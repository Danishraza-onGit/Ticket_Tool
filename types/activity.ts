export type ActivityAction =
  | "Added remark"
  | "Changed status"
  | "Updated ticket"
  | "Created ticket";

export type ActivityLogItem = {
  id: string;
  time: string;
  person: string;
  reference: string;
  action: ActivityAction;
  details?: string;
};