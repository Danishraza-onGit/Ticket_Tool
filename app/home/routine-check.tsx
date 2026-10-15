
import { Ionicons } from "@expo/vector-icons";
import {
  useFocusEffect,
  useRouter,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  useCallback,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { fetchRoutineChecksToday } from "../../api/routineCheck";
import { COLORS } from "../../constants/colors";

import type {
  RoutineCheckEmployeeResponse,
} from "../../api/routineCheck";
import type {
  RoutineCheckRecord,
} from "../../types/routineCheck";

import BackHeader from "../../components/admin/navigation/BackHeader";
import RoutineCheckCard from "../../components/admin/routine-check/RoutineCheckCard";

function formatSubmittedAt(
  value: string | null
): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function mapRoutineCheck(
  employee: RoutineCheckEmployeeResponse
): RoutineCheckRecord {
  return {
    id: employee.userId,
    employeeName: employee.displayName,
    status: employee.taken ? "Submitted" : "Pending",
    ticketSrNo: employee.ticketSrNo,
    ticketNo: employee.ticketNo,
    submittedAt: formatSubmittedAt(employee.submittedAt),
  };
}

export default function RoutineCheckScreen() {
  const router = useRouter();

  const [records, setRecords] =
    useState<RoutineCheckRecord[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const [loadError, setLoadError] =
    useState<string | null>(null);

  const loadRoutineChecks = useCallback(
    async (
      refreshing = false,
      isActive: () => boolean = () => true
    ) => {
      try {
        if (refreshing) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        setLoadError(null);

        const response =
          await fetchRoutineChecksToday();

        if (!isActive()) {
          return;
        }

        setRecords(
          response.employees.map(mapRoutineCheck)
        );
      } catch (error) {
        if (!isActive()) {
          return;
        }

        console.log(
          "Routine Checks API error:",
          error
        );

        setLoadError(
          "Unable to load routine checks. Please try again."
        );
      } finally {
        if (isActive()) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    },
    []
  );

  useFocusEffect(
    useCallback(() => {
      let active = true;

      void loadRoutineChecks(
        false,
        () => active
      );

      return () => {
        active = false;
      };
    }, [loadRoutineChecks])
  );

  const handleTicketPress = (
    ticketNo: string
  ) => {
    router.push({
      pathname: "/home/ticket-details",
      params: {
        ticketNo,
        source: "routine-check",
      },
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />

      <BackHeader
        title="Routine Check"
        onBackPress={() => router.back()}
      />

      <FlatList
        data={loadError ? [] : records}
        keyExtractor={(item) =>
          item.id.toString()
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() =>
              void loadRoutineChecks(true)
            }
            tintColor={COLORS.navigationActive}
            colors={[COLORS.navigationActive]}
          />
        }
        ListHeaderComponent={
          <View style={styles.pageHeading}>
            <Text style={styles.title}>
              Routine Checks
            </Text>

            <Text style={styles.description}>
              Daily submission status for Team FMS&apos;s
              routine system-health checklist.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <RoutineCheckCard
            record={item}
            onTicketPress={handleTicketPress}
          />
        )}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.centerState}>
              <ActivityIndicator
                color={COLORS.navigationActive}
              />

              <Text style={styles.stateText}>
                Loading routine checks...
              </Text>
            </View>
          ) : loadError ? (
            <View style={styles.centerState}>
              <Ionicons
                name="alert-circle-outline"
                size={24}
                color={COLORS.danger}
              />

              <Text style={styles.stateText}>
                {loadError}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  void loadRoutineChecks()
                }
                activeOpacity={0.7}
              >
                <Text style={styles.retryText}>
                  Try Again
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name="clipboard-outline"
                size={25}
                color={COLORS.iconGrey}
              />

              <Text style={styles.emptyTitle}>
                No Team FMS employees to display.
              </Text>

              <Text style={styles.emptyDescription}>
                Routine check submissions will appear
                here when active Team FMS employees
                are available.
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 36,
    flexGrow: 1,
  },
  pageHeading: {
    marginBottom: 16,
  },
  title: {
    fontSize: 19,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  description: {
    marginTop: 5,
    fontSize: 11,
    lineHeight: 17,
    color: COLORS.textNeutral,
  },
  centerState: {
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 20,
  },
  stateText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  retryText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.navigationActive,
  },
  emptyState: {
    minHeight: 170,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 9,
  },
  emptyTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  emptyDescription: {
    maxWidth: 270,
    fontSize: 10.5,
    lineHeight: 16,
    color: COLORS.textNeutral,
    textAlign: "center",
  },
});
