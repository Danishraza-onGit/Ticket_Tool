
import type { RoutineCheckItem } from "../types/ticket";

type RoutineCheckDefinition = Pick<
  RoutineCheckItem,
  "section" | "task" | "detail"
>;

export const ROUTINE_CHECK_TASKS: readonly RoutineCheckDefinition[] = [
  {
    section: "Routine Checks",
    task: "Server Health Check",
  },
  {
    section: "Routine Checks",
    task: "Disk Space Monitoring",
  },
  {
    section: "Routine Checks",
    task: "Backup Verification",
  },
  {
    section: "Routine Checks",
    task: "Antivirus / Endpoint Status",
  },
  {
    section: "Routine Checks",
    task: "Network Device Health",
  },
  {
    section: "Routine Checks",
    task: "Email System Functionality",
  },
  {
    section: "Routine Checks",
    task: "Storage",
  },
  {
    section: "System Updates & Patch Management",
    task: "Windows Servers",
    detail: "Security Updates",
  },
  {
    section: "System Updates & Patch Management",
    task: "Linux Servers",
    detail: "Kernel Update",
  },
  {
    section: "System Updates & Patch Management",
    task: "Network Switches",
    detail: "Firmware Check",
  },
];

export const ROUTINE_CHECK_SECTIONS: RoutineCheckItem["section"][] = [
  "Routine Checks",
  "System Updates & Patch Management",
];

export function createEmptyRoutineChecks(): RoutineCheckItem[] {
  return ROUTINE_CHECK_TASKS.map((item) => ({
    section: item.section,
    task: item.task,
    ...(item.detail ? { detail: item.detail } : {}),
    status: "N/A",
    note: "",
  }));
}
