export type UserRole =
  | "admin"
  | "employee";

export type UserTeam =
  | "FMS"
  | "Field";

export type TicketMode =
  | "Whatsapp"
  | "Call"
  | "Mail"
  | "Verbally"
  | "Website";

export type CallType =
  | "Warranty"
  | "AMC"
  | "OEM"
  | "Office"
  | "Installation"
  | "POC"
  | "Call"
  | "Chargeable"
  | "Non-Chargeable"
  | "Routine Checks";

export type TicketStatus =
  | "Pending"
  | "In Progress"
  | "Closed";

export type InternalTag =
  | "Internal"
  | "External";

export type TicketPriority =
  | "P1"
  | "P2"
  | "P3"
  | "P4";

export interface Employee {
  id: number;
  displayName: string;
  role?: UserRole;
  team?: UserTeam | null;
}

export interface RoutineCheckItem {
  section:
    | "Routine Checks"
    | "System Updates & Patch Management";

  task: string;
  detail?: string;

  status:
    | "Completed"
    | "N/A";

  note?: string;
}

export interface Ticket {
  srNo: number;
  ticketNo: string;
  ticketDate: string;
  mode: TicketMode;
  customerId: number | null;
  companyName: string;
  contactName: string | null;
  contactNo: string | null;
  emailId: string | null;
  address: string | null;
  model: string | null;
  serialNumber: string | null;
  problem: string;
  ownerUserId: number;
  accountManager: string;
  accountManagerId: number | null;
  assignedBy: string | null;
  callType: CallType;
  assignees: Employee[];
  priority: TicketPriority;
  deadlineDate: string | null;
  status: TicketStatus;
  internalTag: InternalTag;
  routineChecks: RoutineCheckItem[];
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
  lastRemark?: string;
  rowVersion: number;
  inInventory: boolean;
  inventoryPending: boolean;
}

//moving towards Server based communication
export interface CustomerDirectoryEntry {
  name: string;
  contactName: string | null;
  contactNo: string | null;
  emailId: string | null;
  address: string | null;
}

export interface AccountManagerDirectoryEntry {
  id: number;
  name: string;
  email: string;
}

export interface MetaOptions {
  modes: TicketMode[];
  callTypes: CallType[];
  statuses: TicketStatus[];
  internalTags: InternalTag[];
  priorities: TicketPriority[];

  accountManagers: string[];
  assignedBys: string[];
  companyNames: string[];

  customers: CustomerDirectoryEntry[];

  assignedToOptions: Employee[];

  accountManagerDirectory:
    AccountManagerDirectoryEntry[];

  teams: UserTeam[];
}

export interface TicketFormInput {
  ticketDate: string;
  mode: TicketMode;
  companyName: string;

  contactName?: string;
  contactNo?: string;
  emailId?: string;
  address?: string;

  model?: string;
  serialNumber?: string;

  problem: string;

  accountManagerId?: number;
  assignedBy?: string;

  callType: CallType;

  assigneeUserIds?: number[];

  priority?: TicketPriority;
  deadlineDate?: string;
  internalTag?: InternalTag;

  routineChecks?: RoutineCheckItem[];
}