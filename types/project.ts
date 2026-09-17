export type ProjectStatus =
  | "Pending"
  | "In Progress"
  | "Completed"
  | "Overdue";

export type Project = {
  projectNo: string;
  startDate: string;
  companyName: string;
  problem: string;
  priority: string;
  status: ProjectStatus;
  assignedBy: string;
  assignedTo: string;
  deadline: string;
};