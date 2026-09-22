import React, { useMemo, useState } from "react";

import {
    Alert,
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

import TicketSearchFilters from "../../components/dashboard/TicketSearchFilters";

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




const tickets: Ticket[] = [];



export default function MyTicketsScreen() {
    const [searchText, setSearchText] =
        useState("");

    const [searchQuery, setSearchQuery] =
        useState("");

    const [filters, setFilters] =
        useState<DashboardFilters>(initialFilters);

    const [selectedFromDate, setSelectedFromDate] =
        useState<Date | null>(null);

    const router = useRouter();

    const [drawerOpen, setDrawerOpen] =
        useState(false);

    const [showAddMenu, setShowAddMenu] =
        useState(false);

    const [showActionsMenu, setShowActionsMenu] =
        useState(false);

    const [showExportModal, setShowExportModal] =
        useState(false);


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


    const openDrawer = () => {
        setShowAddMenu(false);
        setShowActionsMenu(false);
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
    };

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

    const handleSearch = () => {
        setSearchQuery(searchText);
    };


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

            const matchesAssignedBy =
                filters.assignedBy === "All" ||
                ticket.assignedBy ===
                filters.assignedBy;

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
                matchesAssignedBy &&
                matchesFromDate
            );
        });
    }, [
        searchQuery,
        filters.status,
        filters.callType,
        filters.priority,
        filters.assignedTo,
        filters.assignedBy,
        filters.fromDate,
        selectedFromDate,
    ]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

         

            <MainHeader
                onMenuPress={openDrawer}
                onProfilePress={() =>
                    router.push("/home/account")
                }
            />

      

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
         

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

                            <AddTicketProjectMenu
                                visible={showAddMenu}
                                onClose={() =>
                                    setShowAddMenu(false)
                                }
                                onNewTicket={() => {
                                    setShowAddMenu(false);
                                    router.push("/home/new-ticket");
                                }}
                                onNewProject={() => {
                                    setShowAddMenu(false);
                                    router.push("/home/new-project");
                                }}
                            />
                        </View>
                    </View>
                </View>

             

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


                <TicketSearchFilters
                    searchText={searchText}
                    filters={filters}
                    filterOptions={filterOptions}
                    selectedFromDate={selectedFromDate}
                    onSearchTextChange={setSearchText}
                    onSearch={handleSearch}
                    onFilterChange={handleFilterChange}
                    onFromDateChange={handleFromDateChange}
                    onClear={handleClearFilters}
                />

        

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

         

            <ExportTicketsModal
                visible={showExportModal}
                onClose={() =>
                    setShowExportModal(false)
                }
                onExport={handleExport}
            />

     

            <SideDrawer
                visible={drawerOpen}
                onClose={closeDrawer}
            />
        </SafeAreaView>
    );
}


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

});