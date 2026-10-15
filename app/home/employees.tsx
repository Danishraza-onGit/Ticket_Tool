import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { isAxiosError } from "axios";

import { COLORS } from "../../constants/colors";
import BackHeader from "../../components/admin/navigation/BackHeader";
import EmployeeTabs from "../../components/admin/admin-employees/EmployeeTabs";
import EmployeeSearchActions from "../../components/admin/admin-employees/EmployeeSearchActions";
import EmployeeAddMenu from "../../components/admin/admin-employees/EmployeeAddMenu";
import EmployeeCard from "../../components/admin/admin-employees/EmployeeCard";
import AccountManagerCard from "../../components/admin/admin-employees/AccountManagerCard";
import EditAccountManagerModal from "../../components/admin/admin-employees/EditAccountManagerModal";
import AddAccountManagerModal from "../../components/admin/admin-employees/AddAccountManagerModal";
import AddEmployeeModal from "../../components/admin/admin-employees/AddEmployeeModal";

import { createUser, fetchUsers, setUserActive } from "../../api/users";
import type { CreateUserInput } from "../../api/users";
import {
  createAccountManager,
  fetchAccountManagers,
  updateAccountManager,
} from "../../api/accountManagers";
import { mapAccountManager, mapUserToEmployee } from "../../utils/employeeMappers";
import type { AccountManager, Employee, EmployeeManagementTab } from "../../types/employee";

function errorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const body = error.response?.data as { error?: unknown } | undefined;
    if (typeof body?.error === "string") return body.error;
    if (error.response?.status === 401) return "Your session expired. Please log in again.";
    if (error.response?.status === 403) return "This action requires Admin access.";
    if (error.response?.status === 409) return "A record with this name or username already exists.";
    if (error.response?.status === 400) return "Please check the entered details.";
  }
  return "Unable to complete the request. Please try again.";
}

