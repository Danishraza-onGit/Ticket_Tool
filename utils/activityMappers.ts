
import type {
  ActivityEntryResponse,
} from "../api/activity";
import type {
  ActivityLogItem,
  ActivityReferenceType,
} from "../types/activity";

function formatActivityTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export function mapActivity(
  entry: ActivityEntryResponse
): ActivityLogItem {
  let referenceType: ActivityReferenceType = "none";
  let reference = "";
  let referenceSrNo: number | null = null;

  if (entry.projectSrNo !== null) {
    referenceType = "project";
    reference = entry.projectNo ?? "";
    referenceSrNo = entry.projectSrNo;
  } else if (entry.ticketSrNo !== null) {
    referenceType = "ticket";
    reference = entry.ticketNo ?? "";
    referenceSrNo = entry.ticketSrNo;
  }

  return {
    id: entry.id,
    time: formatActivityTime(entry.createdAt),
    person: entry.actorName?.trim() || "Unknown",
    reference,
    referenceType,
    referenceSrNo,
    action: entry.action,
    details: entry.details?.trim() || undefined,
  };
}
