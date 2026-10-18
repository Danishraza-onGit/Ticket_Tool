
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
  fetchProjects,
  fetchProjectSummary,
} from "../../api/projects";

import type { Project } from "../../types/project";
import type {
  DashboardFilters,
  FilterKey,
} from "../../types/dashboardFilters";

import { ticketFilterOptions } from "../../data/ticketFilterOptions";
import { COLORS } from "../../constants/colors";

import EmployeeHeader from "../../components/employee/navigation/EmployeeHeader";
import StatCard from "../../components/employee/dashboard/StatCard";
import ProjectCard from "../../components/employee/dashboard/ProjectCard";
import TicketSearchFilters from "../../components/employee/dashboard/TicketSearchFilters";

type ProjectSummaryData = Awaited<
  ReturnType<typeof fetchProjectSummary>
>;

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

export default function EmployeeProjectsScreen() {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsTotal, setProjectsTotal] = useState(0);

  const [summary, setSummary] =
    useState<ProjectSummaryData | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedFromDate, setSelectedFromDate] =
    useState<Date | null>(null);

  const [filters, setFilters] =
    useState<DashboardFilters>(initialFilters);

  const loadProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const query: Parameters<typeof fetchProjects>[0] = {
        page: 1,
        pageSize: 200,
      };

      if (searchQuery.trim()) {
        query.search = searchQuery.trim();
      }

      if (
        filters.status !== "All" &&
        filters.status !== "Overdue"
      ) {
        query.status = filters.status as Project["status"];
      }

      if (filters.priority !== "All") {
        query.priority = filters.priority as Project["priority"];
      }

      if (filters.accountManager !== "All") {
        query.accountManager = filters.accountManager;
      }

      if (filters.assignedBy !== "All") {
        query.assignedBy = filters.assignedBy;
      }

      if (filters.team !== "All") {
        query.team = filters.team;
      }

      if (selectedFromDate) {
        query.dateFrom = formatDateForApi(selectedFromDate);
      }

      const [firstPage, summaryResponse] =
        await Promise.all([
          fetchProjects(query),
          fetchProjectSummary(),
        ]);

      const allProjects = [...firstPage.projects];
      const total = firstPage.total;

      let page = 2;

      while (allProjects.length < total) {
        const response = await fetchProjects({
          ...query,
          page,
        });

        if (response.projects.length === 0) {
          break;
        }

        allProjects.push(...response.projects);
        page += 1;
      }

      setProjects(allProjects);
      setProjectsTotal(total);
      setSummary(summaryResponse);
    } catch (error) {
      console.log("Employee Projects API error:", error);

      setErrorMessage(
        "Unable to load projects. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    searchQuery,
    filters.status,
    filters.priority,
    filters.accountManager,
    filters.assignedBy,
    filters.team,
    selectedFromDate,
  ]);

  useFocusEffect(
    useCallback(() => {
      void loadProjects();
    }, [loadProjects])
  );

  const filterOptions = useMemo(() => {
    const uniqueValues = (values: string[]) => [
      "All",
      ...Array.from(new Set(values.filter(Boolean))).sort(),
    ];

    return {
      ...ticketFilterOptions,

      status: [
        "All",
        "Pending",
        "In Progress",
        "Closed",
        "Overdue",
      ],

      callType: ["All"],

      priority: [
        "All",
        "P1",
        "P2",
        "P3",
        "P4",
      ],

      accountManager: uniqueValues(
        projects.map((project) => project.accountManager)
      ),

      assignedTo: uniqueValues(
        projects.flatMap((project) =>
          project.assignees.map(
            (employee) => employee.displayName
          )
        )
      ),

      assignedBy: uniqueValues(
        projects.map((project) => project.assignedBy)
      ),
    };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (
        filters.assignedTo !== "All" &&
        !project.assignees.some(
          (employee) =>
            employee.displayName === filters.assignedTo
        )
      ) {
        return false;
      }

      if (filters.status === "Overdue") {
        if (project.status === "Closed") {
          return false;
        }

        const deadline = String(project.deadlineDate).slice(
          0,
          10
        );

        if (deadline >= formatDateForApi(new Date())) {
          return false;
        }
      }

      return true;
    });
  }, [projects, filters.assignedTo, filters.status]);

  const stats = useMemo(
    () => [
      {
        title: "TOTAL PROJECTS",
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

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />

      <EmployeeHeader
        onProfilePress={() =>
          router.push("/employee/account")
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>
            Projects
          </Text>
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
          onSearch={() => setSearchQuery(searchText)}
          onFilterChange={handleFilterChange}
          onFromDateChange={handleFromDateChange}
          onClear={handleClearFilters}
        />

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            PROJECTS
          </Text>

          <Text style={styles.showingText}>
            Showing {filteredProjects.length} of{" "}
            {projectsTotal}
          </Text>
        </View>

        {isLoading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Loading projects...
            </Text>
          </View>
        ) : errorMessage ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {errorMessage}
            </Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => void loadProjects()}
              activeOpacity={0.7}
            >
              <Text style={styles.retryText}>
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        ) : filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectCard
              key={project.srNo}
              project={project}
              onViewDetails={() => {
                router.push({
                  pathname: "/employee/project-details",
                  params: {
                    srNo: String(project.srNo),
                    projectNo: project.projectNo,
                  },
                });
              }}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons
              name="folder-open-outline"
              size={27}
              color={COLORS.iconGrey}
            />

            <Text style={styles.emptyText}>
              No assigned projects found.
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
    backgroundColor: COLORS.background,
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
    justifyContent: "space-between",
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
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 36,
    paddingHorizontal: 20,
  },

  emptyText: {
    marginTop: 9,
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: "center",
  },

  retryButton: {
    marginTop: 14,
    paddingHorizontal: 22,
    minHeight: 38,
    borderRadius: 9,
    backgroundColor: COLORS.primaryDark,
    alignItems: "center",
    justifyContent: "center",
  },

  retryText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.white,
  },
});
