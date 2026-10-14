
import React, {
  useCallback,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import {
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  addProjectRemark,
  fetchProject,
} from "../../api/projects";

import type {
  Project,
  ProjectDetail,
} from "../../types/project";

import { COLORS } from "../../constants/colors";

import ProjectSummaryCard from "../../components/employee/project-details/ProjectSummaryCard";
import ProjectInformationCard from "../../components/employee/project-details/ProjectInformationCard";
import ProjectCustomerInfoCard from "../../components/employee/project-details/ProjectCustomerInfoCard";
import ProjectAssignmentCard from "../../components/employee/project-details/ProjectAssignmentCard";
import ProjectDetailTabs from "../../components/employee/project-details/ProjectDetailTabs";
import ProjectHistoryCard from "../../components/employee/project-details/ProjectHistoryCard";
import ProjectRemarksTimelineCard from "../../components/employee/project-details/ProjectRemarksTimelineCard";
import ProjectAddUpdateCard from "../../components/employee/project-details/ProjectAddUpdateCard";

import type {
  ProjectDetailTab,
} from "../../components/employee/project-details/ProjectDetailTabs";

function formatDate(
  value: string | null | undefined
): string {
  if (!value) {
    return "—";
  }

  const datePart = value.slice(0, 10);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datePart);

  return match
    ? `${match[3]}/${match[2]}/${match[1]}`
    : value;
}

function formatDateTime(
  value: string | null | undefined
): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function textOrDash(
  value: string | null | undefined
): string {
  return value?.trim() || "—";
}

function isOverdue(project: Project): boolean {
  if (
    project.status === "Closed" ||
    !project.deadlineDate
  ) {
    return false;
  }

  const today = new Date();

  const localDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  return project.deadlineDate.slice(0, 10) < localDate;
}

