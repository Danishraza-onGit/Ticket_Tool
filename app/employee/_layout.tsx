
import React, {
  useEffect,
  useState,
} from "react";

import {
  StyleSheet,
  View,
} from "react-native";

import {
  Slot,
  usePathname,
  useRouter,
} from "expo-router";

import {
  fetchTickets,
} from "../../api/tickets";

import {
  getCurrentUser,
} from "../../api/auth";

import { COLORS } from "../../constants/colors";

import EmployeeBottomNavBar, {
  EmployeeBottomNavRoute,
} from "../../components/employee/navigation/EmployeeBottomNavBar";

const PAGE_SIZE = 200;

export default function EmployeeLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const [
    showOverdueNotification,
    setShowOverdueNotification,
  ] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const checkOverdueTickets = async () => {
      try {
        const currentUser = await getCurrentUser();

        if (currentUser.role !== "employee") {
          if (!cancelled) {
            setShowOverdueNotification(false);
          }

          return;
        }

        let page = 1;
        let hasAssignedOverdue = false;
        let hasMore = true;

        while (hasMore && !hasAssignedOverdue && !cancelled) {
          const response = await fetchTickets({
            overdue: "true",
            page,
            pageSize: PAGE_SIZE,
          });

          hasAssignedOverdue = response.tickets.some(
            (ticket) =>
              ticket.assignees.some(
                (assignee) =>
                  assignee.id === currentUser.id
              )
          );

          hasMore =
            page * PAGE_SIZE < response.total &&
            response.tickets.length > 0;

          page += 1;
        }

        if (!cancelled) {
          setShowOverdueNotification(hasAssignedOverdue);
        }
      } catch (error) {
        console.log(
          "Employee overdue notification error:",
          error
        );

        if (!cancelled) {
          setShowOverdueNotification(false);
        }
      }
    };

    void checkOverdueTickets();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const getActiveRoute = (): EmployeeBottomNavRoute => {
    if (pathname.includes("/employee/overdue")) {
      return "overdue";
    }

    if (pathname.includes("/employee/projects")) {
      return "projects";
    }

    if (pathname.includes("/employee/profile")) {
      return "profile";
    }

    return "dashboard";
  };

  const handleNavigate = (
    route: EmployeeBottomNavRoute
  ) => {
    switch (route) {
      case "dashboard":
        router.replace("/employee");
        break;

      case "overdue":
        router.replace("/employee/overdue");
        break;

      case "projects":
        router.replace("/employee/projects");
        break;

      case "profile":
        router.replace("/employee/profile");
        break;
    }
  };

  const hideBottomNav =
    pathname.includes("/employee/new-ticket") ||
    pathname.includes("/employee/ticket-details") ||
    pathname.includes("/employee/edit-ticket") ||
    pathname.includes("/employee/project-details");

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Slot />
      </View>

      {!hideBottomNav && (
        <EmployeeBottomNavBar
          activeRoute={getActiveRoute()}
          onNavigate={handleNavigate}
          showOverdueNotification={showOverdueNotification}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  content: {
    flex: 1,
  },
});
