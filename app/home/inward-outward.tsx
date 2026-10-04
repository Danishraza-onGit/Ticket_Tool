import React, {
  useMemo,
  useState,
} from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  // TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
} from "react-native-safe-area-context";
import { COLORS } from "../../constants/colors";


import InwardOutwardCard from "../../components/admin/inward-outward/InwardOutwardCard";
import LocationFilter from "../../components/admin/inward-outward/LocationFilter";
import BackHeader from "../../components/admin/navigation/BackHeader";

import {
  temporaryInwardOutwardItems,
} from "../../data/inwardOutward";

import type {
  LocationFilterValue,
} from "../../types/inwardOutward";

export default function InwardOutwardScreen() {
  const router = useRouter();

  const [searchText, setSearchText] =
    useState("");

  const [locationFilter, setLocationFilter] =
    useState<LocationFilterValue>(
      "All Locations"
    );

  const filteredItems = useMemo(() => {
    const query =
      searchText.trim().toLowerCase();

    return temporaryInwardOutwardItems.filter(
      (item) => {
        const matchesLocation =
          locationFilter === "All Locations" ||
          item.location === locationFilter;

        const matchesSearch =
          !query ||
          item.ticketNo
            .toLowerCase()
            .includes(query) ||
          item.company
            .toLowerCase()
            .includes(query) ||
          item.serialNumbers
            .toLowerCase()
            .includes(query);

        return (
          matchesLocation &&
          matchesSearch
        );
      }
    );
  }, [
    searchText,
    locationFilter,
  ]);

  const handleTicketPress = (
    ticketNo: string
  ) => {
    router.push({
      pathname: "/home/ticket-details",
      params: {
        ticketNo,
      },
    });
  };

  return (
    <SafeAreaView
      style={styles.screen}
      edges={["top"]}
    >
      <StatusBar style="dark" />

      <BackHeader
        title="Inwards/Outwards"
        onBackPress={() => router.back()}
      />

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <InwardOutwardCard
            item={item}
            onTicketPress={() =>
              handleTicketPress(
                item.ticketNo
              )
            }
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.listContent
        }
        ListHeaderComponent={
          <>
            <View style={styles.intro}>
              <Text style={styles.title}>
                Inward/Outward
              </Text>

              <Text style={styles.subtitle}>
                Track inward/outward movement and
                in-house vs. outsourced repair status.
              </Text>
            </View>

            <View style={styles.filters}>
              <View style={styles.searchContainer}>
                <Ionicons
                  name="search-outline"
                  size={17}
                  color={COLORS.iconGrey}
                />

                <TextInput
                  style={styles.searchInput}
                  value={searchText}
                  onChangeText={setSearchText}
                  placeholder="Ticket no, company, or serial number"
                  placeholderTextColor={COLORS.iconGrey}
                  autoCapitalize="none"
                  returnKeyType="search"
                />
              </View>

              <LocationFilter
                value={locationFilter}
                onChange={setLocationFilter}
              />
            </View>

            <Text style={styles.resultText}>
              Showing {filteredItems.length} items
            </Text>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons
              name="swap-horizontal-outline"
              size={25}
              color={COLORS.navigationActive}
            />

            <Text style={styles.emptyTitle}>
              No records found
            </Text>

            <Text style={styles.emptyText}>
              Try changing the search or location filter.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // header: {
  //   height: 60,
  //   backgroundColor: COLORS.white,
  //   borderBottomWidth: 1,
  //   borderBottomColor: COLORS.border,

  //   paddingHorizontal: 16,

  //   flexDirection: "row",
  //   alignItems: "center",
  // },

  // backButton: {
  //   width: 36,
  //   height: 36,
  //   borderRadius: 11,

  //   borderWidth: 1,
  //   borderColor: COLORS.border,

  //   alignItems: "center",
  //   justifyContent: "center",
  // },

  // headerTitle: {
  //   marginLeft: 12,

  //   fontSize: 16,
  //   fontWeight: "700",
  //   color: COLORS.textPrimary,
  // },

  // headerUserBadge: {
  //   marginLeft: "auto",

  //   height: 32,
  //   borderRadius: 16,

  //   borderWidth: 1,
  //   borderColor: COLORS.border,
  //   backgroundColor: COLORS.background,

  //   paddingLeft: 4,
  //   paddingRight: 10,

  //   flexDirection: "row",
  //   alignItems: "center",
  //   gap: 6,
  // },

  // headerAvatar: {
  //   width: 24,
  //   height: 24,
  //   borderRadius: 12,

  //   backgroundColor: COLORS.textPrimary,

  //   alignItems: "center",
  //   justifyContent: "center",
  // },

  // headerInitials: {
  //   fontSize: 9,
  //   fontWeight: "700",
  //   color: COLORS.white,
  // },

  // headerRole: {
  //   fontSize: 9,
  //   fontWeight: "600",
  //   color: COLORS.background,
  // },

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 32,
  },

  intro: {
    marginBottom: 14,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },

  subtitle: {
    marginTop: 4,

    fontSize: 11,
    lineHeight: 16,
    color: COLORS.textPrimary,
  },

  filters: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,

    marginBottom: 12,

  },

  searchContainer: {
    flex: 1,
    height: 40,

    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,

    backgroundColor: COLORS.white,

    paddingHorizontal: 10,

    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  searchInput: {
    flex: 1,
    height: "100%",

    fontSize: 10.5,
    color: COLORS.textPrimary,
  },

  resultText: {
    marginBottom: 9,

    fontSize: 9.5,
    fontWeight: "500",
    color: COLORS.textPrimary,
  },

  emptyState: {
    minHeight: 180,

    backgroundColor: COLORS.background,

    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,

    alignItems: "center",
    justifyContent: "center",

    padding: 24,
  },

  emptyTitle: {
    marginTop: 8,

    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },

  emptyText: {
    marginTop: 4,

    fontSize: 10,
    color: COLORS.textPrimary,
  },
});