export default function EmployeeProjectDetailsScreen() {
  const router = useRouter();

  const { srNo } = useLocalSearchParams<{
    srNo?: string;
    projectNo?: string;
  }>();

  const projectId =
    typeof srNo === "string" ? Number(srNo) : NaN;

  const [detail, setDetail] =
    useState<ProjectDetail | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [loadError, setLoadError] =
    useState<string | null>(null);

  const [activeTab, setActiveTab] =
    useState<ProjectDetailTab>("overview");

  const [isAddingRemark, setIsAddingRemark] =
    useState(false);

  const loadProject = useCallback(async () => {
    if (
      !Number.isSafeInteger(projectId) ||
      projectId <= 0
    ) {
      setLoadError("Invalid project identifier.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setLoadError(null);

      const response = await fetchProject(projectId);

      setDetail(response);
    } catch (error) {
      console.log(
        "Employee Project Details API error:",
        error
      );

      setDetail(null);
      setLoadError(
        "Unable to load project details. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useFocusEffect(
    useCallback(() => {
      void loadProject();
    }, [loadProject])
  );

  const handleAddUpdate = async (
    message: string
  ) => {
    const trimmedMessage = message.trim();

    if (!detail || isAddingRemark) {
      return;
    }

    if (!trimmedMessage) {
      Alert.alert(
        "Remark Required",
        "Please enter a remark before submitting."
      );

      return;
    }

    try {
      setIsAddingRemark(true);

      const createdRemark = await addProjectRemark(
        detail.project.srNo,
        trimmedMessage
      );

      setDetail((current) =>
        current
          ? {
              ...current,
              remarks: [
                ...current.remarks,
                createdRemark,
              ],
            }
          : current
      );
    } catch (error) {
      console.log(
        "Employee Project Remark API error:",
        error
      );

      Alert.alert(
        "Unable to Add Update",
        "The project remark could not be saved. Please try again."
      );
    } finally {
      setIsAddingRemark(false);
    }
  };

  const project = detail?.project;

  const assignedTo =
    project?.assignees
      .map((assignee) => assignee.displayName)
      .join(", ") || "—";

  const history = project
    ? [
        {
          id: "status",
          label: project.status,
          timestamp: formatDateTime(
            project.updatedAt
          ),
        },
        {
          id: "created",
          label: "Project created",
          timestamp: formatDateTime(
            project.createdAt
          ),
        },
      ]
    : [];

  const remarks = (detail?.remarks ?? []).map(
    (remark) => ({
      id: String(remark.id),
      createdAt: formatDateTime(remark.createdAt),
      createdBy: remark.createdBy ?? "—",
      message: remark.highlighted
        ? `★ ${remark.body}`
        : remark.body,
    })
  );

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={COLORS.black}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Project Details
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      {isLoading ? (
        <View style={styles.centerState}>
          <ActivityIndicator
            color={COLORS.navigationActive}
          />

          <Text style={styles.stateText}>
            Loading project...
          </Text>
        </View>
      ) : loadError || !project ? (
        <View style={styles.centerState}>
          <Ionicons
            name="alert-circle-outline"
            size={30}
            color={COLORS.danger}
          />

          <Text style={styles.stateText}>
            {loadError ||
              "Project details unavailable."}
          </Text>

          <TouchableOpacity
            onPress={() => void loadProject()}
            activeOpacity={0.7}
          >
            <Text style={styles.retryText}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <ProjectSummaryCard
            projectNo={project.projectNo}
            createdOn={formatDate(project.startDate)}
            status={
              isOverdue(project)
                ? "Overdue"
                : project.status
            }
            priority={project.priority}
            duration={`${project.timeValue} ${project.timeUnit}`}
            companyName={project.companyName}
            contactName={project.contactName ?? "—"}
            contactNo={project.contactNo}
            emailId={project.emailId}
          />

          <ProjectDetailTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {activeTab === "overview" ? (
            <>
              <ProjectInformationCard
                title="Scope of Work"
                icon="document-text-outline"
              >
                <View style={styles.descriptionBox}>
                  <Text
                    style={styles.descriptionText}
                    selectable
                  >
                    {textOrDash(project.problem)}
                  </Text>
                </View>
              </ProjectInformationCard>

              <ProjectCustomerInfoCard
                companyName={project.companyName}
                contactName={
                  project.contactName ?? "—"
                }
                phone={project.contactNo ?? "—"}
                email={project.emailId ?? "—"}
                designation={
                  project.designation ?? "—"
                }
                department={
                  project.department ?? "—"
                }
                address={project.address ?? "—"}
              />

              <ProjectInformationCard
                title="Project Components"
                icon="cube-outline"
                fields={[
                  {
                    label: "PO Number",
                    value: project.poNumber,
                  },
                  {
                    label: "Contract Number",
                    value: project.contractNumber,
                  },
                ]}
              >
                {project.components.length > 0 && (
                  <View
                    style={styles.componentsContainer}
                  >
                    {project.components.map(
                      (component, index) => (
                        <View
                          key={`${component.model}-${index}`}
                          style={styles.componentItem}
                        >
                          <Text
                            style={styles.componentHeading}
                          >
                            Component {index + 1}
                          </Text>

                          <Text
                            style={styles.componentText}
                          >
                            Model:{" "}
                            {component.model || "—"}
                          </Text>

                          <Text
                            style={styles.componentText}
                          >
                            Quantity:{" "}
                            {component.quantity}
                          </Text>

                          <Text
                            style={styles.componentText}
                          >
                            Serial Numbers:{" "}
                            {component.serialNumbers ||
                              "—"}
                          </Text>
                        </View>
                      )
                    )}
                  </View>
                )}
              </ProjectInformationCard>

              <ProjectAssignmentCard
                assignedTo={assignedTo}
                assignedBy={project.assignedBy}
                accountManager={
                  project.accountManager
                }
                priority={project.priority}
                deadline={formatDate(
                  project.deadlineDate
                )}
                startDate={formatDate(
                  project.startDate
                )}
                duration={`${project.timeValue} ${project.timeUnit}`}
              />
            </>
          ) : (
            <>
              <ProjectHistoryCard
                history={history}
                currentStatus={project.status}
              />

              <ProjectRemarksTimelineCard
                remarks={remarks}
              />

              <ProjectAddUpdateCard
                onAddUpdate={(message) =>
                  void handleAddUpdate(message)
                }
              />
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    height: 54,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },

  backButton: {
    width: 36,
    height: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.black,
    textAlign: "center",
  },

  headerSpacer: {
    width: 36,
  },

  scrollView: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 110,
  },

  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    gap: 12,
  },

  stateText: {
    color: COLORS.textBody,
    fontSize: 13,
    textAlign: "center",
  },

  retryText: {
    color: COLORS.navigationActive,
    fontSize: 13,
    fontWeight: "700",
  },

  descriptionBox: {
    minHeight: 72,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceSoft,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
  },

  descriptionText: {
    fontSize: 12,
    lineHeight: 19,
    color: COLORS.textPrimary,
  },

  componentsContainer: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },

  componentItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },

  componentHeading: {
    marginTop: 10,
    marginBottom: 6,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.black,
  },

  componentText: {
    fontSize: 11,
    lineHeight: 19,
    color: COLORS.textBody,
  },
});
