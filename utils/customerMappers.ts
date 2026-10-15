import type { ApiCustomer, ApiCustomerTicket } from "../api/customers";
import type { Customer, CustomerTicket } from "../types/customer";

export function displayValue(value: string | null | undefined): string {
  return value?.trim() || "—";
}

export function formatCustomerDate(value: string | null | undefined): string {
  if (!value) return "—";
  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return iso ? `${iso[3]}/${iso[2]}/${iso[1]}` : value;
}

export function mapCustomer(value: ApiCustomer): Customer {
  return {
    id: value.id,
    company: value.name,
    contactName: displayValue(value.contactName),
    contactNo: displayValue(value.contactNo),
    email: displayValue(value.emailId),
    address: displayValue(value.address),
    totalTickets: value.ticketCount,
    openTickets: value.openTicketCount,
    lastActivity: formatCustomerDate(value.lastTicketDate),
  };
}

export function mapCustomerTicket(value: ApiCustomerTicket): CustomerTicket {
  return {
    srNo: value.srNo,
    ticketNo: value.ticketNo,
    date: formatCustomerDate(value.ticketDate),
    callType: displayValue(value.callType),
    priority: displayValue(value.priority),
    status: value.status,
    problem: displayValue(value.problem),
    assignedTo: value.assignees?.map((a) => a.displayName).join(", ") || "—",
    deadline: formatCustomerDate(value.deadlineDate),
  };
}
