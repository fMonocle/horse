import { createContext, useContext, useMemo, type ReactNode } from "react";
import { usePersistedState } from "./persisted-state";
import { addMonths, todayIso } from "./dates";
import { athletes } from "./data/athletes";
import {
  initialAssignments,
  initialMovements,
  initialPlans,
  initialRoles,
  initialSubscriptions,
  initialUsers,
  PERSONA_USER,
} from "./data/platform";
import type {
  Assignment,
  Athlete,
  Movement,
  Plan,
  Role,
  Subscription,
  User,
  UserStatus,
} from "./types";

type AdminStore = {
  users: User[];
  roles: Role[];
  assignments: Assignment[];
  plans: Plan[];
  subscriptions: Subscription[];
  movements: Movement[];
  saveUser: (user: Omit<User, "id" | "createdAt"> & { id?: string }) => void;
  setUserStatus: (id: string, status: UserStatus) => void;
  saveRole: (role: Omit<Role, "id" | "system"> & { id?: string }) => void;
  setCoach: (athleteId: string, coachId: string | null) => void;
  setProfessionals: (athleteId: string, ids: string[]) => void;
  savePlan: (plan: Omit<Plan, "id" | "custom"> & { id?: string }) => void;
  addSubscription: (userId: string, planId: string) => void;
  renewSubscription: (id: string) => void;
  changePlan: (id: string, planId: string) => void;
  suspendSubscription: (id: string) => void;
  reactivateSubscription: (id: string) => void;
  cancelSubscription: (id: string) => void;
  addMovement: (movement: Omit<Movement, "id">) => void;
  markPaid: (id: string) => void;
};

const AdminContext = createContext<AdminStore | null>(null);

