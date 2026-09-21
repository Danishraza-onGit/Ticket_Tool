import React, { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import EmployeeTabs from "../../components/employees/EmployeeTabs";
import EmployeeSearchActions from "../../components/employees/EmployeeSearchActions";
import EmployeeAddMenu from "../../components/employees/EmployeeAddMenu";
import EmployeeCard from "../../components/employees/EmployeeCard";
import AccountManagerCard from "../../components/employees/AccountManagerCard";
import EditAccountManagerModal from "../../components/employees/EditAccountManagerModal";
import AddAccountManagerModal from "../../components/employees/AddAccountManagerModal";
import AddEmployeeModal from "../../components/employees/AddEmployeeModal";

import type {
  AccountManager,
  Employee,
  EmployeeManagementTab,
} from "../../types/employee";

/*
 * Temporary frontend data.
 * Replace with Employees API data later.
 */
const temporaryEmployees: Employee[] = [
  {
    id: "employee-1",
    initials: "AM",
    fullName: "Ajay Malik",
    username: "ajaym",
    email: "fms.dehradun@cygnussolutions.co.in",
    role: "Employee",
    team: "FMS",
    status: "Active",
  },
  {
    id: "employee-2",
    initials: "AS",
    fullName: "Aman Sandim",
    username: "amans",
    email: "aman.sandim@cygnussolutions.co.in",
    role: "Employee",
    team: "Field",
    status: "Active",
  },
  {
    id: "employee-3",
    initials: "JM",
    fullName: "Jitesh Malhotra",
    username: "jiteshm",
    email: "jitesh.malhotra@cygnussolutions.co.in",
    role: "Admin",
    team: "Field",
    status: "Active",
  },
  {
    id: "employee-4",
    initials: "MM",
    fullName: "Manoj Mohite",
    username: "manojm",
    email: "manoj.mohite@cygnussolutions.co.in",
    role: "Employee",
    team: "FMS",
    status: "Active",
  },
  {
    id: "employee-5",
    initials: "NK",
    fullName: "Narendra Kumar",
    username: "narendrak",
    email: "narendra.kumar@cygnussolutions.co.in",
    role: "Employee",
    team: "Field",
    status: "Active",
  },
  {
    id: "employee-6",
    initials: "NK",
    fullName: "Nikhil Kumar",
    username: "nikhilk",
    email: "nikhil.kumar@cygnussolutions.co.in",
    role: "Employee",
    team: "FMS",
    status: "Active",
  },
];

/*
 * Temporary frontend data.
 * Replace with Account Manager API data later.
 */
const temporaryAccountManagers: AccountManager[] = [
  {
    id: "manager-1",
    initials: "AT",
    fullName: "Aishwarya Tambe",
    email: "aishwaryat@cygnussolutions.co.in",
  },
  {
    id: "manager-2",
    initials: "AM",
    fullName: "Anjaneyulu Mallelli",
    email: "anjaneyulu@cygnussolutions.co.in",
  },
  {
    id: "manager-3",
    initials: "BB",
    fullName: "Braj Bala",
    email: "brajbala@cygnussolutions.co.in",
  },
  {
    id: "manager-4",
    initials: "GD",
    fullName: "Gaurav Dubey",
    email: "gaurav.dubey@cygnussolutions.co.in",
  },
];

export default function EmployeesScreen() {
  const router = useRouter();

  const [activeTab, setActiveTab] =
    useState<EmployeeManagementTab>("employees");

  const [showAddAccountManagerModal,
    setShowAddAccountManagerModal,
  ] = useState(false);

  const [searchText, setSearchText] =
    useState("");

  const [showAddMenu, setShowAddMenu] =
    useState(false);

  const [expandedEmployeeId, setExpandedEmployeeId] =
    useState<string | null>(null);

  const [accountManagers, setAccountManagers] =
    useState<AccountManager[]>(
      temporaryAccountManagers
    );

  const [
    selectedAccountManager,
    setSelectedAccountManager,
  ] = useState<AccountManager | null>(null);

  const handleTabChange = (
    tab: EmployeeManagementTab
  ) => {
    setActiveTab(tab);
    setSearchText("");
    setShowAddMenu(false);
    setExpandedEmployeeId(null);
  };

  const [
    showAddEmployeeModal,
    setShowAddEmployeeModal,
  ] = useState(false);


  const filteredEmployees = useMemo(() => {
    const query = searchText
      .trim()
      .toLowerCase();

    if (!query) {
      return temporaryEmployees;
    }

    return temporaryEmployees.filter(
      (employee) =>
        employee.fullName
          .toLowerCase()
          .includes(query) ||
        employee.username
          .toLowerCase()
          .includes(query) ||
        employee.email
          .toLowerCase()
          .includes(query) ||
        employee.role
          .toLowerCase()
          .includes(query) ||
        employee.team
          .toLowerCase()
          .includes(query)
    );
  }, [searchText]);

  const filteredAccountManagers =
    useMemo(() => {
      const query = searchText
        .trim()
        .toLowerCase();

      if (!query) {
        return accountManagers;
      }

      return accountManagers.filter(
        (manager) =>
          manager.fullName
            .toLowerCase()
            .includes(query) ||
          manager.email
            .toLowerCase()
            .includes(query)
      );
    }, [accountManagers, searchText]);

  const handleAddEmployee = () => {
    setShowAddMenu(false);
    setShowAddEmployeeModal(true);
  };

  const handleAddAccountManager = () => {
    setShowAddMenu(false);
    setShowAddAccountManagerModal(true
    );
  };

  const handleSendEmail = (
    employee: Employee
  ) => {
    /*
     * Actual email behavior will be connected
     * when requirements/API are available.
     */
    Alert.alert(
      "Send Email",
      `Email action for ${employee.fullName} will be connected later.`
    );
  };

  const handleDeactivate = (
    employee: Employee
  ) => {
    /*
     * Do not fake backend deactivation.
     */
    Alert.alert(
      "Deactivate Employee",
      `Deactivation for ${employee.fullName} will be connected when the API is available.`
    );
  };

  const handleSaveAccountManager = (
    updatedManager: AccountManager
  ) => {
    /*
     * Temporary local update so the UI interaction
     * can be tested. Replace with API update later.
     */
    setAccountManagers((current) =>
      current.map((manager) =>
        manager.id === updatedManager.id
          ? updatedManager
          : manager
      )
    );

    setSelectedAccountManager(null);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-back"
            size={18}
            color="#52647B"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Employees
        </Text>

        <TouchableOpacity
          style={styles.headerUserBadge}
          onPress={() => router.push("/home/account")}
          activeOpacity={0.7}
        >
          <View style={styles.headerAvatar}>
            <Text style={styles.headerInitials}>
              SH
            </Text>
          </View>

          <Text style={styles.headerRole}>
            Admin
          </Text>
        </TouchableOpacity>
      </View>


      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <EmployeeTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        <View style={styles.searchActionsWrapper}>
          <EmployeeSearchActions
            searchText={searchText}
            onSearchTextChange={setSearchText}
            onAddPress={() =>
              setShowAddMenu(
                (current) => !current
              )
            }
          />

          <EmployeeAddMenu
            visible={showAddMenu}
            onClose={() =>
              setShowAddMenu(false)
            }
            onAddEmployee={
              handleAddEmployee
            }
            onAddAccountManager={
              handleAddAccountManager
            }
          />
        </View>

        {/* EMPLOYEES */}
        {activeTab === "employees" && (
          <View style={styles.list}>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map(
                (employee) => (
                  <EmployeeCard
                    key={employee.id}
                    employee={employee}
                    expanded={
                      expandedEmployeeId ===
                      employee.id
                    }
                    onToggleExpand={() =>
                      setExpandedEmployeeId(
                        (current) =>
                          current === employee.id
                            ? null
                            : employee.id
                      )
                    }
                    onSendEmail={() =>
                      handleSendEmail(employee)
                    }
                    onDeactivate={() =>
                      handleDeactivate(employee)
                    }
                  />
                )
              )
            ) : (
              <EmptyState
                message="No employees found."
              />
            )}
          </View>
        )}

        {/* ACCOUNT MANAGERS */}
        {activeTab ===
          "accountManagers" && (
            <View style={styles.list}>
              {filteredAccountManagers.length >
                0 ? (
                filteredAccountManagers.map(
                  (manager) => (
                    <AccountManagerCard
                      key={manager.id}
                      accountManager={manager}
                      onEdit={() =>
                        setSelectedAccountManager(
                          manager
                        )
                      }
                    />
                  )
                )
              ) : (
                <EmptyState
                  message="No account managers found."
                />
              )}
            </View>
          )}
      </ScrollView>

      <AddEmployeeModal
        visible={showAddEmployeeModal}
        onClose={() =>
          setShowAddEmployeeModal(false)
        }
        onSubmit={(data) => {
          /*
           * UI placeholder only.
           * Actual employee creation will use the API later.
           */
          Alert.alert(
            "Add Employee",
            `${data.fullName} will be created when the API is connected.`
          );

          setShowAddEmployeeModal(false);
        }}
      />
      <AddAccountManagerModal
        visible={showAddAccountManagerModal}
        onClose={() =>
          setShowAddAccountManagerModal(false)
        }
        onSubmit={(data) => {
          /*
           * UI placeholder only.
           * Actual creation will use the API later.
           */
          Alert.alert(
            "Add Account Manager",
            `${data.fullName} will be created when the API is connected.`
          );

          setShowAddAccountManagerModal(false);
        }}
      />

      <EditAccountManagerModal
        visible={
          selectedAccountManager !== null
        }
        accountManager={
          selectedAccountManager
        }
        onClose={() =>
          setSelectedAccountManager(null)
        }
        onSave={
          handleSaveAccountManager
        }
      />
    </SafeAreaView>
  );
}


type EmptyStateProps = {
  message: string;
};

function EmptyState({
  message,
}: EmptyStateProps) {
  return (
    <View style={styles.emptyState}>
      <Ionicons
        name="search-outline"
        size={22}
        color="#A2B0C0"
      />

      <Text style={styles.emptyStateText}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  header: {
    height: 60,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E1E7EF",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    width: 36,
    height: 36,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#DCE4ED",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "700",
    color: "#16243A",
  },

  headerUserBadge: {
    marginLeft: "auto",
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DCE4ED",
    backgroundColor: "#FFFFFF",
    paddingLeft: 4,
    paddingRight: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  headerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#172238",
    alignItems: "center",
    justifyContent: "center",
  },

  headerInitials: {
    fontSize: 9,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  headerRole: {
    fontSize: 9,
    fontWeight: "600",
    color: "#52647B",
  },

  scrollView: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },

  searchActionsWrapper: {
    position: "relative",
    zIndex: 100,
  },

  list: {
    marginTop: 14,
    zIndex: 1,
  },

  emptyState: {
    minHeight: 130,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DCE4ED",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  emptyStateText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#7A8DA3",
  },
});