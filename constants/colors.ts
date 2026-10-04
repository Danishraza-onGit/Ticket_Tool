export const COLORS = {
  // Core brand
  primary: "#3729AD",
  secondary: "#134581",
  primaryDark: "#092E63",
  navigationActive: "#124481",
  brandBlue: "#1E5A96",

  // Status
  success: "#016144",
  warning: "#963B00",
  danger: "#9E0913",

  // Base
  white: "#FFFFFF",
  black: "#000000",
  /*nearBlack: "#050505", using black*/
  iconBlack: "#030303",
  iconGrey: "#545456",

  // App surfaces
  background: "#F4F7FB",
  surface: "#FFFFFF",
  surfaceSoft: "#F8FAFC",
  inputBackground: "#F9FAFB",

  // Text
  textPrimary: "#000000",
  textDark: "#16243A",
  textBody: "#26364C",
  textSecondary: "#52647B",
  textMuted: "#71849A",
  textLight: "#8AA0B8",
  textSubtle: "#5D6F86",
  textNeutral: "#545456",
  textSoftBlue: "#8BA0B7",
  placeholder: "#8CA0B8",

  // Additional shared text shades currently in use
  /*textStrong: "#18263A", using black*/
  /*textCardMuted: "#8DA0B8", using textNeutral*/
  textLabel: "#8CA0B8",
  textUpdated: "#5D6F86",
  textSearchIcon: "#8FA0B4",
  textSearchButton: "#34455B",
  textFilterIcon: "#687A91",

  // Borders
  border: "#DCE4ED",
  borderSoft: "#E1E7EF",
  /*dividerMedium: "#EEF2F6",*/
  bottomNavBorder: "#DDE5EE",
  divider: "#E5EAF0",
  cardBorder: "#DFE6EF",
  searchBorder: "#DEE6EF",

  // Interaction
  pressed: "#F3F6F9",
  ripple: "#E9EFF5",
  notification: "#F04A68",
  searchButtonBackground: "#F1F4F8",

  // Ticket / Project status badges
  statusInProgressBackground: "#DBEAFE",//
  statusInProgressText: "#193cb8",//
  statusInProgressBorder: "#DBEAFE",

  statusPendingBackground: "#fef3c6",//
  statusPendingText: "#973c00",//
  statusPendingBorder: "#fef3c6",//


  statusOverdueBackground: "#FFE4E4",
  statusOverdueText: "#C43D3D",
  statusOverdueBorder: "#FFE4E4",


  statusClosedBackground: "#d0fae5",//
  statusClosedText: "#006045",//
  statusClosedBorder: "#d0fae5",//


  // Priority badge
  priorityP1Background: "#ffe2e2",
  priorityP1Text: "#9f0712",
  priorityP1Border: "#ffe2e2",


  priorityP3Background: "#fef3c6",
  priorityP3Text: "#973c00",
  priorityP3Border: "#fef3c6",

  priorityP2Background: "#ffedd4",
  priorityP2Text: "#9f2d00",
  priorityP2Border: "#ffedd4",

  priorityP4Background: "#f9f3f4",
  priorityP4Text: "#314158",
  priorityP4Border: "#f9f3f4",

  // Small card surfaces
  ticketNumberBackground: "#F3F3F3", //
//   neutralBadge: "#E9EEF4", using divider

  // Dashboard StatCardstatus surfaces
  totalBackground: "#E0E7FF",
  totalBorder: "#D4E1FF",

  pendingBackground: "#FEF3C6",
  pendingBorder: "#FFE5A3",

  inProgressBackground: "#F2F7FC",
  inProgressBorder: "#D5EBFA",

  closedBackground: "#d0fae5",
  closedBorder: "#d0fae5",
  closedText: "#006045",

  overdueBackground: "#FFE3E1",
  overdueBorder: "#F8D0D0",

  // Common UI
  avatarBackground: "#172238",
  activeStatus: "#02a262",

  // Shadow / overlay
  shadow: "#000000",
  overlay: "rgba(0, 0, 0, 0.42)",

  // Analytics
  chartBlue: "#7DA7D9",
  chartPurple: "#9D94E8",
  chartGreen: "#7CBDA9",
} as const;