function slug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = usePersistedState<User[]>("users2", initialUsers);
  const [roles, setRoles] = usePersistedState<Role[]>("roles", initialRoles);
  const [assignments, setAssignments] = usePersistedState<Assignment[]>("assignments2", initialAssignments);
  const [plans, setPlans] = usePersistedState<Plan[]>("plans", initialPlans);
  const [subscriptions, setSubscriptions] = usePersistedState<Subscription[]>("subscriptions2", initialSubscriptions);
  const [movements, setMovements] = usePersistedState<Movement[]>("movements", initialMovements);

  const value = useMemo<AdminStore>(() => {
    const planById = (id: string) => plans.find((plan) => plan.id === id);
    const userById = (id: string) => users.find((user) => user.id === id);

    function syncUser(subscriptionId: string, from: User["status"][], to: User["status"]) {
      const userId = subscriptions.find((item) => item.id === subscriptionId)?.userId;
      setUsers((current) =>
        current.map((user) => (user.id === userId && from.includes(user.status) ? { ...user, status: to } : user)),
      );
    }

    function settle(subscription: Subscription, movementId?: string) {
      syncUser(subscription.id, ["suspended", "inactive"], "active");
      const plan = planById(subscription.planId);
      const months = plan?.periodMonths ?? 1;
      const base = subscription.nextDue ?? todayIso();
      setSubscriptions((current) =>
        current.map((item) =>
          item.id === subscription.id
            ? { ...item, status: "current", nextDue: addMonths(base, months) }
            : item,
        ),
      );
      const pending = movementId
        ? movements.find((item) => item.id === movementId)
        : movements.find((item) => item.subscriptionId === subscription.id && item.status === "pending");
      if (pending) {
        setMovements((current) =>
          current.map((item) => (item.id === pending.id ? { ...item, status: "paid", date: todayIso() } : item)),
        );
      } else {
        setMovements((current) => [
          {
            id: `mv-${Date.now()}`,
            date: todayIso(),
            kind: "income",
            category: "Suscripción",
            description: `${plan?.name ?? "Plan"} · ${userById(subscription.userId)?.name ?? "Usuario"}`,
            amount: plan?.price ?? 0,
            status: "paid",
            subscriptionId: subscription.id,
          },
          ...current,
        ]);
      }
    }

    return {
      users,
      roles,
      assignments,
      plans,
      subscriptions,
      movements,
      saveUser: (draft) => {
        if (draft.id) {
          setUsers((current) => current.map((user) => (user.id === draft.id ? { ...user, ...draft, id: user.id } : user)));
          return;
        }
        setUsers((current) => [...current, { ...draft, id: `u-${Date.now()}`, createdAt: todayIso() }]);
      },
      setUserStatus: (id, status) => {
        setUsers((current) => current.map((user) => (user.id === id ? { ...user, status } : user)));
      },
      saveRole: (draft) => {
        if (draft.id) {
          setRoles((current) => current.map((role) => (role.id === draft.id ? { ...role, ...draft, id: role.id } : role)));
          return;
        }
        const base = slug(draft.name) || "perfil";
        const id = roles.some((role) => role.id === base) ? `${base}-${Date.now()}` : base;
        setRoles((current) => [...current, { ...draft, id, system: false }]);
      },
      setCoach: (athleteId, coachId) => {
        setAssignments((current) =>
          current.map((item) => (item.athleteId === athleteId ? { ...item, coachId } : item)),
        );
      },
      setProfessionals: (athleteId, ids) => {
        setAssignments((current) =>
          current.map((item) => (item.athleteId === athleteId ? { ...item, professionalIds: ids } : item)),
        );
      },
      savePlan: (draft) => {
        if (draft.id) {
          setPlans((current) => current.map((plan) => (plan.id === draft.id ? { ...plan, ...draft, id: plan.id } : plan)));
          return;
        }
        const base = slug(draft.name) || "plan";
        const id = plans.some((plan) => plan.id === base) ? `${base}-${Date.now()}` : base;
        setPlans((current) => [...current, { ...draft, id, custom: true }]);
      },
      addSubscription: (userId, planId) => {
        const plan = planById(planId);
        const id = `sub-${Date.now()}`;
        setSubscriptions((current) => [
          ...current,
          {
            id,
            userId,
            planId,
            status: "current",
            startDate: todayIso(),
            nextDue: addMonths(todayIso(), plan?.periodMonths ?? 1),
            autoRenew: true,
          },
        ]);
        setMovements((current) => [
          {
            id: `mv-${Date.now()}`,
            date: todayIso(),
            kind: "income",
            category: "Suscripción",
            description: `${plan?.name ?? "Plan"} · ${userById(userId)?.name ?? "Usuario"}`,
            amount: plan?.price ?? 0,
            status: "paid",
            subscriptionId: id,
          },
          ...current,
        ]);
      },
      renewSubscription: (id) => {
        const subscription = subscriptions.find((item) => item.id === id);
        if (subscription) settle(subscription);
      },
      changePlan: (id, planId) => {
        setSubscriptions((current) => current.map((item) => (item.id === id ? { ...item, planId } : item)));
      },
      suspendSubscription: (id) => {
        syncUser(id, ["active"], "suspended");
        setSubscriptions((current) => current.map((item) => (item.id === id ? { ...item, status: "suspended" } : item)));
      },
      reactivateSubscription: (id) => {
        syncUser(id, ["suspended", "inactive"], "active");
        setSubscriptions((current) =>
          current.map((item) => {
            if (item.id !== id) return item;
            const nextDue = item.nextDue ?? addMonths(todayIso(), 1);
            return { ...item, nextDue, cancelledAt: undefined, status: nextDue < todayIso() ? "pending" : "current" };
          }),
        );
      },
      cancelSubscription: (id) => {
        syncUser(id, ["active", "suspended", "invited"], "inactive");
        setSubscriptions((current) =>
          current.map((item) =>
            item.id === id
              ? { ...item, status: "cancelled", autoRenew: false, nextDue: null, cancelledAt: todayIso() }
              : item,
          ),
        );
      },
      addMovement: (movement) => {
        setMovements((current) =>
          [{ ...movement, id: `mv-${Date.now()}` }, ...current].sort((a, b) => b.date.localeCompare(a.date)),
        );
      },
      markPaid: (id) => {
        const movement = movements.find((item) => item.id === id);
        if (!movement) return;
        const subscription = movement.subscriptionId
          ? subscriptions.find((item) => item.id === movement.subscriptionId)
          : undefined;
        if (subscription && (subscription.status === "pending" || subscription.status === "suspended")) {
          settle(subscription, id);
          return;
        }
        setMovements((current) => current.map((item) => (item.id === id ? { ...item, status: "paid" } : item)));
      },
    };
  }, [assignments, movements, plans, roles, subscriptions, users]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin(): AdminStore {
  const store = useContext(AdminContext);
  if (!store) {
    throw new Error("useAdmin tiene que usarse dentro de AdminProvider");
  }
  return store;
}

export function useUserName(): (id: string | null | undefined) => string {
  const { users } = useAdmin();
  return (id) => users.find((user) => user.id === id)?.name ?? "Sin asignar";
}

export function useMyAthletes(): Athlete[] {
  const { assignments } = useAdmin();
  return useMemo(() => {
    const mine = new Set(
      assignments.filter((item) => item.coachId === PERSONA_USER.coach).map((item) => item.athleteId),
    );
    return athletes.filter((athlete) => mine.has(athlete.id));
  }, [assignments]);
}