export default function EmployeesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<EmployeeManagementTab>("employees");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [accountManagers, setAccountManagers] = useState<AccountManager[]>([]);
  const [searchText, setSearchText] = useState("");
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [expandedEmployeeId, setExpandedEmployeeId] = useState<number | null>(null);
  const [selectedAccountManager, setSelectedAccountManager] = useState<AccountManager | null>(null);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showAddAccountManagerModal, setShowAddAccountManagerModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [changingUserId, setChangingUserId] = useState<number | null>(null);

  const loadDirectories = useCallback(async (isCurrent: () => boolean = () => true) => {
    try {
      setIsLoading(true);
      setLoadError(null);
      const [users, managers] = await Promise.all([fetchUsers(), fetchAccountManagers()]);
      if (!isCurrent()) return;
      setEmployees(users.map(mapUserToEmployee));
      setAccountManagers(managers.map(mapAccountManager));
    } catch (error) {
      if (!isCurrent()) return;
      console.log("Employees directory load error:", error);
      setLoadError(errorMessage(error));
    } finally {
      if (isCurrent()) setIsLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => {
    let active = true;
    void loadDirectories(() => active);
    return () => { active = false; };
  }, [loadDirectories]));

  const filteredEmployees = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return employees;
    return employees.filter((person) => [
      person.fullName, person.username, person.email, person.role, person.team, person.status,
    ].some((value) => value.toLowerCase().includes(query)));
  }, [employees, searchText]);

  const filteredAccountManagers = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return accountManagers;
    return accountManagers.filter((manager) => [manager.fullName, manager.email]
      .some((value) => value.toLowerCase().includes(query)));
  }, [accountManagers, searchText]);

  const handleTabChange = (tab: EmployeeManagementTab) => {
    setActiveTab(tab);
    setSearchText("");
    setShowAddMenu(false);
    setExpandedEmployeeId(null);
  };

  const handleSendEmail = async (employee: Employee) => {
    if (!employee.email || employee.email === "—") {
      Alert.alert("Email Unavailable", "This user does not have an email address.");
      return;
    }
    try {
      await Linking.openURL(`mailto:${encodeURIComponent(employee.email)}`);
    } catch {
      Alert.alert("Email Unavailable", "No email app could open this address.");
    }
  };

  const performSetActive = async (employee: Employee) => {
    const activate = employee.status !== "Active";
    try {
      setChangingUserId(employee.id);
      const updated = await setUserActive(employee.id, activate);
      setEmployees((current) => current.map((item) =>
        item.id === employee.id ? mapUserToEmployee(updated) : item
      ));
      Alert.alert("Success", `${employee.fullName} has been ${activate ? "activated" : "deactivated"}.`);
    } catch (error) {
      Alert.alert("Unable to Update User", errorMessage(error));
    } finally {
      setChangingUserId(null);
    }
  };

  const handleChangeActive = (employee: Employee) => {
    if (changingUserId !== null) return;
    const activate = employee.status !== "Active";
    Alert.alert(
      activate ? "Activate User" : "Deactivate User",
      `Are you sure you want to ${activate ? "activate" : "deactivate"} ${employee.fullName}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: activate ? "Activate" : "Deactivate", style: activate ? "default" : "destructive", onPress: () => void performSetActive(employee) },
      ]
    );
  };

  const handleCreateEmployee = async (data: {
    fullName: string; username: string; email: string; password: string; role: string; team: string;
  }) => {
    if (isSaving) return;
    const input: CreateUserInput = {
      username: data.username.trim(),
      password: data.password,
      displayName: data.fullName.trim(),
      role: data.role === "Admin" ? "admin" : "employee",
      ...(data.email.trim() ? { email: data.email.trim() } : {}),
      ...(data.team === "FMS" || data.team === "Field" ? { team: data.team } : {}),
    };
    try {
      setIsSaving(true);
      const created = await createUser(input);
      setEmployees((current) => [...current, mapUserToEmployee(created)]
        .sort((a, b) => a.fullName.localeCompare(b.fullName)));
      setShowAddEmployeeModal(false);
      setActiveTab("employees");
      setSearchText("");
      Alert.alert("User Created", `${created.displayName} was created successfully.`);
    } catch (error) {
      Alert.alert("Unable to Create User", errorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateManager = async (data: { fullName: string; email: string }) => {
    if (isSaving) return;
    try {
      setIsSaving(true);
      const created = await createAccountManager({ name: data.fullName.trim(), email: data.email.trim() });
      setAccountManagers((current) => [...current, mapAccountManager(created)]
        .sort((a, b) => a.fullName.localeCompare(b.fullName)));
      setShowAddAccountManagerModal(false);
      setActiveTab("accountManagers");
      setSearchText("");
      Alert.alert("Account Manager Created", `${created.name} was added successfully.`);
    } catch (error) {
      Alert.alert("Unable to Add Account Manager", errorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveManager = async (edited: AccountManager) => {
    if (isSaving) return;
    try {
      setIsSaving(true);
      const saved = await updateAccountManager(edited.id, {
        name: edited.fullName.trim(), email: edited.email.trim(),
      });
      setAccountManagers((current) => current.map((item) =>
        item.id === saved.id ? mapAccountManager(saved) : item
      ).sort((a, b) => a.fullName.localeCompare(b.fullName)));
      setSelectedAccountManager(null);
      Alert.alert("Changes Saved", "Account Manager details were updated.");
    } catch (error) {
      Alert.alert("Unable to Update Account Manager", errorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <BackHeader title="Employees" onBackPress={() => router.back()} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <EmployeeTabs activeTab={activeTab} onTabChange={handleTabChange} />
        <View style={styles.searchActionsWrapper}>
          <EmployeeSearchActions searchText={searchText} onSearchTextChange={setSearchText}
            onAddPress={() => setShowAddMenu((current) => !current)} />
          <EmployeeAddMenu visible={showAddMenu} onClose={() => setShowAddMenu(false)}
            onAddEmployee={() => { setShowAddMenu(false); setShowAddEmployeeModal(true); }}
            onAddAccountManager={() => { setShowAddMenu(false); setShowAddAccountManagerModal(true); }} />
        </View>

        {isLoading ? (
          <View style={styles.centerState}>
            <ActivityIndicator color={COLORS.navigationActive} />
            <Text style={styles.stateText}>Loading directory...</Text>
          </View>
        ) : loadError ? (
          <View style={styles.centerState}>
            <Text style={styles.stateText}>{loadError}</Text>
            <TouchableOpacity onPress={() => void loadDirectories()} activeOpacity={0.7}>
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : activeTab === "employees" ? (
          <View style={styles.list}>
            {filteredEmployees.length ? filteredEmployees.map((employee) => (
              <EmployeeCard key={employee.id} employee={employee}
                expanded={expandedEmployeeId === employee.id}
                busy={changingUserId !== null}
                onToggleExpand={() => setExpandedEmployeeId((current) => current === employee.id ? null : employee.id)}
                onSendEmail={() => void handleSendEmail(employee)}
                onDeactivate={() => handleChangeActive(employee)} />
            )) : <EmptyState message={searchText.trim() ? "No matching users found." : "No users available."} />}
          </View>
        ) : (
          <View style={styles.list}>
            {filteredAccountManagers.length ? filteredAccountManagers.map((manager) => (
              <AccountManagerCard key={manager.id} accountManager={manager}
                onEdit={() => setSelectedAccountManager(manager)} />
            )) : <EmptyState message={searchText.trim() ? "No matching account managers found." : "No account managers available."} />}
          </View>
        )}
      </ScrollView>

      <AddEmployeeModal visible={showAddEmployeeModal} onClose={() => { if (!isSaving) setShowAddEmployeeModal(false); }}
        onSubmit={(data) => void handleCreateEmployee(data)} isSubmitting={isSaving} />
      {showAddEmployeeModal && (
        <AddEmployeeModal
          visible={showAddEmployeeModal}
          onClose={() => {
            if (!isSaving) {
              setShowAddEmployeeModal(false);
            }
          }}
          onSubmit={(data) =>
            void handleCreateEmployee(data)
          }
          isSubmitting={isSaving}
        />
      )}

      {showAddAccountManagerModal && (
        <AddAccountManagerModal
          visible={showAddAccountManagerModal}
          onClose={() => {
            if (!isSaving) {
              setShowAddAccountManagerModal(false);
            }
          }}
          onSubmit={(data) =>
            void handleCreateManager(data)
          }
          isSubmitting={isSaving}
        />
      )}

      {selectedAccountManager !== null && (
        <EditAccountManagerModal
          key={selectedAccountManager.id}
          visible
          accountManager={selectedAccountManager}
          onClose={() => {
            if (!isSaving) {
              setSelectedAccountManager(null);
            }
          }}
          onSave={(manager) =>
            void handleSaveManager(manager)
          }
          isSubmitting={isSaving}
        />
      )}

    </SafeAreaView>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <View style={styles.emptyState}>
      <Ionicons name="search-outline" size={22} color={COLORS.textMuted} />
      <Text style={styles.emptyStateText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scrollView: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 },
  searchActionsWrapper: { position: "relative", zIndex: 100 },
  list: { marginTop: 14, zIndex: 1 },
  centerState: { minHeight: 170, alignItems: "center", justifyContent: "center", gap: 12, paddingHorizontal: 24 },
  stateText: { fontSize: 12, color: COLORS.textSecondary, textAlign: "center" },
  retryText: { fontSize: 12, fontWeight: "700", color: COLORS.navigationActive },
  emptyState: {
    minHeight: 130, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border,
    backgroundColor: COLORS.white, alignItems: "center", justifyContent: "center", gap: 8
  },
  emptyStateText: { fontSize: 11, fontWeight: "500", color: COLORS.textMuted },
});
