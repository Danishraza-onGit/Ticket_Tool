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
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "../../constants/colors";

import MainHeader from "../../components/admin/navigation/MainHeader";
import SideDrawer from "../../components/admin/navigation/SideDrawer";
import StatCard from "../../components/admin/dashboard/StatCard";
import ProjectCard from "../../components/admin/dashboard/ProjectCard";
import TicketSearchFilters from "../../components/admin/dashboard/TicketSearchFilters";
import DashboardActionsMenu from "../../components/admin/dashboard/DashboardActionsMenu";
import AddTicketProjectMenu from "../../components/admin/dashboard/AddTicketProjectMenu";

import {
  fetchProjects,
  fetchProjectSummary,
} from "../../api/projects";

import type {
  Project,
  ProjectSummary,
} from "../../types/project";

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

const isOverdueProject = (project: Project) => {
  if (
    project.status !== "Pending" &&
    project.status !== "In Progress"
  ) {
    return false;
  }

  if (!project.deadlineDate) {
    return false;
  }

  return (
    project.deadlineDate.slice(0, 10) <
    formatDateForApi(new Date())
  );
};

const uniqueSorted = (values: string[]) => {
  return Array.from(
    new Set(
      values
        .map((value) => value.trim())
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b));
};

export default function ProjectsScreen() {
  const router = useRouter();

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [summary, setSummary] =
    useState<ProjectSummary>({
      total: 0,
      pending: 0,
      closed: 0,
      inProgress: 0,
      overdue: 0,
    });

  const [isLoading, setIsLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState<string | null>(null);

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

  const loadProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError(null);

      const [
        firstPage,
        summaryResponse,
      ] = await Promise.all([
        fetchProjects({
          page: 1,
          pageSize: 200,
        }),
        fetchProjectSummary(),
      ]);

      const allProjects = [
        ...firstPage.projects,
      ];

      const totalPages =
        Math.ceil(firstPage.total / 200);

      for (
        let page = 2;
        page <= totalPages;
        page += 1
      ) {
        const response =
          await fetchProjects({
            page,
            pageSize: 200,
          });

        allProjects.push(
          ...response.projects
        );
      }

      setProjects(allProjects);
      setSummary(summaryResponse);
    } catch (error) {
      console.log(
        "Projects API error:",
        error
      );

      setProjects([]);
      setSummary({
        total: 0,
        pending: 0,
        closed: 0,
        inProgress: 0,
        overdue: 0,
      });

      setLoadError(
        "Unable to load projects."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadProjects();
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, [loadProjects]);

  const stats = useMemo(
    () => [
      {
        title: "TOTAL PROJECTS",
        value: summary.total,
        backgroundColor:
          COLORS.totalBackground,
        borderColor:
          COLORS.totalBorder,
        textColor:
          COLORS.primary,
      },
      {
        title: "PENDING",
        value: summary.pending,
        backgroundColor:
          COLORS.pendingBackground,
        borderColor:
          COLORS.pendingBorder,
        textColor:
          COLORS.warning,
      },
      {
        title: "IN PROGRESS",
        value: summary.inProgress,
        backgroundColor:
          COLORS.inProgressBackground,
        borderColor:
          COLORS.inProgressBorder,
        textColor:
          COLORS.secondary,
      },
      {
        title: "CLOSED",
        value: summary.closed,
        backgroundColor:
          COLORS.closedBackground,
        borderColor:
          COLORS.closedBorder,
        textColor:
          COLORS.success,
      },
      {
        title: "OVERDUE",
        value: summary.overdue,
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

  const projectFilterOptions =
    useMemo<Record<FilterKey, string[]>>(
      () => ({
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
        accountManager: [
          "All",
          ...uniqueSorted(
            projects.map(
              (project) =>
                project.accountManager
            )
          ),
        ],
        assignedTo: [
          "All",
          ...uniqueSorted(
            projects.flatMap(
              (project) =>
                project.assignees.map(
                  (assignee) =>
                    assignee.displayName
                )
            )
          ),
        ],
        assignedBy: [
          "All",
          ...uniqueSorted(
            projects.map(
              (project) =>
                project.assignedBy
            )
          ),
        ],
        team: [
          "All",
          ...uniqueSorted(
            projects.flatMap(
              (project) =>
                project.assignees
                  .map(
                    (assignee) =>
                      assignee.team ?? ""
                  )
                  .filter(Boolean)
            )
          ),
        ],
      }),
      [projects]
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

  const filteredProjects = useMemo(() => {
    const normalizedSearch =
      searchQuery.trim().toLowerCase();

    return projects.filter((project) => {
      const assigneeNames =
        project.assignees.map(
          (assignee) =>
            assignee.displayName
        );

      const matchesSearch =
        !normalizedSearch ||
        [
          project.projectNo,
          project.companyName,
          project.problem,
          project.assignedBy,
          project.accountManager,
          ...assigneeNames,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        filters.status === "All" ||
        (filters.status === "Overdue"
          ? isOverdueProject(project)
          : project.status ===
          filters.status);

      const matchesPriority =
        filters.priority === "All" ||
        project.priority ===
        filters.priority;

      const matchesAccountManager =
        filters.accountManager === "All" ||
        project.accountManager ===
        filters.accountManager;

      const matchesAssignedTo =
        filters.assignedTo === "All" ||
        project.assignees.some(
          (assignee) =>
            assignee.displayName ===
            filters.assignedTo
        );

      const matchesAssignedBy =
        filters.assignedBy === "All" ||
        project.assignedBy ===
        filters.assignedBy;

      const matchesTeam =
        filters.team === "All" ||
        project.assignees.some(
          (assignee) =>
            assignee.team ===
            filters.team
        );

      const matchesFromDate =
        !selectedFromDate ||
        project.startDate.slice(0, 10) >=
        formatDateForApi(
          selectedFromDate
        );

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesAccountManager &&
        matchesAssignedTo &&
        matchesAssignedBy &&
        matchesTeam &&
        matchesFromDate
      );
    });
  }, [
    projects,
    searchQuery,
    filters.status,
    filters.priority,
    filters.accountManager,
    filters.assignedTo,
    filters.assignedBy,
    filters.team,
    selectedFromDate,
  ]);

  return (
    <SafeAreaView style={styles.screen}>
      <MainHeader
        onMenuPress={() =>
          setDrawerOpen(true)
        }
        onProfilePress={() =>
          router.push("/home/account")
        }
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>
            Projects
          </Text>

          <View
            style={
              styles.dashboardActions
            }
          >
            <View
              style={
                styles.actionButtonWrapper
              }
            >
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
                  color={COLORS.textBody}
                />
              </TouchableOpacity>

              <DashboardActionsMenu
                visible={showMoreMenu}
                onExport={() => {
                  setShowMoreMenu(false);

                  Alert.alert(
                    "Export Projects",
                    "Project export will be connected in the export/import step."
                  );
                }}
                onDownloadTemplate={() => {
                  setShowMoreMenu(false);

                  Alert.alert(
                    "Download Template",
                    "Project template download will be connected in the export/import step."
                  );
                }}
                onImport={() => {
                  setShowMoreMenu(false);

                  Alert.alert(
                    "Import Projects",
                    "Project import will be connected in the export/import step."
                  );
                }}
                onClose={() =>
                  setShowMoreMenu(false)
                }
              />
            </View>

            <View
              style={
                styles.actionButtonWrapper
              }
            >
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
                <Text
                  style={styles.addButtonText}
                >
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
                onNewTicket={() => {
                  setShowAddMenu(false);
                  router.push(
                    "/home/new-ticket"
                  );
                }}
                onNewProject={() => {
                  setShowAddMenu(false);
                  router.push(
                    "/home/new-project"
                  );
                }}
                onClose={() =>
                  setShowAddMenu(false)
                }
              />
            </View>
          </View>
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
            projectFilterOptions
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
            style={styles.showingText}
          >
            Showing{" "}
            {filteredProjects.length} of{" "}
            {projects.length}
          </Text>
        </View>

        {isLoading ? (
          <View style={styles.emptyState}>
            <Text
              style={styles.emptyTitle}
            >
              Loading projects...
            </Text>
          </View>
        ) : loadError ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="alert-circle-outline"
              size={30}
              color={COLORS.danger}
            />

            <Text
              style={styles.emptyTitle}
            >
              Unable to load projects
            </Text>

            <Text
              style={styles.emptyText}
            >
              {loadError}
            </Text>

            <TouchableOpacity
              onPress={() =>
                void loadProjects()
              }
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.emptyText,
                  {
                    color:
                      COLORS.navigationActive,
                    fontWeight: "700",
                  },
                ]}
              >
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        ) : filteredProjects.length > 0 ? (
          filteredProjects.map(
            (project) => (
              <ProjectCard
                key={project.srNo}
                project={project}
                onViewDetails={() => {
                  router.push({
                    pathname: "/home/project-details",
                    params: {
                      srNo: String(project.srNo),
                      projectNo: project.projectNo,
                    },
                  });
                }}
              />
            )
          )
        ) : (
          <View style={styles.emptyState}>
            <Ionicons
              name="folder-open-outline"
              size={30}
              color={COLORS.textSearchIcon}
            />

            <Text
              style={styles.emptyTitle}
            >
              {projects.length === 0
                ? "No projects available"
                : "No matching projects"}
            </Text>

            <Text
              style={styles.emptyText}
            >
              {projects.length === 0
                ? "There are currently no projects to display."
                : "No projects match the current search or selected filters."}
            </Text>
          </View>
        )}
      </ScrollView>

      <SideDrawer
        visible={drawerOpen}
        onClose={() =>
          setDrawerOpen(false)
        }
      />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({

  screen: {

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

    backgroundColor: COLORS.white,



    borderRadius: 12,

    borderWidth: 1,

    borderColor: COLORS.cardBorder,

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
