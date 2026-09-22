import type {
  AnalyticsData,
} from "../types/analytics";

export const temporaryAnalyticsData: AnalyticsData = {
  tickets: {
    volume: [
      {
        label: "May",
        created: 18,
        closed: 14,
      },
      {
        label: "Jun",
        created: 27,
        closed: 22,
      },
      {
        label: "Jul",
        created: 21,
        closed: 25,
      },
      {
        label: "Aug",
        created: 64,
        closed: 58,
      },
      {
        label: "Sep",
        created: 35,
        closed: 39,
      },
    ],

    byCallType: [
      { label: "Call", value: 94 },
      { label: "Routine", value: 91 },
      { label: "AMC", value: 32 },
      { label: "Warranty", value: 24 },
      { label: "Office", value: 19 },
      { label: "OEM", value: 13 },
      { label: "Chargeable", value: 11 },
      { label: "Installation", value: 6 },
      { label: "Project", value: 2 },
    ],

    byEmployee: [
      {
        employeeName: "Ajay",
        pending: 1,
        inProgress: 5,
        closed: 34,
      },
      {
        employeeName: "Jitesh",
        pending: 0,
        inProgress: 2,
        closed: 9,
      },
      {
        employeeName: "Manoj",
        pending: 0,
        inProgress: 3,
        closed: 14,
      },
      {
        employeeName: "Narendra",
        pending: 1,
        inProgress: 4,
        closed: 24,
      },
      {
        employeeName: "Rajesh",
        pending: 0,
        inProgress: 2,
        closed: 8,
      },
    ],

    byPriority: [
      { label: "P1", value: 8 },
      { label: "P2", value: 19 },
      { label: "P3", value: 178 },
      { label: "P4", value: 74 },
    ],

    byStatus: [
      { label: "Closed", value: 304 },
      { label: "In Progress", value: 17 },
      { label: "Pending", value: 1 },
    ],

    byMode: [
      { label: "Call", value: 171 },
      { label: "Mail", value: 67 },
      { label: "Verbally", value: 41 },
      { label: "Website", value: 22 },
      { label: "WhatsApp", value: 14 },
    ],

    internalVsExternal: [
      { label: "External", value: 246 },
      { label: "Internal", value: 77 },
    ],
  },

  projects: {
    volume: [
      {
        label: "May",
        created: 1,
        closed: 1,
      },
      {
        label: "Jun",
        created: 2,
        closed: 1,
      },
      {
        label: "Jul",
        created: 1,
        closed: 2,
      },
      {
        label: "Aug",
        created: 8,
        closed: 6,
      },
      {
        label: "Sep",
        created: 2,
        closed: 3,
      },
    ],

    byAccountManager: [
      {
        label: "Rajesh Mishra",
        value: 8,
      },
      {
        label: "Hemang Shah",
        value: 4,
      },
    ],

    byEmployee: [
      {
        employeeName: "Jitesh",
        pending: 0,
        inProgress: 1,
        closed: 4,
      },
      {
        employeeName: "Manoj",
        pending: 0,
        inProgress: 1,
        closed: 4,
      },
      {
        employeeName: "Pranesh",
        pending: 1,
        inProgress: 0,
        closed: 3,
      },
      {
        employeeName: "Raghavendra",
        pending: 0,
        inProgress: 1,
        closed: 4,
      },
    ],

    byPriority: [
      { label: "P3", value: 9 },
      { label: "P4", value: 4 },
    ],

    byStatus: [
      {
        label: "In Progress",
        value: 8,
      },
      {
        label: "Pending",
        value: 4,
      },
    ],
  },
};