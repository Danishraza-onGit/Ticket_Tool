import React, { useMemo, useState } from "react";

import {
    Alert,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    SafeAreaView,
} from "react-native-safe-area-context";

import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import MainHeader from "../../components/navigation/MainHeader";
import SideDrawer from "../../components/navigation/SideDrawer";

import DashboardActionsMenu from "../../components/dashboard/DashboardActionsMenu";
import AddTicketProjectMenu from "../../components/dashboard/AddTicketProjectMenu";

import DateTimePicker from "@react-native-community/datetimepicker";

import SearchBar from "../../components/dashboard/SearchBar";
import FilterChip from "../../components/dashboard/FilterChip";
import FilterDropdown from "../../components/dashboard/FilterDropdown";

import type {
    DashboardFilters,
    FilterKey,
} from "../../types/dashboardFilters";

import ExportTicketsModal, {
    ExportDateRange,
} from "../../components/dashboard/ExportTicketsModal";

import StatCard from "../../components/dashboard/StatCard";

import TicketCard, {
    Ticket,
} from "../../components/dashboard/TicketCard";

/* =========================================================
   TEMPORARY MY TICKETS DATA

   Later this will come from the API and contain only
   tickets created by the currently logged-in admin.
========================================================= */

const tickets: Ticket[] = [];

/* =========================================================
   MY TICKETS SCREEN
========================================================= */

