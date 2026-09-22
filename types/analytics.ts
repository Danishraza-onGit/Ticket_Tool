export type AnalyticsPeriod =
  | "monthly"
  | "quarterly"
  | "yearly";

export type VolumeDataPoint = {
  label: string;
  created: number;
  closed: number;
};

export type DistributionDataPoint = {
  label: string;
  value: number;
};

export type EmployeeAnalyticsDataPoint = {
  employeeName: string;
  pending: number;
  inProgress: number;
  closed: number;
};

export type TicketAnalyticsData = {
  volume: VolumeDataPoint[];

  byCallType: DistributionDataPoint[];

  byEmployee: EmployeeAnalyticsDataPoint[];

  byPriority: DistributionDataPoint[];

  byStatus: DistributionDataPoint[];

  byMode: DistributionDataPoint[];

  internalVsExternal: DistributionDataPoint[];
};

export type ProjectAnalyticsData = {
  volume: VolumeDataPoint[];

  byAccountManager: DistributionDataPoint[];

  byEmployee: EmployeeAnalyticsDataPoint[];

  byPriority: DistributionDataPoint[];

  byStatus: DistributionDataPoint[];
};

export type AnalyticsData = {
  tickets: TicketAnalyticsData;
  projects: ProjectAnalyticsData;
};