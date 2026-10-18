import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchInventory, updateInventory } from "../../api/inwardOutward";
import { updateTicketStatus } from "../../api/tickets";
import InventoryEditModal from "../../components/admin/inward-outward/InventoryEditModal";
import InventoryTicketCard from "../../components/admin/inward-outward/InventoryTicketCard";
import BackHeader from "../../components/admin/navigation/BackHeader";
import { COLORS } from "../../constants/colors";
import type { InventoryItem, InventoryUpdateInput, RepairLocation } from "../../types/inwardOutward";

const PAGE_SIZE = 7;
const errorMessage = (error: unknown) => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const value = error as { response?: { data?: { error?: unknown } } };
    if (typeof value.response?.data?.error === "string") return value.response.data.error;
  }
  return "Please check your connection and try again.";
};
export default function InwardOutwardScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState<RepairLocation | undefined>();
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editing, setEditing] = useState<InventoryItem | null>(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => { const timer = setTimeout(() => { setPage(1); setQuery(search.trim()); }, 350); return () => clearTimeout(timer); }, [search]);
  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true); else setLoading(true);
    try {
      const result = await fetchInventory({ search: query || undefined, repairLocation: location, page, pageSize: PAGE_SIZE });
      setItems(result.items); setTotal(result.total); setLoadError(null);
    } catch (error) { setLoadError(errorMessage(error)); }
    finally { setLoading(false); setRefreshing(false); }
  }, [query, location, page]);
  useFocusEffect(useCallback(() => { void load(); }, [load]));
  const changeLocation = (next: RepairLocation | undefined) => { setLocation(next); setPage(1); };
  const openTicket = (item: InventoryItem) => router.push({ pathname: "/home/ticket-details", params: { srNo: String(item.srNo), ticketNo: item.ticketNo } });
  const save = async (input: InventoryUpdateInput) => {
    if (!editing || saving) return;
    const ticket = editing;
    const justDispatched = !ticket.outwardDate && Boolean(input.outwardDate);
    setSaving(true);
    try {
      await updateInventory(ticket.srNo, input);
      setEditing(null);
      await load(true);
      if (justDispatched) {
        Alert.alert("Close this ticket now?", "The product has been dispatched back to the customer. You can close the ticket now or later.", [
          { text: "Not now", style: "cancel" },
          {
            text: "Close Ticket", onPress: () => {
              void (async () => {
                try { await updateTicketStatus(ticket.srNo, "Closed"); Alert.alert("Ticket closed", `Ticket ${ticket.ticketNo} was closed successfully.`); }
                catch (error) { Alert.alert("Unable to close ticket", errorMessage(error)); }
              })();
            }
          },
        ]);
      } else { Alert.alert("Inventory updated", "The inward/outward information was saved."); }
    } catch (error) { Alert.alert("Unable to update Inventory", errorMessage(error)); }
    finally { setSaving(false); }
  };
  const renderItem = ({ item }: { item: InventoryItem }) => (
    <InventoryTicketCard
      key={item.srNo}
      item={item}
      onPressTicket={openTicket}
      onUpdate={(selectedItem) => {
        if (!selectedItem.outwardDate) {
          setEditing(selectedItem);
        }
      }}
    />
  );
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  return <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
    <BackHeader title="Inward/Outward" onBackPress={() => router.back()} />
    <FlatList
      data={items} renderItem={renderItem} keyExtractor={item => String(item.srNo)}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void load(true)} />}
      contentContainerStyle={styles.list}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={<View>
        <Text style={styles.title}>Inward/Outward</Text>
        <Text style={styles.subtitle}>Track device receipt, repair location and dispatch for inventory tickets.</Text>
        <View style={styles.searchBox}><Ionicons name="search-outline" size={18} color={COLORS.textMuted} /><TextInput value={search} onChangeText={setSearch} placeholder="Ticket, company or serial number" placeholderTextColor={COLORS.placeholder} style={styles.searchInput} returnKeyType="search" /></View>
        <View style={styles.filters}>{([undefined, "In-House", "Outsourced"] as const).map((value) => <Pressable key={value ?? "all"} onPress={() => changeLocation(value)} style={[styles.filter, location === value && styles.filterActive]}><Text style={[styles.filterText, location === value && styles.filterTextActive]}>{value ?? "All locations"}</Text></Pressable>)}</View>
        {loadError && <Pressable onPress={() => void load()} style={styles.error}><Text style={styles.errorText}>{loadError}  Tap to retry.</Text></Pressable>}
        <Text style={styles.count}>{total} inventory item{total === 1 ? "" : "s"}</Text>
      </View>}
      ListEmptyComponent={loading ? <ActivityIndicator style={{ marginTop: 40 }} color={COLORS.navigationActive} /> : <Text style={styles.empty}>No inventory items found. Eligible tickets appear here after choosing Add to Inward/Outward.</Text>}
      ListFooterComponent={total > PAGE_SIZE ? <View style={styles.pagination}>
        <Pressable disabled={page <= 1 || loading} onPress={() => setPage(p => p - 1)} style={styles.pageButton}><Text style={styles.pageText}>Previous</Text></Pressable>
        <Text style={styles.pageText}>Page {page} of {pages}</Text>
        <Pressable disabled={page >= pages || loading} onPress={() => setPage(p => p + 1)} style={styles.pageButton}><Text style={styles.pageText}>Next</Text></Pressable>
      </View> : null}
    />
    {editing && (
      <InventoryEditModal key={editing.srNo} item={editing} busy={saving} onClose={() => { if (!saving) setEditing(null); }} onSave={save} />
    )}
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  list: { paddingHorizontal: 16, paddingVertical: 16, paddingBottom: 50 },
  title: { fontSize: 19, fontWeight: "700", color: COLORS.textDark },
  subtitle: { fontSize: 12, lineHeight: 18, color: COLORS.textMuted, marginTop: 5, marginBottom: 16 },
  searchBox: { minHeight: 44, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, flexDirection: "row", alignItems: "center", paddingHorizontal: 12, gap: 8 },
  searchInput: { flex: 1, fontSize: 13, color: COLORS.textPrimary },
  filters: { flexDirection: "row", gap: 6, marginTop: 12, marginBottom: 15 },
  filter: { paddingVertical: 9, paddingHorizontal: 10, borderRadius: 9, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.white },
  filterActive: { backgroundColor: COLORS.navigationActive, borderColor: COLORS.navigationActive },
  filterText: { fontSize: 11, fontWeight: "600", color: COLORS.textBody },
  filterTextActive: { color: COLORS.white },
  count: { fontSize: 11, color: COLORS.textMuted, marginBottom: 10 },
  card: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 13, padding: 15, marginBottom: 12 },
  cardHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 8 },
  ticketNo: { color: COLORS.navigationActive, fontWeight: "700", fontSize: 14 },
  company: { color: COLORS.textDark, fontWeight: "600", fontSize: 13, marginTop: 5 },
  statusBadge: { borderRadius: 8, paddingVertical: 5, paddingHorizontal: 8, maxWidth: 145 },
  statusPending: { backgroundColor: "#FFF0CD" },
  statusComplete: { backgroundColor: "#DDF5E8" },
  statusText: { fontSize: 10, color: COLORS.textBody, fontWeight: "700", textAlign: "center" },
  divider: { height: 1, backgroundColor: COLORS.divider, marginVertical: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 10, marginBottom: 9 },
  field: { width: "38%", color: COLORS.textMuted, fontSize: 11 },
  value: { flex: 1, textAlign: "right", color: COLORS.textBody, fontSize: 12, fontWeight: "500" },
  updateButton: { backgroundColor: COLORS.navigationActive, borderRadius: 9, minHeight: 38, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 8 },
  completedButton: { backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border },
  updateText: { fontSize: 12, fontWeight: "700", color: COLORS.white },
  empty: { fontSize: 13, color: COLORS.textMuted, textAlign: "center", lineHeight: 20, marginTop: 35 },
  error: { padding: 12, backgroundColor: "#FFF0F0", borderRadius: 9, marginBottom: 10 },
  errorText: { fontSize: 12, color: COLORS.danger },
  pagination: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 10 }, pageButton: { borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 13, paddingVertical: 10, borderRadius: 8, backgroundColor: COLORS.white },
  pageText: { fontSize: 12, color: COLORS.textBody },
});
