import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  fetchTickets,
  fetchTicketSummary,
} from "../../api/tickets";

import type { TicketSummary } from "../../api/tickets";
import type {
  DashboardFilters,
  FilterKey,
} from "../../types/dashboardFilters";
import type { Ticket } from "../../types/ticket";

import { COLORS } from "../../constants/colors";
import { ticketFilterOptions } from "../../data/ticketFilterOptions";

import EmployeeAddMenu from "../../components/employee/dashboard/EmployeeAddMenu";
import StatCard from "../../components/employee/dashboard/StatCard";
import TicketCard from "../../components/employee/dashboard/TicketCard";
import TicketSearchFilters from "../../components/employee/dashboard/TicketSearchFilters";
import EmployeeHeader from "../../components/employee/navigation/EmployeeHeader";

const initialFilters: DashboardFilters = {
  status: "All",
  callType: "All",
  priority: "All",
  accountManager: "All",
  assignedTo: "All",
  assignedBy: "All",
  team: "All",
  fromDate: "",
};

const formatDateForApi = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function EmployeeDashboardScreen() {
  const router = useRouter();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketsTotal, setTicketsTotal] = useState(0);
  const [summary, setSummary] = useState<TicketSummary | null>(null);
  const [isLoadingTickets, setIsLoadingTickets] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  const [showAddMenu, setShowAddMenu] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFromDate, setSelectedFromDate] = useState<Date | null>(null);
  const [filters, setFilters] = useState<DashboardFilters>(initialFilters);

  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoadingTickets(true);
      setDashboardError(null);

      const ticketFilters = {
        page: 1,
        pageSize: 200,

        ...(searchQuery.trim()
          ? { search: searchQuery.trim() }
          : {}),

        ...(filters.status !== "All"
          ? { status: filters.status }
          : {}),

        ...(filters.callType !== "All"
          ? { callType: filters.callType }
          : {}),

        ...(filters.priority !== "All"
          ? { priority: filters.priority }
          : {}),

        ...(filters.accountManager !== "All"
          ? { accountManager: filters.accountManager }
          : {}),

        ...(filters.assignedBy !== "All"
          ? { assignedBy: filters.assignedBy }
          : {}),

        ...(filters.team !== "All"
          ? { team: filters.team }
          : {}),

        ...(selectedFromDate
          ? { dateFrom: formatDateForApi(selectedFromDate) }
          : {}),
      };

      const [ticketResponse, summaryResponse] = await Promise.all([
        fetchTickets(ticketFilters),
        fetchTicketSummary(),
      ]);

      setTickets(ticketResponse.tickets);
      setTicketsTotal(ticketResponse.total);
      setSummary(summaryResponse);
    } catch (error) {
      console.log("Employee Dashboard API error:", error);
      setDashboardError("Unable to load dashboard data.");
    } finally {
      setIsLoadingTickets(false);
    }
  }, [
    searchQuery,
    filters.status,
    filters.callType,
    filters.priority,
    filters.accountManager,
    filters.assignedBy,
    filters.team,
    selectedFromDate,
  ]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadDashboardData();
    } finally {
      setRefreshing(false);
    }
  }, [loadDashboardData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadDashboardData();
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, [loadDashboardData]);

  const handleSearch = () => {
    setSearchQuery(searchText);
  };

  const handleFilterChange = (
    key: FilterKey,
    value: string
  ) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleFromDateChange = (
    date: Date | null,
    formattedDate: string
  ) => {
    setSelectedFromDate(date);
    setFilters((current) => ({
      ...current,
      fromDate: formattedDate,
    }));
  };

  const handleClearFilters = () => {
    setSearchText("");
    setSearchQuery("");
    setFilters(initialFilters);
    setSelectedFromDate(null);
  };

  const filteredTickets = useMemo(() => {
    if (filters.assignedTo === "All") {
      return tickets;
    }

    return tickets.filter((ticket) =>
      ticket.assignees.some(
        (assignee) => assignee.displayName === filters.assignedTo
      )
    );
  }, [tickets, filters.assignedTo]);

  const stats = useMemo(
    () => [
      {
        title: "TOTAL TICKETS",
        value: summary?.total ?? 0,
        backgroundColor: COLORS.totalBackground,
        borderColor: COLORS.totalBorder,
        textColor: COLORS.primary,
      },
      {
        title: "PENDING",
        value: summary?.pending ?? 0,
        backgroundColor: COLORS.pendingBackground,
        borderColor: COLORS.pendingBorder,
        textColor: COLORS.warning,
      },
      {
        title: "IN PROGRESS",
        value: summary?.inProgress ?? 0,
        backgroundColor: COLORS.inProgressBackground,
        borderColor: COLORS.inProgressBorder,
        textColor: COLORS.secondary,
      },
      {
        title: "CLOSED",
        value: summary?.closed ?? 0,
        backgroundColor: COLORS.closedBackground,
        borderColor: COLORS.closedBorder,
        textColor: COLORS.success,
      },
      {
        title: "OVERDUE",
        value: summary?.overdue ?? 0,
        backgroundColor: COLORS.overdueBackground,
        borderColor: COLORS.overdueBorder,
        textColor: COLORS.danger,
      },
    ],
    [summary]
  );

  return (
    <SafeAreaView 
    style={styles.container}
    edges={["top", "left", "right"]}
    >
      <StatusBar style="dark" />

      <EmployeeHeader
        onProfilePress={() => router.push("/employee/account")}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.navigationActive}
            colors={[COLORS.navigationActive]}
          />
        }
        contentContainerStyle={styles.content}
      >
        <View style={styles.dashboardTitleRow}>
          <Text style={styles.pageTitle}>Dashboard</Text>

          <View style={styles.dashboardActions}>
            <View style={styles.actionButtonWrapper}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() =>
                  setShowAddMenu((current) => !current)
                }
                activeOpacity={0.8}
              >
                <Text style={styles.addButtonText}>＋ Add</Text>

                <Ionicons
                  name="chevron-down"
                  size={15}
                  color={COLORS.white}
                />
              </TouchableOpacity>

              <EmployeeAddMenu
                visible={showAddMenu}
                onClose={() => setShowAddMenu(false)}
                onNewTicket={() => {
                  setShowAddMenu(false);
                  router.push("/employee/new-ticket");
                }}
              />
            </View>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsContainer}
        >
          {stats.map((stat) => (
            <View key={stat.title} style={styles.statWrapper}>
              <StatCard
                title={stat.title}
                value={stat.value}
                backgroundColor={stat.backgroundColor}
                borderColor={stat.borderColor}
                textColor={stat.textColor}
              />
            </View>
          ))}
        </ScrollView>

        <TicketSearchFilters
          searchText={searchText}
          filters={filters}
          filterOptions={ticketFilterOptions}
          selectedFromDate={selectedFromDate}
          onSearchTextChange={setSearchText}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          onFromDateChange={handleFromDateChange}
          onClear={handleClearFilters}
        />

        <View style={styles.ticketsHeader}>
          <Text style={styles.ticketsTitle}>TICKETS</Text>

          <Text style={styles.ticketsCount}>
            Showing {filteredTickets.length} of {ticketsTotal}
          </Text>
        </View>

        {isLoadingTickets && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Loading tickets...</Text>
          </View>
        )}

        {dashboardError && !isLoadingTickets && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{dashboardError}</Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={loadDashboardData}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {!isLoadingTickets && !dashboardError && (
          <View>
            {filteredTickets.map((ticket) => (
              <TicketCard
                key={ticket.srNo}
                ticket={ticket}
                onViewDetails={() =>
                  router.push({
                    pathname: "/employee/ticket-details",
                    params: {
                      srNo: String(ticket.srNo),
                      ticketNo: ticket.ticketNo,
                    },
                  })
                }
              />
            ))}
          </View>
        )}

        {!isLoadingTickets &&
          !dashboardError &&
          filteredTickets.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons
                name="search-outline"
                size={30}
                color={COLORS.textSearchIcon}
              />

              <Text style={styles.emptyText}>No tickets found</Text>
            </View>
          )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  /* LAYOUT */
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 10,
  },

  /* DASHBOARD HEADER */
  dashboardTitleRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  pageTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: COLORS.textDark,
  },

  dashboardActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    zIndex: 100,
  },

  actionButtonWrapper: {
    position: "relative",
    zIndex: 100,
  },

  addButton: {
    height: 38,
    minWidth: 94,
    borderRadius: 9,
    backgroundColor: COLORS.primaryDark,
    paddingHorizontal: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    zIndex: 1002,
  },

  addButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.white,
  },

  /* STATS */
  statsContainer: {
    paddingLeft: 4,
    paddingRight: 4,
    paddingBottom: 6,
  },

  statWrapper: {
    marginRight: 12,
  },

  /* TICKETS */
  ticketsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
    marginBottom: 10,
  },

  ticketsTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textBody,
    letterSpacing: 0.3,
  },

  ticketsCount: {
    fontSize: 10,
    color: COLORS.textMuted,
  },

  /* EMPTY / ERROR STATE */
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },

  emptyText: {
    marginTop: 8,
    fontSize: 12,
    color: COLORS.textMuted,
  },

  retryButton: {
    marginTop: 14,
    minWidth: 100,
    minHeight: 38,
    paddingHorizontal: 16,
    borderRadius: 9,
    backgroundColor: COLORS.primaryDark,
    alignItems: "center",
    justifyContent: "center",
  },

  retryButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.white,
  },
});
