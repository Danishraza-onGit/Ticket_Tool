import React, {
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
    temporaryTickets,
} from "../../data/tickets";


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

    const {
        srNo,
        ticketNo,
    } = useLocalSearchParams<{
        srNo?: string;
        ticketNo?: string;
    }>();

    const ticket =
        temporaryTickets.find((item) => {
            if (srNo) {
                return item.srNo === Number(srNo);
            }

            return item.ticketNo === ticketNo;
        });

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

    const [remarks, setRemarks] = useState<
        {
            id: string;
            createdAt: string;
            createdBy: string;
            message: string;
        }[]
    >(
        ticket?.ticketNo === "0110202615"
            ? [
                {
                    id: "remark-1",
                    createdAt:
                        "01/10/2026, 05:24:00 PM",
                    createdBy: "Narendrak",
                    message: "Issue Resolved",
                },
            ]
            : []
    );

    const temporaryHistory =
        ticket?.ticketNo === "0110202615"
            ? [
                {
                    id: "history-1",
                    label: "Closed",
                    timestamp:
                        "02/10/2026, 5:30:03 PM",
                },
                {
                    id: "history-2",
                    label: "Ticket created",
                    timestamp:
                        "01/10/2026, 5:23:51 PM",
                },
            ]
            : [];

    const temporaryCurrentUser = "ShabezK";

    const getCurrentDateTime = () => {
        const now = new Date();

        return now.toLocaleString(
            "en-IN",
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

    const handleAddUpdate = (
        message: string
    ) => {
        const newRemark = {
            id: `remark-${Date.now()}`,

            createdAt:
                getCurrentDateTime(),

            createdBy:
                temporaryCurrentUser,

            message,
        };

        setRemarks((current) => [
            newRemark,
            ...current,
        ]);
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

            {!ticket ? (
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
                        contactName={
                            ticket.contactName ?? "—"
                        }
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
                                onStatusPress={(status) => {
                                    Alert.alert(
                                        "Change Status",
                                        `Status change to "${status}" will be connected when the API is available.`
                                    );
                                }}
                            />

                            <RemarksTimelineCard
                                remarks={remarks}
                            />

                            <TicketHistoryCard
                                history={temporaryHistory}
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
    });