export default function MyTicketsScreen() {
    const [searchText, setSearchText] =
        useState("");

    const [searchQuery, setSearchQuery] =
        useState("");

    const [filters, setFilters] =
        useState<DashboardFilters>(initialFilters);

    const [activeFilter, setActiveFilter] =
        useState<FilterKey | null>(null);

    const [showDatePicker, setShowDatePicker] =
        useState(false);

    const [selectedFromDate, setSelectedFromDate] =
        useState<Date | null>(null);

    const [filterScrollX, setFilterScrollX] =
        useState(0);

    const [filterPositions, setFilterPositions] =
        useState<
            Partial<
                Record<
                    FilterKey,
                    {
                        x: number;
                        width: number;
                    }
                >
            >
        >({});
    const router = useRouter();

    const [drawerOpen, setDrawerOpen] =
        useState(false);

    const [showAddMenu, setShowAddMenu] =
        useState(false);

    const [showActionsMenu, setShowActionsMenu] =
        useState(false);

    const [showExportModal, setShowExportModal] =
        useState(false);

    /* =======================================================
       MY TICKETS STATISTICS
    ======================================================= */

    const stats = useMemo(
        () => [
            {
                title: "TOTAL TICKETS",
                value: tickets.length,
                backgroundColor: "#E0E7FF",
                borderColor: "#D4E1FF",
                textColor: "#3729AD",
            },

            {
                title: "PENDING",
                value: tickets.filter(
                    (ticket) =>
                        ticket.status === "Pending"
                ).length,
                backgroundColor: "#FEF3C6",
                borderColor: "#FFE5A3",
                textColor: "#963B00",
            },

            {
                title: "IN PROGRESS",
                value: tickets.filter(
                    (ticket) =>
                        ticket.status === "In Progress"
                ).length,
                backgroundColor: "#F2F7FC",
                borderColor: "#D5EBFA",
                textColor: "#134581",
            },

            {
                title: "CLOSED",
                value: tickets.filter(
                    (ticket) =>
                        ticket.status === "Closed"
                ).length,
                backgroundColor: "#D1FBE5",
                borderColor: "#CDEEDD",
                textColor: "#016144",
            },

            {
                title: "OVERDUE",
                value: tickets.filter(
                    (ticket) =>
                        ticket.status === "Overdue"
                ).length,
                backgroundColor: "#FFE3E1",
                borderColor: "#F8D0D0",
                textColor: "#9E0913",
            },
        ],
        []
    );

    /* =======================================================
       DRAWER
    ======================================================= */

    const openDrawer = () => {
        setShowAddMenu(false);
        setShowActionsMenu(false);
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
    };

    /* =======================================================
       MORE ACTIONS
    ======================================================= */

    const openActionsMenu = () => {
        setShowAddMenu(false);
        setShowActionsMenu(true);
    };

    const handleExport = (
        dateRange: ExportDateRange
    ) => {
        setShowExportModal(false);

        Alert.alert(
            "Export",
            `Export selected: ${dateRange}`
        );
    };

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
            "Import",
            "Import will be connected when the API is available."
        );
    };

    const measureFilter = (
        key: FilterKey,
        x: number,
        width: number
    ) => {
        setFilterPositions((current) => ({
            ...current,
            [key]: {
                x,
                width,
            },
        }));
    };

    const handleFilterSelect = (
        key: FilterKey,
        value: string
    ) => {
        setFilters((current) => ({
            ...current,
            [key]: value,
        }));

        setActiveFilter(null);
    };

    const toggleFilter = (key: FilterKey) => {
        setActiveFilter((current) =>
            current === key ? null : key
        );
    };

    const formatDate = (date: Date) => {
        const day = String(
            date.getDate()
        ).padStart(2, "0");

        const month = String(
            date.getMonth() + 1
        ).padStart(2, "0");

        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };

    const handleSearch = () => {
        setSearchQuery(searchText);
    };

    const activePosition =
        activeFilter
            ? filterPositions[activeFilter]
            : undefined;

    const filteredTickets = useMemo(() => {
        const query =
            searchQuery.trim().toLowerCase();

        return tickets.filter((ticket) => {
            const matchesSearch =
                !query ||
                [
                    ticket.ticketNo,
                    ticket.clientName,
                    ticket.callType,
                    ticket.assignedBy,
                    ticket.assignedTo,
                    ticket.status,
                ]
                    .join(" ")
                    .toLowerCase()
                    .includes(query);

            const matchesStatus =
                filters.status === "All" ||
                ticket.status === filters.status;

            const matchesCallType =
                filters.callType === "All" ||
                ticket.callType
                    .toLowerCase()
                    .includes(
                        filters.callType.toLowerCase()
                    );

            const matchesPriority =
                filters.priority === "All" ||
                ticket.priority ===
                filters.priority;

            const matchesAssignedTo =
                filters.assignedTo === "All" ||
                ticket.assignedTo ===
                filters.assignedTo;

            const matchesFromDate =
                !filters.fromDate ||
                (() => {
                    const [day, month, year] =
                        ticket.date
                            .split("/")
                            .map(Number);

                    const ticketDate =
                        new Date(
                            year,
                            month - 1,
                            day
                        );

                    if (!selectedFromDate) {
                        return true;
                    }

                    const selectedDate =
                        new Date(
                            selectedFromDate.getFullYear(),
                            selectedFromDate.getMonth(),
                            selectedFromDate.getDate()
                        );

                    return (
                        ticketDate >= selectedDate
                    );
                })();

            return (
                matchesSearch &&
                matchesStatus &&
                matchesCallType &&
                matchesPriority &&
                matchesAssignedTo &&
                matchesFromDate
            );
        });
    }, [
        searchQuery,
        filters.status,
        filters.callType,
        filters.priority,
        filters.assignedTo,
        filters.fromDate,
        selectedFromDate,
    ]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            {/* =================================================
          SAME MAIN HEADER AS DASHBOARD
      ================================================= */}

            <MainHeader
                onMenuPress={openDrawer}
            />

            {/* =================================================
          MAIN CONTENT
      ================================================= */}

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                {/* =================================================
            PAGE TITLE + SAME DASHBOARD ACTIONS
        ================================================= */}

                <View style={styles.dashboardTitleRow}>
                    <Text style={styles.pageTitle}>
                        My Tickets
                    </Text>

                    <View style={styles.dashboardActions}>
                        {/* MORE */}

                        <View style={styles.actionButtonWrapper}>
                            <TouchableOpacity
                                style={styles.moreButton}
                                onPress={openActionsMenu}
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
                                onDownloadTemplate={
                                    handleDownloadTemplate
                                }
                                onImport={handleImport}
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

                            {showAddMenu && (
                                <>
                                    <TouchableOpacity
                                        style={styles.addMenuDismissArea}
                                        activeOpacity={1}
                                        onPress={() =>
                                            setShowAddMenu(false)
                                        }
                                    />

                                    <AddTicketProjectMenu
                                        visible={showAddMenu}
                                        onClose={() => setShowAddMenu(false)}
                                        onNewTicket={() => {
                                            setShowAddMenu(false);
                                            router.push("/home/new-ticket");
                                        }}
                                        onNewProject={() => {
                                            setShowAddMenu(false);
                                            router.push("/home/new-project");
                                        }}
                                    />
                                </>
                            )}
                        </View>
                    </View>
                </View>

                {/* =================================================
            EXACT SAME HORIZONTAL STAT CARD STRUCTURE
        ================================================= */}

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
                                borderColor={
                                    stat.borderColor
                                }
                                textColor={stat.textColor}
                            />
                        </View>
                    ))}
                </ScrollView>


                {/* SEARCH */}

                <View style={styles.searchSection}>
                    <SearchBar
                        value={searchText}
                        onChangeText={setSearchText}
                        onSearch={handleSearch}
                    />
                </View>

                {/* FILTERS */}

                <View style={styles.filtersRow}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={
                            styles.filtersContainer
                        }
                        onScroll={(event) => {
                            setFilterScrollX(
                                event.nativeEvent.contentOffset.x
                            );
                        }}
                        scrollEventThrottle={16}
                    >
                        <View
                            onLayout={(event) => {
                                const { x, width } =
                                    event.nativeEvent.layout;

                                measureFilter(
                                    "status",
                                    x,
                                    width
                                );
                            }}
                        >
                            <FilterChip
                                label="Status"
                                value={filters.status}
                                onPress={() =>
                                    toggleFilter("status")
                                }
                            />
                        </View>

                        <View
                            onLayout={(event) => {
                                const { x, width } =
                                    event.nativeEvent.layout;

                                measureFilter(
                                    "callType",
                                    x,
                                    width
                                );
                            }}
                        >
                            <FilterChip
                                label="Call Type"
                                value={filters.callType}
                                onPress={() =>
                                    toggleFilter("callType")
                                }
                            />
                        </View>

                        <View
                            onLayout={(event) => {
                                const { x, width } =
                                    event.nativeEvent.layout;

                                measureFilter(
                                    "priority",
                                    x,
                                    width
                                );
                            }}
                        >
                            <FilterChip
                                label="Priority"
                                value={filters.priority}
                                onPress={() =>
                                    toggleFilter("priority")
                                }
                            />
                        </View>

                        <View
                            onLayout={(event) => {
                                const { x, width } =
                                    event.nativeEvent.layout;

                                measureFilter(
                                    "accountManager",
                                    x,
                                    width
                                );
                            }}
                        >
                            <FilterChip
                                label="Account Manager"
                                value={filters.accountManager}
                                onPress={() =>
                                    toggleFilter(
                                        "accountManager"
                                    )
                                }
                            />
                        </View>

                        <View
                            onLayout={(event) => {
                                const { x, width } =
                                    event.nativeEvent.layout;

                                measureFilter(
                                    "assignedTo",
                                    x,
                                    width
                                );
                            }}
                        >
                            <FilterChip
                                label="Assigned To"
                                value={filters.assignedTo}
                                onPress={() =>
                                    toggleFilter("assignedTo")
                                }
                            />
                        </View>

                        <View
                            onLayout={(event) => {
                                const { x, width } =
                                    event.nativeEvent.layout;

                                measureFilter(
                                    "team",
                                    x,
                                    width
                                );
                            }}
                        >
                            <FilterChip
                                label="Team"
                                value={filters.team}
                                onPress={() =>
                                    toggleFilter("team")
                                }
                            />
                        </View>

                        <FilterChip
                            label="From"
                            value={
                                filters.fromDate ||
                                "All Date"
                            }
                            onPress={() =>
                                setShowDatePicker(true)
                            }
                        />

                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={() => {
                                setSearchText("");
                                setSearchQuery("");

                                setFilters(initialFilters);

                                setSelectedFromDate(null);
                                setShowDatePicker(false);
                                setActiveFilter(null);
                            }}
                            activeOpacity={0.6}
                        >
                            <Text style={styles.clearText}>
                                Clear
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                {activeFilter && (
                    <TouchableOpacity
                        style={styles.filterDismissLayer}
                        activeOpacity={1}
                        onPress={() =>
                            setActiveFilter(null)
                        }
                    />
                )}

                {activeFilter &&
                    activePosition && (
                        <View
                            style={[
                                styles.dropdownWrapper,
                                {
                                    left:
                                        activePosition.x -
                                        filterScrollX,

                                    width: Math.max(
                                        activePosition.width,
                                        220
                                    ),
                                },
                            ]}
                        >
                            <FilterDropdown
                                options={
                                    filterOptions[activeFilter]
                                }
                                selectedValue={
                                    filters[activeFilter]
                                }
                                onSelect={(value) =>
                                    handleFilterSelect(
                                        activeFilter,
                                        value
                                    )
                                }
                            />
                        </View>
                    )}
                {/* =================================================
            TEMPORARY TICKET SECTION
        ================================================= */}

                <View style={styles.ticketsHeader}>
                    <Text style={styles.ticketsTitle}>
                        TICKETS
                    </Text>

                    <Text style={styles.ticketsCount}>
                        Showing {filteredTickets.length} of{" "}
                        {tickets.length}
                    </Text>
                </View>

                {filteredTickets.map((ticket) => (
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
                ))}

                {filteredTickets.length === 0 && (
                    <View style={styles.emptyState}>
                        <Ionicons
                            name="ticket-outline"
                            size={30}
                            color="#9AA9BA"
                        />

                        <Text style={styles.emptyText}>
                            No tickets found
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* =================================================
          EXPORT MODAL
      ================================================= */}

            <ExportTicketsModal
                visible={showExportModal}
                onClose={() =>
                    setShowExportModal(false)
                }
                onExport={handleExport}
            />

            {/* =================================================
          SAME SIDE DRAWER
      ================================================= */}

            <SideDrawer
                visible={drawerOpen}
                onClose={closeDrawer}
            />
        </SafeAreaView>
    );
}

