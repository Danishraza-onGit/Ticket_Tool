
import { apiClient } from "./client";

export type RoutineCheckEmployeeResponse = {
  userId: number;
  displayName: string;
  taken: boolean;
  ticketSrNo: number | null;
  ticketNo: string | null;
  submittedAt: string | null;
};

export type RoutineChecksTodayResponse = {
  date: string;
  employees: RoutineCheckEmployeeResponse[];
};

export async function fetchRoutineChecksToday():
  Promise<RoutineChecksTodayResponse> {
  const { data } =
    await apiClient.get<RoutineChecksTodayResponse>(
      "/tickets/routine-checks/today"
    );

  return data;
}
