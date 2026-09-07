export type DashboardFilters = {
  status: string;
  callType: string;
  priority: string;
  accountManager: string;
  assignedTo: string;
  team: string;
  fromDate: string;
};

export type FilterKey =
  | "status"
  | "callType"
  | "priority"
  | "accountManager"
  | "assignedTo"
  | "team";