/* =========================================================
   STYLES

   THESE VALUES ARE TAKEN FROM THE CURRENT DASHBOARD.
========================================================= */
const initialFilters: DashboardFilters = {
    status: "All",
    callType: "All",
    priority: "All",
    accountManager: "All",
    assignedTo: "All",
    team: "All",
    fromDate: "",
};

const filterOptions: Record<FilterKey, string[]> = {
    status: [
        "All",
        "Pending",
        "In Progress",
        "Closed",
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

    team: [
        "All",
        "FMS",
        "Field",
    ],
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4F7FB",
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
        justifyContent: "space-between",

        marginBottom: 14,
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

    /* =======================================================
       MORE
    ======================================================= */

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

    /* =======================================================
       ADD
    ======================================================= */

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


    /* =======================================================
       STATISTICS
    ======================================================= */

    statsContainer: {
        paddingLeft: 4,
        paddingRight: 4,
        paddingBottom: 6,
    },

    statWrapper: {
        marginRight: 12,
    },

    /* =======================================================
       TICKETS
    ======================================================= */

    ticketsHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        marginTop: 18,
        marginBottom: 10,
    },

    ticketsTitle: {
        fontSize: 12,
        fontWeight: "700",
        color: "#293A50",
        letterSpacing: 0.3,
    },

    ticketsCount: {
        fontSize: 10,
        color: "#71849A",
    },

    emptyState: {
        alignItems: "center",
        justifyContent: "center",

        paddingVertical: 50,
    },

    emptyText: {
        marginTop: 8,

        fontSize: 12,
        color: "#8798AA",
    },

    searchSection: {
        marginTop: 14,
    },

    filtersRow: {
        marginTop: 10,
    },

    filtersContainer: {
        alignItems: "center",
    },

    clearButton: {
        paddingHorizontal: 5,
        height: 28,
        justifyContent: "center",
    },

    clearText: {
        fontSize: 10,
        fontWeight: "600",
        color: "#174F8A",
    },

    filterDismissLayer: {
        position: "absolute",

        top: 0,
        left: 0,
        right: 0,
        bottom: 0,

        backgroundColor: "transparent",

        zIndex: 40,
    },

    dropdownWrapper: {
        position: "absolute",

        top: 178,

        zIndex: 50,
    },
});