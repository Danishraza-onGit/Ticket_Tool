import {
  temporaryTickets,
} from "./tickets";

import type {
  Project,
} from "../types/project";

export const employeeProjects: Project[] = [
  {
    projectNo:"PRJ3108202601",
    startDate: "31/08/2026",
    companyName: "Gayn Bharatam",
    problem: "Installation of...",
    assignedBy: "Parmanand Pandey",
    assignedTo: "Pranesh Kute",
    priority: "P3",
    status: "Pending",
    deadline: "30/09/2026",
  },
];

export const employeeTickets =
  temporaryTickets.filter(
    (ticket) =>
      ticket.assignedTo ===
      "Pranesh Kute"
  );