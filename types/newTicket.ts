import type {
  CallType,
  InternalTag,
  TicketMode,
  TicketPriority,
} from "./ticket";

export type NewTicketForm = {
  dateReceived: string;
  mode: TicketMode;
  companyName: string;
  contactName: string;
  contactNo: string;
  emailId: string;
  address: string;
  model: string;

  // Temporary UI name.
  // API field will eventually be serialNumber.
  serialNumbers: string;
  problem: string;
  callType: CallType;

  // Temporary display values.
  // These will later be converted to IDs where required.
  accountManager: string;
  assignedBy: string;
  assignedTo: string;
  deadlineDate: string;
  priority: TicketPriority;
  internalTag: InternalTag;
};

export type Company = {
  name: string;
  contactName: string;
  contactNo: string;
  emailId: string;
  address: string;
};