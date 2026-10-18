export type AnalyticsPeriod = "monthly" | "quarterly" | "yearly";
export type AnalyticsVolumePoint = { month: string; created: number; closed: number };
export type AnalyticsEmployeeStatus = { employee: string; pending: number; inProgress: number; closed: number };
export type AnalyticsDistribution = { count: number };
export type TicketAnalyticsResponse = {
  monthly: AnalyticsVolumePoint[];
  quarterly: AnalyticsVolumePoint[];
  yearly: AnalyticsVolumePoint[];
  byCallType: { callType: string; count: number }[];
  byEmployee: AnalyticsEmployeeStatus[];
  byPriority: { priority: string; count: number }[];
  byStatus: { status: string; count: number }[];
  byMode: { mode: string; count: number }[];
  byInternalTag: { internalTag: string; count: number }[];
};
export type ProjectAnalyticsResponse = {
  monthly: AnalyticsVolumePoint[];
  quarterly: AnalyticsVolumePoint[];
  yearly: AnalyticsVolumePoint[];
  byAccountManager: { accountManager: string; count: number }[];
  byEmployee: AnalyticsEmployeeStatus[];
  byPriority: { priority: string; count: number }[];
  byStatus: { status: string; count: number }[];
};
