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
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import {
    addProjectRemark,
    fetchProject,
    updateProjectStatus,
} from "../../api/projects";

import type {
    ProjectDetailTab,
} from "../../components/admin/project-details/ProjectDetailTabs";

import type {
    Project,
    ProjectDetail,
    ProjectStatus,
} from "../../types/project";

import { COLORS } from "../../constants/colors";

import ProjectDetailsHeader from "../../components/admin/navigation/ProjectDetailsHeader";
import ProjectSummaryCard from "../../components/admin/project-details/ProjectSummaryCard";
import ProjectInformationCard from "../../components/admin/project-details/ProjectInformationCard";


import ProjectCustomerInfoCard from "../../components/admin/project-details/ProjectCustomerInfoCard";
import ProjectAssignmentCard from "../../components/admin/project-details/ProjectAssignmentCard";
import ProjectDetailTabs from "../../components/admin/project-details/ProjectDetailTabs";
import ProjectChangeStatusCard from "../../components/admin/project-details/ProjectChangeStatusCard";
import ProjectHistoryCard from "../../components/admin/project-details/ProjectHistoryCard";
import ProjectRemarksTimelineCard from "../../components/admin/project-details/ProjectRemarksTimelineCard";
import ProjectAddUpdateCard from "../../components/admin/project-details/ProjectAddUpdateCard";


function formatDate(value: string | null | undefined): string {
    if (!value) {
        return "—";
    }

    const datePart = value.slice(0, 10);
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datePart);

    return match
        ? `${match[3]}/${match[2]}/${match[1]}`
        : value;
}

function formatDateTime(value: string | null | undefined): string {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? value
        : date.toLocaleString("en-GB");
}

function textOrDash(value: string | null | undefined): string {
    return value?.trim() || "—";
}

