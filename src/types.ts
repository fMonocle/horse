export type AthleteStatus = "available" | "traveling" | "competition";

export type Panel = "coach" | "athlete";

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
