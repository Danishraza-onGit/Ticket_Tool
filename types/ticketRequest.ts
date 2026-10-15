export type TicketRequest = {
  id: number;
  companyName: string;
  contactName: string;
  contactNo: string;
  emailId: string;
  address: string;
  model: string | null;
  serialNumber: string | null;
  problem: string;
  status: "New" | "Converted" | "Discarded";
  convertedTicketSrNo: number | null;
  convertedAt: string | null;
  discardedAt: string | null;
  discardReason: string | null;
  createdAt: string;
};
