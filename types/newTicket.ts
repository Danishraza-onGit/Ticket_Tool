export type NewTicketForm = {
  dateReceived: string;
  mode: string;
  companyName: string;
  contactName: string;
  contactNo: string;
  emailId: string;
  address: string;
  model: string;
  serialNumbers: string;
  problem: string;
  callType: string;
  accountManager: string;
  assignedBy: string;
  assignedTo: string;
  deadlineDate: string;
  priority: string;
  internalTag: string;
};

export type Company = {
  name: string;
  contactName: string;
  contactNo: string;
  emailId: string;
  address: string;
};