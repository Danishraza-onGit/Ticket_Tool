import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Animated,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useRouter } from "expo-router";


import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import DateTimePicker from "@react-native-community/datetimepicker";

import FilterChip from "../../components/dashboard/FilterChip";
import FilterDropdown from "../../components/dashboard/FilterDropdown";
import SearchBar from "../../components/dashboard/SearchBar";
import StatCard from "../../components/dashboard/StatCard";
import TicketCard, {
  Ticket,
} from "../../components/dashboard/TicketCard";

import type {
  DashboardFilters,
  FilterKey,
} from "../../types/dashboardFilters";

/* =========================================================
   STATISTICS
========================================================= */

const stats = [
  {
    title: "TOTAL TICKETS",
    value: 323,
    backgroundColor: "#E0E7FF",
    borderColor: "#D4E1FF",
    textColor: "#3729AD",
  },
  {
    title: "PENDING",
    value: 1,
    backgroundColor: "#FEF3C6",
    borderColor: "#FFE5A3",
    textColor: "#963B00",
  },
  {
    title: "IN PROGRESS",
    value: 17,
    backgroundColor: "#F2F7FC",
    borderColor: "#D5EBFA",
    textColor: "#134581",
  },
  {
    title: "CLOSED",
    value: 304,
    backgroundColor: "#D1FBE5",
    borderColor: "#CDEEDD",
    textColor: "#016144",
  },
  {
    title: "OVERDUE",
    value: 2,
    backgroundColor: "#FFE3E1",
    borderColor: "#F8D0D0",
    textColor: "#9E0913",
  },
];

/* =========================================================
   INITIAL FILTER STATE
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

/* =========================================================
   FILTER OPTIONS
   ---------------------------------------------------------
   These are temporary mock options for development.

   IMPORTANT:
   The UI should NOT depend on these being permanent.
   Later, the API/service layer will provide these values.
========================================================= */

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

/* =========================================================
   TEMPORARY TICKET DATA
========================================================= */

const tickets: Ticket[] = [
  {
    ticketNo: "0309202606",
    date: "03/09/2026",
    clientName: "IES College",
    callType: "Routine Visit u...",
    priority: "P3",
    status: "In Progress",
    assignedBy: "Pranesh",
    assignedTo: "Pranesh Kute",
    updatedAt: "03/09/2026",
  },
  {
    ticketNo: "0309202605",
    date: "03/09/2026",
    clientName: "CEWELL ONGC V...",
    callType: "Routine Health ...",
    priority: "P3",
    status: "Closed",
    assignedBy: "-",
    assignedTo: "Yash Gupta",
    updatedAt: "03/09/2026",
  },
  {
    ticketNo: "0309202604",
    date: "03/09/2026",
    clientName: "Cygnus Inform...",
    callType: "Routine Checkin...",
    priority: "P3",
    status: "Closed",
    assignedBy: "-",
    assignedTo: "Jitesh Malhotra",
    updatedAt: "03/09/2026",
  },
  {
    ticketNo: "0309202603",
    date: "03/09/2026",
    clientName: "ONGC Rajahmun...",
    callType: "Routine Checks",
    priority: "P3",
    status: "Closed",
    assignedBy: "-",
    assignedTo: "Ravi Kumar Gorrela",
    updatedAt: "03/09/2026",
  },
  {
    ticketNo: "0309202602",
    date: "03/09/2026",
    clientName: "ONGC GEOPIC C...",
    callType: "CLAP & GMS Heal...",
    priority: "P3",
    status: "Closed",
    assignedBy: "Ajay Malik",
    assignedTo: "Ajay Malik",
    updatedAt: "03/09/2026",
  },
];

