import React, {
    useEffect,
    useState,
} from "react";

import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Alert,
} from "react-native";

import {
    useLocalSearchParams,
    useRouter,
} from "expo-router";

import {
    Ionicons,
} from "@expo/vector-icons";

import {
    StatusBar,
} from "expo-status-bar";

import {
    SafeAreaView,
} from "react-native-safe-area-context";

import {
    COLORS,
} from "../../constants/colors";

import {
    addTicketRemark,
    fetchTicket,
    updateTicketStatus,
} from "../../api/tickets";

import type {
    Remark,
} from "../../api/tickets";

import type {
    Ticket,
} from "../../types/ticket";


import TicketSummaryCard from "../../components/admin/ticket-details/TicketSummaryCard";
import TicketDetailsHeader from "../../components/admin/navigation/TicketDetailsHeader";
import ProblemDescriptionCard from "../../components/admin/ticket-details/ProblemDescriptionCard";
import CustomerInfoCard from "../../components/admin/ticket-details/CustomerInfoCard";
import DeviceInfoCard from "../../components/admin/ticket-details/DeviceInfoCard";
import AssignmentCard from "../../components/admin/ticket-details/AssignmentCard";
import CallReportTimeModal from "../../components/admin/ticket-details/CallReportTimeModal";

import ChangeStatusCard from "../../components/admin/ticket-details/ChangeStatusCard";
import RemarksTimelineCard from "../../components/admin/ticket-details/RemarksTimelineCard";
import TicketHistoryCard from "../../components/admin/ticket-details/TicketHistoryCard";
import AddUpdateCard from "../../components/admin/ticket-details/AddUpdateCard";
import RoutineChecklist from "../../components/admin/routine-check/RoutineChecklist";

import TicketDetailTabs, {
    TicketDetailTab,
} from "../../components/admin/ticket-details/TicketDetailTabs";

