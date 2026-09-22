export type CustomerTicketStatus =
  | "Pending"
  | "In Progress"
  | "Closed"
  | "Overdue";

export type CustomerTicket = {
  ticketNo: string;
  date: string;
  callType: string;
  priority: string;
  status: CustomerTicketStatus;
  problem: string;
  assignedTo: string;
  deadline: string;
};

export type Customer = {
  id: string;
  company: string;
  contactName: string;
  contactNo: string;
  email?: string;
  address?: string;
  totalTickets: number;
  openTickets: number;
  lastActivity: string;
  tickets: CustomerTicket[];
};