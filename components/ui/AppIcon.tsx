import React from "react";
import {COLORS} from "../../constants/colors";
import {
  UserRound,
  Building,
  ChartColumn,
  ClipboardCheck,
  FolderKanban,
  History,
  Inbox,
  LayoutDashboard,
  ListChecks,
  TriangleAlert,
  Users,
  ArrowLeft,
} from "lucide-react-native";

const appIcons = {
  dashboard: LayoutDashboard,
  myTickets: ListChecks,
  overdue: TriangleAlert,
  projects: FolderKanban,
  inwardOutward: ListChecks,
  pendingRequests: Inbox,
  activityLog: History,
  customers: Building,
  analytics: ChartColumn,
  routineCheck: ClipboardCheck,
  employees: Users,
  back: ArrowLeft,
  profile: UserRound,
};

export type AppIconName = keyof typeof appIcons;

type AppIconProps = {
  name: AppIconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export default function AppIcon({
  name,
  size = 20,
  color = COLORS.black,
  strokeWidth = 2,
}: AppIconProps) {
  const Icon = appIcons[name];

  return (
    <Icon
      size={size}
      color={color}
      strokeWidth={strokeWidth}
    />
  );
}