import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CustomerTicketCard from "./CustomerTicketCard";
import {temporaryTickets} from "../../../data/tickets";
import type {
  Customer,
  CustomerTicket,
} from "../../../types/customer";
import { COLORS } from "@/constants/colors";

type CustomerDetailsModalProps = {
  visible: boolean;
  customer: Customer | null;
  onClose: () => void;
  onTicketPress: (
    ticket: CustomerTicket
  ) => void;
};

export default function CustomerDetailsModal({
  visible,
  customer,
  onClose,
  onTicketPress,
}: CustomerDetailsModalProps) {

  const customerTickets =
  customer
    ? temporaryTickets.filter(
        (ticket) =>
          ticket.customerId === customer.id
      )
    : [];

  const insets = useSafeAreaInsets();

  if (!customer) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />

        <View
          style={[
            styles.sheet,
            {
              paddingBottom:
                Math.max(insets.bottom, 16),
            },
          ]}
        >
          <View style={styles.handle} />

          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>
                CUSTOMER
              </Text>

              <Text
                style={styles.title}
                numberOfLines={1}
              >
                {customer.company}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons
                name="close"
                size={19}
                color={COLORS.textSubtle}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={
              styles.content
            }
          >
            <View style={styles.infoCard}>
              <Text style={styles.sectionTitle}>
                Customer Information
              </Text>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>
                  COMPANY NAME
                </Text>

                <Text
                  style={styles.infoValue}
                  selectable
                >
                  {customer.company}
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>
                  CONTACT PERSON
                </Text>

                <Text
                  style={styles.infoValue}
                  selectable
                >
                  {customer.contactName}
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>
                  PHONE
                </Text>

                <Text
                  style={styles.infoValue}
                  selectable
                >
                  {customer.contactNo}
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>
                  EMAIL
                </Text>

                <Text
                  style={styles.infoValue}
                  selectable
                >
                  {customer.email || "—"}
                </Text>
              </View>

              <View
                style={[
                  styles.infoItem,
                  styles.lastInfoItem,
                ]}
              >
                <Text style={styles.infoLabel}>
                  ADDRESS
                </Text>

                <Text
                  style={styles.infoValue}
                  selectable
                >
                  {customer.address || "—"}
                </Text>
              </View>
            </View>

            <View style={styles.ticketHeader}>
              <Text style={styles.sectionTitle}>
                Tickets
              </Text>

              <Text style={styles.ticketCount}>
                {customerTickets.length}
              </Text>
            </View>

            {customerTickets.length > 0 ? (
              customerTickets.map((ticket) => (
                <CustomerTicketCard
                  key={ticket.ticketNo}
                  ticket={ticket}
                  onTicketPress={() =>
                    onTicketPress(ticket)
                  }
                />
              ))
            ) : (
              <View style={styles.emptyTickets}>
                <Ionicons
                  name="ticket-outline"
                  size={21}
                  color={COLORS.border}
                />

                <Text style={styles.emptyText}>
                  No ticket details available yet.
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(15, 25, 40, 0.35)",
  },

  sheet: {
    height: "86%",
    backgroundColor: COLORS.background,

    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,

    paddingHorizontal: 16,
    paddingTop: 8,
  },

  handle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: "center",
    marginBottom: 14,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 14,

    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  eyebrow: {
    fontSize: 7.5,
    fontWeight: "700",
    letterSpacing: 0.7,
    color: COLORS.black,
  },

  title: {
    marginTop: 3,
    maxWidth: 270,
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.navigationActive,
  },

  closeButton: {
    marginLeft: "auto",

    width: 32,
    height: 32,
    borderRadius: 10,

    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,

    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    paddingTop: 14,
    paddingBottom: 24,
  },

  infoCard: {
    backgroundColor: COLORS.background,
    borderRadius: 13,

    borderWidth: 1,
    borderColor: COLORS.border,

    padding: 14,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.black,
  },

  infoItem: {
    marginTop: 13,
  },

  lastInfoItem: {
    paddingBottom: 2,
  },

  infoLabel: {
    fontSize: 7.5,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },

  infoValue: {
    marginTop: 4,
    fontSize: 10.5,
    lineHeight: 15,
    color: COLORS.textPrimary,
  },

  ticketHeader: {
    marginTop: 18,
    marginBottom: 9,

    flexDirection: "row",
    alignItems: "center",
  },

  ticketCount: {
    marginLeft: 7,

    minWidth: 21,
    height: 21,
    borderRadius: 11,

    backgroundColor: COLORS.background,

    textAlign: "center",
    lineHeight: 21,

    fontSize: 9,
    fontWeight: "700",
    color: COLORS.navigationActive,
  },

  emptyTickets: {
    height: 100,

    backgroundColor: COLORS.background,
    borderRadius: 13,

    borderWidth: 1,
    borderColor: COLORS.border,

    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  emptyText: {
    fontSize: 10,
    color: COLORS.textNeutral,
  },
});