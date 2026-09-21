import React, {
  useMemo,
  useState
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

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";
import TicketSearchFilters from "../../components/dashboard/TicketSearchFilters";

import { Ionicons } from "@expo/vector-icons";
import AddTicketProjectMenu from "../../components/dashboard/AddTicketProjectMenu";


import DashboardActionsMenu from "../../components/dashboard/DashboardActionsMenu";
import ExportTicketsModal, {
  ExportDateRange,
} from "../../components/dashboard/ExportTicketsModal";

import StatCard from "../../components/dashboard/StatCard";
import TicketCard, {
  Ticket,
} from "../../components/dashboard/TicketCard";

import MainHeader from "../../components/navigation/MainHeader";
import SideDrawer from "../../components/navigation/SideDrawer";

import type {
  DashboardFilters,
  FilterKey,
} from "../../types/dashboardFilters";

/* =========================================================
   STATISTICS
========================================================= */

const stats = [
  {
    title: "TOTAL TICKETS",
    value: 323,
    backgroundColor: "#E0E7FF",
    borderColor: "#D4E1FF",
    textColor: "#3729AD",
  },
  {
    title: "PENDING",
    value: 1,
    backgroundColor: "#FEF3C6",
    borderColor: "#FFE5A3",
    textColor: "#963B00",
  },
  {
    title: "IN PROGRESS",
    value: 17,
    backgroundColor: "#F2F7FC",
    borderColor: "#D5EBFA",
    textColor: "#134581",
  },
  {
    title: "CLOSED",
    value: 304,
    backgroundColor: "#D1FBE5",
    borderColor: "#CDEEDD",
    textColor: "#016144",
  },
  {
    title: "OVERDUE",
    value: 2,
    backgroundColor: "#FFE3E1",
    borderColor: "#F8D0D0",
    textColor: "#9E0913",
  },
];

/* =========================================================
   INITIAL FILTER STATE
========================================================= */

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

/* =========================================================
   FILTER OPTIONS
========================================================= */

const filterOptions: Record<FilterKey, string[]> = {
  status: [
    "All",
    "Pending",
    "In Progress",
    "Closed",
  ],

  callType: [
    "All",
    "Warranty",
    "AMC",
    "OEM",
    "Office",
    "Installation",
    "POC",
    "Call",
    "Chargeable",
    "Non-Chargeable",
    "Routine Checks",
  ],

  priority: [
    "All",
    "P1",
    "P2",
    "P3",
    "P4",
  ],

  accountManager: [
    "All",
    "Aishwarya",
    "Aishwarya Tambe",
    "Anjaneyulu Mallelli",
    "Archana Mishra",
    "Braj Bala",
    "Computer Center",
    "Dil B Thapa",
    "D.S. Rawat",
    "Gaurav Dubey",
    "Hardik Narielwala",
    "Hardik Sir",
    "Hemang Shah",
    "Himanshu Parikh",
    "Jitesh Malhotra",
    "Manoj Mohite",
    "Mr. Sundaram",
    "Parmanand Pandey",
    "Pranesh Kute",
    "Radheshyam G",
    "Rajesh Mishra",
    "R Arul Babu",
    "Sachin Gupta",
    "Sanyukt Saransh",
    "Sheetal Sawant",
    "T Srinivasa",
  ],

  assignedTo: [
    "All",
    "Ajay Malik",
    "Aman Sandim",
    "Help Desk",
    "Jitesh Malhotra",
    "Manoj Mohite",
    "Narendra Kumar",
    "Nikhil Kumar",
    "Parmanand Pandey",
    "Pranesh Kute",
    "Raghavendra Mishra",
    "Rajesh Mishra",
    "Rajesh R",
    "Ravi Kumar Gorella",
    "Rohit Kumar",
    "Shazeb Khan",
    "Yash Gupta",
  ],

  assignedBy: [
    "All",
    "Ajay Malik",
    "Jitesh Malhotra",
    "Manoj",
    "Narendar Kumar",
    "Nikhil Kumar",
    "Parmanand Pandey",
    "Pranesh",
    "Raghavendra Mishra",
    "Rohit Kumar",
    "Yash Gupta",
  ],

  team: [
    "All",
    "FMS",
    "Field",
  ],
};

/* =========================================================
   TEMPORARY TICKET DATA
========================================================= */

const tickets: Ticket[] = [
  {
    ticketNo: "0309202606",
    date: "03/09/2026",
    clientName: "IES College",
    callType: "Routine Visit u...",
    priority: "P3",
    status: "In Progress",
    assignedBy: "Pranesh",
    assignedTo: "Pranesh Kute",
    updatedAt: "03/09/2026",
  },
  {
    ticketNo: "0309202605",
    date: "03/09/2026",
    clientName: "CEWELL ONGC V...",
    callType: "Routine Health ...",
    priority: "P3",
    status: "Closed",
    assignedBy: "-",
    assignedTo: "Yash Gupta",
    updatedAt: "03/09/2026",
  },
  {
    ticketNo: "0309202604",
    date: "03/09/2026",
    clientName: "Cygnus Inform...",
    callType: "Routine Checkin...",
    priority: "P3",
    status: "Closed",
    assignedBy: "-",
    assignedTo: "Jitesh Malhotra",
    updatedAt: "03/09/2026",
  },
  {
    ticketNo: "0309202603",
    date: "03/09/2026",
    clientName: "ONGC Rajahmun...",
    callType: "Routine Checks",
    priority: "P3",
    status: "Closed",
    assignedBy: "-",
    assignedTo: "Ravi Kumar Gorrela",
    updatedAt: "03/09/2026",
  },
  {
    ticketNo: "0309202602",
    date: "03/09/2026",
    clientName: "ONGC GEOPIC C...",
    callType: "CLAP & GMS Heal...",
    priority: "P3",
    status: "Closed",
    assignedBy: "Ajay Malik",
    assignedTo: "Ajay Malik",
    updatedAt: "03/09/2026",
  },
];

/* =========================================================
   HOME SCREEN
========================================================= */

export default function HomeScreen() {
  const router = useRouter();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [showAddMenu, setShowAddMenu] = useState(false);

  const [showActionsMenu, setShowActionsMenu] =
    useState(false);

  const [showExportModal, setShowExportModal] =
    useState(false);


  const [selectedFromDate, setSelectedFromDate] =
    useState<Date | null>(null);

  const [filters, setFilters] =
    useState<DashboardFilters>(initialFilters);




  /* =======================================================
     FILTER POSITION
  ======================================================= */


  /* =======================================================
     FILTER SELECTION
  ======================================================= */

  /* =======================================================
     FILTER OPEN / CLOSE
  ======================================================= */


  /* =======================================================
     SEARCH + FILTERING
  ======================================================= */



  /* =======================================================
     SEARCH
  ======================================================= */

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
    return tickets.filter((ticket) => {
      /* SEARCH */

      const normalizedSearch =
        searchQuery.trim().toLowerCase();

      if (normalizedSearch) {
        const matchesSearch =
          ticket.ticketNo
            .toLowerCase()
            .includes(normalizedSearch) ||
          ticket.clientName
            .toLowerCase()
            .includes(normalizedSearch);

        if (!matchesSearch) {
          return false;
        }
      }

      /* STATUS */

      if (
        filters.status !== "All" &&
        ticket.status !== filters.status
      ) {
        return false;
      }

      /* CALL TYPE */

      if (
        filters.callType !== "All" &&
        ticket.callType !== filters.callType
      ) {
        return false;
      }

      /* PRIORITY */

      if (
        filters.priority !== "All" &&
        ticket.priority !== filters.priority
      ) {
        return false;
      }

      /* ASSIGNED TO */

      if (
        filters.assignedTo !== "All" &&
        ticket.assignedTo !== filters.assignedTo
      ) {
        return false;
      }

      /* ASSIGNED BY */

      if (
        filters.assignedBy !== "All" &&
        ticket.assignedBy !== filters.assignedBy
      ) {
        return false;
      }

      /* FROM DATE */

      if (selectedFromDate) {
        const [day, month, year] =
          ticket.date.split("/").map(Number);

        const ticketDate = new Date(
          year,
          month - 1,
          day
        );

        ticketDate.setHours(0, 0, 0, 0);

        const fromDate =
          new Date(selectedFromDate);

        fromDate.setHours(0, 0, 0, 0);

        if (ticketDate < fromDate) {
          return false;
        }
      }

      return true;
    });
  }, [
    searchQuery,
    filters.status,
    filters.callType,
    filters.priority,
    filters.assignedTo,
    filters.assignedBy,
    selectedFromDate,
  ]);
  /* =======================================================
     ACTIVE DROPDOWN POSITION
  ======================================================= */


  /* =======================================================
     DRAWER
  ======================================================= */

  const openDrawer = () => {
    setShowAddMenu(false);
    setShowActionsMenu(false);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };



  /* =======================================================
     BOTTOM NAVIGATION
     
     Only Dashboard is currently an implemented route.
     The remaining destinations will be connected when
     their screens are created.
  ======================================================= */
  const openActionsMenu = () => {
    setShowAddMenu(false);
    setShowActionsMenu(true);
  };

  const closeActionsMenu = () => {
    setShowActionsMenu(false);
  };

  const handleExport = (
    dateRange: ExportDateRange
  ) => {
    setShowExportModal(false);

    /*
     * The actual export API will be connected
     * once the API contract is provided.
     *
     * dateRange contains:
     * "30 days" | "90 days" | "All"
     */

    Alert.alert(
      "Export",
      `Export selected: ${dateRange}`
    );
  };

  const handleDownloadTemplate = () => {
    setShowActionsMenu(false);

    /*
     * Actual template download will be connected
     * once the API/file endpoint is provided.
     */

    Alert.alert(
      "Download Template",
      "Template download will be connected when the API is available."
    );
  };

  const handleImport = () => {
    setShowActionsMenu(false);

    /*
     * Actual import functionality will be connected
     * once the API/file requirements are provided.
     */

    Alert.alert(
      "Import",
      "Import will be connected when the API is available."
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        style="dark"
      />

      {/* =================================================
          REUSABLE MAIN HEADER
      ================================================= */}

      <MainHeader
        onMenuPress={openDrawer}
        onProfilePress={() =>
          router.push("/home/account")
        }
      />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* =================================================
            DASHBOARD TITLE
        ================================================= */}

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
                  color="#26364B"
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
                  color="#FFFFFF"
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

        {/* =================================================
    SEARCH + FILTERS
================================================= */}

        <TicketSearchFilters
          searchText={searchText}
          filters={filters}
          filterOptions={filterOptions}
          selectedFromDate={selectedFromDate}
          onSearchTextChange={setSearchText}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          onFromDateChange={handleFromDateChange}
          onClear={handleClearFilters}
        />
        {/* =================================================
            TICKETS HEADER
        ================================================= */}

        <View style={styles.ticketsHeader}>
          <Text style={styles.ticketsTitle}>
            TICKETS
          </Text>

          <Text style={styles.ticketsCount}>
            Showing {filteredTickets.length} of{" "}
            {tickets.length}
          </Text>
        </View>

        {/* =================================================
            TICKETS
        ================================================= */}

        <View>
          {filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.ticketNo}
              ticket={ticket}
              onViewDetails={() =>
                Alert.alert(
                  "Ticket Details",
                  `Ticket #${ticket.ticketNo}`
                )
              }
            />
          ))}
        </View>

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {filteredTickets.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons
              name="search-outline"
              size={30}
              color="#9AA9BA"
            />

            <Text style={styles.emptyText}>
              No tickets found
            </Text>
          </View>
        )}
      </ScrollView>



      {/* =================================================
          REUSABLE BOTTOM NAVIGATION
      ================================================= */}

      <ExportTicketsModal
        visible={showExportModal}
        onClose={() =>
          setShowExportModal(false)
        }
        onExport={handleExport}
      />

      {/* =================================================
          REUSABLE SIDE DRAWER
      ================================================= */}

      <SideDrawer
        visible={drawerOpen}
        onClose={closeDrawer}
      />
    </SafeAreaView>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  /* =======================================================
     MAIN CONTENT
  ======================================================= */

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
    color: "#16243A",
  },

  /* =======================================================
     ADD BUTTON
  ======================================================= */

  addButton: {
    height: 38,
    minWidth: 94,

    borderRadius: 9,

    backgroundColor: "#092E63",

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
    color: "#FFFFFF",
  },



  /* =======================================================
     STATISTICS
  ======================================================= */

  statsContainer: {
    paddingLeft: 4,
    paddingRight: 4,
    paddingBottom: 6,
  },

  statWrapper: {
    marginRight: 12,
  },

  /* =======================================================
     SEARCH
  ======================================================= */


  /* =======================================================
     FILTERS
  ======================================================= */


  /* =======================================================
     FILTER DROPDOWN
  ======================================================= */



  /* =======================================================
     TICKETS
  ======================================================= */

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
    color: "#293A50",
    letterSpacing: 0.3,
  },

  ticketsCount: {
    fontSize: 10,
    color: "#71849A",
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",

    paddingVertical: 50,
  },

  emptyText: {
    marginTop: 8,

    fontSize: 12,
    color: "#8798AA",
  },


  /* =======================================================
     DATE MODAL
  ======================================================= */

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

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#DCE4ED",

    alignItems: "center",
    justifyContent: "center",

    zIndex: 1002,
  },


});