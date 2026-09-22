import React, {
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

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import MainHeader from "../../components/navigation/MainHeader";
import SideDrawer from "../../components/navigation/SideDrawer";

import StatCard from "../../components/dashboard/StatCard";
import ProjectCard from "../../components/dashboard/ProjectCard";
import TicketSearchFilters from "../../components/dashboard/TicketSearchFilters";
import DashboardActionsMenu from "../../components/dashboard/DashboardActionsMenu";
import AddTicketProjectMenu from "../../components/dashboard/AddTicketProjectMenu";

import {
  DashboardFilters,
  FilterKey,
} from "../../types/dashboardFilters";

import { SafeAreaView } from "react-native-safe-area-context";

import type { Project } from "../../types/project";




const projects: Project[] = [
  {
    projectNo: "PRJ3108202601",
    startDate: "31/08/2026",
    companyName: "Gayn Bharatam",
    problem: "Installation of...",
    assignedBy: "Parmanand Pandey",
    assignedTo: "Jitesh Malhotra",
    priority: "P3",
    status: "Pending",
    deadline: "30/09/2026",
  },

  {
    projectNo: "PRJ2508202601",
    startDate: "25/08/2026",
    companyName: "SAINIK SCHOOL...",
    problem: "7. Scope of Work...",
    assignedBy: "Parmanand Pandey",
    assignedTo: "Raghavendra Mishra",
    priority: "P4",
    status: "In Progress",
    deadline: "25/10/2026",
  },

  {
    projectNo: "PRJ1408202601",
    startDate: "14/08/2026",
    companyName: "Hindusthan Na...",
    problem: "Desktop Install...",
    assignedBy: "Pranesh",
    assignedTo: "Manoj Mohite",
    priority: "P3",
    status: "Pending",
    deadline: "13/09/2026",
  },
];




const stats = [
  {
    title: "TOTAL PROJECTS",
    value: 3,
    backgroundColor: "#E0E7FF",
    borderColor: "#D4E1FF",
    textColor: "#3729AD",
  },
  {
    title: "PENDING",
    value: 2,
    backgroundColor: "#FEF3C6",
    borderColor: "#FFE5A3",
    textColor: "#963B00",
  },
  {
    title: "IN PROGRESS",
    value: 1,
    backgroundColor: "#F2F7FC",
    borderColor: "#D5EBFA",
    textColor: "#134581",
  },
  {
    title: "COMPLETED",
    value: 0,
    backgroundColor: "#D1FBE5",
    borderColor: "#CDEEDD",
    textColor: "#016144",
  },
  {
    title: "OVERDUE",
    value: 0,
    backgroundColor: "#FFE3E1",
    borderColor: "#F8D0D0",
    textColor: "#9E0913",
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
  status: [
    "All",
    "Pending",
    "In Progress",
    "Completed",
    "Overdue",
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


export default function ProjectsScreen() {
  const router = useRouter();

  const [drawerOpen, setDrawerOpen] =
    useState(false);

  const [showMoreMenu, setShowMoreMenu] =
    useState(false);

  const [showAddMenu, setShowAddMenu] =
    useState(false);

  const [searchText, setSearchText] =
    useState("");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [filters, setFilters] =
    useState<DashboardFilters>(initialFilters);

  const [
    selectedFromDate,
    setSelectedFromDate,
  ] = useState<Date | null>(null);



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



  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const normalizedSearch =
        searchQuery.trim().toLowerCase();

      /* Search */

      const matchesSearch =
        normalizedSearch.length === 0 ||
        project.projectNo
          .toLowerCase()
          .includes(normalizedSearch) ||
        project.companyName
          .toLowerCase()
          .includes(normalizedSearch) ||
        project.problem
          .toLowerCase()
          .includes(normalizedSearch) ||
        project.assignedBy
          .toLowerCase()
          .includes(normalizedSearch) ||
        project.assignedTo
          .toLowerCase()
          .includes(normalizedSearch);


      /* Status */

      const matchesStatus =
        filters.status === "All" ||
        project.status === filters.status;


      /* Priority */

      const matchesPriority =
        filters.priority === "All" ||
        project.priority === filters.priority;


      /* Assigned To */

      const matchesAssignedTo =
        filters.assignedTo === "All" ||
        project.assignedTo === filters.assignedTo;


      /* Assigned By */

      const matchesAssignedBy =
        filters.assignedBy === "All" ||
        project.assignedBy === filters.assignedBy;





      /* From Date */

      let matchesFromDate = true;

      if (selectedFromDate) {
        const [
          day,
          month,
          year,
        ] = project.startDate
          .split("/")
          .map(Number);

        const projectDate = new Date(
          year,
          month - 1,
          day
        );

        projectDate.setHours(0, 0, 0, 0);

        const fromDate =
          new Date(selectedFromDate);

        fromDate.setHours(0, 0, 0, 0);

        matchesFromDate =
          projectDate >= fromDate;
      }


      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesAssignedTo &&
        matchesAssignedBy &&
        matchesFromDate
      );
    });
  }, [
    searchQuery,
    filters.status,
    filters.priority,
    filters.assignedTo,
    filters.assignedBy,
    selectedFromDate,
  ]);


  return (
    <SafeAreaView style={styles.screen}>
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
        {/* PAGE TITLE + ACTIONS */}

        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>
            Projects
          </Text>

          <View style={styles.dashboardActions}>

            {/* MORE */}

            <View style={styles.actionButtonWrapper}>
              <TouchableOpacity
                style={styles.moreButton}
                activeOpacity={0.7}
                onPress={() => {
                  setShowMoreMenu(
                    (current) => !current
                  );
                  setShowAddMenu(false);
                }}
              >
                <Ionicons
                  name="ellipsis-vertical"
                  size={18}
                  color="#26364B"
                />
              </TouchableOpacity>

              <DashboardActionsMenu
                visible={showMoreMenu}
                onExport={() => {
                  setShowMoreMenu(false);

                  Alert.alert(
                    "Export",
                    "Export will be connected when the API is available."
                  );
                }}
                onDownloadTemplate={() => {
                  setShowMoreMenu(false);

                  Alert.alert(
                    "Download Template",
                    "Template download will be connected when the API is available."
                  );
                }}
                onImport={() => {
                  setShowMoreMenu(false);

                  Alert.alert(
                    "Import",
                    "Import will be connected when the API is available."
                  );
                }}
                onClose={() =>
                  setShowMoreMenu(false)
                }
              />
            </View>


            {/* ADD */}

            <View style={styles.actionButtonWrapper}>
              <TouchableOpacity
                style={styles.addButton}
                activeOpacity={0.7}
                onPress={() => {
                  setShowAddMenu(
                    (current) => !current
                  );
                  setShowMoreMenu(false);
                }}
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
                onNewTicket={() => {
                  setShowAddMenu(false);
                  router.push("/home/new-ticket");
                }}
                onNewProject={() => {
                  setShowAddMenu(false);
                  router.push("/home/new-project");
                }}
                onClose={() =>
                  setShowAddMenu(false)
                }
              />
            </View>
          </View>
        </View>


        {/* STATS */}

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


        {/* SHARED SEARCH + FILTERS */}

        <TicketSearchFilters
          searchText={searchText}
          filters={filters}
          filterOptions={filterOptions}
          selectedFromDate={selectedFromDate}
          onSearchTextChange={setSearchText}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          onFromDateChange={
            handleFromDateChange
          }
          onClear={handleClearFilters}
        />


        {/* PROJECT LIST HEADER */}

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            PROJECTS
          </Text>

          <Text style={styles.showingText}>
            Showing {filteredProjects.length} of{" "}
            {projects.length}
          </Text>
        </View>


        {/* PROJECT CARDS */}

        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectCard
              key={project.projectNo}
              project={project}
              onViewDetails={() => {
                /*
                  Project details screen will be connected
                  once that screen/route is implemented.
                */

                Alert.alert(
                  "Project Details",
                  `Project #${project.projectNo}`
                );
              }}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              No projects found
            </Text>

            <Text style={styles.emptyText}>
              Try changing your search or filters.
            </Text>
          </View>
        )}
      </ScrollView>


      {/* SIDE DRAWER */}

      <SideDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  screen: {
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
    zIndex: 100,
  },

  pageTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: "#16243A",
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
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCE4ED",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1002,
  },

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

  statsContainer: {
    paddingLeft: 4,
    paddingRight: 4,
    paddingBottom: 6,
  },

  statWrapper: {
    marginRight: 12,
  },

  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
    marginBottom: 10,
  },

  listTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#52647B",
    letterSpacing: 0.5,
  },

  showingText: {
    fontSize: 10,
    color: "#91A2B8",
  },

  emptyState: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DFE6EF",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 36,
    paddingHorizontal: 20,
  },

  emptyTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#26364C",
  },

  emptyText: {
    fontSize: 11,
    color: "#91A2B8",
    marginTop: 5,
    textAlign: "center",
  },
});