export default function TicketDetailsScreen() {
    const router = useRouter();

    const [
        printModalVisible,
        setPrintModalVisible,
    ] = useState(false);


    const [
        activeTab,
        setActiveTab,
    ] = useState<TicketDetailTab>(
        "overview"
    );

    const formatHistoryDateTime = (
        value: string | null | undefined
    ) => {
        if (!value) {
            return "—";
        }

        return new Date(value).toLocaleString(
            "en-GB",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
            }
        );
    };

    const {
        srNo,
    } = useLocalSearchParams<{
        srNo?: string;
        ticketNo?: string;
    }>();

    const [ticket, setTicket] =
        useState<Ticket | null>(null);

    const ticketHistory = ticket
        ? [
            {
                id: "status",
                label: ticket.status,
                timestamp:
                    formatHistoryDateTime(
                        ticket.updatedAt
                    ),
            },
            {
                id: "created",
                label: "Ticket created",
                timestamp:
                    formatHistoryDateTime(
                        ticket.createdAt
                    ),
            },
        ]
        : [];


    const [isLoading, setIsLoading] =
        useState(true);

    const [loadError, setLoadError] =
        useState<string | null>(null);

    const [, setIsUpdatingStatus] =
        useState(false);

    const [isAddingRemark, setIsAddingRemark] =
        useState(false);

    const printDate =
        ticket?.ticketDate
            ? new Date(
                `${ticket.ticketDate}T00:00:00`
            ).toLocaleDateString("en-GB")
            : "—";

    const printTime =
        new Date().toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
            }
        );

    const assignedToText =
        ticket?.assignees?.length
            ? ticket.assignees
                .map(
                    (assignee) =>
                        assignee.displayName
                )
                .join(", ")
            : "—";

    const [remarks, setRemarks] =
        useState<Remark[]>([]);

    useEffect(() => {
        let active = true;

        const loadTicket = async () => {
            if (!srNo) {
                setLoadError(
                    "Ticket identifier is missing."
                );
                setIsLoading(false);
                return;
            }

            const numericSrNo = Number(srNo);

            if (Number.isNaN(numericSrNo)) {
                setLoadError(
                    "Invalid ticket identifier."
                );
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setLoadError(null);

                const detail =
                    await fetchTicket(numericSrNo);

                if (!active) {
                    return;
                }

                setTicket(detail.ticket);
                setRemarks(detail.remarks);
            } catch (error) {
                console.log(
                    "Ticket details API error:",
                    error
                );

                if (!active) {
                    return;
                }

                setLoadError(
                    "Unable to load ticket details."
                );
            } finally {
                if (active) {
                    setIsLoading(false);
                }
            }
        };

        void loadTicket();

        return () => {
            active = false;
        };
    }, [srNo]);



    const handleAddUpdate = async (
        message: string
    ) => {
        if (!ticket) {
            return;
        }

        const trimmedMessage = message.trim();

        if (!trimmedMessage) {
            Alert.alert(
                "Remark Required",
                "Please enter a remark before submitting."
            );
            return;
        }

        if (isAddingRemark) {
            return;
        }

        try {
            setIsAddingRemark(true);

            const createdRemark =
                await addTicketRemark(
                    ticket.srNo,
                    trimmedMessage
                );

            setRemarks((current) => [
                ...current,
                createdRemark,
            ]);
        } catch (error) {
            console.log(
                "Add remark error:",
                error
            );

            Alert.alert(
                "Unable to Add Remark",
                "The remark could not be saved. Please try again."
            );
        } finally {
            setIsAddingRemark(false);
        }
    };

    const displayRemarks = remarks.map(
        (remark) => ({
            id: String(remark.id),

            createdAt:
                new Date(
                    remark.createdAt
                ).toLocaleString("en-IN"),

            createdBy:
                remark.createdBy ?? "—",

            message:
                remark.body,
        })
    );

    const handleStatusChange = (
        nextStatus: Ticket["status"]
    ) => {
        if (!ticket) {
            return;
        }

        if (nextStatus === ticket.status) {
            return;
        }

        if (
            nextStatus === "Closed" &&
            ticket.inInventory &&
            ticket.inventoryPending
        ) {
            Alert.alert(
                "Cannot Close Ticket",
                "This ticket includes a product inward that has not yet been dispatched back to the customer. The ticket cannot be closed until the product is dispatched."
            );

            return;
        }

        const confirmChange = async () => {
            try {
                setIsUpdatingStatus(true);

                const updatedTicket =
                    await updateTicketStatus(
                        ticket.srNo,
                        nextStatus
                    );

                setTicket(updatedTicket);
            } catch (error) {
                console.log(
                    "Update ticket status error:",
                    error
                );

                Alert.alert(
                    "Unable to Change Status",
                    "The ticket status could not be updated. Please try again."
                );
            } finally {
                setIsUpdatingStatus(false);
            }
        };

        if (nextStatus === "Closed") {
            Alert.alert(
                "Close this ticket?",
                "This marks the ticket as resolved. If the customer hasn't already been notified, they may be notified about the closure.",
                [
                    {
                        text: "Cancel",
                        style: "cancel",
                    },
                    {
                        text: "Confirm",
                        onPress: () => {
                            void confirmChange();
                        },
                    },
                ]
            );

            return;
        }

        Alert.alert(
            `Change status to ${nextStatus}?`,
            `This will change the ticket's status from ${ticket.status} to ${nextStatus}.`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Confirm",
                    onPress: () => {
                        void confirmChange();
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView
            style={styles.screen}
        >
            <StatusBar style="dark" />

            {/* Header */}
            {/* <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() =>
                        router.back()
                    }
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="chevron-back"
                        size={22}
                        color={
                            COLORS.navigationActive
                        }
                    />
                </TouchableOpacity>

                <Text
                    style={styles.headerTitle}
                >
                    Ticket Details
                </Text>

                <View
                    style={styles.headerActions}
                >
                    <TouchableOpacity
                        style={styles.editButton}
                        activeOpacity={0.75}
                    >
                        <Ionicons
                            name="pencil-outline"
                            size={14}
                            color={
                                COLORS.navigationActive
                            }
                        />

                        <Text
                            style={
                                styles.editButtonText
                            }
                        >
                            Edit
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.adminBadge}
                        onPress={() =>
                            router.push(
                                "/home/account"
                            )
                        }
                        activeOpacity={0.75}
                    >
                        <Text
                            style={
                                styles.adminBadgeText
                            }
                        >
                            SH Admin
                        </Text>
                    </TouchableOpacity>
                </View>
            </View> */}

            <TicketDetailsHeader
                onBackPress={() =>
                    router.back()
                }
                onEditPress={() => {
                    if (!ticket) {
                        return;
                    }

                    router.push({
                        pathname:
                            "/home/edit-ticket",

                        params: {
                            srNo:
                                String(ticket.srNo),
                            ticketNo:
                                ticket.ticketNo,
                        },
                    });
                }}
                onPrintPress={() =>
                    setPrintModalVisible(true)
                }
            />

            {isLoading ? (
                <View style={styles.notFound}>
                    <Text style={styles.notFoundTitle}>
                        Loading ticket...
                    </Text>
                </View>
            ) : loadError ? (
                <View style={styles.notFound}>
                    <Ionicons
                        name="alert-circle-outline"
                        size={30}
                        color={COLORS.iconGrey}
                    />

                    <Text style={styles.notFoundTitle}>
                        Unable to load ticket
                    </Text>

                    <Text style={styles.notFoundText}>
                        {loadError}
                    </Text>
                </View>
            ) : !ticket ? (
                <View
                    style={styles.notFound}
                >
                    <Ionicons
                        name="ticket-outline"
                        size={30}
                        color={COLORS.iconGrey}
                    />

                    <Text
                        style={
                            styles.notFoundTitle
                        }
                    >
                        Ticket details unavailable
                    </Text>

                    <Text
                        style={
                            styles.notFoundText
                        }
                    >
                        Ticket information will
                        be loaded from the API
                        when backend integration
                        is connected.
                    </Text>
                </View>
            ) : (
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    <TicketSummaryCard
                        ticketNo={ticket.ticketNo}
                        createdOn={ticket.ticketDate}
                        status={ticket.status}
                        priority={ticket.priority}
                        callType={ticket.callType}
                        companyName={ticket.companyName}
                        contactName={ticket.contactName ?? "—"}
                        contactNo={ticket.contactNo}
                        emailId={ticket.emailId}
                    />

                    <TicketDetailTabs
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />

                    {activeTab === "overview" ? (
                        <>
                            <ProblemDescriptionCard
                                problem={ticket.problem}
                            />

                            <CustomerInfoCard
                                companyName={ticket.companyName}
                                contactName={ticket.contactName ?? "—"}
                                phone={ticket.contactNo ?? "—"}
                                email={ticket.emailId ?? "—"}
                                address={ticket.address ?? "—"}
                            />

                            <DeviceInfoCard
                                model={ticket.model ?? "—"}
                                serialNumbers={ticket.serialNumber ?? "—"}
                                internalTag={ticket.internalTag}
                                callType={ticket.callType}
                                mode={ticket.mode}
                                inInventory={ticket.inInventory}
                            />

                            <AssignmentCard
                                assignedTo={assignedToText}
                                assignedBy={ticket.assignedBy ?? "—"}
                                accountManager={ticket.accountManager || "—"}
                                priority={ticket.priority}
                                deadline={ticket.deadlineDate ?? "—"}
                            />
                        </>
                    ) : (
                        <>
                            <ChangeStatusCard
                                currentStatus={ticket.status}
                                onStatusPress={handleStatusChange}
                                inventoryPending={
                                    ticket.inInventory && ticket.inventoryPending
                                }
                            />

                            <TicketHistoryCard
                                history={ticketHistory}

                                inventory={ticket.inventory}
                            />
                            {ticket.callType === "Routine Checks" &&
                                ticket.routineChecks?.length > 0 && (
                                    <View style={styles.routineChecksAuditCard}>
                                        <View style={styles.routineChecksAuditHeading}>
                                            <View style={styles.routineChecksIconContainer}>
                                                <Ionicons
                                                    name="clipboard-outline"
                                                    size={16}
                                                    color={COLORS.navigationActive}
                                                />
                                            </View>


                                            <Text style={styles.routineChecksAuditTitle}>
                                                ROUTINE CHECKS REPORT
                                            </Text>
                                        </View>

                                        <Text style={styles.routineChecksAuditDescription}>
                                            Submitted checklist. To modify a task
                                            status or notes, open Edit Ticket.
                                        </Text>

                                        <RoutineChecklist
                                            value={ticket.routineChecks}
                                            readOnly
                                        />
                                    </View>
                                )}

                            <RemarksTimelineCard
                                remarks={displayRemarks}
                            />


                            <AddUpdateCard
                                onAddUpdate={
                                    handleAddUpdate
                                }
                            />
                        </>
                    )}

                </ScrollView>
            )}
            <CallReportTimeModal
                visible={printModalVisible}
                date={printDate}
                time={printTime}
                onClose={() =>
                    setPrintModalVisible(false)
                }
                onDatePress={() => {
                    // Native date selection will be connected next.
                }}
                onTimePress={() => {
                    // Native time selection will be connected next.
                }}
                onPrint={() => {
                    setPrintModalVisible(false);

                    Alert.alert(
                        "Print Call Report",
                        "Call report generation will be connected when the printing/report functionality is available."
                    );
                }}
            />
        </SafeAreaView>
    );
}

const styles =
    StyleSheet.create({
        screen: {
            flex: 1,

            backgroundColor:
                COLORS.background,
        },

        header: {
            minHeight: 62,

            paddingHorizontal: 16,

            backgroundColor:
                COLORS.white,

            borderBottomWidth: 1,
            borderBottomColor:
                COLORS.borderSoft,

            flexDirection: "row",
            alignItems: "center",
        },

        backButton: {
            width: 38,
            height: 38,

            borderRadius: 11,

            borderWidth: 1,
            borderColor:
                COLORS.border,

            backgroundColor:
                COLORS.surfaceSoft,

            alignItems: "center",
            justifyContent: "center",
        },

        headerTitle: {
            marginLeft: 12,

            fontSize: 16,
            fontWeight: "700",

            color:
                COLORS.black,
        },

        headerActions: {
            marginLeft: "auto",

            flexDirection: "row",
            alignItems: "center",

            gap: 8,
        },

        editButton: {
            height: 34,

            paddingHorizontal: 10,

            borderRadius: 9,

            borderWidth: 1,
            borderColor:
                COLORS.inProgressBorder,

            backgroundColor:
                COLORS.inProgressBackground,

            flexDirection: "row",
            alignItems: "center",

            gap: 5,
        },

        editButtonText: {
            fontSize: 10,
            fontWeight: "600",

            color:
                COLORS.navigationActive,
        },

        adminBadge: {
            minHeight: 34,

            paddingHorizontal: 11,

            borderRadius: 17,

            backgroundColor:
                COLORS.avatarBackground,

            alignItems: "center",
            justifyContent: "center",
        },

        adminBadgeText: {
            fontSize: 10,
            fontWeight: "600",

            color:
                COLORS.white,
        },

        scrollView: {
            flex: 1,
        },

        content: {
            paddingHorizontal: 16,
            paddingTop: 16,

            paddingBottom: 110,
        },

        placeholderCard: {
            marginTop: 16,

            padding: 20,

            borderRadius: 16,

            borderWidth: 1,
            borderColor:
                COLORS.border,

            backgroundColor:
                COLORS.white,
        },

        placeholderTitle: {
            fontSize: 13,
            fontWeight: "700",

            color:
                COLORS.black,
        },

        placeholderText: {
            marginTop: 7,

            fontSize: 11,
            lineHeight: 17,

            color:
                COLORS.textSecondary,
        },

        notFound: {
            flex: 1,

            paddingHorizontal: 40,

            alignItems: "center",
            justifyContent: "center",
        },

        notFoundTitle: {
            marginTop: 10,

            fontSize: 13,
            fontWeight: "700",

            color:
                COLORS.textBody,
        },

        notFoundText: {
            marginTop: 6,

            textAlign: "center",

            fontSize: 10,
            lineHeight: 15,

            color:
                COLORS.textMuted,
        },
        routineChecksAuditCard: {
            marginTop: 16,
            padding: 14,
            backgroundColor: COLORS.white,
            borderWidth: 1,
            borderColor: COLORS.border,
            borderRadius: 16,
        },

        routineChecksAuditHeading: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
        },

        routineChecksAuditTitle: {
            fontSize: 12,
            fontWeight: "700",
            letterSpacing: 0.5,
            color: COLORS.navigationActive,
        },

        routineChecksAuditDescription: {
            marginTop: 9,
            fontSize: 11,
            lineHeight: 17,
            color: COLORS.textMuted,
        },
        routineChecksIconContainer: {
            width: 27,
            height: 27,
            borderRadius: 8,
            backgroundColor: COLORS.statusInProgressBackground,
            alignItems: "center",
            justifyContent: "center",
        },
    });