import { apiClient } from "./client";
import type { ProjectAnalyticsResponse, TicketAnalyticsResponse } from "../types/analytics";

export async function fetchTicketAnalytics(): Promise<TicketAnalyticsResponse> {
  const { data } = await apiClient.get<TicketAnalyticsResponse>("/tickets/analytics");
  return data;
}

export async function fetchProjectAnalytics(): Promise<ProjectAnalyticsResponse> {
  const { data } = await apiClient.get<ProjectAnalyticsResponse>("/projects/analytics");
  return data;
}
