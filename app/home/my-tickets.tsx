import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    Alert,
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import ListPagination from "../../components/admin/dashboard/ListPagination";
import { exportTicketWorkbook, downloadTicketTemplate, pickTicketWorkbook, importTicketWorkbook } from "../../api/ticketExcel";

import { COLORS } from "../../constants/colors";
import { ticketFilterOptions } from "../../data/ticketFilterOptions";

import MainHeader from "../../components/admin/navigation/MainHeader";
import SideDrawer from "../../components/admin/navigation/SideDrawer";
import DashboardActionsMenu from "../../components/admin/dashboard/DashboardActionsMenu";
import AddTicketProjectMenu from "../../components/admin/dashboard/AddTicketProjectMenu";
import TicketSearchFilters from "../../components/admin/dashboard/TicketSearchFilters";
import ExportTicketsModal, {
    ExportDateRange,
} from "../../components/admin/dashboard/ExportTicketsModal";
import StatCard from "../../components/admin/dashboard/StatCard";
import TicketCard from "../../components/admin/dashboard/TicketCard";

import type {
    DashboardFilters,
    FilterKey,
} from "../../types/dashboardFilters";
import type { Ticket } from "../../types/ticket";
import { fetchTickets } from "../../api/tickets";
import { getCurrentUser } from "../../api/auth";

const PAGE_SIZE = 10;

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

const isOverdueTicket = (ticket: Ticket) => {
    if (
        ticket.status !== "Pending" &&
        ticket.status !== "In Progress"
    ) {
        return false;
    }

    if (!ticket.deadlineDate) {
        return false;
    }

    return ticket.deadlineDate < formatDateForApi(new Date());
};

