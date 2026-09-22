import type {
  ActivityLogItem,
} from "../types/activity";

export const temporaryActivityLogs: ActivityLogItem[] = [
  {
    id: "activity-1",
    time: "03/09/2026, 11:43:12 AM",
    person: "Pranesh Kute",
    reference: "0309202606",
    action: "Added remark",
    details: "Laptop Distribution is under process...",
  },
  {
    id: "activity-2",
    time: "03/09/2026, 11:43:03 AM",
    person: "Pranesh Kute",
    reference: "0309202606",
    action: "Changed status",
    details: "New status: In Progress",
  },
  {
    id: "activity-3",
    time: "03/09/2026, 11:43:00 AM",
    person: "Pranesh Kute",
    reference: "0309202606",
    action: "Updated ticket",
    details: "Changes in ticket",
  },
  {
    id: "activity-4",
    time: "03/09/2026, 11:42:15 AM",
    person: "Pranesh Kute",
    reference: "0309202606",
    action: "Created ticket",
  },
  {
    id: "activity-5",
    time: "03/09/2026, 11:34:02 AM",
    person: "Yash Gupta",
    reference: "0309202605",
    action: "Created ticket",
  },
  {
    id: "activity-6",
    time: "03/09/2026, 11:05:28 AM",
    person: "Parmanand Pandey",
    reference: "1107202607",
    action: "Added remark",
    details:
      "Visited the site as planned to investigate the reported issue.",
  },
];