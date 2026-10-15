import { apiClient } from "./client";
import type { TicketFormInput } from "../types/ticket";
import type { TicketRequest } from "../types/ticketRequest";

type RequestsResponse = { requests: TicketRequest[] };
type CreatedTicketResponse = { srNo: number; ticketNo: string };

export async function fetchPendingRequests(): Promise<TicketRequest[]> {
  const { data } = await apiClient.get<RequestsResponse>("/ticket-requests", {
    params: { status: "New" },
  });
  return data.requests;
}

export async function fetchTicketRequest(id: number): Promise<TicketRequest> {
  const { data } = await apiClient.get<TicketRequest>(`/ticket-requests/${id}`);
  return data;
}

export async function discardTicketRequest(id: number, reason?: string) {
  const { data } = await apiClient.post<{ success: boolean }>(
    `/ticket-requests/${id}/discard`,
    reason ? { reason } : {}
  );
  return data;
}

export async function convertTicketRequest(
  id: number,
  input: TicketFormInput
): Promise<CreatedTicketResponse> {
  const { data } = await apiClient.post<CreatedTicketResponse>(
    `/ticket-requests/${id}/convert`, input
  );
  return data;
}