/* =========================================================
   HOME SCREEN
========================================================= */

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const router = useRouter();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const drawerTranslateX = useRef(
    new Animated.Value(-280)
  ).current;

  const drawerBackdropOpacity = useRef(
    new Animated.Value(0)
  ).current;

  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [showAddMenu, setShowAddMenu] = useState(false);

  const [showDatePicker, setShowDatePicker] =
    useState(false);

  const [selectedFromDate, setSelectedFromDate] =
    useState<Date | null>(null);

  const [filters, setFilters] =
    useState<DashboardFilters>(initialFilters);

  const [activeFilter, setActiveFilter] =
    useState<FilterKey | null>(null);

  /*
   * Tracks the horizontal position of the filter row.
   * This allows the dropdown to remain attached to
   * the correct filter while the filter row scrolls.
   */
  const [filterScrollX, setFilterScrollX] =
    useState(0);

  /*
   * Stores the position and width of each filter chip.
   */
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

  const openDrawer = () => {
    setDrawerOpen(true);
    setShowMore(false);
  };

  const closeDrawer = () => {
    Animated.parallel([
      Animated.timing(drawerTranslateX, {
        toValue: -280,
        duration: 180,
        useNativeDriver: true,
      }),

      Animated.timing(drawerBackdropOpacity, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setDrawerOpen(false);
        setShowMore(false);
      }
    });
  };

  useEffect(() => {
    if (!drawerOpen) {
      return;
    }

    drawerTranslateX.setValue(-280);
    drawerBackdropOpacity.setValue(0);

    Animated.parallel([
      Animated.timing(drawerTranslateX, {
        toValue: 0,
        duration: 190,
        useNativeDriver: true,
      }),

      Animated.timing(drawerBackdropOpacity, {
        toValue: 1,
        duration: 170,
        useNativeDriver: true,
      }),
    ]).start();
  }, [
    drawerOpen,
    drawerTranslateX,
    drawerBackdropOpacity,
  ]);

  /* =======================================================
     FILTER POSITION
  ======================================================= */

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

  /* =======================================================
     FILTER SELECTION
  ======================================================= */

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

  /* =======================================================
     FILTER OPEN / CLOSE
  ======================================================= */

  const toggleFilter = (key: FilterKey) => {
    setActiveFilter((current) =>
      current === key ? null : key
    );
  };

  /* =======================================================
     SEARCH + FILTERING
  ======================================================= */
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const filteredTickets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return tickets.filter((ticket) => {
      /* ---------------- SEARCH ---------------- */

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

      /* ---------------- STATUS ---------------- */

      const matchesStatus =
        filters.status === "All" ||
        ticket.status === filters.status;

      /* ---------------- CALL TYPE ---------------- */

      const matchesCallType =
        filters.callType === "All" ||
        ticket.callType
          .toLowerCase()
          .includes(
            filters.callType.toLowerCase()
          );

      /* ---------------- PRIORITY ---------------- */

      const matchesPriority =
        filters.priority === "All" ||
        ticket.priority === filters.priority;

      /* ---------------- ASSIGNED TO ---------------- */

      const matchesAssignedTo =
        filters.assignedTo === "All" ||
        ticket.assignedTo === filters.assignedTo;

      /*
       * Account Manager and Team are intentionally not
       * applied to the temporary ticket data yet.
       *
       * The current mock Ticket type does not contain
       * accountManager or team fields.
       *
       * We will connect these filters properly when the
       * API provides those fields.
       */

      const matchesFromDate =
        !filters.fromDate ||
        (() => {
          const [day, month, year] =
            ticket.date.split("/").map(Number);

          const ticketDate = new Date(
            year,
            month - 1,
            day
          );

          const fromDate = selectedFromDate;

          if (!fromDate) {
            return true;
          }

          const selectedDate = new Date(
            fromDate.getFullYear(),
            fromDate.getMonth(),
            fromDate.getDate()
          );

          return ticketDate >= selectedDate;
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

  /* =======================================================
     SEARCH
  ======================================================= */

  const handleSearch = () => {
    setSearchQuery(searchText);
  };

  /* =======================================================
     ACTIVE DROPDOWN POSITION
  ======================================================= */

  const activePosition =
    activeFilter
      ? filterPositions[activeFilter]
      : undefined;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        style="dark"
        backgroundColor="#FFFFFF"
      />

      {/* =================================================
          HEADER
      ================================================= */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={openDrawer}
          activeOpacity={0.7}
        >
          <Ionicons
            name="menu-outline"
            size={27}
            color="#174F8A"
          />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>
            CYGNUS
          </Text>

          <Text style={styles.logoSubtitle}>
            TICKETING SYSTEM
          </Text>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.notificationContainer}>
            <Ionicons
              name="notifications-outline"
              size={21}
              color="#5D6F86"
            />

            <View
              style={styles.notificationDot}
            />
          </View>

          <View style={styles.userBadge}>
            <View style={styles.avatarCircle}>
              <Text style={styles.userInitial}>
                SH
              </Text>
            </View>

            <Text style={styles.userRole}>
              Admin
            </Text>
          </View>
        </View>
      </View>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Page title */}

        {/* ================= DASHBOARD TITLE ================= */}

        <View style={styles.dashboardTitleRow}>
          <Text style={styles.pageTitle}>Dashboard</Text>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setShowAddMenu((current) => !current);
              setActiveFilter(null);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonText}>＋ Add</Text>

            <Ionicons
              name="chevron-down"
              size={15}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {/* =================================================
            STATISTICS
        ================================================= */}

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

        {/* =================================================
            SEARCH
        ================================================= */}

        <View style={styles.searchSection}>
          <SearchBar
            value={searchText}
            onChangeText={setSearchText}
            onSearch={handleSearch}
          />
        </View>

        {/* =================================================
            FILTERS
        ================================================= */}

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

            {/* STATUS */}

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

            {/* CALL TYPE */}

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

            {/* PRIORITY */}

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

            {/* ACCOUNT MANAGER */}

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

            {/* ASSIGNED TO */}

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

            {/* TEAM */}

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

            {/* FROM */}

            <FilterChip
              label="From"
              value={filters.fromDate || "All Date"}
              onPress={() => setShowDatePicker(true)}
            />

            {/* CLEAR */}

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


        {/* Android date picker */}
        {showDatePicker &&
          Platform.OS === "android" && (
            <DateTimePicker
              value={
                selectedFromDate || new Date()
              }
              mode="date"
              display="calendar"
              onChange={(event, date) => {
                setShowDatePicker(false);

                if (event.type === "dismissed") {
                  return;
                }

                if (date) {
                  setSelectedFromDate(date);

                  setFilters((current) => ({
                    ...current,
                    fromDate: formatDate(date),
                  }));
                }
              }}
            />
          )}

        {/* iOS date picker */}
        {Platform.OS === "ios" && (
          <Modal
            visible={showDatePicker}
            transparent
            animationType="fade"
            onRequestClose={() =>
              setShowDatePicker(false)
            }
          >
            <View style={styles.dateModalOverlay}>
              <View style={styles.dateModalCard}>
                <View style={styles.dateModalHeader}>
                  <Text style={styles.dateModalTitle}>
                    Select From Date
                  </Text>

                  <TouchableOpacity
                    onPress={() =>
                      setShowDatePicker(false)
                    }
                    activeOpacity={0.7}
                  >
                    <Text style={styles.dateModalCancel}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>

                <DateTimePicker
                  value={
                    selectedFromDate || new Date()
                  }
                  mode="date"
                  display="inline"
                  accentColor="#174F8A"
                  onChange={(event, date) => {
                    if (event.type === "dismissed") {
                      setShowDatePicker(false);
                      return;
                    }

                    if (date) {
                      setSelectedFromDate(date);

                      setFilters((current) => ({
                        ...current,
                        fromDate: formatDate(date),
                      }));

                      setShowDatePicker(false);
                    }
                  }}
                />
              </View>
            </View>
          </Modal>
        )}

        {/* =================================================
            DROPDOWN DISMISS LAYER
            -------------------------------------------------
            This is rendered BEFORE the dropdown so that
            the dropdown stays above it.
        ================================================= */}

        {activeFilter && (
          <TouchableOpacity
            style={styles.filterDismissLayer}
            activeOpacity={1}
            onPress={() =>
              setActiveFilter(null)
            }
          />
        )}

        {/* =================================================
            ACTIVE FILTER DROPDOWN
        ================================================= */}

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
            TICKETS HEADER
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

        {/* =================================================
            TICKETS
        ================================================= */}

        <View>
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
        </View>

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {filteredTickets.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons
              name="search-outline"
              size={30}
              color="#9AA9BA"
            />

            <Text style={styles.emptyText}>
              No tickets found
            </Text>
          </View>
        )}
      </ScrollView>


      {showAddMenu && (
        <>
          {/* Transparent area to detect taps outside the menu */}
          <TouchableOpacity
            style={styles.addMenuDismissArea}
            activeOpacity={1}
            onPress={() => setShowAddMenu(false)}
          />

          {/* Add menu */}
          <View style={styles.addMenu}>
            <TouchableOpacity
              style={styles.addMenuOption}
              onPress={() => {
                setShowAddMenu(false);
                router.push("/home/new-ticket");
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.addMenuText}>
                New Ticket
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.addMenuOption}
              onPress={() => {
                setShowAddMenu(false);
                router.push("/home/new-project");
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.addMenuText}>
                New Project
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* =================================================
          BOTTOM NAVIGATION
      ================================================= */}

      <View
        style={[
          styles.bottomNavigation,
          {
            paddingBottom:
              Platform.OS === "ios"
                ? Math.max(insets.bottom, 8)
                : 8,
          },
        ]}
      >
        <BottomNavItem
          icon="home"
          label="Dashboard"
          active
        />

        <BottomNavItem
          icon="ticket-outline"
          label="Tickets"
        />

        <BottomNavItem
          icon="warning-outline"
          label="Overdue"
          notification
        />

        <BottomNavItem
          icon="business-outline"
          label="Clients"
        />

        <BottomNavItem
          icon="menu-outline"
          label="More"
        />
      </View>

      {/* =================================================
          DRAWER
      ================================================= */}

      {drawerOpen && (
        <View style={styles.overlay}>
          {/* Dimmed background */}
          <Animated.View
            pointerEvents="box-none"
            style={[
              styles.overlayBackgroundContainer,
              {
                opacity: drawerBackdropOpacity,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.overlayBackground}
              onPress={closeDrawer}
              activeOpacity={1}
            />
          </Animated.View>

          {/* Sliding drawer */}
          <Animated.View
            style={[
              styles.drawer,
              {
                transform: [
                  {
                    translateX: drawerTranslateX,
                  },
                ],
                paddingTop: insets.top + 20,
              },
            ]}
          >
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerLogo}>
                Cygnus
              </Text>

              <TouchableOpacity
                onPress={closeDrawer}
                activeOpacity={0.7}
              >
                <Text style={styles.closeButton}>
                  ×
                </Text>
              </TouchableOpacity>
            </View>

            {[
              "Dashboard",
              "My Tickets",
              "Projects",
              "More",
            ].map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.menuItem}
                onPress={() => {
                  if (item === "More") {
                    setShowMore((current) => !current);
                  }
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.menuItemText}>
                  {item}
                </Text>

                {item === "More" && (
                  <Text style={styles.arrow}>
                    {showMore ? "▲" : "▼"}
                  </Text>
                )}
              </TouchableOpacity>
            ))}

            {showMore && (
              <View style={styles.moreContainer}>
                {[
                  "Overdue",
                  "Inwards/Outwards",
                  "Pending Requests",
                  "Activity Log",
                  "Customers",
                  "Analytics",
                  "Routine Check",
                  "Employees",
                ].map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.moreItem}
                    onPress={closeDrawer}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.moreItemText}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
}

/* =========================================================
   BOTTOM NAVIGATION ITEM
========================================================= */

type BottomNavItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
  notification?: boolean;
};

function BottomNavItem({
  icon,
  label,
  active = false,
  notification = false,
}: BottomNavItemProps) {
  return (
    <TouchableOpacity
      style={styles.bottomItem}
      activeOpacity={0.7}
    >
      <View>
        <Ionicons
          name={icon}
          size={21}
          color={
            active
              ? "#174F8A"
              : "#71849A"
          }
        />

        {notification && (
          <View
            style={
              styles.bottomNotificationDot
            }
          />
        )}
      </View>

      <Text
        style={[
          styles.bottomLabel,
          active &&
          styles.bottomLabelActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  /* =======================================================
     HEADER
  ======================================================= */

  header: {
    height: 62,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E1E7EF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  menuButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },

  logoContainer: {
    marginLeft: 4,
  },

  logoText: {
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: "#174F8A",
  },

  logoDot: {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#174F8A",
    right: -8,
    top: 7,
  },

  logoSubtitle: {
    fontSize: 7,
    letterSpacing: 1,
    color: "#8BA0B7",
    marginTop: 1,
  },

  headerRight: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  notificationContainer: {
    position: "relative",
  },

  notificationDot: {
    position: "absolute",
    right: -1,
    top: 0,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F04A68",
  },

  userBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F4F8",
    borderRadius: 14,
    paddingRight: 7,
    paddingLeft: 4,
    paddingVertical: 3,
    gap: 4,
  },

  avatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#DCE5EF",
    alignItems: "center",
    justifyContent: "center",
  },

  userInitial: {
    fontSize: 9,
    fontWeight: "700",
    color: "#51657B",
  },

  userRole: {
    fontSize: 8,
    color: "#52647A",
  },

  /* =======================================================
     MAIN CONTENT
  ======================================================= */

  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 85,
  },

  pageTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: "#16243A",
    marginBottom: 14,
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
     SEARCH
  ======================================================= */

  searchSection: {
    marginTop: 14,
  },

  /* =======================================================
     FILTERS
  ======================================================= */

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

  /* =======================================================
     FILTER DROPDOWN
  ======================================================= */

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

  /* =======================================================
     BOTTOM NAVIGATION
  ======================================================= */

  bottomNavigation: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#DDE5EE",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 7,
  },

  bottomItem: {
    width: 65,
    alignItems: "center",
    justifyContent: "center",
  },

  bottomLabel: {
    fontSize: 8,
    color: "#71849A",
    marginTop: 2,
  },

  bottomLabelActive: {
    color: "#174F8A",
    fontWeight: "600",
  },

  bottomNotificationDot: {
    position: "absolute",
    right: -3,
    top: -1,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#F04A68",
  },

  /* =======================================================
     DRAWER
  ======================================================= */

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    zIndex: 100,
  },

  overlayBackgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  overlayBackground: {
    flex: 1,
    backgroundColor:
      "rgba(0,0,0,0.35)",
  },

  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    paddingTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 3,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },

  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginBottom: 12,
  },

  drawerLogo: {
    fontSize: 24,
    fontWeight: "700",
    color: "#174F8A",
  },

  closeButton: {
    fontSize: 32,
    color: "#6B7280",
  },

  menuItem: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 5,
  },

  menuItemText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1F2937",
  },

  arrow: {
    fontSize: 12,
    color: "#6B7280",
  },

  moreContainer: {
    paddingLeft: 12,
    marginBottom: 8,
  },

  moreItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  moreItemText: {
    fontSize: 14,
    color: "#6B7280",
  },

  dateModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
  },

  dateModalCard: {
    width: "100%",
    maxWidth: 360,

    backgroundColor: "#FFFFFF",
    borderRadius: 18,

    paddingTop: 16,
    paddingBottom: 12,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.18,
    shadowRadius: 12,

    elevation: 8,
  },

  dateModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 18,
    paddingBottom: 10,
  },

  dateModalTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#16243A",
  },

  dateModalCancel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#174F8A",
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

  addMenu: {
    position: "absolute",
    right: 16,
    top: 64,
    overflow: "hidden",
    width: 145,
    backgroundColor: "#FFFFFF",
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#DCE4ED",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.14,
    shadowRadius: 7,
    elevation: 6,
    zIndex: 1000,
  },

  addMenuDismissArea: {
    position: "absolute",

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: "transparent",

    zIndex: 1000,
  },

  addMenuOption: {
    minHeight: 43,
    paddingHorizontal: 14,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F6",
  },

  addMenuText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#26364B",
  },
});