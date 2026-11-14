import type { TdHTMLAttributes } from "react";
import { lastMonthKeys, monthKey, monthLabel, todayIso } from "./dates";
import type { Movement, Plan, Subscription } from "./types";

export function cellLabel(label: string): TdHTMLAttributes<HTMLTableCellElement> {
  return { "data-label": label } as TdHTMLAttributes<HTMLTableCellElement>;
}

export type MonthTotals = {
  key: string;
  label: string;
  income: number;
  expense: number;
  balance: number;
  billed: number;
  collected: number;
  pendingIncome: number;
};

export function monthTotals(movements: Movement[], key: string): MonthTotals {
  const rows = movements.filter((movement) => monthKey(movement.date) === key);
  const sum = (filter: (movement: Movement) => boolean) =>
    rows.filter(filter).reduce((total, movement) => total + movement.amount, 0);
  const income = sum((movement) => movement.kind === "income" && movement.status === "paid");
  const expense = sum((movement) => movement.kind === "expense" && movement.status === "paid");
  const billed = sum((movement) => movement.kind === "income");
  return {
    key,
    label: monthLabel(key),
    income,
    expense,
    balance: income - expense,
    billed,
    collected: income,
    pendingIncome: billed - income,
  };
}

export function monthlySeries(movements: Movement[], count = 6): MonthTotals[] {
  return lastMonthKeys(count).map((key) => monthTotals(movements, key));
}

export function currentMonth(movements: Movement[]): MonthTotals {
  return monthTotals(movements, monthKey(todayIso()));
}

export function pendingTotal(movements: Movement[], kind: Movement["kind"]): number {
  return movements
    .filter((movement) => movement.kind === kind && movement.status === "pending")
    .reduce((total, movement) => total + movement.amount, 0);
}

export function planDistribution(subscriptions: Subscription[], plans: Plan[]) {
  const active = subscriptions.filter((item) => item.status === "current" || item.status === "pending");
  const total = active.length || 1;
  return plans
    .map((plan) => {
      const count = active.filter((item) => item.planId === plan.id).length;
      return {
        id: plan.id,
        name: plan.name,
        color: plan.color,
        count,
        monthly: Math.round((count * plan.price) / plan.periodMonths),
        share: Math.round((count / total) * 100),
      };
    })
    .filter((row) => row.count > 0);
}
