export type RoutineCheckStatus =
  | "Submitted"
  | "Pending";

export type RoutineCheckRecord = {
  id: string;
  employeeName: string;
  status: RoutineCheckStatus;
  ticketNo?: string;
  submittedAt?: string;
};