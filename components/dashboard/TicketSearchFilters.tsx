import React, { useState } from "react";

import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";

import SearchBar from "./SearchBar";
import FilterChip from "./FilterChip";
import FilterDropdown from "./FilterDropdown";

import type {
  DashboardFilters,
  FilterKey,
} from "../../types/dashboardFilters";

/* =========================================================
   TYPES
========================================================= */

type FilterOptions = Record<FilterKey, string[]>;

type TicketSearchFiltersProps = {
  searchText: string;

  filters: DashboardFilters;

  filterOptions: FilterOptions;

  selectedFromDate: Date | null;

  onSearchTextChange: (text: string) => void;

  onSearch: () => void;

  onFilterChange: (
    key: FilterKey,
    value: string
  ) => void;

  onFromDateChange: (
    date: Date | null,
    formattedDate: string
  ) => void;

  onClear: () => void;
};

/* =========================================================
   COMPONENT
========================================================= */

export default function TicketSearchFilters({
  searchText,
  filters,
  filterOptions,
  selectedFromDate,
  onSearchTextChange,
  onSearch,
  onFilterChange,
  onFromDateChange,
  onClear,
}: TicketSearchFiltersProps) {
  const [activeFilter, setActiveFilter] =
    useState<FilterKey | null>(null);

  const [showDatePicker, setShowDatePicker] =
    useState(false);

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
     FILTER OPEN / CLOSE
  ======================================================= */

  const toggleFilter = (key: FilterKey) => {
    setActiveFilter((current) =>
      current === key ? null : key
    );
  };

  /* =======================================================
     FILTER SELECTION
  ======================================================= */

  const handleFilterSelect = (
    key: FilterKey,
    value: string
  ) => {
    onFilterChange(key, value);

    setActiveFilter(null);
  };

  /* =======================================================
     DATE FORMAT
  ======================================================= */

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

  /* =======================================================
     CLEAR
  ======================================================= */

  const handleClear = () => {
    setActiveFilter(null);
    setShowDatePicker(false);

    onClear();
  };

  /* =======================================================
     ACTIVE DROPDOWN POSITION
  ======================================================= */

  const activePosition =
    activeFilter
      ? filterPositions[activeFilter]
      : undefined;

  return (
    <View style={styles.container}>
      {/* =================================================
          SEARCH
      ================================================= */}

      <View style={styles.searchSection}>
        <SearchBar
          value={searchText}
          onChangeText={onSearchTextChange}
          onSearch={onSearch}
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
              value={
                filters.accountManager
              }
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
                toggleFilter(
                  "assignedTo"
                )
              }
            />
          </View>
          {/* ASSIGNED BY */}

          <View
            onLayout={(event) => {
              const { x, width } =
                event.nativeEvent.layout;

              measureFilter(
                "assignedBy",
                x,
                width
              );
            }}
          >
            <FilterChip
              label="Assigned By"
              value={filters.assignedBy}
              onPress={() =>
                toggleFilter(
                  "assignedBy"
                )
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
            value={
              filters.fromDate ||
              "All Date"
            }
            onPress={() => {
              setActiveFilter(null);
              setShowDatePicker(true);
            }}
          />

          {/* CLEAR */}

          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
            activeOpacity={0.6}
          >
            <Text style={styles.clearText}>
              Clear
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* =================================================
          ANDROID DATE PICKER
      ================================================= */}

      {showDatePicker &&
        Platform.OS === "android" && (
          <DateTimePicker
            value={
              selectedFromDate ||
              new Date()
            }
            mode="date"
            display="calendar"
            onChange={(event, date) => {
              setShowDatePicker(false);

              if (
                event.type === "dismissed"
              ) {
                return;
              }

              if (date) {
                onFromDateChange(
                  date,
                  formatDate(date)
                );
              }
            }}
          />
        )}

      {/* =================================================
          iOS DATE PICKER
      ================================================= */}

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
              <View
                style={styles.dateModalHeader}
              >
                <Text
                  style={styles.dateModalTitle}
                >
                  Select From Date
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    setShowDatePicker(false)
                  }
                  activeOpacity={0.7}
                >
                  <Text
                    style={
                      styles.dateModalCancel
                    }
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>

              <DateTimePicker
                value={
                  selectedFromDate ||
                  new Date()
                }
                mode="date"
                display="inline"
                accentColor="#174F8A"
                onChange={(event, date) => {
                  if (
                    event.type ===
                    "dismissed"
                  ) {
                    setShowDatePicker(
                      false
                    );

                    return;
                  }

                  if (date) {
                    onFromDateChange(
                      date,
                      formatDate(date)
                    );

                    setShowDatePicker(
                      false
                    );
                  }
                }}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* =================================================
          FILTER DISMISS LAYER
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
                filterOptions[
                activeFilter
                ]
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
    </View>
  );
}

/* =========================================================
   STYLES

   Copied from the current Dashboard implementation so
   extracting this component does not redesign the UI.
========================================================= */

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 30,
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
    bottom: -1000,

    backgroundColor: "transparent",

    zIndex: 40,
  },

  dropdownWrapper: {
    position: "absolute",

    top: 76,

    zIndex: 50,
  },

  dateModalOverlay: {
    flex: 1,

    backgroundColor:
      "rgba(0, 0, 0, 0.35)",

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
});