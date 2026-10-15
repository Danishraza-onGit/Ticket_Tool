import React, { useEffect, useState } from "react";
import {
  ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet,
  Text, TouchableOpacity, View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchCustomer, type CustomerDetailsResponse } from "../../../api/customers";
import { displayValue, mapCustomerTicket } from "../../../utils/customerMappers";
import type { Customer, CustomerTicket } from "../../../types/customer";
import { COLORS } from "../../../constants/colors";
import CustomerTicketCard from "./CustomerTicketCard";

type Props = {
  visible: boolean;
  customer: Customer;
  onClose: () => void;
  onTicketPress: (ticket: CustomerTicket) => void;
};

export default function CustomerDetailsModal({ visible, customer, onClose, onTicketPress }: Props) {
  const insets = useSafeAreaInsets();
  const [details, setDetails] = useState<CustomerDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!visible) return;
    let active = true;
    fetchCustomer(Number(customer.id))
      .then((response) => {
        if (!active) return;
        setDetails(response);
        setError(null);
        setIsLoading(false);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        console.log("Customer details API error:", reason);
        setError("Unable to load customer details.");
        setIsLoading(false);
      });
    return () => { active = false; };
  }, [customer.id, visible, attempt]);

  const fields = details?.customer;
  const tickets = details?.tickets.map(mapCustomerTicket) ?? [];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={styles.heading}>
              <Text style={styles.eyebrow}>CUSTOMER</Text>
              <Text style={styles.title} numberOfLines={2}>{fields?.name ?? customer.company}</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose} accessibilityLabel="Close customer details">
              <Ionicons name="close" size={19} color={COLORS.iconGrey} />
            </TouchableOpacity>
          </View>
          {isLoading ? (
            <View style={styles.centerState}>
              <ActivityIndicator color={COLORS.navigationActive} />
              <Text style={styles.emptyText}>Loading customer details...</Text>
            </View>
          ) : error ? (
            <View style={styles.centerState}>
              <Text style={styles.emptyText}>{error}</Text>
              <TouchableOpacity onPress={() => { setIsLoading(true); setAttempt((v) => v + 1); }}>
                <Text style={styles.retryText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
              <View style={styles.infoCard}>
                <Text style={styles.sectionTitle}>Customer Information</Text>
                <InfoRow label="COMPANY NAME" value={fields?.name} />
                <InfoRow label="CONTACT PERSON" value={fields?.contactName} />
                <InfoRow label="PHONE" value={fields?.contactNo} />
                <InfoRow label="EMAIL" value={fields?.emailId} />
                <InfoRow label="ADDRESS" value={fields?.address} />
              </View>
              <View style={styles.ticketHeader}>
                <Text style={styles.sectionTitle}>Tickets</Text>
                <Text style={styles.ticketCount}>{tickets.length}</Text>
              </View>
              {tickets.length > 0 ? tickets.map((ticket) => (
                <CustomerTicketCard
                  key={ticket.srNo ?? ticket.ticketNo}
                  ticket={ticket}
                  onTicketPress={() => onTicketPress(ticket)}
                />
              )) : (
                <View style={styles.emptyTickets}>
                  <Ionicons name="ticket-outline" size={21} color={COLORS.border} />
                  <Text style={styles.emptyText}>No tickets logged for this customer yet.</Text>
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} selectable>{displayValue(value)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end", backgroundColor: COLORS.overlay },
  sheet: {
    height: "86%", backgroundColor: COLORS.background, borderTopLeftRadius: 22,
    borderTopRightRadius: 22, paddingHorizontal: 16, paddingTop: 8,
  },
  handle: { width: 42, height: 4, borderRadius: 2, backgroundColor: COLORS.border, alignSelf: "center", marginBottom: 14 },
  header: { flexDirection: "row", alignItems: "center", paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  heading: { flex: 1, paddingRight: 12 },
  eyebrow: { fontSize: 8, fontWeight: "700", letterSpacing: 0.7, color: COLORS.textPrimary },
  title: { marginTop: 3, fontSize: 17, fontWeight: "700", color: COLORS.navigationActive },
  closeButton: {
    width: 32, height: 32, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border,
    backgroundColor: COLORS.background, alignItems: "center", justifyContent: "center",
  },
  content: { paddingTop: 14, paddingBottom: 24 },
  infoCard: { backgroundColor: COLORS.white, borderRadius: 13, borderWidth: 1, borderColor: COLORS.border, padding: 14 },
  sectionTitle: { fontSize: 12, fontWeight: "700", color: COLORS.black },
  infoItem: { marginTop: 13 },
  infoLabel: { fontSize: 8, fontWeight: "700", color: COLORS.textPrimary },
  infoValue: { marginTop: 4, fontSize: 11, lineHeight: 16, color: COLORS.textPrimary },
  ticketHeader: { marginTop: 18, marginBottom: 9, flexDirection: "row", alignItems: "center" },
  ticketCount: { marginLeft: 7, minWidth: 21, height: 21, borderRadius: 11, backgroundColor: COLORS.white, textAlign: "center", lineHeight: 21, fontSize: 9, fontWeight: "700", color: COLORS.navigationActive },
  emptyTickets: { height: 100, backgroundColor: COLORS.white, borderRadius: 13, borderWidth: 1, borderColor: COLORS.border, alignItems: "center", justifyContent: "center", gap: 7 },
  emptyText: { fontSize: 11, color: COLORS.textNeutral, textAlign: "center" },
  centerState: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, paddingHorizontal: 20 },
  retryText: { fontSize: 12, fontWeight: "700", color: COLORS.navigationActive },
});