function isOverdue(project: Project): boolean {
    if (project.status === "Closed" || !project.deadlineDate) {
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

function formatHistoryDateTime(
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

export default function ProjectDetailsScreen() {
    const router = useRouter();
    const { srNo } = useLocalSearchParams<{ srNo?: string }>();
    const projectId = typeof srNo === "string" ? Number(srNo) : NaN;

    const [detail, setDetail] = useState<ProjectDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<ProjectDetailTab>("overview");
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [isAddingRemark, setIsAddingRemark] = useState(false);

    const loadProject = useCallback(async () => {
        if (!Number.isSafeInteger(projectId) || projectId <= 0) {
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
            console.log("Project details API error:", error);
            setLoadError("Unable to load project details.");
        } finally {
            setIsLoading(false);
        }
    }, [projectId]);

    useFocusEffect(
        useCallback(() => {
            void loadProject();
        }, [loadProject])
    );

    const handleStatusChange = (nextStatus: ProjectStatus) => {
        const project = detail?.project;

        if (!project || isUpdatingStatus || nextStatus === project.status) {
            return;
        }

        Alert.alert(
            nextStatus === "Closed" ? "Close this project?" : "Change project status?",
            `Change status from ${project.status} to ${nextStatus}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Confirm",
                    onPress: () => {
                        const update = async () => {
                            try {
                                setIsUpdatingStatus(true);

                                const updatedProject = await updateProjectStatus(
                                    project.srNo,
                                    nextStatus
                                );

                                setDetail((current) =>
                                    current
                                        ? { ...current, project: updatedProject }
                                        : current
                                );
                            } catch (error) {
                                console.log("Project status update error:", error);
                                Alert.alert("Unable to Change Status", "Please try again.");
                            } finally {
                                setIsUpdatingStatus(false);
                            }
                        };

                        void update();
                    },
                },
            ]
        );
    };

    const handleAddUpdate = async (message: string) => {
        if (!detail || isAddingRemark || !message.trim()) {
            return;
        }

        try {
            setIsAddingRemark(true);
            const createdRemark = await addProjectRemark(projectId, message.trim());

            setDetail((current) =>
                current
                    ? {
                        ...current,
                        remarks: [...current.remarks, createdRemark],
                    }
                    : current
            );
        } catch (error) {
            console.log("Add project remark error:", error);
            Alert.alert("Unable to Add Update", "Please try again.");
        } finally {
            setIsAddingRemark(false);
        }
    };

    const project = detail?.project;
    const assignees = project?.assignees
        .map((assignee) => assignee.displayName)
        .join(", ") || "—";

    const history = project
        ? [
            {
                id: "status",
                label: project.status,
                timestamp: formatHistoryDateTime(project.updatedAt),
            },
            {
                id: "created",
                label: "Project created",
                timestamp: formatHistoryDateTime(project.createdAt),
            },
        ]
        : [];

    const remarks = (detail?.remarks ?? []).map((remark) => ({
        id: String(remark.id),
        createdAt: formatDateTime(remark.createdAt),
        createdBy: remark.createdBy ?? "—",
        message: remark.highlighted ? `★ ${remark.body}` : remark.body,
    }));

    return (
        <SafeAreaView style={styles.screen}>
            <StatusBar style="dark" />

            <ProjectDetailsHeader
                onBackPress={() => router.back()}


                onEditPress={() => {
                    const selectedProject = detail?.project;

                    if (!selectedProject) {
                        Alert.alert(
                            "Project Unavailable",
                            "Please wait for the project information to load."
                        );

                        return;
                    }

                    router.push({
                        pathname: "/home/edit-project",
                        params: {
                            srNo: String(selectedProject.srNo),
                        },
                    });
                }}


                onPrintPress={() =>
                    Alert.alert("Print Project", "Project printing is not connected yet.")
                }
            />

            {isLoading ? (
                <View style={styles.centerState}>
                    <ActivityIndicator color={COLORS.navigationActive} />
                    <Text style={styles.stateText}>Loading project...</Text>
                </View>
            ) : loadError || !project ? (
                <View style={styles.centerState}>
                    <Ionicons
                        name="alert-circle-outline"
                        size={30}
                        color={COLORS.danger}
                    />
                    <Text style={styles.stateText}>
                        {loadError || "Project details unavailable."}
                    </Text>
                    <TouchableOpacity onPress={() => void loadProject()}>
                        <Text style={styles.retryText}>Try Again</Text>
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
                        status={isOverdue(project) ? "Overdue" : project.status}
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
                                    <Text style={styles.descriptionText} selectable>
                                        {textOrDash(project.problem)}
                                    </Text>
                                </View>
                            </ProjectInformationCard>

                            <ProjectCustomerInfoCard
                                companyName={project.companyName}
                                contactName={project.contactName ?? "—"}
                                phone={project.contactNo ?? "—"}
                                email={project.emailId ?? "—"}
                                designation={project.designation ?? "—"}
                                department={project.department ?? "—"}
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
                                    <View style={styles.componentsContainer}>
                                        {project.components.map((component, index) => (
                                            <View
                                                key={`${component.model}-${index}`}
                                                style={styles.componentItem}
                                            >
                                                <Text style={styles.componentHeading}>
                                                    Component {index + 1}
                                                </Text>

                                                <Text style={styles.componentText}>
                                                    Model: {component.model || "—"}
                                                </Text>

                                                <Text style={styles.componentText}>
                                                    Quantity: {component.quantity}
                                                </Text>

                                                <Text style={styles.componentText}>
                                                    Serial Numbers: {component.serialNumbers || "—"}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </ProjectInformationCard>


                            <ProjectAssignmentCard
                                assignedTo={assignees}
                                assignedBy={project.assignedBy}
                                accountManager={project.accountManager}
                                priority={project.priority}
                                deadline={formatDate(project.deadlineDate)}
                                startDate={formatDate(project.startDate)}
                                duration={`${project.timeValue} ${project.timeUnit}`}
                            />
                        </>
                    ) : (
                        <>
                            <ProjectChangeStatusCard
                                currentStatus={project.status}
                                onStatusPress={handleStatusChange}
                            />

                            <ProjectHistoryCard
                                history={history}
                                currentStatus={project.status}
                            />
                            <ProjectRemarksTimelineCard remarks={remarks} />
                            <ProjectAddUpdateCard onAddUpdate={(message) => void handleAddUpdate(message)} />
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
    scrollView: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 110,
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
    emptyText: {
        fontSize: 12,
        color: COLORS.textMuted,
    },
});
