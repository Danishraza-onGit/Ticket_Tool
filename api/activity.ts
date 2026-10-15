
import { apiClient } from "./client";

export type ActivityEntryResponse = {
  id: number;
  actorUserId: number | null;
  actorName: string | null;
  action: string;
  ticketSrNo: number | null;
  ticketNo: string | null;
  projectSrNo: number | null;
  projectNo: string | null;
  details: string | null;
  createdAt: string;
};

export type ActivityListResponse = {
  entries: ActivityEntryResponse[];
  total: number;
  page: number;
  pageSize: number;
};

export type ActivityFilters = {
  ticketSrNo?: number;
  projectSrNo?: number;
  actorUserId?: number;
  action?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
};

export async function fetchActivity(
  filters: ActivityFilters = {}
): Promise<ActivityListResponse> {
  const { data } =
    await apiClient.get<ActivityListResponse>(
      "/activity",
      { params: filters }
    );

  return data;
}
