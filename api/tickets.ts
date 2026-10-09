import { apiClient } from "./client";

import type {
  MetaOptions,
  Ticket,
  TicketFormInput,
  TicketStatus,
} from "../types/ticket";

export type TicketSummary = {
  total: number;
  pending: number;
  closed: number;
  inProgress: number;
  overdue: number;
};

export type TicketListResponse = {
  tickets: Ticket[];
  total: number;
  page: number;
  pageSize: number;
};

export type TicketFilters = {
  status?: string;
  callType?: string;
  assigneeUserId?: number;
  assignedBy?: string;
  accountManager?: string;
  priority?: string;
  team?: string;

  dateFrom?: string;
  dateTo?: string;

  search?: string;
  overdue?: string;

  page?: number;
  pageSize?: number;
};

export type Remark = {
  id: number;
  remarkDate: string;
  body: string;
  createdBy: string | null;
  createdAt: string;
};

export type TicketDetail = {
  ticket: Ticket;
  remarks: Remark[];
};

export async function fetchTicketSummary() {
  const response =
    await apiClient.get<TicketSummary>(
      "/tickets/summary"
    );

  return response.data;
}

export async function fetchTickets(
  filters: TicketFilters = {}
) {
  const response =
    await apiClient.get<TicketListResponse>(
      "/tickets",
      {
        params: filters,
      }
    );

  return response.data;
}

export async function fetchTicket(
  srNo: number
) {
  const response =
    await apiClient.get<TicketDetail>(
      `/tickets/${srNo}`
    );

  return response.data;
}

export async function updateTicketStatus(
  srNo: number,
  status: TicketStatus
) {
  const response =
    await apiClient.patch<Ticket>(
      `/tickets/${srNo}/status`,
      {
        status,
      }
    );

  return response.data;
}

export async function addTicketRemark(
  srNo: number,
  body: string,
  remarkDate?: string
) {
  const response =
    await apiClient.post<Remark>(
      `/tickets/${srNo}/remarks`,
      {
        body,
        remarkDate,
      }
    );

  return response.data;
}

export async function fetchMetaOptions(): Promise<MetaOptions> {
  const { data } = await apiClient.get<MetaOptions>(
    "/meta/options"
  );

  return data;
}

export async function createTicket(
  input: TicketFormInput
): Promise<Ticket> {
  const { data } = await apiClient.post<Ticket>(
    "/tickets",
    input
  );

  return data;
}