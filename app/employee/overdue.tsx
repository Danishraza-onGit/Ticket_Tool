
import React, {
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  fetchTickets,
  fetchTicketSummary,
} from "../../api/tickets";

import type { TicketSummary } from "../../api/tickets";
import type { Ticket } from "../../types/ticket";

import type {
  DashboardFilters,
  FilterKey,
} from "../../types/dashboardFilters";

import { ticketFilterOptions } from "../../data/ticketFilterOptions";
import { COLORS } from "../../constants/colors";

import EmployeeHeader from "../../components/employee/navigation/EmployeeHeader";
import EmployeeAddMenu from "../../components/employee/dashboard/EmployeeAddMenu";
import StatCard from "../../components/employee/dashboard/StatCard";
import TicketCard from "../../components/employee/dashboard/TicketCard";
import TicketSearchFilters from "../../components/employee/dashboard/TicketSearchFilters";

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

const initialSummary: TicketSummary = {
  total: 0,
  pending: 0,
  inProgress: 0,
  closed: 0,
  overdue: 0,
};

const PAGE_SIZE = 200;

function formatDateForApi(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function EmployeeOverdueScreen() {
  const router = useRouter();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [summary, setSummary] =
    useState<TicketSummary>(initialSummary);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] =
    useState<string | null>(null);

  const [showAddMenu, setShowAddMenu] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedFromDate, setSelectedFromDate] =
    useState<Date | null>(null);

  const [filters, setFilters] =
    useState<DashboardFilters>(initialFilters);

  const loadOverdueData = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError(null);

      const [firstPage, summaryResponse] =
        await Promise.all([
          fetchTickets({
            overdue: "true",
            page: 1,
            pageSize: PAGE_SIZE,
          }),
          fetchTicketSummary(),
        ]);

      const allTickets = [...firstPage.tickets];
      const totalPages = Math.ceil(
        firstPage.total / PAGE_SIZE
      );

      for (
        let page = 2;
        page <= totalPages;
        page += 1
      ) {
        const response = await fetchTickets({
          overdue: "true",
          page,
          pageSize: PAGE_SIZE,
        });

        allTickets.push(...response.tickets);
      }

      setTickets(allTickets);
      setSummary(summaryResponse);
    } catch (error) {
      console.log(
        "Employee Overdue API error:",
        error
      );

      setLoadError(
        "Unable to load overdue tickets. Please try again."
      );

      setTickets([]);
      setSummary(initialSummary);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadOverdueData();
    }, [loadOverdueData])
  );

  const stats = useMemo(
    () => [
      {
        title: "TOTAL TICKETS",
        value: summary.total,
        backgroundColor: COLORS.totalBackground,
        borderColor: COLORS.totalBorder,
        textColor: COLORS.primary,
      },
      {
        title: "PENDING",
        value: summary.pending,
        backgroundColor: COLORS.pendingBackground,
        borderColor: COLORS.pendingBorder,
        textColor: COLORS.warning,
      },
      {
        title: "IN PROGRESS",
        value: summary.inProgress,
        backgroundColor: COLORS.inProgressBackground,
        borderColor: COLORS.inProgressBorder,
        textColor: COLORS.secondary,
      },
      {
        title: "CLOSED",
        value: summary.closed,
        backgroundColor: COLORS.closedBackground,
        borderColor: COLORS.closedBorder,
        textColor: COLORS.success,
      },
      {
        title: "OVERDUE",
        value: summary.overdue,
        backgroundColor: COLORS.overdueBackground,
        borderColor: COLORS.overdueBorder,
        textColor: COLORS.danger,
      },
    ],
    [summary]
  );

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
    const normalizedSearch = searchQuery
      .trim()
      .toLowerCase();

    const fromDate = selectedFromDate
      ? formatDateForApi(selectedFromDate)
      : null;

    return tickets.filter((ticket) => {
      const assignees = ticket.assignees ?? [];

      const assigneeNames = assignees.map(
        (assignee) => assignee.displayName
      );

      const searchableText = [
        ticket.ticketNo,
        ticket.companyName,
        ticket.problem,
        ticket.callType,
        ticket.accountManager,
        ticket.assignedBy ?? "",
        ...assigneeNames,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        searchableText.includes(normalizedSearch);

      const matchesStatus =
        filters.status === "All" ||
        filters.status === "Overdue" ||
        ticket.status === filters.status;

      const matchesCallType =
        filters.callType === "All" ||
        ticket.callType === filters.callType;

      const matchesPriority =
        filters.priority === "All" ||
        ticket.priority === filters.priority;

      const matchesAccountManager =
        filters.accountManager === "All" ||
        ticket.accountManager ===
          filters.accountManager;

      const matchesAssignedTo =
        filters.assignedTo === "All" ||
        assignees.some(
          (assignee) =>
            assignee.displayName === filters.assignedTo
        );

      const matchesAssignedBy =
        filters.assignedBy === "All" ||
        ticket.assignedBy === filters.assignedBy;

      const matchesTeam =
        filters.team === "All" ||
        assignees.some(
          (assignee) =>
            assignee.team === filters.team
        );

      const matchesFromDate =
        !fromDate ||
        ticket.ticketDate.slice(0, 10) >= fromDate;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCallType &&
        matchesPriority &&
        matchesAccountManager &&
        matchesAssignedTo &&
        matchesAssignedBy &&
        matchesTeam &&
        matchesFromDate
      );
    });
  }, [
    tickets,
    searchQuery,
    filters.status,
    filters.callType,
    filters.priority,
    filters.accountManager,
    filters.assignedTo,
    filters.assignedBy,
    filters.team,
    selectedFromDate,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <EmployeeHeader
        onProfilePress={() =>
          router.push("/employee/account")
        }
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        {/* PAGE HEADER */}
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>
            Overdue
          </Text>

          <View style={styles.dashboardActions}>
            <View style={styles.actionButtonWrapper}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() =>
                  setShowAddMenu((current) => !current)
                }
                activeOpacity={0.8}
              >
                <Text style={styles.addButtonText}>
                  ＋ Add
                </Text>

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

        {/* STATISTICS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsContainer}
        >
          {stats.map((stat) => (
            <View
              key={stat.title}
              style={styles.statWrapper}
            >
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

        {/* SEARCH & FILTERS */}
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

        {/* LIST HEADING */}
        <View style={styles.ticketsHeader}>
          <Text style={styles.ticketsTitle}>
            OVERDUE TICKETS
          </Text>

          <Text style={styles.ticketCount}>
            Showing {filteredTickets.length} of{" "}
            {tickets.length}
          </Text>
        </View>

        {/* LOADING */}
        {isLoading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Loading overdue tickets...
            </Text>
          </View>
        ) : loadError ? (
          /* API ERROR */
          <View style={styles.emptyState}>
            <Ionicons
              name="alert-circle-outline"
              size={30}
              color={COLORS.danger}
            />

            <Text style={styles.emptyTitle}>
              Unable to load overdue tickets
            </Text>

            <Text style={styles.emptyText}>
              {loadError}
            </Text>

            <TouchableOpacity
              onPress={() => void loadOverdueData()}
              activeOpacity={0.7}
            >
              <Text style={styles.retryText}>
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        ) : filteredTickets.length > 0 ? (
          /* OVERDUE TICKET CARDS */
          filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.srNo}
              ticket={ticket}
              onViewDetails={() => {
                router.push({
                  pathname:
                    "/employee/ticket-details",
                  params: {
                    srNo: String(ticket.srNo),
                    ticketNo: ticket.ticketNo,
                  },
                });
              }}
            />
          ))
        ) : (
          /* EMPTY STATE */
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons
                name={
                  tickets.length === 0
                    ? "calendar-outline"
                    : "search-outline"
                }
                size={24}
                color={COLORS.textMuted}
              />
            </View>

            <Text style={styles.emptyTitle}>
              {tickets.length === 0
                ? "No overdue tickets"
                : "No matching overdue tickets"}
            </Text>

            <Text style={styles.emptyText}>
              {tickets.length === 0
                ? "All tickets are currently within their due dates."
                : "No overdue tickets match the current search or selected filters."}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollView: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 100,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    zIndex: 100,
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

  statsContainer: {
    paddingLeft: 4,
    paddingRight: 4,
    paddingBottom: 6,
  },

  statWrapper: {
    marginRight: 12,
  },

  ticketsHeader: {
    marginTop: 18,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  ticketsTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textBody,
    letterSpacing: 0.7,
  },

  ticketCount: {
    fontSize: 10,
    color: COLORS.textMuted,
  },

  emptyState: {
    minHeight: 180,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 30,
  },

  emptyIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surfaceSoft,
    marginBottom: 4,
  },

  emptyTitle: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textBody,
    textAlign: "center",
  },

  emptyText: {
    marginTop: 5,
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
    color: COLORS.textMuted,
  },

  retryText: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.navigationActive,
  },
});
