import React, { useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../constants/colors";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { fullName: string; email: string }) => void;
  isSubmitting?: boolean;
};
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AddAccountManagerModal({ visible, onClose, onSubmit, isSubmitting = false }: Props) {
  const [fullName, setFullName] = useState("");

  const [email, setEmail] = useState("");
  const valid = fullName.trim().length > 0 && fullName.trim().length <= 100 && emailPattern.test(email.trim());
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => { if (!isSubmitting) onClose(); }}>
      <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => { if (!isSubmitting) onClose(); }} />
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Account Manager</Text>
            <TouchableOpacity disabled={isSubmitting} onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={18} color={COLORS.iconGrey} />
            </TouchableOpacity>
          </View>
          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} value={fullName} onChangeText={setFullName}
            maxLength={100} placeholder="Enter name" placeholderTextColor={COLORS.placeholder} />
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail}
            placeholder="name@cygnussolutions.co.in" placeholderTextColor={COLORS.placeholder}
            keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
          <TouchableOpacity style={[styles.submitButton, (!valid || isSubmitting) && styles.disabled]}
            onPress={() => onSubmit({ fullName: fullName.trim(), email: email.trim() })}
            disabled={!valid || isSubmitting} activeOpacity={0.8}>
            <Text style={styles.submitText}>{isSubmitting ? "Adding..." : "Add Account Manager"}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: "center", paddingHorizontal: 16 },
  card: { backgroundColor: COLORS.white, borderRadius: 20, paddingHorizontal: 22, paddingTop: 18, paddingBottom: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
  title: { flex: 1, fontSize: 16, fontWeight: "700", color: COLORS.textPrimary },
  closeButton: { width: 28, height: 28, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  label: { marginBottom: 7, fontSize: 12, fontWeight: "600", color: COLORS.textPrimary },
  input: {
    height: 42, borderRadius: 9, backgroundColor: COLORS.searchButtonBackground,
    paddingHorizontal: 12, fontSize: 12, color: COLORS.textPrimary, marginBottom: 14
  },
  submitButton: {
    height: 42, borderRadius: 9, backgroundColor: COLORS.navigationActive,
    alignItems: "center", justifyContent: "center", marginTop: 2
  },
  submitText: { fontSize: 12, fontWeight: "700", color: COLORS.white },
  disabled: { opacity: 0.55 },
});
