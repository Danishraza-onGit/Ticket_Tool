import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Alert,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { exportTicketWorkbook, downloadTicketTemplate, pickTicketWorkbook, importTicketWorkbook } from "../../api/ticketExcel";
import { useRouter } from "expo-router";
import { COLORS } from "../../constants/colors";
import {
  ticketFilterOptions,
} from "../../data/ticketFilterOptions";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";
import TicketSearchFilters from "../../components/admin/dashboard/TicketSearchFilters";

import { Ionicons } from "@expo/vector-icons";
import ListPagination from "../../components/admin/dashboard/ListPagination";
import AddTicketProjectMenu from "../../components/admin/dashboard/AddTicketProjectMenu";

import DashboardActionsMenu from "../../components/admin/dashboard/DashboardActionsMenu";
import ExportTicketsModal, {
  ExportDateRange,
} from "../../components/admin/dashboard/ExportTicketsModal";

import StatCard from "../../components/admin/dashboard/StatCard";
import TicketCard from "../../components/admin/dashboard/TicketCard";
// import {
//   temporaryTickets,
// } from "../../data/tickets";

import {
  fetchTickets,
  fetchTicketSummary,
} from "../../api/tickets";

import type {
  Ticket,
} from "../../types/ticket";

import type {
  TicketSummary,
} from "../../api/tickets";

import MainHeader from "../../components/admin/navigation/MainHeader";
import SideDrawer from "../../components/admin/navigation/SideDrawer";

import type {
  DashboardFilters,
  FilterKey,
} from "../../types/dashboardFilters";


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



const formatDateForApi = (
  date: Date
) => {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};


