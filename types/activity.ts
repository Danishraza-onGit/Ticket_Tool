
export type ActivityReferenceType =
  | "ticket"
  | "project"
  | "none";

export type ActivityLogItem = {
  id: number;
  time: string;
  person: string;
  reference: string;
  referenceType: ActivityReferenceType;
  referenceSrNo: number | null;
  action: string;
  details?: string;
};
