export type AthleteStatus = "available" | "traveling" | "competition";

export type Panel = "owner" | "coach" | "athlete" | "doctor";

export type Athlete = {
  id: string;
  firstName: string;
  lastName: string;
  country: string;
  sport: string;
  status: AthleteStatus;
  goal: string;
  coachNote: string;
  metric: string;
  unit: string;
};

export type Session = {
  id: string;
  athleteId: string;
  date: string;
  type: string;
  durationMin: number;
  notes: string;
  completed: boolean;
};

export type Measurement = {
  athleteId: string;
  date: string;
  value: number;
};

export type SessionDraft = {
  athleteId: string;
  date: string;
  type: string;
  durationMin: number;
  notes: string;
};

export type ModuleKey =
  | "admin-dashboard"
  | "users"
  | "roles"
  | "assignments"
  | "plans"
  | "subscriptions"
  | "finance"
  | "coach-dashboard"
  | "athletes"
  | "routine"
  | "planning"
  | "tracking"
  | "incidents"
  | "doctor-dashboard"
  | "my-week"
  | "my-history"
  | "my-progress";

export type Role = {
  id: string;
  name: string;
  description: string;
  modules: ModuleKey[];
  system: boolean;
};

export type UserStatus = "active" | "invited" | "suspended" | "inactive";

export type User = {
  id: string;
  name: string;
  email: string;
  roleId: string;
  status: UserStatus;
  athleteId?: string;
  createdAt: string;
};

export type Assignment = {
  athleteId: string;
  coachId: string | null;
  professionalIds: string[];
};

export type PlanPeriod = 1 | 3 | 12;

export type Plan = {
  id: string;
  name: string;
  price: number;
  periodMonths: PlanPeriod;
  description: string;
  features: string[];
  color: string;
  custom: boolean;
  active: boolean;
};

export type SubscriptionStatus = "current" | "pending" | "suspended" | "cancelled";

export type Subscription = {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: string;
  nextDue: string | null;
  autoRenew: boolean;
  cancelledAt?: string;
};

export type MovementKind = "income" | "expense";

export type Movement = {
  id: string;
  date: string;
  kind: MovementKind;
  category: string;
  description: string;
  amount: number;
  status: "paid" | "pending";
  subscriptionId?: string;
};

export type RoutineExercise = {
  id: string;
  name: string;
  prescription: string;
};

export type RoutineAssignment = {
  id: string;
  athleteId: string;
  coachId: string;
  date: string;
  title: string;
  note: string;
  exercises: RoutineExercise[];
  status: "assigned" | "reported";
};

export type ExerciseResult = {
  exerciseId: string;
  done: boolean;
  result: string;
};

export type Discomfort = {
  zone: string;
  intensity: number;
  description: string;
};

export type RoutineReport = {
  id: string;
  assignmentId: string;
  athleteId: string;
  submittedAt: string;
  results: ExerciseResult[];
  feeling: number;
  effort: number;
  comment: string;
  discomfort?: Discomfort;
  shareWithMedical: boolean;
};

export type IncidentStatus = "open" | "docs_requested" | "docs_sent" | "evaluated" | "closed";

export type Fitness = "fit" | "restricted" | "unfit";

export type Incident = {
  id: string;
  athleteId: string;
  reportId?: string;
  createdAt: string;
  kind: "discomfort" | "incomplete";
  title: string;
  detail: string;
  status: IncidentStatus;
  sharedWithMedical: boolean;
  coachSeen: boolean;
  docRequest?: {
    requestedAt: string;
    note: string;
    fileName?: string;
    sentAt?: string;
  };
  evaluation?: {
    doctorId: string;
    date: string;
    diagnosis: string;
    recommendation: string;
    fitness: Fitness;
    returnDate?: string;
  };
  closedNote?: string;
};

export type HistoryKind = "routine" | "report" | "incident" | "docs" | "evaluation" | "closed" | "consent";

export type HistoryEvent = {
  id: string;
  athleteId: string;
  date: string;
  kind: HistoryKind;
  title: string;
  detail: string;
  actor: string;
  incidentId?: string;
};
