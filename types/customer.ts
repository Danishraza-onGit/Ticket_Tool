export type CustomerTicketStatus =
  | "Pending"
  | "In Progress"
  | "Closed"
  | "Overdue";

export type TicketRemark = {
  id: string;
  createdAt: string;
  createdBy: string;
  message: string;
};

export type TicketHistoryItem = {
  id: string;
  label: string;
  timestamp: string;
};

export type CustomerTicket = {
  ticketNo: string;
  date: string;
  callType: string;
  priority: string;
  status: CustomerTicketStatus;
  problem: string;
  assignedTo: string;
  deadline: string;

  // Ticket Details - optional for now
  model?: string;
  serialNumbers?: string;
  internalTag?: string;
  mode?: string;

  assignedBy?: string;
  accountManager?: string;

  remarks?: TicketRemark[];
  history?: TicketHistoryItem[];
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
};