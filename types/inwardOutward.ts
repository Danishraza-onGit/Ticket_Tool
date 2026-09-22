export type RepairLocation =
  | "In-House"
  | "Outsourced";

export type LocationFilterValue =
  | "All Locations"
  | RepairLocation;

export type InwardOutwardItem = {
  id: string;
  ticketNo: string;
  company: string;
  model: string;
  serialNumbers: string;
  quantity: number;
  status: string;
  inwardDate: string;
  outwardDate: string;
  location: RepairLocation;
};