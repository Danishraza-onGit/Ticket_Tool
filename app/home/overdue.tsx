import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../constants/colors";
import { ticketFilterOptions } from "../../data/ticketFilterOptions";
import AddTicketProjectMenu from "../../components/admin/dashboard/AddTicketProjectMenu";
import DashboardActionsMenu from "../../components/admin/dashboard/DashboardActionsMenu";
import ExportTicketsModal, {
  ExportDateRange,
} from "../../components/admin/dashboard/ExportTicketsModal";
import StatCard from "../../components/admin/dashboard/StatCard";
import TicketCard from "../../components/admin/dashboard/TicketCard";
import TicketSearchFilters from "../../components/admin/dashboard/TicketSearchFilters";
import MainHeader from "../../components/admin/navigation/MainHeader";
import SideDrawer from "../../components/admin/navigation/SideDrawer";

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

export default function OverdueScreen() {
  const router = useRouter();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [summary, setSummary] = useState<TicketSummary>({
    total: 0,
    pending: 0,
    inProgress: 0,
    closed: 0,
    overdue: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedFromDate, setSelectedFromDate] = useState<Date | null>(null);
  const [filters, setFilters] = useState<DashboardFilters>(initialFilters);

  const loadOverdueData = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError(null);

      const [firstPage, summaryResponse] = await Promise.all([
        fetchTickets({
          overdue: "true",
          page: 1,
          pageSize: 200,
        }),
        fetchTicketSummary(),
      ]);

      const allOverdueTickets = [...firstPage.tickets];
      const totalPages = Math.ceil(firstPage.total / 200);

      for (let page = 2; page <= totalPages; page += 1) {
        const response = await fetchTickets({
          overdue: "true",
          page,
          pageSize: 200,
        });

        allOverdueTickets.push(...response.tickets);
      }

      setTickets(allOverdueTickets);
      setSummary(summaryResponse);
    } catch (error) {
      console.log("Overdue API error:", error);
      setLoadError("Unable to load overdue tickets.");
      setTickets([]);
      setSummary({
        total: 0,
        pending: 0,
        inProgress: 0,
        closed: 0,
        overdue: 0,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadOverdueData();
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, [loadOverdueData]);

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
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const assigneeNames = ticket.assignees.map(
        (assignee) => assignee.displayName
      );

      const matchesSearch =
        !normalizedSearch ||
        [
          ticket.ticketNo,
          ticket.companyName,
          ticket.problem,
          ticket.callType,
          ticket.accountManager,
          ticket.assignedBy ?? "",
          ...assigneeNames,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

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
        ticket.accountManager === filters.accountManager;

      const matchesAssignedTo =
        filters.assignedTo === "All" ||
        ticket.assignees.some(
          (assignee) =>
            assignee.displayName === filters.assignedTo
        );

      const matchesAssignedBy =
        filters.assignedBy === "All" ||
        ticket.assignedBy === filters.assignedBy;

      const matchesTeam =
        filters.team === "All" ||
        ticket.assignees.some(
          (assignee) => assignee.team === filters.team
        );

      const matchesFromDate =
        !selectedFromDate ||
        ticket.ticketDate >= formatDateForApi(selectedFromDate);

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

  const handleDownloadTemplate = () => {
    setShowActionsMenu(false);
    Alert.alert(
      "Download Template",
      "Template download will be connected when the API is available."
    );
  };

  const handleImport = () => {
    setShowActionsMenu(false);
    Alert.alert(
      "Import Tickets",
      "Ticket import will be connected when the API is available."
    );
  };

  const handleExportConfirm = (
    range: ExportDateRange
  ) => {
    setShowExportModal(false);
    Alert.alert(
      "Export Tickets",
      `Export selected: ${range}`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <MainHeader
        onMenuPress={() => setDrawerOpen(true)}
        onProfilePress={() => router.push("/home/account")}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Overdue</Text>

          <View style={styles.dashboardActions}>
            <View style={styles.actionButtonWrapper}>
              <TouchableOpacity
                style={styles.moreButton}
                onPress={() => {
                  setShowAddMenu(false);
                  setShowActionsMenu(
                    (current) => !current
                  );
                }}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="ellipsis-vertical"
                  size={18}
                  color={COLORS.textBody}
                />
              </TouchableOpacity>

              <DashboardActionsMenu
                visible={showActionsMenu}
                onExport={() => {
                  setShowActionsMenu(false);
                  setShowExportModal(true);
                }}
                onDownloadTemplate={handleDownloadTemplate}
                onImport={handleImport}
                onClose={() => setShowActionsMenu(false)}
              />
            </View>

            <View style={styles.actionButtonWrapper}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  setShowActionsMenu(false);
                  setShowAddMenu(
                    (current) => !current
                  );
                }}
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

              <AddTicketProjectMenu
                visible={showAddMenu}
                onClose={() => setShowAddMenu(false)}
                onNewTicket={() => {
                  setShowAddMenu(false);
                  router.push("/home/new-ticket");
                }}
                onNewProject={() => {
                  setShowAddMenu(false);
                  router.push("/home/new-project");
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
          <Text style={styles.ticketsTitle}>
            OVERDUE TICKETS
          </Text>

          <Text style={styles.ticketCount}>
            Showing {filteredTickets.length} of{" "}
            {tickets.length}
          </Text>
        </View>

        {isLoading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Loading overdue tickets...
            </Text>
          </View>
        ) : loadError ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="alert-circle-outline"
              size={34}
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
              <Text
                style={[
                  styles.emptyText,
                  {
                    color: COLORS.navigationActive,
                    fontWeight: "700",
                  },
                ]}
              >
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        ) : filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.srNo}
              ticket={ticket}
              onViewDetails={() =>
                router.push({
                  pathname: "/home/ticket-details",
                  params: {
                    srNo: String(ticket.srNo),
                    ticketNo: ticket.ticketNo,
                  },
                })
              }
            />
          ))
        ) : (
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

      <ExportTicketsModal
        visible={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExportConfirm}
      />

      <SideDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
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

  emptyIconContainer: {
  width: 42,
  height: 42,
  borderRadius: 12,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: COLORS.surfaceSoft,
  marginBottom: 4,
},



  titleRow: {

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



  actionsRow: {

    flexDirection: "row",

    alignItems: "center",

    gap: 4,

  },



  moreButton: {

    width: 36,

    height: 38,

    borderRadius: 9,

    backgroundColor: COLORS.white,



    borderWidth: 1,

    borderColor: COLORS.border,

    alignItems: "center",

    justifyContent: "center",

    zIndex: 1002,

  },



  addButton: {

    minWidth: 94,

    height: 38,

    borderRadius: 9,

    backgroundColor: COLORS.primaryDark,



    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    paddingHorizontal: 11,

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



  emptyTitle: {

    marginTop: 10,

    fontSize: 14,

    fontWeight: "700",

    color: COLORS.textBody,

  },



  emptyText: {

    marginTop: 5,

    fontSize: 11,

    lineHeight: 16,

    textAlign: "center",

    color: COLORS.textMuted,

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

});
