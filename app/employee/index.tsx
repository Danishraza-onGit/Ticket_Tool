import React, {
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

import { useRouter } from "expo-router";

import {
    SafeAreaView,
} from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";
import { COLORS } from "../../constants/colors";
import EmployeeHeader from "../../components/employee/navigation/EmployeeHeader";
import EmployeeAddMenu from "../../components/employee/dashboard/EmployeeAddMenu";
import StatCard from "../../components/employee/dashboard/StatCard";
import TicketCard from "../../components/employee/dashboard/TicketCard";
import TicketSearchFilters from "../../components/employee/dashboard/TicketSearchFilters";

import { Ionicons } from "@expo/vector-icons";
import { temporaryCustomers } from "../../data/customer";
import {
    ticketFilterOptions,
} from "../../data/ticketFilterOptions";

import type {
    DashboardFilters,
    FilterKey,
} from "../../types/dashboardFilters";

import {
    employeeTickets,
} from "../../data/employee";

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


export default function EmployeeDashboardScreen() {
    const router = useRouter();

    const [showAddMenu, setShowAddMenu] =
        useState(false);

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
                title: "TOTAL TICKETS",
                value: employeeTickets.length,
                backgroundColor:
                    COLORS.totalBackground,
                borderColor:
                    COLORS.totalBorder,
                textColor:
                    COLORS.primary,
            },

            {
                title: "PENDING",
                value: employeeTickets.filter(
                    (ticket) =>
                        ticket.status === "Pending"
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
                value: employeeTickets.filter(
                    (ticket) =>
                        ticket.status ===
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
                title: "CLOSED",
                value: employeeTickets.filter(
                    (ticket) =>
                        ticket.status === "Closed"
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
                value: employeeTickets.filter(
                    (ticket) =>
                        ticket.status === "Overdue"
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

    const filteredTickets =
        useMemo(() => {
            const normalizedSearch =
                searchQuery
                    .trim()
                    .toLowerCase();

            return employeeTickets.filter(
                (ticket) => {
                    if (normalizedSearch) {
                        const customer =
                            temporaryCustomers.find(
                                (item) =>
                                    item.id === ticket.customerId
                            );

                        const customerName =
                            customer?.company ?? "";

                        const matchesSearch =
                            ticket.ticketNo
                                .toLowerCase()
                                .includes(normalizedSearch) ||
                            customerName
                                .toLowerCase()
                                .includes(normalizedSearch);

                        if (!matchesSearch) {
                            return false;
                        }
                    }

                    if (
                        filters.status !== "All" &&
                        ticket.status !==
                        filters.status
                    ) {
                        return false;
                    }

                    if (
                        filters.callType !==
                        "All" &&
                        ticket.callType !==
                        filters.callType
                    ) {
                        return false;
                    }

                    if (
                        filters.priority !== "All" &&
                        ticket.priority !==
                        filters.priority
                    ) {
                        return false;
                    }

                    if (selectedFromDate) {
                        const [
                            day,
                            month,
                            year,
                        ] = ticket.date
                            .split("/")
                            .map(Number);

                        const ticketDate =
                            new Date(
                                year,
                                month - 1,
                                day
                            );

                        ticketDate.setHours(
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

                        if (
                            ticketDate < fromDate
                        ) {
                            return false;
                        }
                    }

                    return true;
                }
            );
        }, [
            searchQuery,
            filters.status,
            filters.callType,
            filters.priority,
            selectedFromDate,
        ]);

    return (
        <SafeAreaView
            style={styles.container}
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
                <View
                    style={
                        styles.dashboardTitleRow
                    }
                >
                    <Text style={styles.pageTitle}>
                        Dashboard
                    </Text>

                    {/* <TouchableOpacity
            style={styles.addButton}
            onPress={() =>
              router.push(
                "/employee/new-ticket"
              )
            }
            activeOpacity={0.8}
          >
            <Text
              style={
                styles.addButtonText
              }
            >
              ＋ Add
            </Text>
          </TouchableOpacity> */}
                    <View style={styles.dashboardActions}>
                        <View style={styles.actionButtonWrapper}>
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() =>
                                    setShowAddMenu(
                                        (current) => !current
                                    )
                                }
                                activeOpacity={0.8}
                            >
                                <Text style={styles.addButtonText}>
                                    ＋ Add
                                </Text>

                                <Ionicons
                                    name="chevron-down"
                                    size={15}
                                    color={COLORS.white}
                                />
                            </TouchableOpacity>

                            <EmployeeAddMenu
                                visible={showAddMenu}
                                onClose={() =>
                                    setShowAddMenu(false)
                                }
                                onNewTicket={() => {
                                    setShowAddMenu(false);

                                    router.push(
                                        "/employee/new-ticket"
                                    );
                                }}
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

                <View
                    style={
                        styles.ticketsHeader
                    }
                >
                    <Text
                        style={
                            styles.ticketsTitle
                        }
                    >
                        TICKETS
                    </Text>

                    <Text
                        style={
                            styles.ticketsCount
                        }
                    >
                        Showing{" "}
                        {filteredTickets.length} of{" "}
                        {employeeTickets.length}
                    </Text>
                </View>

                {filteredTickets.map((ticket) => {
                    const customer =
                        temporaryCustomers.find(
                            (item) =>
                                item.id === ticket.customerId
                        );

                    return (
                        <TicketCard
                            key={ticket.ticketNo}
                            ticket={ticket}
                            clientName={
                                customer?.company ?? "—"
                            }
                            onViewDetails={() =>
                                router.push({
                                    pathname:
                                        "/employee/ticket-details",
                                    params: {
                                        ticketNo:
                                            ticket.ticketNo,
                                    },
                                })
                            }
                        />
                    );
                })}

                {filteredTickets.length ===
                    0 && (
                        <View
                            style={
                                styles.emptyState
                            }
                        >
                            <Text
                                style={
                                    styles.emptyText
                                }
                            >
                                No tickets found
                            </Text>
                        </View>
                    )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:
            COLORS.background,
    },

    content: {
        paddingHorizontal: 16,
        paddingTop: 18,
        paddingBottom: 100,
    },

    dashboardTitleRow: {
        width: "100%",

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

    // addButton: {
    //     height: 38,
    //     minWidth: 94,

    //     borderRadius: 9,

    //     backgroundColor:
    //         COLORS.primaryDark,

    //     paddingHorizontal: 11,

    //     alignItems: "center",
    //     justifyContent: "center",
    // },

    addButtonText: {
        fontSize: 12,
        fontWeight: "700",

        color: COLORS.white,
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

    addButton: {
        height: 38,
        minWidth: 94,

        borderRadius: 9,

        backgroundColor:
            COLORS.primaryDark,

        paddingHorizontal: 11,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",

        gap: 4,

        zIndex: 1002,
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
        flexDirection: "row",
        alignItems: "center",
        justifyContent:
            "space-between",

        marginTop: 18,
        marginBottom: 10,
    },

    ticketsTitle: {
        fontSize: 12,
        fontWeight: "700",

        color: COLORS.textBody,

        letterSpacing: 0.3,
    },

    ticketsCount: {
        fontSize: 10,
        color: COLORS.textMuted,
    },

    emptyState: {
        alignItems: "center",
        justifyContent: "center",

        paddingVertical: 50,
    },

    emptyText: {
        fontSize: 12,
        color: COLORS.textMuted,
    },
});