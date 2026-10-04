import React, {
  useMemo,
  useState,
} from "react";

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import { COLORS } from "../../constants/colors";

import {
  employeeProjects,
} from "../../data/employee";

import {
  ticketFilterOptions,
} from "../../data/ticketFilterOptions";

import EmployeeHeader from "../../components/employee/navigation/EmployeeHeader";

import StatCard from "../../components/employee/dashboard/StatCard";
import ProjectCard from "../../components/employee/dashboard/ProjectCard";
import TicketSearchFilters from "../../components/employee/dashboard/TicketSearchFilters";

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

export default function EmployeeProjectsScreen() {
  const router = useRouter();

  const [searchText, setSearchText] =
    useState("");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [
    selectedFromDate,
    setSelectedFromDate,
  ] = useState<Date | null>(null);

  const [filters, setFilters] =
    useState<DashboardFilters>(
      initialFilters
    );

  const stats = useMemo(
    () => [
      {
        title: "TOTAL PROJECTS",
        value: employeeProjects.length,
        backgroundColor:
          COLORS.totalBackground,
        borderColor:
          COLORS.totalBorder,
        textColor:
          COLORS.primary,
      },

      {
        title: "PENDING",
        value: employeeProjects.filter(
          (project) =>
            project.status === "Pending"
        ).length,
        backgroundColor:
          COLORS.pendingBackground,
        borderColor:
          COLORS.pendingBorder,
        textColor:
          COLORS.warning,
      },

      {
        title: "IN PROGRESS",
        value: employeeProjects.filter(
          (project) =>
            project.status ===
            "In Progress"
        ).length,
        backgroundColor:
          COLORS.inProgressBackground,
        borderColor:
          COLORS.inProgressBorder,
        textColor:
          COLORS.secondary,
      },

      {
        title: "COMPLETED",
        value: employeeProjects.filter(
          (project) =>
            project.status ===
            "Completed"
        ).length,
        backgroundColor:
          COLORS.closedBackground,
        borderColor:
          COLORS.closedBorder,
        textColor:
          COLORS.success,
      },

      {
        title: "OVERDUE",
        value: employeeProjects.filter(
          (project) =>
            project.status === "Overdue"
        ).length,
        backgroundColor:
          COLORS.overdueBackground,
        borderColor:
          COLORS.overdueBorder,
        textColor:
          COLORS.danger,
      },
    ],
    []
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

  const filteredProjects =
    useMemo(() => {
      return employeeProjects.filter(
        (project) => {
          const normalizedSearch =
            searchQuery
              .trim()
              .toLowerCase();

          const matchesSearch =
            !normalizedSearch ||
            project.projectNo
              .toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            project.companyName
              .toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            project.problem
              .toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            project.assignedBy
              .toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            project.assignedTo
              .toLowerCase()
              .includes(
                normalizedSearch
              );

          const matchesStatus =
            filters.status === "All" ||
            project.status ===
              filters.status;

          const matchesPriority =
            filters.priority === "All" ||
            project.priority ===
              filters.priority;

          const matchesAssignedTo =
            filters.assignedTo === "All" ||
            project.assignedTo ===
              filters.assignedTo;

          const matchesAssignedBy =
            filters.assignedBy === "All" ||
            project.assignedBy ===
              filters.assignedBy;

          let matchesFromDate = true;

          if (selectedFromDate) {
            const [
              day,
              month,
              year,
            ] = project.startDate
              .split("/")
              .map(Number);

            const projectDate =
              new Date(
                year,
                month - 1,
                day
              );

            projectDate.setHours(
              0,
              0,
              0,
              0
            );

            const fromDate =
              new Date(
                selectedFromDate
              );

            fromDate.setHours(
              0,
              0,
              0,
              0
            );

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
        }
      );
    }, [
      searchQuery,
      filters.status,
      filters.priority,
      filters.assignedTo,
      filters.assignedBy,
      selectedFromDate,
    ]);

  return (
    <SafeAreaView
      style={styles.screen}
    >
      <StatusBar style="dark" />

      <EmployeeHeader
        onProfilePress={() =>
          router.push(
            "/employee/profile"
          )
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
      >
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>
            Projects
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.statsContainer
          }
        >
          {stats.map((stat) => (
            <View
              key={stat.title}
              style={
                styles.statWrapper
              }
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
                textColor={
                  stat.textColor
                }
              />
            </View>
          ))}
        </ScrollView>

        <TicketSearchFilters
          searchText={searchText}
          filters={filters}
          filterOptions={
            ticketFilterOptions
          }
          selectedFromDate={
            selectedFromDate
          }
          onSearchTextChange={
            setSearchText
          }
          onSearch={handleSearch}
          onFilterChange={
            handleFilterChange
          }
          onFromDateChange={
            handleFromDateChange
          }
          onClear={
            handleClearFilters
          }
        />

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            PROJECTS
          </Text>

          <Text
            style={
              styles.showingText
            }
          >
            Showing{" "}
            {filteredProjects.length} of{" "}
            {employeeProjects.length}
          </Text>
        </View>

        {filteredProjects.length >
        0 ? (
          filteredProjects.map(
            (project) => (
              <ProjectCard
                key={
                  project.projectNo
                }
                project={project}
                onViewDetails={() => {
                  /*
                   * Connect project
                   * details when the
                   * corresponding route
                   * is available.
                   */
                }}
              />
            )
          )
        ) : (
          <View
            style={
              styles.emptyState
            }
          >
            <Text
              style={
                styles.emptyTitle
              }
            >
              No projects found
            </Text>

            <Text
              style={
                styles.emptyText
              }
            >
              No projects are currently
              assigned to you.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor:
      COLORS.background,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 100,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",

    marginBottom: 14,
  },

  pageTitle: {
    fontSize: 21,
    fontWeight: "700",

    color: COLORS.textDark,
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
    justifyContent:
      "space-between",

    marginTop: 18,
    marginBottom: 10,
  },

  listTitle: {
    fontSize: 12,
    fontWeight: "700",

    color: COLORS.textBody,

    letterSpacing: 0.5,
  },

  showingText: {
    fontSize: 10,

    color: COLORS.textUpdated,
  },

  emptyState: {
    backgroundColor: COLORS.white,

    borderRadius: 12,

    borderWidth: 1,
    borderColor:
      COLORS.cardBorder,

    alignItems: "center",
    justifyContent: "center",

    paddingVertical: 36,
    paddingHorizontal: 20,
  },

  emptyTitle: {
    fontSize: 14,
    fontWeight: "600",

    color: COLORS.textBody,
  },

  emptyText: {
    fontSize: 11,

    color: COLORS.textUpdated,

    marginTop: 5,

    textAlign: "center",
  },
});