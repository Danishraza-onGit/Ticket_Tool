export type RepairLocation = "In-House" | "Outsourced";
export type InventoryStatus = "Pending Inward" | "In-House" | "Outsourced" | "Returned to Customer";
export interface InventoryRepairFields {
  inwardDate: string | null;
  outwardDate: string | null;
  repairLocation: RepairLocation;
  outsourceVendor: string | null;
  expectedReturnDate: string | null;
  deliveryPerson: string | null;
}
export interface InventoryItem extends InventoryRepairFields {
  srNo: number;
  ticketNo: string;
  companyName: string;
  model: string | null;
  serialNumber: string | null;
  quantity: number;
  derivedStatus: InventoryStatus;
}
export interface InventoryListResponse {
  items: InventoryItem[];
  total: number;
  page: number;
  pageSize: number;
}
export interface InventoryFilters {
  search?: string;
  repairLocation?: RepairLocation;
  status?: InventoryStatus;
  page?: number;
  pageSize?: number;
}
export type InventoryUpdateInput = Partial<{
  inwardDate: string;
  outwardDate: string;
  repairLocation: RepairLocation;
  outsourceVendor: string;
  expectedReturnDate: string;
  deliveryPerson: string;
}>;
export type InventoryUpdateResponse = InventoryRepairFields & {srNo:number};
export type InventoryEditForm = {
  inwardDate: string;
  outwardDate: string;
  repairLocation: RepairLocation;
  outsourceVendor: string;
  expectedReturnDate: string;
  deliveryPerson: string;
};
