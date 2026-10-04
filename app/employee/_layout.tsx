import React from "react";
import {
  StyleSheet,
  View,
} from "react-native";

import {
  Slot,
  usePathname,
  useRouter,
} from "expo-router";

import { COLORS } from "../../constants/colors";

import EmployeeBottomNavBar, {
  EmployeeBottomNavRoute,
} from "../../components/employee/navigation/EmployeeBottomNavBar";

export default function EmployeeLayout() {
  const router = useRouter();
  const pathname = usePathname();


  const getActiveRoute =
    (): EmployeeBottomNavRoute => {
      if (
        pathname.includes(
          "/employee/overdue"
        )
      ) {
        return "overdue";
      }

      if (
        pathname.includes(
          "/employee/projects"
        )
      ) {
        return "projects";
      }

      if (
        pathname.includes(
          "/employee/profile"
        )
      ) {
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
      router.replace(
        "/employee/overdue"
      );
      break;

    case "projects":
      router.replace(
        "/employee/projects"
      );
      break;

    case "profile":
      router.replace(
        "/employee/profile"
      );
      break;
  }
};

const hideBottomNav =
  pathname.includes("/employee/new-ticket") ||
  pathname.includes("/employee/ticket-details");

return (
  <View style={styles.container}>
    <View style={styles.content}>
      <Slot />
    </View>

    {!hideBottomNav && (
      <EmployeeBottomNavBar
        activeRoute={getActiveRoute()}
        onNavigate={handleNavigate}
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