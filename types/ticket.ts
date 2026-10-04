export type TicketStatus =
  | "Pending"
  | "In Progress"
  | "Closed"
  | "Overdue";

export type TicketPriority =
  | "P1"
  | "P2"
  | "P3"
  | "P4";

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

export type Ticket = {
  ticketNo: string;
  customerId: string;
  date: string;
  callType: string;
  priority: TicketPriority;
  status: TicketStatus;
  problem: string;
  assignedTo: string;
  deadline: string;
  assignedBy?: string;
  accountManager?: string;
  model?: string;
  serialNumbers?: string;
  internalTag?: string;
  mode?: string;
  updatedAt?: string;
  remarks?: TicketRemark[];
  history?: TicketHistoryItem[];
};