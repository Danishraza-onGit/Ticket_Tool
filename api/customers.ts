import { apiClient } from "./client";

export type ApiCustomer = {
  id: number;
  name: string;
  contactName: string | null;
  contactNo: string | null;
  emailId: string | null;
  address: string | null;
  createdAt: string;
  ticketCount: number;
  openTicketCount: number;
  lastTicketDate: string | null;
};

export type ApiCustomerTicket = {
  srNo: number;
  ticketNo: string;
  ticketDate: string | null;
  callType: string | null;
  status: string;
  priority: string | null;
  problem: string | null;
  assignees: { id: number; displayName: string }[];
  deadlineDate: string | null;
  closedAt: string | null;
};

export type CustomerListResponse = {
  customers: ApiCustomer[];
  total: number;
  page: number;
  pageSize: number;
};

export type CustomerDetailsResponse = {
  customer: Omit<ApiCustomer, "ticketCount" | "openTicketCount" | "lastTicketDate">;
  tickets: ApiCustomerTicket[];
};

export async function fetchCustomers(params: {
  search?: string;
  page?: number;
  pageSize?: number;
} = {}): Promise<CustomerListResponse> {
  const { data } = await apiClient.get<CustomerListResponse>("/customers", { params });
  return data;
}

export async function fetchCustomer(id: number): Promise<CustomerDetailsResponse> {
  const { data } = await apiClient.get<CustomerDetailsResponse>(`/customers/${id}`);
  return data;
}
