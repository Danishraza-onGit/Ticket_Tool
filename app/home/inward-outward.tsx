import React, {
  useMemo,
  useState,
} from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
} from "react-native-safe-area-context";

import InwardOutwardCard from "../../components/inward-outward/InwardOutwardCard";
import LocationFilter from "../../components/inward-outward/LocationFilter";

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

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-back"
            size={20}
            color="#3729AD"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Inward/Outward
        </Text>

        <TouchableOpacity
          style={styles.headerUserBadge}
          onPress={() =>
            router.push("/home/account")
          }
          activeOpacity={0.7}
        >
          <View style={styles.headerAvatar}>
            <Text style={styles.headerInitials}>
              SH
            </Text>
          </View>

          <Text style={styles.headerRole}>
            Admin
          </Text>
        </TouchableOpacity>
      </View>

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
                  color="#2a2a2b"
                />

                <TextInput
                  style={styles.searchInput}
                  value={searchText}
                  onChangeText={setSearchText}
                  placeholder="Ticket no, company, or serial number"
                  placeholderTextColor="#2a2a2b"
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
              color="#3729AD"
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
    backgroundColor: "#F4F7FB",
  },

  header: {
    height: 60,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E1E7EF",

    paddingHorizontal: 16,

    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    width: 36,
    height: 36,
    borderRadius: 11,

    borderWidth: 1,
    borderColor: "#DCE4ED",

    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    marginLeft: 12,

    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },

  headerUserBadge: {
    marginLeft: "auto",

    height: 32,
    borderRadius: 16,

    borderWidth: 1,
    borderColor: "#DCE4ED",
    backgroundColor: "#FFFFFF",

    paddingLeft: 4,
    paddingRight: 10,

    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  headerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,

    backgroundColor: "#000000",

    alignItems: "center",
    justifyContent: "center",
  },

  headerInitials: {
    fontSize: 9,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  headerRole: {
    fontSize: 9,
    fontWeight: "600",
    color: "#2a2a2b",
  },

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
    color: "#000000",
  },

  subtitle: {
    marginTop: 4,

    fontSize: 11,
    lineHeight: 16,
    color: "#2a2a2b",
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
    borderColor: "#DCE4ED",
    borderRadius: 10,

    backgroundColor: "#FFFFFF",

    paddingHorizontal: 10,

    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  searchInput: {
    flex: 1,
    height: "100%",

    fontSize: 10.5,
    color: "#000000",
  },

  resultText: {
    marginBottom: 9,

    fontSize: 9.5,
    fontWeight: "500",
    color: "#2a2a2b",
  },

  emptyState: {
    minHeight: 180,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#DCE4ED",
    borderRadius: 12,

    alignItems: "center",
    justifyContent: "center",

    padding: 24,
  },

  emptyTitle: {
    marginTop: 8,

    fontSize: 13,
    fontWeight: "700",
    color: "#000000",
  },

  emptyText: {
    marginTop: 4,

    fontSize: 10,
    color: "#2a2a2b",
  },
});