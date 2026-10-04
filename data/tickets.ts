import type {
  Ticket,
} from "../types/ticket";

export const temporaryTickets: Ticket[] = [
  {
    ticketNo: "0708202601",
    customerId: "customer-10",

    date: "07/08/2026",
    callType: "Warranty",
    priority: "P3",
    status: "Closed",
    problem: "1 TB NVME SSD issue",
    model: "Fujitsu Work Station",
    serialNumbers: "Fujitsu Work Station",
    internalTag: "External",
    mode: "Call",
    assignedTo: "Pranesh Kute",
    assignedBy: "Narendra Kumar",
    accountManager: "Parmanand Pandey",
    deadline: "—",
    updatedAt: "07/08/2026",
  },

  {
    ticketNo: "0309202601",
    customerId: "customer-2",

    date: "03/09/2026",
    callType: "AMC",
    priority: "P2",
    status: "In Progress",
    problem: "Temporary customer ticket for UI flow.",
    assignedTo: "Nikhil Kumar",
    deadline: "—",
    updatedAt: "03/09/2026",
  },

  {
    ticketNo: "0309202605",
    customerId: "customer-3",

    date: "03/09/2026",
    callType: "AMC",
    priority: "P3",
    status: "Closed",
    problem: "Temporary customer ticket for UI flow.",
    assignedTo: "Yash Gupta",
    deadline: "—",
    updatedAt: "03/09/2026",
  },

  {
    ticketNo: "0309202604",
    customerId: "customer-4",

    date: "03/09/2026",
    callType: "Routine Checking",
    priority: "P3",
    status: "Closed",
    problem: "Temporary customer ticket for UI flow.",
    assignedTo: "Jitesh Malhotra",
    deadline: "—",
    updatedAt: "03/09/2026",
  },

  {
    ticketNo: "0309202603",
    customerId: "customer-5",

    date: "03/09/2026",
    callType: "Routine Checks",
    priority: "P3",
    status: "Closed",
    problem: "Temporary customer ticket for UI flow.",
    assignedTo: "Ravi Kumar Gorrela",
    deadline: "—",
    updatedAt: "03/09/2026",
  },

  {
    ticketNo: "0309202602",
    customerId: "customer-6",

    date: "03/09/2026",
    callType: "CLAP & GMS Health Check",
    priority: "P3",
    status: "Closed",
    problem: "Temporary customer ticket for UI flow.",
    assignedBy: "Ajay Malik",
    assignedTo: "Ajay Malik",
    deadline: "—",
    updatedAt: "03/09/2026",
  },

  {
    ticketNo: "0309202606",
    customerId: "customer-9",

    date: "03/09/2026",
    callType: "Routine Visit",
    priority: "P3",
    status: "In Progress",
    problem: "Temporary IES College ticket for UI flow.",
    assignedBy: "Pranesh",
    assignedTo: "Pranesh Kute",
    deadline: "—",
    updatedAt: "03/09/2026",
  },

  {
    ticketNo: "0309202607",
    customerId: "customer-7",

    date: "03/09/2026",
    callType: "Routine Visit",
    priority: "P3",
    status: "Overdue",
    problem: "Temporary overdue ticket for UI flow.",
    assignedBy: "Pranesh",
    assignedTo: "Pranesh Kute",
    deadline: "—",
    updatedAt: "03/09/2026",
  },

  {
    ticketNo: "0309202608",
    customerId: "customer-8",

    date: "03/09/2026",
    callType: "Warranty",
    priority: "P2",
    status: "Overdue",
    problem: "Temporary overdue warranty ticket.",
    assignedBy: "Shazeb Khan",
    assignedTo: "Yash Gupta",
    deadline: "—",
    updatedAt: "03/09/2026",
  },

  {
    ticketNo: "0110202615",
    customerId: "customer-1",

    date: "01/10/2026",
    callType: "AMC",
    priority: "P3",
    status: "Closed",
    problem:
      "Os installed and Network Configure in the Work station as user requested.",
    assignedTo: "Narendra Kumar",
    assignedBy: "Narendar Kumar",
    accountManager: "Parmanand Pandey",
    deadline: "—",
    model: "Fujitsu Work Station",
    serialNumbers: "Fujitsu Work Station",
    internalTag: "External",
    mode: "Call",
    updatedAt: "02/10/2026",
    remarks: [
      {
        id: "remark-1",
        createdAt: "01/10/2026, 05:24:00 PM",
        createdBy: "Narendrak",
        message: "Issue Resolved",
      },
    ],

    history: [
      {
        id: "history-1",
        label: "Closed",
        timestamp: "02/10/2026, 5:30:03 PM",
      },

      {
        id: "history-2",
        label: "Ticket created",
        timestamp: "01/10/2026, 5:23:51 PM",
      },
    ],
  },
];