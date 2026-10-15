
export type RoutineCheckStatus =
  | "Submitted"
  | "Pending";

export type RoutineCheckRecord = {
  id: number;
  employeeName: string;
  status: RoutineCheckStatus;
  ticketSrNo: number | null;
  ticketNo: string | null;
  submittedAt: string | null;
};
