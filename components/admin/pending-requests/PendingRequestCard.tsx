import React from "react";
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../constants/colors";
import { getInitials } from "../../../utils/getInitials";
import type { TicketRequest } from "../../../types/ticketRequest";


type Props = {
  request: TicketRequest;
  busy?: boolean;
  showNewBadge?: boolean;
  onConvert: () => void;
  onDiscard: () => void;
};

function formatSubmitted(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  });
}

async function launchContact(url: string, kind: "phone" | "email") {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert("Unable to open app", `No compatible ${kind === "phone" ? "calling" : "email"} app is available.`);
  }
}

export default function PendingRequestCard({
  request, busy = false, showNewBadge = false, onConvert, onDiscard,
}: Props) {
  const email = request.emailId?.trim() ?? "";
  const phone = request.contactNo?.trim() ?? "";

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(request.companyName)}</Text>
        </View>
        <View style={styles.identity}>
          <Text selectable style={styles.company}>{request.companyName}</Text>
          <Text selectable style={styles.contact}>{request.contactName}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text selectable style={styles.date}>{formatSubmitted(request.createdAt)}</Text>
          {showNewBadge && (
            <View style={styles.newBadge}><Text style={styles.newText}>NEW</Text></View>
          )}
        </View>
      </View>

      <View style={styles.divider}></View>
      <View style={styles.contactSection}>
        {Boolean(email) && (
          <View style={styles.contactRow}>
            <TouchableOpacity
              onPress={() => void launchContact(`mailto:${email}`, "email")}
              style={styles.contactIconButton}
              accessibilityRole="button"
              accessibilityLabel={`Compose email to ${email}`}
            >
              <Ionicons name="mail-outline" size={16} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <Text selectable style={styles.contactText}>{email}</Text>
          </View>
        )}
        {Boolean(phone) && (
          <View style={styles.contactRow}>
            <TouchableOpacity
              onPress={() => void launchContact(`tel:${phone.replace(/[^+\d]/g, "")}`, "phone")}
              style={styles.contactIconButton}
              accessibilityRole="button"
              accessibilityLabel={`Call ${phone}`}
            >
              <Ionicons name="call-outline" size={16} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <Text selectable style={styles.contactText}>{phone}</Text>
          </View>
        )}
      </View>

      <View style={styles.divider} />
      <View style={styles.issueBox}>
        <Text style={styles.issueLabel}>ISSUE DETAILS</Text>
        <Text style={styles.issueText} selectable >{request.problem.length > 50
  ? `${request.problem.slice(0, 150)}...`
  : request.problem}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.discardButton, busy && styles.disabled]}
          disabled={busy} onPress={onDiscard} activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel={`Discard request from ${request.companyName}`}
        >
          <Ionicons name="trash-outline" size={15} color={COLORS.danger} />
          <Text style={styles.discardText}>Discard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.convertButton, busy && styles.disabled]}
          disabled={busy} onPress={onConvert} activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel={`Convert request from ${request.companyName} to a ticket`}
        >
          <Ionicons name="ticket-outline" size={15} color={COLORS.white} />
          <Text style={styles.convertText}>Convert</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, padding: 13, marginBottom: 11 },
  header: { flexDirection: "row", alignItems: "flex-start" },
  avatar: { width: 44, height: 44, borderRadius: 12, backgroundColor: COLORS.avatarBackground, justifyContent: "center", alignItems: "center" },
  avatarText: { color: COLORS.white, fontSize: 14, fontWeight: "700" },
  identity: { flex: 1, minWidth: 0, marginLeft: 10, marginRight: 6 },
  company: { fontSize: 14, fontWeight: "700", color: COLORS.textPrimary, marginTop : 4, },
  contact: { marginTop: 1, fontSize: 11, color: COLORS.textPrimary },
  headerRight: { maxWidth: "42%", alignItems: "flex-end" },
  date: { fontSize: 9, color: COLORS.textPrimary, textAlign: "right" },
  newBadge: { marginTop: 8, borderWidth: 1, borderColor: COLORS.statusInProgressBorder, borderRadius: 11, paddingHorizontal: 10, paddingVertical: 3, backgroundColor: COLORS.statusInProgressBackground },
  newText: { fontSize: 9, fontWeight: "700", color: COLORS.statusInProgressText },
  contactSection: { marginTop: 0, gap: 0 },
  contactRow: { flexDirection: "row", alignItems: "center", minHeight: 20 },
  contactIconButton: { width: 27, height: 25, alignItems: "flex-start", justifyContent: "center" },
  contactText: { flex: 1, fontSize: 11, color: COLORS.textPrimary, lineHeight: 17 },
  divider: { height: 1, backgroundColor: COLORS.divider, marginTop: 8, marginBottom: 4 },
  issueBox: { borderLeftWidth: 2, borderLeftColor: COLORS.navigationActive, paddingLeft: 11, paddingVertical: 3 },
  issueLabel: { fontSize: 9, letterSpacing: 0.65, fontWeight: "700", color: COLORS.textPrimary },
  issueText: { marginTop: 5, fontSize: 11, lineHeight: 17, color: COLORS.textSecondary },
  actions: { flexDirection: "row", gap: 9, marginTop: 15 },
  discardButton: { flex: 1, minHeight: 41, flexDirection: "row", gap: 7, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, backgroundColor: COLORS.white },
  discardText: { fontSize: 11, fontWeight: "700", color: COLORS.danger },
  convertButton: { flex: 1, minHeight: 41, flexDirection: "row", gap: 7, alignItems: "center", justifyContent: "center", borderRadius: 10, backgroundColor: COLORS.navigationActive },
  convertText: { fontSize: 11, fontWeight: "700", color: COLORS.white },
  disabled: { opacity: 0.55 },
});
