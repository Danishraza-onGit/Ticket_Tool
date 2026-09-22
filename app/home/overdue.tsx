import React, { useMemo, useState } from "react";
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

import AddTicketProjectMenu from "../../components/dashboard/AddTicketProjectMenu";

import DashboardActionsMenu from "../../components/dashboard/DashboardActionsMenu";
import ExportTicketsModal, {
  ExportDateRange,
} from "../../components/dashboard/ExportTicketsModal";
import StatCard from "../../components/dashboard/StatCard";
import TicketCard, {
  Ticket,
} from "../../components/dashboard/TicketCard";
import TicketSearchFilters from "../../components/dashboard/TicketSearchFilters";

import MainHeader from "../../components/navigation/MainHeader";
import SideDrawer from "../../components/navigation/SideDrawer";

import type {
  DashboardFilters,
  FilterKey,
} from "../../types/dashboardFilters";




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




const overdueTickets: Ticket[] = [
  {
    ticketNo: "0309202607",
    date: "03/09/2026",
    clientName: "GIK Kuthnaur",
    callType: "Routine Visit",
    priority: "P3",
    status: "Overdue",
    assignedBy: "Pranesh",
    assignedTo: "Pranesh Kute",
    updatedAt: "03/09/2026",
  },
  {
    ticketNo: "0309202608",
    date: "03/09/2026",
    clientName: "Cygnus Client",
    callType: "Warranty",
    priority: "P2",
    status: "Overdue",
    assignedBy: "Shazeb Khan",
    assignedTo: "Yash Gupta",
    updatedAt: "03/09/2026",
  },
];




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

const filterOptions: Record<FilterKey, string[]> = {
  status: ["All", "Pending", "In Progress", "Closed", "Overdue"],

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

  priority: ["All", "P1", "P2", "P3", "P4"],

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

  team: ["All", "FMS", "Field"],
};


export default function OverdueScreen() {
  const router = useRouter();

  /* =====================================================
     SCREEN STATE
  ===================================================== */

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const [selectedFromDate, setSelectedFromDate] =
    useState<Date | null>(null);

  const [filters, setFilters] =
    useState<DashboardFilters>(initialFilters);




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
    return overdueTickets.filter((ticket) => {
      /* Search */

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

      /* Status */

      if (
        filters.status !== "All" &&
        ticket.status !== filters.status
      ) {
        return false;
      }

      /* Call Type */

      if (
        filters.callType !== "All" &&
        ticket.callType !== filters.callType
      ) {
        return false;
      }

      /* Priority */

      if (
        filters.priority !== "All" &&
        ticket.priority !== filters.priority
      ) {
        return false;
      }

      /* Assigned To */

      if (
        filters.assignedTo !== "All" &&
        ticket.assignedTo !== filters.assignedTo
      ) {
        return false;
      }

      /* Assigned By */

      if (
        filters.assignedBy !== "All" &&
        ticket.assignedBy !== filters.assignedBy
      ) {
        return false;
      }

      /* From Date */

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



  /*const openDrawer = () => {
    setShowAddMenu(false);
    setShowActionsMenu(false);
    setDrawerOpen(true);
  };




  const toggleAddMenu = () => {
    setShowActionsMenu(false);
    setShowAddMenu((current) => !current);
  };

  const handleNewTicket = () => {
    setShowAddMenu(false);
    router.push("/home/new-ticket");
  };

  const handleNewProject = () => {
    setShowAddMenu(false);
    router.push("/home/new-project");
  };




  const toggleActionsMenu = () => {
    setShowAddMenu(false);
    setShowActionsMenu((current) => !current);
  };

  const handleExport = () => {
    setShowActionsMenu(false);
    setShowExportModal(true);
  };*/

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



  /*const closeMenus = () => {
    setShowAddMenu(false);
    setShowActionsMenu(false);
  };*/


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <MainHeader
        onMenuPress={() => setDrawerOpen(true)}
        onProfilePress={() =>
          router.push("/home/account")
        }
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
       

        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>
            Overdue
          </Text>

          <View style={styles.dashboardActions}>
            {/* MORE */}
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
                  color="#26364B"
                />
              </TouchableOpacity>

              <DashboardActionsMenu
                visible={showActionsMenu}
                onExport={() => {
                  setShowActionsMenu(false);
                  setShowExportModal(true);
                }}
                onDownloadTemplate={() => {
                  setShowActionsMenu(false);
                  handleDownloadTemplate();
                }}
                onImport={() => {
                  setShowActionsMenu(false);
                  handleImport();
                }}
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
          filterOptions={filterOptions}
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
            {overdueTickets.length}
          </Text>
        </View>



        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
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
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons
              name="checkmark-circle-outline"
              size={34}
              color="#8FA0B4"
            />

            <Text style={styles.emptyTitle}>
              No overdue tickets found
            </Text>

            <Text style={styles.emptyText}>
              No overdue tickets match the current
              search or filters.
            </Text>
          </View>
        )}
      </ScrollView>


   

      <ExportTicketsModal
        visible={showExportModal}
        onClose={() =>
          setShowExportModal(false)
        }
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
    backgroundColor: "#F4F7FB",
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
  },

  pageTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: "#16243A",
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
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCE4ED",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1002,
  },

  addButton: {
    minWidth: 94,
    height: 38,
    borderRadius: 9,
    backgroundColor: "#092E63",
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
    color: "#FFFFFF",
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
    color: "#26364C",
    letterSpacing: 0.7,
  },

  ticketCount: {
    fontSize: 10,
    color: "#7D8DA1",
  },

  emptyState: {
    minHeight: 180,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#DCE4ED",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 30,
  },

  emptyTitle: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "700",
    color: "#26364C",
  },

  emptyText: {
    marginTop: 5,
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
    color: "#7D8DA1",
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