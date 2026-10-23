import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Stack, usePathname, useRouter } from "expo-router";

import { COLORS } from "../../constants/colors";
import { fetchTicketSummary } from "../../api/tickets";
import BottomNavBar, {
  BottomNavRoute,
} from "../../components/admin/navigation/BottomNavBar";

export default function HomeLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const [overdueCount, setOverdueCount] = useState(0);

  const loadOverdueCount = useCallback(async () => {
    try {
      const summary = await fetchTicketSummary();
      setOverdueCount(summary.overdue);
    } catch (error) {
      console.log("Overdue notification error:", error);
      setOverdueCount(0);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadOverdueCount();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadOverdueCount, pathname]);

  const getActiveRoute = (): BottomNavRoute => {
    if (pathname.includes("/my-tickets")) return "my-tickets";
    if (pathname.includes("/overdue")) return "overdue";
    if (pathname.includes("/projects")) return "projects";
    return "dashboard";
  };

  const handleNavigate = (route: BottomNavRoute) => {
    const destinations: Record<BottomNavRoute, string> = {
      dashboard: "/home",
      "my-tickets": "/home/my-tickets",
      overdue: "/home/overdue",
      projects: "/home/projects",
    };
    const destination = destinations[route];
    if (pathname !== destination) {
      router.replace(destination as "/home");
    }
  };

  const hideBottomNav =
    pathname.includes("/new-ticket") ||
    pathname.includes("/new-project") ||
    pathname.includes("/account") ||
    pathname.includes("/employees") ||
    pathname.includes("/customers") ||
    pathname.includes("/ticket-details") ||
    pathname.includes("/activity-log") ||
    pathname.includes("/pending-requests") ||
    pathname.includes("/inward-outward") ||
    pathname.includes("/routine-check") ||
    pathname.includes("/analytics") ||
    pathname.includes("/edit-ticket") ||
    pathname.includes("/edit-project") ||
    pathname.includes("/project-details");

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
            animationTypeForReplace: "push",
            contentStyle: { backgroundColor: COLORS.white },
          }}
        >
          <Stack.Screen name="index" options={{ animation: "fade" }} />
          <Stack.Screen name="my-tickets" options={{ animation: "fade" }} />
          <Stack.Screen name="overdue" options={{ animation: "fade" }} />
          <Stack.Screen name="projects" options={{ animation: "fade" }} />
        </Stack>
      </View>
      {!hideBottomNav && (
        <BottomNavBar
          activeRoute={getActiveRoute()}
          onNavigate={handleNavigate}
          showOverdueNotification={overdueCount > 0}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { flex: 1 },
});
