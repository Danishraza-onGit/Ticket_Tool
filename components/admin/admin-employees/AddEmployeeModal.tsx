import React, { useState } from "react";
import {
  KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../constants/colors";

type AddEmployeeData = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  role: string;
  team: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: AddEmployeeData) => void;
  isSubmitting?: boolean;
};

const roleOptions = ["Employee", "Admin"] as const;
const teamOptions = ["—", "FMS", "Field"] as const;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AddEmployeeModal({ visible, onClose, onSubmit, isSubmitting = false }: Props) {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<(typeof roleOptions)[number]>("Employee");
  const [team, setTeam] = useState<(typeof teamOptions)[number]>("—");
  const [openDropdown, setOpenDropdown] = useState<"role" | "team" | null>(null);


  const valid = fullName.trim().length > 0 && fullName.trim().length <= 100 &&
    username.trim().length > 0 && username.trim().length <= 50 && password.length >= 8 &&
    (!email.trim() || emailPattern.test(email.trim()));

  const handleClose = () => {
    if (isSubmitting) return;
    setOpenDropdown(null);
    onClose();
  };

  const submit = () => {
    if (!valid || isSubmitting) return;
    onSubmit({
      fullName: fullName.trim(),
      username: username.trim(),
      email: email.trim(),
      password,
      role,
      team,
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Employee</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose} disabled={isSubmitting}>
              <Ionicons name="close" size={18} color={COLORS.iconGrey} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text style={styles.label}>Full Name</Text>
            <TextInput style={styles.input} value={fullName} onChangeText={setFullName}
              maxLength={100} placeholder="Enter your name" placeholderTextColor={COLORS.placeholder} />
            <Text style={styles.label}>Username</Text>
            <TextInput style={styles.input} value={username} onChangeText={setUsername}
              maxLength={50} placeholder="Enter your username" placeholderTextColor={COLORS.placeholder}
              autoCapitalize="none" autoCorrect={false} />
            <Text style={styles.label}>Email (optional)</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail}
              placeholder="name@cygnussolutions.co.in" placeholderTextColor={COLORS.placeholder}
              keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
            <Text style={styles.label}>Password</Text>
            <TextInput style={styles.input} value={password} onChangeText={setPassword}
              placeholder="Minimum 8 characters" placeholderTextColor={COLORS.placeholder}
              secureTextEntry autoCapitalize="none" autoCorrect={false} />
            <Text style={styles.label}>Role</Text>
            <View style={styles.dropdownWrapper}>
              <TouchableOpacity style={styles.dropdownButton} onPress={() => setOpenDropdown((current) => current === "role" ? null : "role")}>
                <Text style={styles.dropdownText}>{role}</Text>
                <Ionicons name={openDropdown === "role" ? "chevron-up" : "chevron-down"} size={15} color={COLORS.iconGrey} />
              </TouchableOpacity>
              {openDropdown === "role" && (
                <View style={styles.dropdownMenu}>
                  {roleOptions.map((option) => (
                    <TouchableOpacity key={option} style={styles.dropdownOption} onPress={() => { setRole(option); setOpenDropdown(null); }}>
                      <Text style={[styles.dropdownOptionText, role === option && styles.selectedOptionText]}>{option}</Text>
                      {role === option && <Ionicons name="checkmark" size={15} color={COLORS.navigationActive} />}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            <Text style={styles.label}>Team</Text>
            <View style={styles.dropdownWrapper}>
              <TouchableOpacity style={styles.dropdownButton} onPress={() => setOpenDropdown((current) => current === "team" ? null : "team")}>
                <Text style={styles.dropdownText}>{team}</Text>
                <Ionicons name={openDropdown === "team" ? "chevron-up" : "chevron-down"} size={15} color={COLORS.iconGrey} />
              </TouchableOpacity>
              {openDropdown === "team" && (
                <View style={styles.dropdownMenu}>
                  {teamOptions.map((option) => (
                    <TouchableOpacity key={option} style={styles.dropdownOption} onPress={() => { setTeam(option); setOpenDropdown(null); }}>
                      <Text style={[styles.dropdownOptionText, team === option && styles.selectedOptionText]}>{option}</Text>
                      {team === option && <Ionicons name="checkmark" size={15} color={COLORS.navigationActive} />}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            <TouchableOpacity style={[styles.submitButton, (!valid || isSubmitting) && styles.disabled]}
              disabled={!valid || isSubmitting} onPress={submit} activeOpacity={0.8}>
              <Text style={styles.submitText}>{isSubmitting ? "Adding..." : "Add Employee"}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: "center", paddingHorizontal: 16 },
  card: { maxHeight: "88%", backgroundColor: COLORS.white, borderRadius: 20,
    paddingHorizontal: 22, paddingTop: 18, paddingBottom: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
  title: { flex: 1, fontSize: 16, fontWeight: "700", color: COLORS.textPrimary },
  closeButton: { width: 28, height: 28, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  label: { marginBottom: 7, fontSize: 12, fontWeight: "600", color: COLORS.textPrimary },
  input: { height: 42, borderRadius: 9, backgroundColor: COLORS.searchButtonBackground,
    paddingHorizontal: 12, fontSize: 12, color: COLORS.textPrimary, marginBottom: 14 },
  dropdownWrapper: { marginBottom: 14 },
  dropdownButton: { height: 42, borderRadius: 9, backgroundColor: COLORS.searchButtonBackground,
    paddingHorizontal: 12, flexDirection: "row", alignItems: "center" },
  dropdownText: { flex: 1, fontSize: 12, color: COLORS.textPrimary },
  dropdownMenu: { marginTop: 5, borderRadius: 9, borderWidth: 1, borderColor: COLORS.border,
    backgroundColor: COLORS.white, overflow: "hidden" },
  dropdownOption: { minHeight: 40, paddingHorizontal: 12, flexDirection: "row", alignItems: "center" },
  dropdownOptionText: { flex: 1, fontSize: 12, color: COLORS.textPrimary },
  selectedOptionText: { fontWeight: "600", color: COLORS.navigationActive },
  submitButton: { height: 42, borderRadius: 9, backgroundColor: COLORS.navigationActive,
    alignItems: "center", justifyContent: "center", marginTop: 2 },
  submitText: { fontSize: 12, fontWeight: "700", color: COLORS.white },
  disabled: { opacity: 0.55 },
});
