export type EmployeeStatus = "Active" | "Inactive";
export type EmployeeRole = "Employee" | "Admin";
export type EmployeeTeam = "FMS" | "Field" | "—";

export type Employee = {
  id: number;
  initials: string;
  fullName: string;
  username: string;
  email: string;
  role: EmployeeRole;
  team: EmployeeTeam;
  status: EmployeeStatus;
};

export type AccountManager = {
  id: number;
  initials: string;
  fullName: string;
  email: string;
};

export type EmployeeManagementTab = "employees" | "accountManagers";
