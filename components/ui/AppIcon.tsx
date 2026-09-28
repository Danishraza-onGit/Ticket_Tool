import React from "react";
import {
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
  color = "#000000",
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