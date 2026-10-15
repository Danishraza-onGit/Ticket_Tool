import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator, Alert, FlatList, RefreshControl,
  StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "../../constants/colors";
import { discardTicketRequest, fetchPendingRequests } from "../../api/ticketRequests";
import type { TicketRequest } from "../../types/ticketRequest";
import BackHeader from "../../components/admin/navigation/BackHeader";
import PendingRequestCard from "../../components/admin/pending-requests/PendingRequestCard";
import { getViewedRequestIds, markRequestsViewed } from "../../utils/pendingRequestViewed";
import { publishPendingRequestCount } from "../../utils/pendingRequestsSignal";

export default function PendingRequestsScreen() {
  const router = useRouter();
  const requestSequence = useRef(0);
  const visibleIdsRef = useRef<number[]>([]);
  const [viewedIds, setViewedIds] = useState<Set<number>>(new Set());
  const [requests, setRequests] = useState<TicketRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadRequests = useCallback(async (refresh = false) => {
    const sequence = ++requestSequence.current;
    if (refresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const [data, viewed] = await Promise.all([fetchPendingRequests(), getViewedRequestIds()]);
      if (sequence === requestSequence.current) {
        setRequests(data);
        publishPendingRequestCount(data.length);
        setViewedIds(viewed);
        visibleIdsRef.current = data.map((item) => item.id);
      }
    } catch (err) {
      console.error("Pending requests API error:", err);
      if (sequence === requestSequence.current) setError("Unable to load pending requests.");
    } finally {
      if (sequence === requestSequence.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useFocusEffect(useCallback(() => {
    void loadRequests();
    return () => {
      requestSequence.current += 1;
      void markRequestsViewed(visibleIdsRef.current);
      visibleIdsRef.current = [];
    };
  }, [loadRequests]));

  const handleDiscard = async (id: number) => {
    if (busyId !== null) return;
    setBusyId(id);
    try {
      await discardTicketRequest(id);
      await loadRequests(true);
    } catch (err) {
      console.error("Discard pending request error:", err);
      Alert.alert("Unable to Discard", "The request may already have been reviewed. Please refresh and try again.");
      await loadRequests(true);
    } finally {
      setBusyId(null);
    }
  };

  const confirmDiscard = (request: TicketRequest) => {
    Alert.alert(
      "Discard this request?",
      "This removes it from the queue without creating a ticket. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Discard", style: "destructive", onPress: () => void handleDiscard(request.id) },
      ]
    );
  };

  const handleConvert = (request: TicketRequest) => {
    router.push({ pathname: "/home/new-ticket", params: { fromRequest: String(request.id) } });
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <StatusBar style="dark" />
      <BackHeader title="Pending Requests" onBackPress={() => router.back()} />
      <FlatList
        data={error ? [] : requests}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => void loadRequests(true)} tintColor={COLORS.navigationActive} />
        }
        ListHeaderComponent={
          <View style={styles.intro}>
            <Text style={styles.title}>Pending Requests</Text>
            <Text style={styles.subtitle}>
              Submissions from the public &quot;Request a Ticket&quot; form. Convert to a ticket, or discard spam and duplicates.
            </Text>
            {!loading && !error && requests.length > 0 && (
              <Text style={styles.count}>{requests.length} pending</Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <PendingRequestCard
            request={item}
            busy={busyId !== null}
            showNewBadge={!viewedIds.has(item.id)}
            onConvert={() => handleConvert(item)}
            onDiscard={() => confirmDiscard(item)}
          />
        )}
        ListEmptyComponent={loading ? (
          <View style={styles.centerState}>
            <ActivityIndicator color={COLORS.navigationActive} />
            <Text style={styles.stateText}>Loading pending requests...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerState}>
            <Ionicons name="alert-circle-outline" size={25} color={COLORS.danger} />
            <Text style={styles.stateText}>{error}</Text>
            <TouchableOpacity onPress={() => void loadRequests()}>
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons name="file-tray-outline" size={24} color={COLORS.navigationActive} />
            </View>
            <Text style={styles.emptyTitle}>No pending requests</Text>
            <Text style={styles.emptyDescription}>
              New public ticket requests will appear here when customers submit them.
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { flexGrow: 1, paddingHorizontal: 16, paddingTop: 18, paddingBottom: 36 },
  intro: { marginBottom: 18 },
  title: { fontSize: 19, fontWeight: "700", color: COLORS.textPrimary },
  subtitle: { marginTop: 5, fontSize: 11, lineHeight: 17, color: COLORS.textNeutral },
  count: { marginTop: 10, fontSize: 11, fontWeight: "600", color: COLORS.navigationActive },
  centerState: { minHeight: 180, alignItems: "center", justifyContent: "center", gap: 11, padding: 20 },
  stateText: { fontSize: 11, color: COLORS.textSecondary, textAlign: "center" },
  retryText: { fontSize: 12, fontWeight: "700", color: COLORS.navigationActive },
  emptyCard: { minHeight: 185, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, padding: 24, alignItems: "center", justifyContent: "center" },
  emptyIcon: { width: 46, height: 46, borderRadius: 13, backgroundColor: COLORS.background, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  emptyTitle: { fontSize: 13, fontWeight: "700", color: COLORS.textPrimary },
  emptyDescription: { maxWidth: 270, marginTop: 6, textAlign: "center", fontSize: 10.5, lineHeight: 16, color: COLORS.textNeutral },
});