export default function HomeScreen() {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const [tickets, setTickets] =
    useState<Ticket[]>([]);


  const [summary, setSummary] =
    useState<TicketSummary | null>(null);

  const [isLoadingTickets, setIsLoadingTickets] =
    useState(true);

  const [dashboardError, setDashboardError] =
    useState<string | null>(null);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddMenu, setShowAddMenu] = useState(false);

  const [showActionsMenu, setShowActionsMenu] =
    useState(false);

  const [showExportModal, setShowExportModal] =
    useState(false);
  const [excelBusy, setExcelBusy] = useState(false);


  const [selectedFromDate, setSelectedFromDate] =
    useState<Date | null>(null);

  const [filters, setFilters] =
    useState<DashboardFilters>(initialFilters);



  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData =
    useCallback(async () => {
      try {
        setIsLoadingTickets(true);
        setDashboardError(null);

        const ticketFilters = {
          page: 1,
          pageSize: 200,

          ...(searchQuery.trim()
            ? {
              search:
                searchQuery.trim(),
            }
            : {}),

          ...(filters.status !== "All"
            ? {
              status:
                filters.status,
            }
            : {}),

          ...(filters.callType !== "All"
            ? {
              callType:
                filters.callType,
            }
            : {}),

          ...(filters.priority !== "All"
            ? {
              priority:
                filters.priority,
            }
            : {}),

          ...(filters.accountManager !==
            "All"
            ? {
              accountManager:
                filters.accountManager,
            }
            : {}),

          ...(filters.assignedBy !== "All"
            ? {
              assignedBy:
                filters.assignedBy,
            }
            : {}),

          ...(filters.team !== "All"
            ? {
              team:
                filters.team,
            }
            : {}),

          ...(selectedFromDate
            ? {
              dateFrom:
                formatDateForApi(
                  selectedFromDate
                ),
            }
            : {}),
        };

        const [firstPage, summaryResponse] = await Promise.all([
          fetchTickets(ticketFilters),
          fetchTicketSummary(),
        ]);
        const allTickets = [...firstPage.tickets];
        const totalPages = Math.ceil(firstPage.total / 200);
        for (let nextPage = 2; nextPage <= totalPages; nextPage++) {
          const next = await fetchTickets({ ...ticketFilters, page: nextPage });
          allTickets.push(...next.tickets);
        }
        setTickets(allTickets);
        setSummary(summaryResponse);

      } catch (error) {
        console.log(
          "Dashboard API error:",
          error
        );

        setDashboardError(
          "Unable to load dashboard data."
        );
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

  const filteredTickets =
    useMemo(() => {
      if (
        filters.assignedTo === "All"
      ) {
        return tickets;
      }

      return tickets.filter(
        (ticket) =>
          ticket.assignees.some(
            (assignee) =>
              assignee.displayName ===
              filters.assignedTo
          )
      );
    }, [
      tickets,
      filters.assignedTo,
    ]);

  const stats = useMemo(
    () => [
      {
        title: "TOTAL TICKETS",
        value: summary?.total ?? 0,
        backgroundColor:
          COLORS.totalBackground,
        borderColor:
          COLORS.totalBorder,
        textColor:
          COLORS.primary,
      },
      {
        title: "PENDING",
        value:
          summary?.pending ?? 0,
        backgroundColor:
          COLORS.pendingBackground,
        borderColor:
          COLORS.pendingBorder,
        textColor:
          COLORS.warning,
      },
      {
        title: "IN PROGRESS",
        value:
          summary?.inProgress ?? 0,
        backgroundColor:
          COLORS.inProgressBackground,
        borderColor:
          COLORS.inProgressBorder,
        textColor:
          COLORS.secondary,
      },
      {
        title: "CLOSED",
        value:
          summary?.closed ?? 0,
        backgroundColor:
          COLORS.closedBackground,
        borderColor:
          COLORS.closedBorder,
        textColor:
          COLORS.success,
      },
      {
        title: "OVERDUE",
        value:
          summary?.overdue ?? 0,
        backgroundColor:
          COLORS.overdueBackground,
        borderColor:
          COLORS.overdueBorder,
        textColor:
          COLORS.danger,
      },
    ],
    [summary]
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

  /*const closeActionsMenu = () => {
    setShowActionsMenu(false);
  };*/

  const handleExport = async (
    dateRange: ExportDateRange
  ) => {
    console.log(
      "[Excel] Export tapped:",
      dateRange,
      "Busy:",
      excelBusy
    );

    if (excelBusy) {
      Alert.alert(
        "Please Wait",
        "Another Excel operation is still in progress."
      );
      return;
    }

    setExcelBusy(true);
    setShowExportModal(false);

    try {
      // Wait for the Export modal to finish closing
      // before opening the native iOS share sheet.
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 550);
      });

      const today = new Date();
      const dateFrom = new Date(today);

      dateFrom.setDate(
        today.getDate() -
        (dateRange === "30 days" ? 29 : 89)
      );

      const exportFilters =
        dateRange === "All"
          ? {}
          : {
            dateFrom: formatDateForApi(dateFrom),
            dateTo: formatDateForApi(today),
          };

      console.log(
        "[Excel] Starting export:",
        exportFilters
      );

      await exportTicketWorkbook(exportFilters);

      console.log(
        "[Excel] Export download completed."
      );
    } catch (error) {
      console.log(
        "[Excel] Export failed:",
        error
      );

      Alert.alert(
        "Export Failed",
        error instanceof Error
          ? error.message
          : "Unable to export tickets."
      );
    } finally {
      setExcelBusy(false);
    }
  };

  const handleDownloadTemplate = async () => {
    console.log(
      "[Excel] Download Template tapped. Busy:",
      excelBusy
    );

    if (excelBusy) {
      Alert.alert(
        "Please Wait",
        "Another Excel operation is still in progress."
      );
      return;
    }
    setShowActionsMenu(false);
    setExcelBusy(true);
    try {
      await downloadTicketTemplate();
    } catch (error) {
      console.log("Ticket template download failed:", error);
      Alert.alert("Download Failed", error instanceof Error ? error.message : "Unable to download the template.");
    } finally {
      setExcelBusy(false);
    }
  };

  const handleImport = async () => {
    console.log(
      "[Excel] Import tapped. Busy:",
      excelBusy
    );

    if (excelBusy) {
      Alert.alert(
        "Please Wait",
        "Another Excel operation is still in progress."
      );
      return;
    }
    setShowActionsMenu(false);
    try {
      const selection = await pickTicketWorkbook();
      if (!selection) return;
      Alert.alert(
        "Import Tickets?",
        `Import tickets from ${selection.name}? This can create new tickets in Cygnus.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Import",
            onPress: () => {
              void (async () => {
                setExcelBusy(true);
                try {
                  const result = await importTicketWorkbook(selection);
                  const failures = result.errors.slice(0, 3).map(
                    (item) => `Row ${item.row}: ${item.error ?? "Import failed"}`
                  );
                  const detail = failures.length
                    ? `\n\n${failures.join("\n")}${result.failedCount > failures.length ? "\nMore errors were reported by the server." : ""}`
                    : "";
                  Alert.alert(
                    "Import Complete",
                    `${result.created} ticket(s) created. ${result.failedCount} row(s) failed.${detail}`,
                  );
                  await loadDashboardData();
                } catch (error) {
                  console.log("Ticket import failed:", error);
                  Alert.alert("Import Failed", error instanceof Error ? error.message : "Unable to import the workbook.");
                } finally {
                  setExcelBusy(false);
                }
              })();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("File Selection Failed", error instanceof Error ? error.message : "Unable to open the file picker.");
    }
  };
  const paginatedTickets = useMemo(
    () => filteredTickets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredTickets, page]
  );


  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar
        style="dark"
      />


      <MainHeader
        onMenuPress={openDrawer}
        onProfilePress={() =>
          router.push("/home/account")
        }
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
          <Text style={styles.pageTitle}>
            Dashboard
          </Text>

          <View style={styles.dashboardActions}>
            {/* MORE */}
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

            {/* ADD */}
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

        {/* =================================================
            STATISTICS
        ================================================= */}

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
                backgroundColor={
                  stat.backgroundColor
                }
                borderColor={
                  stat.borderColor
                }
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

        {isLoadingTickets && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Loading tickets...
            </Text>
          </View>
        )}

        {dashboardError &&
          !isLoadingTickets && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {dashboardError}
              </Text>

              <TouchableOpacity
                style={styles.retryButton}
                onPress={
                  loadDashboardData
                }
                activeOpacity={0.8}
              >
                <Text
                  style={
                    styles.retryButtonText
                  }
                >
                  Retry
                </Text>
              </TouchableOpacity>
            </View>
          )}




        {!isLoadingTickets &&
          !dashboardError && (
            <View>
              {paginatedTickets.map((ticket) => (
                <TicketCard
                  key={ticket.srNo}
                  ticket={ticket}
                  onViewDetails={() =>
                    router.push({
                      pathname:
                        "/home/ticket-details",

                      params: {
                        srNo: String(
                          ticket.srNo
                        ),
                        ticketNo:
                          ticket.ticketNo,
                      },
                    })
                  }
                />
              )
              )}
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

              <Text style={styles.emptyText}>
                No tickets found
              </Text>
            </View>
          )}
        {!isLoadingTickets && !dashboardError && (
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
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10000,
  },
  excelBusyCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 15,
  },
  excelBusyText: {
    fontSize: 12,
    color: COLORS.textBody,
    fontWeight: "600",
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },



  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 10,
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

  retryButton: {
    marginTop: 14,
    minWidth: 100,
    minHeight: 38,
    paddingHorizontal: 16,
    borderRadius: 9,
    backgroundColor:
      COLORS.primaryDark,
    alignItems: "center",
    justifyContent: "center",
  },

  retryButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.white,
  },


});