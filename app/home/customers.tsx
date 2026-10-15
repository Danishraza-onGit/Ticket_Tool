import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator, RefreshControl, ScrollView, StyleSheet,
  Text, TouchableOpacity, View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { fetchCustomers } from "../../api/customers";
import type { CustomerListResponse } from "../../api/customers";
import { mapCustomer } from "../../utils/customerMappers";
import type { Customer, CustomerTicket } from "../../types/customer";
import CustomerCard from "../../components/admin/customers/CustomerCard";
import CustomerSearchBar from "../../components/admin/customers/CustomerSearchBar";
import CustomerDetailsModal from "../../components/admin/customers/CustomerDetailsModal";
import BackHeader from "../../components/admin/navigation/BackHeader";
import { COLORS } from "../../constants/colors";

const PAGE_SIZE = 7;

export default function CustomersScreen() {
  const router = useRouter();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [response, setResponse] = useState<CustomerListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [, setRefreshCount] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(searchText.trim()), 300);
    return () => clearTimeout(timeout);
  }, [searchText]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      fetchCustomers({ search: debouncedSearch || undefined, page, pageSize: PAGE_SIZE })
        .then((result) => {
          if (!active) return;
          setResponse(result);
          setLoadError(null);
          setIsLoading(false);
          setIsRefreshing(false);
        })
        .catch((reason: unknown) => {
          if (!active) return;
          console.log("Customers API error:", reason);
          setLoadError("Unable to load customers.");
          setIsLoading(false);
          setIsRefreshing(false);
        });
      return () => { active = false; };
    }, [debouncedSearch, page])
  );

  const customers = useMemo(() => (response?.customers ?? []).map(mapCustomer), [response]);
  const totalPages = Math.max(1, Math.ceil((response?.total ?? 0) / PAGE_SIZE));

  const handleSearchChange = (value: string) => {
    setSearchText(value);
    setPage(1);
    setIsLoading(true);
  };

  const changePage = (next: number) => {
    if (next < 1 || next > totalPages || next === page) return;
    setPage(next);
    setIsLoading(true);
  };

  const refresh = () => {
    setIsRefreshing(true);
    setRefreshCount((v) => v + 1);
  };

  const openTicket = (ticket: CustomerTicket) => {
    if (ticket.srNo === undefined) return;
    setSelectedCustomer(null);
    // Confirm that /home/ticket-details reads a param named "srNo".
    router.push({
      pathname: "/home/ticket-details",
      params: { srNo: String(ticket.srNo) },
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <BackHeader title="Customers" onBackPress={() => router.back()} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor={COLORS.navigationActive} />
        }
      >
        <CustomerSearchBar value={searchText} onChangeText={handleSearchChange} />
        {isLoading ? (
          <View style={styles.state}>
            <ActivityIndicator color={COLORS.navigationActive} />
            <Text style={styles.stateText}>Loading customers...</Text>
          </View>
        ) : loadError ? (
          <View style={styles.state}>
            <Ionicons name="alert-circle-outline" color={COLORS.danger} size={24} />
            <Text style={styles.stateText}>{loadError}</Text>
            <TouchableOpacity onPress={() => { setIsLoading(true); setRefreshCount((v) => v + 1); }}>
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.customerList}>
              {customers.length ? customers.map((customer) => (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  onCompanyPress={() => setSelectedCustomer(customer)}
                />
              )) : (
                <View style={styles.emptyState}>
                  <Ionicons name="search-outline" size={22} color={COLORS.textMuted} />
                  <Text style={styles.stateText}>
                    {debouncedSearch ? "No matching customers found." : "No customers available."}
                  </Text>
                </View>
              )}
            </View>
            {(response?.total ?? 0) > 0 && (
              <View style={styles.pagination}>
                <Text style={styles.pageInfo}>
                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, response?.total ?? 0)} of {response?.total ?? 0}
                </Text>
                <View style={styles.pageActions}>
                  <TouchableOpacity
                    style={[styles.pageButton, page === 1 && styles.disabledButton]}
                    onPress={() => changePage(page - 1)}
                    disabled={page === 1}
                  >
                    <Text style={styles.pageButtonText}>Prev</Text>
                  </TouchableOpacity>
                  <Text style={styles.pageLabel}>{page} / {totalPages}</Text>
                  <TouchableOpacity
                    style={[styles.pageButton, page === totalPages && styles.disabledButton]}
                    onPress={() => changePage(page + 1)}
                    disabled={page === totalPages}
                  >
                    <Text style={styles.pageButtonText}>Next</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
      {selectedCustomer !== null && (
        <CustomerDetailsModal
          key={selectedCustomer.id}
          visible
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onTicketPress={openTicket}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scrollView: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 32 },
  customerList: { marginTop: 12 },
  state: { minHeight: 180, alignItems: "center", justifyContent: "center", gap: 12, paddingHorizontal: 24 },
  stateText: { fontSize: 11, color: COLORS.textNeutral, textAlign: "center" },
  retryText: { fontSize: 12, fontWeight: "700", color: COLORS.navigationActive },
  emptyState: {
    minHeight: 130, borderRadius: 13, borderWidth: 1, borderColor: COLORS.border,
    backgroundColor: COLORS.white, alignItems: "center", justifyContent: "center", gap: 8,
  },
  pagination: { marginTop: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 },
  pageInfo: { fontSize: 10, color: COLORS.textNeutral },
  pageActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  pageButton: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, backgroundColor: COLORS.white, paddingHorizontal: 11, paddingVertical: 7 },
  disabledButton: { opacity: 0.45 },
  pageButtonText: { fontSize: 11, color: COLORS.navigationActive, fontWeight: "600" },
  pageLabel: { fontSize: 10, color: COLORS.textPrimary },
});
