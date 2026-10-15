import React, { useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../constants/colors";
import type { AccountManager } from "../../../types/employee";

type Props = {
  visible: boolean;
  accountManager: AccountManager | null;
  onClose: () => void;
  onSave: (manager: AccountManager) => void;
  isSubmitting?: boolean;
};
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EditAccountManagerModal({ visible, accountManager, onClose, onSave, isSubmitting = false }: Props) {
const [fullName, setFullName] = useState(
  accountManager?.fullName ?? ""
);

const [email, setEmail] = useState(
  accountManager?.email === "—"
    ? ""
    : accountManager?.email ?? ""
);

  const valid = fullName.trim().length > 0 && fullName.trim().length <= 100 && emailPattern.test(email.trim());
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => { if (!isSubmitting) onClose(); }}>
      <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => { if (!isSubmitting) onClose(); }} />
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Edit Account Manager</Text>
            <TouchableOpacity disabled={isSubmitting} onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={18} color={COLORS.iconGrey} />
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />
          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} value={fullName} onChangeText={setFullName} maxLength={100}
            placeholder="Enter full name" placeholderTextColor={COLORS.placeholder} />
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail}
            placeholder="Enter email address" placeholderTextColor={COLORS.placeholder}
            keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
          <TouchableOpacity style={[styles.saveButton, (!valid || isSubmitting) && styles.disabled]}
            disabled={!valid || isSubmitting} onPress={() => {
              if (accountManager) onSave({ ...accountManager, fullName: fullName.trim(), email: email.trim() });
            }} activeOpacity={0.8}>
            <Text style={styles.saveText}>{isSubmitting ? "Saving..." : "Save Changes"}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: COLORS.overlay, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 },
  card: { width: "100%", maxWidth: 420, borderRadius: 18, backgroundColor: COLORS.white, padding: 20,
    shadowColor: COLORS.shadow, shadowOpacity: 0.14, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 10 },
  header: { flexDirection: "row", alignItems: "center" },
  title: { flex: 1, fontSize: 16, fontWeight: "700", color: COLORS.textPrimary },
  closeButton: { width: 32, height: 32, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  divider: { height: 1, backgroundColor: COLORS.divider, marginTop: 14, marginBottom: 4 },
  label: { marginTop: 15, marginBottom: 7, fontSize: 11, fontWeight: "600", color: COLORS.textPrimary },
  input: { height: 44, borderRadius: 11, borderWidth: 1, borderColor: COLORS.border,
    backgroundColor: COLORS.white, paddingHorizontal: 13, fontSize: 12, color: COLORS.textPrimary },
  saveButton: { height: 46, marginTop: 22, borderRadius: 11, backgroundColor: COLORS.navigationActive,
    alignItems: "center", justifyContent: "center" },
  saveText: { fontSize: 12, fontWeight: "700", color: COLORS.white },
  disabled: { opacity: 0.55 },
});
