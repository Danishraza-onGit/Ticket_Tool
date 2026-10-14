import type {
  Employee,
  TicketPriority,
} from "./ticket";

export const PROJECT_TIME_UNITS = [
  "Days",
  "Weeks",
  "Months",
] as const;

export type ProjectTimeUnit =
  (typeof PROJECT_TIME_UNITS)[number];

export type ProjectStatus =
  | "Pending"
  | "In Progress"
  | "Closed";

export type ProjectComponent = {
  model: string;
  quantity: number;
  serialNumbers?: string;
};

export type Project = {
  srNo: number;
  projectNo: string;
  startDate: string;
  timeValue: number;
  timeUnit: ProjectTimeUnit;
  deadlineDate: string;
  customerId: number | null;
  companyName: string;
  contactName: string | null;
  contactNo: string | null;
  emailId: string | null;
  designation: string | null;
  department: string | null;
  address: string | null;
  components: ProjectComponent[];
  poNumber: string | null;
  contractNumber: string | null;
  problem: string;
  ownerUserId: number;
  accountManager: string;
  accountManagerId: number;
  assignedBy: string;
  assignees: Employee[];
  priority: TicketPriority;
  status: ProjectStatus;
  customerFeedbackRating: number | null;
  customerFeedbackComment: string | null;
  customerFeedbackSubmittedAt: string | null;
  adminFeedbackResponse: string | null;
  adminFeedbackRespondedAt: string | null;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
  lastRemark?: string;
  rowVersion: number;
};

export type ProjectSummary = {
  total: number;
  pending: number;
  closed: number;
  inProgress: number;
  overdue: number;
};

export type ProjectFilters = {
  status?: string;
  assigneeUserId?: number;
  assignedBy?: string;
  accountManager?: string;
  priority?: string;
  team?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  overdue?: string;
  page?: number;
  pageSize?: number;
};

export type ProjectListResponse = {
  projects: Project[];
  total: number;
  page: number;
  pageSize: number;
};

export type ProjectRemark = {
  id: number;
  remarkDate: string;
  body: string;
  createdBy: string | null;
  createdAt: string;
  highlighted: boolean;
};

export type ProjectDetail = {
  project: Project;
  remarks: ProjectRemark[];
};

export type ProjectFormInput = {
  startDate: string;
  timeValue: number;
  timeUnit: ProjectTimeUnit;
  companyName: string;
  contactName: string;
  contactNo: string;
  emailId: string;
  designation?: string;
  department?: string;
  address: string;
  components?: ProjectComponent[];
  contractNumber?: string;
  poNumber?: string;
  problem: string;
  accountManagerId: number;
  assignedBy: string;
  assigneeUserIds: number[];
  priority?: TicketPriority;
};

export type UpdateProjectInput =
  Partial<ProjectFormInput> & {
    rowVersion: number;
  };