export default function MyTicketsScreen() {
    const router = useRouter();

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [page, setPage] = useState(1);

    const [searchText, setSearchText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] =
        useState<DashboardFilters>(initialFilters);
    const [selectedFromDate, setSelectedFromDate] =
        useState<Date | null>(null);

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [showActionsMenu, setShowActionsMenu] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [excelBusy, setExcelBusy] = useState(false);

    const loadMyTickets = useCallback(async () => {
        try {
            setIsLoading(true);
            setLoadError(null);

            const currentUser = await getCurrentUser();

            const ticketResponse = await fetchTickets({
                assigneeUserId: currentUser.id,
                page: 1,
                pageSize: 200,
            });

            const allTickets = [...ticketResponse.tickets];
            const totalPages = Math.ceil(ticketResponse.total / 200);

            for (let page = 2; page <= totalPages; page += 1) {
                const response = await fetchTickets({
                    assigneeUserId: currentUser.id,
                    page,
                    pageSize: 200,
                });

                allTickets.push(...response.tickets);
            }

            setTickets(allTickets);
        } catch (error) {
            console.log("My Tickets API error:", error);
            setLoadError("Unable to load your tickets.");
            setTickets([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            void loadMyTickets();
        }, 0);

        return () => {
            clearTimeout(timer);
        };
    }, [loadMyTickets]);

    const stats = useMemo(
        () => [
            {
                title: "TOTAL TICKETS",
                value: tickets.length,
                backgroundColor: COLORS.totalBackground,
                borderColor: COLORS.totalBorder,
                textColor: COLORS.primary,
            },
            {
                title: "PENDING",
                value: tickets.filter(
                    (ticket) => ticket.status === "Pending"
                ).length,
                backgroundColor: COLORS.pendingBackground,
                borderColor: COLORS.pendingBorder,
                textColor: COLORS.warning,
            },
            {
                title: "IN PROGRESS",
                value: tickets.filter(
                    (ticket) => ticket.status === "In Progress"
                ).length,
                backgroundColor: COLORS.inProgressBackground,
                borderColor: COLORS.inProgressBorder,
                textColor: COLORS.secondary,
            },
            {
                title: "CLOSED",
                value: tickets.filter(
                    (ticket) => ticket.status === "Closed"
                ).length,
                backgroundColor: COLORS.closedBackground,
                borderColor: COLORS.closedBorder,
                textColor: COLORS.success,
            },
            {
                title: "OVERDUE",
                value: tickets.filter(isOverdueTicket).length,
                backgroundColor: COLORS.overdueBackground,
                borderColor: COLORS.overdueBorder,
                textColor: COLORS.danger,
            },
        ],
        [tickets]
    );

    const openDrawer = () => {
        setShowAddMenu(false);
        setShowActionsMenu(false);
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
    };

    const openActionsMenu = () => {
        setShowAddMenu(false);
        setShowActionsMenu(true);
    };

const handleExport = async (range: ExportDateRange) => {
    if (excelBusy) return;
    setShowExportModal(false);
    setExcelBusy(true);
    try {
      await new Promise<void>((resolve) => setTimeout(resolve, 550));
      const user = await getCurrentUser();
      const today = new Date();
      const from = new Date(today);
      from.setDate(today.getDate() - (range === "30 days" ? 29 : 89));
      await exportTicketWorkbook({
        assigneeUserId: user.id,
        ...(range === "All" ? {} : {
          dateFrom: formatDateForApi(from),
          dateTo: formatDateForApi(today),
        }),
        ...(filters.status !== "All" ? { status: filters.status } : {}),
        ...(filters.callType !== "All" ? { callType: filters.callType } : {}),
        ...(filters.priority !== "All" ? { priority: filters.priority } : {}),
        ...(filters.accountManager !== "All" ? { accountManager: filters.accountManager } : {}),
        ...(filters.assignedBy !== "All" ? { assignedBy: filters.assignedBy } : {}),
        ...(searchQuery ? { search: searchQuery } : {}),
      });
    } catch (error) {
      Alert.alert("Export Failed", error instanceof Error ? error.message : "Unable to export tickets.");
    } finally {
      setExcelBusy(false);
    }
  };

  const handleDownloadTemplate = async () => {
    if (excelBusy) return;
    setShowActionsMenu(false);
    setExcelBusy(true);
    try {
      await downloadTicketTemplate();
    } catch (error) {
      Alert.alert("Download Failed", error instanceof Error ? error.message : "Unable to download template.");
    } finally {
      setExcelBusy(false);
    }
  };

  const handleImport = async () => {
    if (excelBusy) return;
    setShowActionsMenu(false);
    try {
      const selection = await pickTicketWorkbook();
      if (!selection) return;
      Alert.alert("Import Tickets?", `Import tickets from ${selection.name}? This creates new tickets. Admin access is required.`, [
        { text: "Cancel", style: "cancel" },
        { text: "Import", onPress: () => { void (async () => {
          setExcelBusy(true);
          try {
            const result = await importTicketWorkbook(selection);
            const firstErrors = result.errors.slice(0, 3).map((e) => `Row ${e.row}: ${e.error ?? "Failed"}`).join("\n");
            Alert.alert("Import Complete", `${result.created} ticket(s) created, ${result.failedCount} row(s) failed.${firstErrors ? `\n${firstErrors}` : ""}`);
            await loadMyTickets();
          } catch (error) {
            Alert.alert("Import Failed", error instanceof Error ? error.message : "Unable to import tickets.");
          } finally { setExcelBusy(false); }
        })(); } },
      ]);
    } catch (error) {
      Alert.alert("File Selection Failed", error instanceof Error ? error.message : "Unable to select workbook.");
    }
  };

  

  const handleFilterChange = (
        key: FilterKey,
        value: string
    ) => {
    setPage(1);
        setFilters((current) => ({
            ...current,
            [key]: value,
        }));
    };

    const handleFromDateChange = (
        date: Date | null,
        formattedDate: string
    ) => {
    setPage(1);
        setSelectedFromDate(date);

        setFilters((current) => ({
            ...current,
            fromDate: formattedDate,
        }));
    };

    const handleClearFilters = () => {
    setPage(1);
        setSearchText("");
        setSearchQuery("");
        setFilters(initialFilters);
        setSelectedFromDate(null);
    };

    useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearchQuery(searchText.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchText]);

  const handleSearch = () => {
        setPage(1);
    setSearchQuery(searchText.trim());
    };

    const filteredTickets = useMemo(() => {
        const query =
            searchQuery.trim().toLowerCase();

        return tickets.filter((ticket) => {
            const assigneeNames = ticket.assignees
                .map((assignee) => assignee.displayName);

            const matchesSearch =
                !query ||
                [
                    ticket.ticketNo,
                    ticket.companyName,
                    ticket.callType,
                    ticket.accountManager,
                    ticket.assignedBy ?? "",
                    ...assigneeNames,
                    ticket.status,
                    ticket.problem,
                ]
                    .join(" ")
                    .toLowerCase()
                    .includes(query);

            const matchesStatus =
                filters.status === "All" ||
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
                ticket.ticketDate >=
                formatDateForApi(selectedFromDate);

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
    const paginatedTickets = useMemo(
  () =>
    filteredTickets.slice(
      (page - 1) * PAGE_SIZE,
      page * PAGE_SIZE
    ),
  [filteredTickets, page]
);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            <MainHeader
                onMenuPress={openDrawer}
                onProfilePress={() =>
                    router.push("/home/account")
                }
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                <View style={styles.dashboardTitleRow}>
                    <Text style={styles.pageTitle}>
                        My Tickets
                    </Text>

                    <View style={styles.dashboardActions}>
                        <View style={styles.actionButtonWrapper}>
                            <TouchableOpacity
                                style={styles.moreButton}
                                onPress={openActionsMenu}
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
                                onDownloadTemplate={
                                    handleDownloadTemplate
                                }
                                onImport={handleImport}
                                onClose={() =>
                                    setShowActionsMenu(false)
                                }
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
                                onClose={() =>
                                    setShowAddMenu(false)
                                }
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
                    contentContainerStyle={
                        styles.statsContainer
                    }
                >
                    {stats.map((stat) => (
                        <View
                            key={stat.title}
                            style={styles.statWrapper}
                        >
                            <StatCard
                                title={stat.title}
                                value={stat.value}
                                backgroundColor={
                                    stat.backgroundColor
                                }
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
                        TICKETS
                    </Text>

                    <Text style={styles.ticketsCount}>
                        Showing {paginatedTickets.length} of{" "}
                        {filteredTickets.length}
                    </Text>
                </View>

                {isLoading && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>
                            Loading your tickets...
                        </Text>
                    </View>
                )}

                {!isLoading && loadError && (
                    <View style={styles.emptyState}>
                        <Ionicons
                            name="alert-circle-outline"
                            size={30}
                            color={COLORS.danger}
                        />

                        <Text style={styles.emptyText}>
                            {loadError}
                        </Text>

                        <TouchableOpacity
                            onPress={() => void loadMyTickets()}
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
                )}

                {!isLoading &&
                    !loadError &&
                    paginatedTickets.map((ticket) => (
<TicketCard
                            key={ticket.srNo}
                            ticket={ticket}
                            onViewDetails={() =>
                                router.push({
                                    pathname:
                                        "/home/ticket-details",
                                    params: {
                                        srNo: String(ticket.srNo),
                                        ticketNo:
                                            ticket.ticketNo,
                                    },
                                })
                            }
                        />
                    ))}

                {!isLoading &&
                    !loadError &&
                    filteredTickets.length === 0 && (
                        <View style={styles.emptyState}>
                            <Ionicons
                                name="ticket-outline"
                                size={30}
                                color={COLORS.textSearchIcon}
                            />

                            <Text style={styles.emptyText}>
                                No tickets found
                            </Text>
                        </View>
                    )}
                  {!isLoading && !loadError && (
        <ListPagination
          page={page}
          total={filteredTickets.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      )}
      </ScrollView>

      {excelBusy && (
        <View style={styles.excelBusyOverlay} pointerEvents="none">
          <View style={styles.excelBusyCard}>
            <ActivityIndicator color={COLORS.navigationActive} />
            <Text style={styles.excelBusyText}>Processing Excel file...</Text>
          </View>
        </View>
      )}

            <ExportTicketsModal
                visible={showExportModal}
                onClose={() =>
                    setShowExportModal(false)
                }
                onExport={handleExport}
            />

            <SideDrawer
                visible={drawerOpen}
                onClose={closeDrawer}
            />
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
  excelBusyOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10000,
  },
  excelBusyCard: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 15,
  },
  excelBusyText: {
    color: COLORS.textBody,
    fontSize: 12,
    fontWeight: "600",
  },


    container: {

        flex: 1,

        backgroundColor: COLORS.background,

    },



    content: {

        paddingHorizontal: 16,

        paddingTop: 18,

        paddingBottom: 100,

    },



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



});
