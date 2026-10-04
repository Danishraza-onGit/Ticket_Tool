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
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import { COLORS } from "../../constants/colors";

import {
  employeeTickets,
} from "../../data/employee";

import {
  ticketFilterOptions,
} from "../../data/ticketFilterOptions";

import EmployeeHeader from "../../components/employee/navigation/EmployeeHeader";
import EmployeeAddMenu from "../../components/employee/dashboard/EmployeeAddMenu";
import { temporaryCustomers } from "../../data/customer";

import StatCard from "../../components/employee/dashboard/StatCard";
import TicketCard from "../../components/employee/dashboard/TicketCard";
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

export default function EmployeeOverdueScreen() {
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

  const employeeOverdueTickets =
    useMemo(
      () =>
        employeeTickets.filter(
          (ticket) =>
            ticket.status === "Overdue"
        ),
      []
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
        value:
          employeeOverdueTickets.length,
        backgroundColor:
          COLORS.overdueBackground,
        borderColor:
          COLORS.overdueBorder,
        textColor:
          COLORS.danger,
      },
    ],
    [employeeOverdueTickets.length]
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
      return employeeOverdueTickets.filter(
        (ticket) => {
          const normalizedSearch =
            searchQuery
              .trim()
              .toLowerCase();

          if (normalizedSearch) {
            const matchesSearch =
              ticket.ticketNo
                .toLowerCase()
                .includes(
                  normalizedSearch
                ) ||
              ticket.clientName
                .toLowerCase()
                .includes(
                  normalizedSearch
                );

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
            filters.callType !== "All" &&
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

          if (
            filters.assignedTo !== "All" &&
            ticket.assignedTo !==
            filters.assignedTo
          ) {
            return false;
          }

          if (
            filters.assignedBy !== "All" &&
            ticket.assignedBy !==
            filters.assignedBy
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
      employeeOverdueTickets,
      searchQuery,
      filters.status,
      filters.callType,
      filters.priority,
      filters.assignedTo,
      filters.assignedBy,
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
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>
            Overdue
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
                style={styles.addButton}
                onPress={() =>
                  setShowAddMenu(
                    (current) =>
                      !current
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
            OVERDUE TICKETS
          </Text>

          <Text
            style={
              styles.ticketCount
            }
          >
            Showing{" "}
            {filteredTickets.length} of{" "}
            {
              employeeOverdueTickets.length
            }
          </Text>
        </View>

        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => {
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
          })
        ) : (
  // keep your existing empty state

        <View
          style={
            styles.emptyState
          }
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={34}
            color={
              COLORS.textSearchIcon
            }
          />

          <Text
            style={
              styles.emptyTitle
            }
          >
            No overdue tickets
          </Text>

          <Text
            style={
              styles.emptyText
            }
          >
            You currently have no
            overdue tickets.
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

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",

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

  ticketsHeader: {
    marginTop: 18,
    marginBottom: 10,

    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
  },

  ticketsTitle: {
    fontSize: 12,
    fontWeight: "700",

    color: COLORS.textBody,

    letterSpacing: 0.7,
  },

  ticketCount: {
    fontSize: 10,

    color: COLORS.textMuted,
  },

  emptyState: {
    minHeight: 180,

    borderRadius: 14,

    borderWidth: 1,
    borderColor: COLORS.border,

    backgroundColor: COLORS.white,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 24,
    paddingVertical: 30,
  },

  emptyTitle: {
    marginTop: 10,

    fontSize: 14,
    fontWeight: "700",

    color: COLORS.textBody,
  },

  emptyText: {
    marginTop: 5,

    fontSize: 11,
    lineHeight: 16,

    textAlign: "center",

    color: COLORS.textMuted,
  },
});