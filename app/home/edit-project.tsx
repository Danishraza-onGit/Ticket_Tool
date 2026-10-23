import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { isAxiosError } from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import type { GestureResponderEvent } from "react-native";
import {
  Alert,
  Animated,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { createAccountManager } from "../../api/accountManagers";
import { fetchProject, updateProject } from "../../api/projects";
import { fetchMetaOptions } from "../../api/tickets";
import BackHeader from "../../components/admin/navigation/BackHeader";
import { COLORS } from "../../constants/colors";
import type {
  Project,
  ProjectFormInput,
  ProjectTimeUnit,
  UpdateProjectInput,
} from "../../types/project";
import { PROJECT_TIME_UNITS } from "../../types/project";
import type {
  CustomerDirectoryEntry,
  MetaOptions,
} from "../../types/ticket";
type Company = {
  name: string;
  customerName: string;
  contactNumber: string;
  email: string;
  address: string;
};
type ProjectComponent = {
  id: string;
  model: string;
  quantity: string;
  serialNumber: string;
};
type DropdownKey =
  | "unit"
  | "accountManager"
  | "assignedBy"
  | "assignedTo"
  | "priority";
const mapCustomerToCompany = (
  customer: CustomerDirectoryEntry
): Company => ({
  name: customer.name,
  customerName: customer.contactName ?? "",
  contactNumber: customer.contactNo ?? "",
  email: customer.emailId ?? "",
  address: customer.address ?? "",
});
const formatDateForApi = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  // Month is rendered through toLocaleString below.
  const year = date.getFullYear();
  return `${day} ${date.toLocaleString("en-US", {
    month: "short",
  })} ${year}`;
};
export default function EditProjectScreen() {
  const { srNo } = useLocalSearchParams<{ srNo?: string }>();
  const projectId = typeof srNo === "string" ? Number(srNo) : NaN;
  const [existingProject, setExistingProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const [metaOptions, setMetaOptions] = useState<MetaOptions | null>(null);
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [isCreatingAccountManager, setIsCreatingAccountManager] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [time, setTime] = useState("30");
  const [unit, setUnit] = useState("Days");
  const [companyName, setCompanyName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [address, setAddress] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const [contractNumber, setContractNumber] = useState("");
  const [scopeOfWork, setScopeOfWork] = useState("");
  const [assignedBy, setAssignedBy] = useState("");
  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<number[]>([]);
  const assignedTo = selectedAssigneeIds.map((id) => metaOptions?.assignedToOptions.find((e) => e.id === id)?.displayName).filter(Boolean).join(", ");
  const [priority, setPriority] = useState("P3");
  const [accountManager, setAccountManager] = useState("");
  const [components, setComponents] = useState<ProjectComponent[]>([]);
  const [dropdown, setDropdown] = useState<DropdownKey | null>(null);
  const [dropdownSearch, setDropdownSearch] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState<{
    top?: number;
    bottom?: number;
    left: number;
    width: number;
    maxHeight: number;
  } | null>(null);
  const [companyModalVisible, setCompanyModalVisible] = useState(false);
  const [companySearch, setCompanySearch] = useState("");
  const [companyBackdropOpacity] = useState(() => new Animated.Value(0));
  const [companySheetTranslateY] = useState(() => new Animated.Value(300));
  const [showAccountManagerModal, setShowAccountManagerModal] = useState(false);
  const [newAccountManagerName, setNewAccountManagerName] = useState("");
  const [newAccountManagerEmail, setNewAccountManagerEmail] = useState("");
  const companies = useMemo(
    () =>
      (metaOptions?.customers ?? []).map(
        mapCustomerToCompany
      ),
    [metaOptions]
  );
  const accountManagers = useMemo(
    () =>
      metaOptions?.accountManagerDirectory.map(
        (manager) => manager.name
      ) ?? [],
    [metaOptions]
  );
  const assignedByOptions = useMemo(
    () => metaOptions?.assignedBys ?? [],
    [metaOptions]
  );
  const assignedToOptions = useMemo(
    () =>
      metaOptions?.assignedToOptions.map(
        (employee) => employee.displayName
      ) ?? [],
    [metaOptions]
  );
  const priorities = useMemo(
    () => metaOptions?.priorities ?? [],
    [metaOptions]
  );
  const units = PROJECT_TIME_UNITS;
  useEffect(() => {
    let active = true;
    const loadEditProject = async () => {
      if (!Number.isInteger(projectId) || projectId <= 0) {
        setLoadError("Invalid project identifier.");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setLoadError(null);
        const [result, options] = await Promise.all([
          fetchProject(projectId),
          fetchMetaOptions(),
        ]);
        if (!active) return;
        const project = result.project;
        const [year, month, day] = project.startDate.slice(0, 10).split("-").map(Number);
        const parsedDate = new Date(year, month - 1, day);
        setExistingProject(project);
        setMetaOptions(options);
        setStartDate(Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate);
        setTime(String(project.timeValue));
        setUnit(project.timeUnit);
        setCompanyName(project.companyName);
        setCustomerName(project.contactName ?? "");
        setContactNumber(project.contactNo ?? "");
        setEmail(project.emailId ?? "");
        setDesignation(project.designation ?? "");
        setDepartment(project.department ?? "");
        setAddress(project.address ?? "");
        setPoNumber(project.poNumber ?? "");
        setContractNumber(project.contractNumber ?? "");
        setScopeOfWork(project.problem);
        setAccountManager(project.accountManager);
        setAssignedBy(project.assignedBy);
        setSelectedAssigneeIds(project.assignees.map((person) => person.id));
        setPriority(project.priority);
        setComponents(project.components.map((component, index) => ({
          id: `existing-${index}`,
          model: component.model,
          quantity: String(component.quantity),
          serialNumber: component.serialNumbers ?? "",
        })));
      } catch (error) {
        console.error("Edit Project load error:", error);
        if (active) setLoadError("Unable to load project details and form options.");
      } finally {
        if (active) setIsLoading(false);
      }
    };
    void loadEditProject();
    return () => {
      active = false;
    };
  }, [projectId]);
  const openCompanyModal = () => {
    companyBackdropOpacity.setValue(0);
    companySheetTranslateY.setValue(300);
    setCompanyModalVisible(true);
    requestAnimationFrame(() => {
      Animated.parallel([
        Animated.timing(companyBackdropOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(companySheetTranslateY, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };
  const closeCompanyModal = () => {
    Animated.parallel([
      Animated.timing(companyBackdropOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(companySheetTranslateY, {
        toValue: 300,
        duration: 190,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCompanyModalVisible(false);
      setCompanySearch("");
    });
  };
  const openDropdown = (
    field: DropdownKey,
    event: GestureResponderEvent
  ) => {
    event.currentTarget.measureInWindow((x, y, width, height) => {
      const gap = 6;
      const screenMargin = 12;
      const actionBarHeight = 90;
      const desiredHeight = 260;
      const bottomLimit =
        screenHeight - insets.bottom - actionBarHeight;
      const spaceBelow = Math.max(
        0,
        bottomLimit - (y + height + gap)
      );
      const spaceAbove = Math.max(
        0,
        y - insets.top - screenMargin - gap
      );
      const openAbove =
        spaceBelow < desiredHeight && spaceAbove > spaceBelow;
      const availableHeight = openAbove
        ? spaceAbove
        : spaceBelow;
      const maxHeight = Math.min(desiredHeight, availableHeight);
      setDropdownSearch("");
      setDropdown(field);
      setDropdownPosition({
        top: openAbove ? undefined : y + height + gap,
        bottom: openAbove ? screenHeight - y + gap : undefined,
        left: x,
        width,
        maxHeight,
      });
    });
  };
  const closeDropdown = () => {
    setDropdown(null);
    setDropdownPosition(null);
    setDropdownSearch("");
  };
  const getDropdownOptions = (field: DropdownKey): string[] => {
    switch (field) {
      case "unit":
        return [...units];
      case "accountManager":
        return accountManagers;
      case "assignedBy":
        return assignedByOptions;
      case "assignedTo":
        return assignedToOptions;
      case "priority":
        return priorities;
      default:
        return [];
    }
  };
  const searchableDropdown =
    dropdown === "assignedBy" || dropdown === "assignedTo";
  const filteredDropdownOptions = dropdown
    ? getDropdownOptions(dropdown).filter((option) =>
      !searchableDropdown ||
      option.toLowerCase().includes(dropdownSearch.trim().toLowerCase())
    )
    : [];
  const customAssignedByName = dropdownSearch.trim();
  const canUseCustomAssignedBy =
    dropdown === "assignedBy" &&
    customAssignedByName.length > 0 &&
    !assignedByOptions.some(
      (name) =>
        name.trim().toLowerCase() ===
        customAssignedByName.toLowerCase()
    );
  const filteredCompanies = useMemo(() => {
    const query = companySearch.trim().toLowerCase();
    if (!query) {
      return companies;
    }
    return companies.filter((company) =>
      company.name.toLowerCase().includes(query)
    );
  }, [companies, companySearch]);
  const updateComponent = (
    id: string,
    field: keyof Omit<ProjectComponent, "id">,
    value: string
  ) => {
    setComponents((current) =>
      current.map((component) =>
        component.id === id
          ? {
            ...component,
            [field]: value,
          }
          : component
      )
    );
  };
  const hasExactCompanyMatch = useMemo(() => {
    const search = companySearch.trim().toLowerCase();
    if (!search) {
      return false;
    }
    return companies.some(
      (company) => company.name.trim().toLowerCase() === search
    );
  }, [companySearch, companies]);
  const addComponent = () => {
    setComponents((current) => [
      ...current,
      {
        id: `${Date.now()}-${current.length}`,
        model: "",
        quantity: "",
        serialNumber: "",
      },
    ]);
  };
  const removeComponent = (id: string) => {
    setComponents((current) =>
      current.filter((component) => component.id !== id)
    );
  };
  const selectCompany = (company: Company) => {
    setCompanyName(company.name);
    setCustomerName(company.customerName);
    setContactNumber(company.contactNumber);
    setEmail(company.email);
    setAddress(company.address);
    closeCompanyModal();
  };
  const selectNewCompany = () => {
    const newCompanyName = companySearch.trim();
    if (!newCompanyName || hasExactCompanyMatch) {
      return;
    }
    setCompanyName(newCompanyName);
    setCustomerName("");
    setContactNumber("");
    setEmail("");
    setDesignation("");
    setDepartment("");
    setAddress("");
    closeCompanyModal();
  };
  const addAccountManager = async () => {
    const name = newAccountManagerName.trim();
    const managerEmail = newAccountManagerEmail.trim();
    if (!name || !managerEmail) {
      Alert.alert(
        "Required Fields",
        "Please enter both name and email."
      );
      return;
    }
    if (isCreatingAccountManager) {
      return;
    }
    try {
      setIsCreatingAccountManager(true);
      const createdManager =
        await createAccountManager({
          name,
          email: managerEmail,
        });
      setMetaOptions((current) => {
        if (!current) {
          return current;
        }
        return {
          ...current,
          accountManagerDirectory: [
            ...current.accountManagerDirectory,
            {
              id: createdManager.id,
              name: createdManager.name,
              email: createdManager.email,
            },
          ],
          accountManagers: [
            ...current.accountManagers,
            createdManager.name,
          ],
        };
      });
      setAccountManager(createdManager.name);
      setShowAccountManagerModal(false);
      setNewAccountManagerName("");
      setNewAccountManagerEmail("");
    } catch (error) {
      console.log(
        "Create account manager error:",
        error
      );
      Alert.alert(
        "Unable to Add Account Manager",
        "The account manager could not be created. Please verify the information and try again."
      );
    } finally {
      setIsCreatingAccountManager(false);
    }
  };
  const handleSaveProject = async () => {
    const missingFields: string[] = [];
    if (!companyName) missingFields.push("Company Name");
    if (!customerName) missingFields.push("Customer Name");
    if (!contactNumber) missingFields.push("Contact Number");
    if (!email) missingFields.push("Email ID");
    if (!address) missingFields.push("Address");
    if (!time.trim() || Number(time) <= 0) {
      missingFields.push("Valid Project Duration");
    }
    components.forEach((component, index) => {
      if (!component.model.trim()) {
        missingFields.push(`Component ${index + 1} Model`);
      }
      if (
        !component.quantity.trim() ||
        Number(component.quantity) <= 0
      ) {
        missingFields.push(`Component ${index + 1} Quantity`);
      }
      if (!component.serialNumber.trim()) {
        missingFields.push(`Component ${index + 1} Serial Number`);
      }
    });
    if (!scopeOfWork.trim()) missingFields.push("Scope of Work");
    if (!accountManager) missingFields.push("Account Manager");
    if (!assignedBy) missingFields.push("Assigned By");
    if (!assignedTo) missingFields.push("Assigned To");
    if (!priority) missingFields.push("Priority");
    if (missingFields.length > 0) {
      Alert.alert(
        "Required Fields",
        `Please complete:\n\n${missingFields.join("\n")}`
      );
      return;
    }
    if (!metaOptions || !existingProject) {
      Alert.alert(
        "Unable to Update Project",
        "Project information has not finished loading."
      );
      return;
    }
    if (isSavingProject) {
      return;
    }
    const selectedAccountManager =
      metaOptions.accountManagerDirectory.find(
        (manager) =>
          manager.name === accountManager
      );
    if (!selectedAccountManager) {
      Alert.alert(
        "Account Manager",
        "Please select a valid account manager."
      );
      return;
    }
    const input: ProjectFormInput = {
      startDate: formatDateForApi(startDate),
      timeValue: Number(time),
      timeUnit: unit as ProjectTimeUnit,
      companyName: companyName.trim(),
      contactName: customerName.trim(),
      contactNo: contactNumber.trim(),
      emailId: email.trim(),
      designation: designation.trim() || undefined,
      department: department.trim() || undefined,
      address: address.trim(),
      components: components.map((component) => ({
        model: component.model.trim(),
        quantity: Number(component.quantity),
        serialNumbers:
          component.serialNumber.trim() || undefined,
      })),
      contractNumber:
        contractNumber.trim() || undefined,
      poNumber:
        poNumber.trim() || undefined,
      problem: scopeOfWork.trim(),
      accountManagerId:
        selectedAccountManager.id,
      assignedBy: assignedBy.trim(),
      assigneeUserIds: selectedAssigneeIds,
      priority:
        priority as ProjectFormInput["priority"],
    };
    try {
      setIsSavingProject(true);

      const updatedProject = await updateProject(existingProject.srNo, {
        ...input,
        rowVersion: existingProject.rowVersion,
      } satisfies UpdateProjectInput);

      Alert.alert(
        "Project Updated",
        `Project #${updatedProject.projectNo} was updated successfully.`,
        [{
          text: "OK",
          onPress: () => router.replace({
            pathname: "/home/project-details",
            params: { srNo: String(updatedProject.srNo) },
          }),
        }]
      );
    } catch (error) {
      console.error("Update project error:", error);

      if (isAxiosError(error) && error.response?.status === 409) {
        Alert.alert(
          "Project Changed",
          "This project was updated elsewhere. Reopen it and try again."
        );
        return;
      }

      Alert.alert(
        "Unable to Update Project",
        "The project could not be updated. Please check the information and try again."
      );
    } finally {
      setIsSavingProject(false);
    }
  };
  if (isLoading || loadError || !existingProject) {
    return (
      <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
        <StatusBar style="dark" />
        <BackHeader title="Edit Project" onBackPress={() => router.back()} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            {isLoading ? "Loading project..." : loadError ?? "Project unavailable."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView
      style={styles.screen}
      edges={["top", "left", "right"]}
    >
      <StatusBar style="dark" />
      {/* HEADER */}
      <BackHeader
        title="Edit Project"
        onBackPress={() => router.back()}
      />
      {/* TITLE */}
      <View style={styles.titleRow}>
        <Text style={styles.pageTitle}>Edit Project</Text>
      </View>
      {/* FORM */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* 1. TIMELINE & DURATION */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons
                name="calendar-outline"
                size={17}
                color={COLORS.navigationActive}
              />
              <Text style={styles.sectionTitle}>
                1. TIMELINE & DURATION
              </Text>
            </View>
          </View>
          <View style={styles.sectionBody}>
            <FieldLabel label="Start Date" required />
            <TouchableOpacity
              style={styles.input}
              activeOpacity={0.7}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Ionicons
                name="calendar-outline"
                size={17}
                color={COLORS.textLight}
              />
              <Text style={[styles.inputText, styles.iconFieldText]}>
                {formatDate(startDate)}
              </Text>
            </TouchableOpacity>
            <FieldLabel label="Time" required />
            <TextInput
              style={styles.input}
              value={time}
              onChangeText={(value) =>
                setTime(value.replace(/[^0-9]/g, ""))
              }
              keyboardType="number-pad"
              placeholder="Enter duration"
              placeholderTextColor={COLORS.placeholder}
            />
            <FieldLabel label="Unit" required />
            <TouchableOpacity
              style={styles.input}
              onPress={(event) =>
                openDropdown("unit", event)
              }
              activeOpacity={0.7}
            >
              <Text style={styles.inputText}>{unit}</Text>
              <Ionicons
                name="chevron-down"
                size={17}
                color={COLORS.textFilterIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* 2. COMPANY & CUSTOMER DETAILS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons
                name="business-outline"
                size={17}
                color={COLORS.navigationActive}
              />
              <Text style={styles.sectionTitle}>
                2. COMPANY & CUSTOMER DETAILS
              </Text>
            </View>
          </View>
          <View style={styles.sectionBody}>
            {/* Company Name */}
            <FieldLabel label="Company Name" required />
            <TouchableOpacity
              style={styles.input}
              onPress={openCompanyModal}
              activeOpacity={0.7}
            >
              <Ionicons
                name="search-outline"
                size={18}
                color={COLORS.textLight}
              />
              <Text
                style={[
                  styles.inputText,
                  styles.iconFieldText,
                  !companyName && styles.placeholderText,
                ]}
                numberOfLines={1}
              >
                {companyName || "Select or type a company name"}
              </Text>
              <Ionicons
                name="chevron-down"
                size={17}
                color={COLORS.textFilterIcon}
              />
            </TouchableOpacity>
            {/* Customer Name */}
            <FieldLabel label="Customer Name" required />
            <TextInput
              style={styles.input}
              value={customerName}
              onChangeText={setCustomerName}
              placeholder="Enter customer name"
              placeholderTextColor={COLORS.placeholder}
            />
            {/* Contact Number */}
            <FieldLabel label="Contact Number" required />
            <TextInput
              style={styles.input}
              value={contactNumber}
              onChangeText={setContactNumber}
              placeholder="Enter contact number"
              placeholderTextColor={COLORS.placeholder}
              keyboardType="phone-pad"
            />
            {/* Email ID */}
            <FieldLabel label="Email ID" required />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email address"
              placeholderTextColor={COLORS.placeholder}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {/* Designation */}
            <FieldLabel label="Designation" />
            <TextInput
              style={styles.input}
              value={designation}
              onChangeText={setDesignation}
              placeholder="Enter customer's job title"
              placeholderTextColor={COLORS.placeholder}
            />
            {/* Department */}
            <FieldLabel label="Department" />
            <TextInput
              style={styles.input}
              value={department}
              onChangeText={setDepartment}
              placeholder="Enter customer's department"
              placeholderTextColor={COLORS.placeholder}
            />
            {/* Address */}
            <FieldLabel label="Address" required />
            <TextInput
              style={[styles.input, styles.addressInput]}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter company address"
              placeholderTextColor={COLORS.placeholder}
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>
        {/* 3. PROJECT COMPONENTS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons
                name="cube-outline"
                size={17}
                color={COLORS.navigationActive}
              />
              <Text style={styles.sectionTitle}>
                3. PROJECT COMPONENTS
              </Text>
            </View>
          </View>
          <View style={styles.sectionBody}>
            <View style={styles.componentHeadingRow}>
              <View>
                <Text style={styles.componentTitle}>
                  Project Components
                </Text>
                {components.length === 0 && (
                  <Text style={styles.componentHint}>
                    No components added yet — e.g. Server, Storage, Monitor.
                  </Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.addComponentButton}
                onPress={addComponent}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="add"
                  size={15}
                  color={COLORS.navigationActive}
                />
                <Text style={styles.addComponentText}>
                  Add Component
                </Text>
              </TouchableOpacity>
            </View>
            {components.map((component, index) => (
              <View
                key={component.id}
                style={styles.componentCard}
              >
                <View style={styles.componentCardHeader}>
                  <Text style={styles.componentNumber}>
                    Component {index + 1}
                  </Text>
                  <TouchableOpacity
                    onPress={() => removeComponent(component.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={17}
                      color={COLORS.danger}
                    />
                  </TouchableOpacity>
                </View>
                <FieldLabel label="Model" required />
                <TextInput
                  style={styles.input}
                  value={component.model}
                  onChangeText={(value) =>
                    updateComponent(
                      component.id,
                      "model",
                      value
                    )
                  }
                  placeholder="e.g. HP Z8 Fury G5 Workstation"
                  placeholderTextColor={COLORS.placeholder}
                />
                <FieldLabel label="Quantity" required />
                <TextInput
                  style={styles.input}
                  value={component.quantity}
                  onChangeText={(value) =>
                    updateComponent(
                      component.id,
                      "quantity",
                      value.replace(/[^0-9]/g, "")
                    )
                  }
                  keyboardType="number-pad"
                  placeholder="Enter quantity"
                  placeholderTextColor={COLORS.placeholder}
                />
                <FieldLabel label="Serial Number(s)" required />
                <TextInput
                  style={styles.input}
                  value={component.serialNumber}
                  onChangeText={(value) =>
                    updateComponent(
                      component.id,
                      "serialNumber",
                      value.toUpperCase()
                    )
                  }
                  autoCapitalize="characters"
                  placeholder="Comma-separated serial numbers"
                  placeholderTextColor={COLORS.placeholder}
                />
              </View>
            ))}
          </View>
        </View>
        {/* 4. PROJECT DETAILS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons
                name="document-text-outline"
                size={17}
                color={COLORS.navigationActive}
              />
              <Text style={styles.sectionTitle}>
                4. PROJECT DETAILS
              </Text>
            </View>
          </View>
          <View style={styles.sectionBody}>
            <FieldLabel label="PO Number" />
            <TextInput
              style={styles.input}
              value={poNumber}
              onChangeText={setPoNumber}
              placeholder="Purchase order number"
              placeholderTextColor={COLORS.placeholder}
            />
            <FieldLabel label="Contract Number" />
            <TextInput
              style={styles.input}
              value={contractNumber}
              onChangeText={setContractNumber}
              placeholder="Contract number"
              placeholderTextColor={COLORS.placeholder}
            />
            <FieldLabel label="Scope of Work" required />
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={scopeOfWork}
              onChangeText={setScopeOfWork}
              placeholder="Describe the project scope"
              placeholderTextColor={COLORS.placeholder}
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>
        {/* 5. ASSIGNMENT & ROUTING */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons
                name="people-outline"
                size={17}
                color={COLORS.navigationActive}
              />
              <Text style={styles.sectionTitle}>
                5. ASSIGNMENT & ROUTING
              </Text>
            </View>
          </View>
          <View style={styles.sectionBody}>
            <FieldLabel label="Account Manager" required />
            <TouchableOpacity
              style={styles.input}
              onPress={(event) =>
                openDropdown("accountManager", event)
              }
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.inputText,
                  !accountManager && styles.placeholderText,
                ]}
                numberOfLines={1}
              >
                {accountManager || "Select an account manager"}
              </Text>
              <Ionicons
                name="chevron-down"
                size={17}
                color={COLORS.textFilterIcon}
              />
            </TouchableOpacity>
            <FieldLabel label="Assigned By" required />
            <TouchableOpacity
              style={styles.input}
              onPress={(event) =>
                openDropdown("assignedBy", event)
              }
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.inputText,
                  !assignedBy && styles.placeholderText,
                ]}
                numberOfLines={1}
              >
                {assignedBy || "Person in the company who assigned this project"}
              </Text>
              <Ionicons
                name="chevron-down"
                size={17}
                color={COLORS.textFilterIcon}
              />
            </TouchableOpacity>
            <FieldLabel label="Assigned To" required />
            <TouchableOpacity
              style={styles.input}
              onPress={(event) =>
                openDropdown("assignedTo", event)
              }
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.inputText,
                  !assignedTo && styles.placeholderText,
                ]}
                numberOfLines={1}
              >
                {assignedTo || "Select employees"}
              </Text>
              <Ionicons
                name="chevron-down"
                size={17}
                color={COLORS.textFilterIcon}
              />
            </TouchableOpacity>
            <FieldLabel label="Priority" required />
            <TouchableOpacity
              style={styles.input}
              onPress={(event) =>
                openDropdown("priority", event)
              }
              activeOpacity={0.7}
            >
              <Text style={styles.inputText}>
                {priority}
              </Text>
              <Ionicons
                name="chevron-down"
                size={17}
                color={COLORS.textFilterIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.bottomSpace} />
      </ScrollView>
      {dropdown && dropdownPosition && (
        <Modal
          transparent
          visible
          animationType="none"
          onRequestClose={closeDropdown}
        >
          <Pressable
            style={styles.dropdownOverlay}
            onPress={closeDropdown}
          >
            <Pressable
              style={[
                styles.floatingDropdown,
                {
                  top: dropdownPosition.top,
                  bottom: dropdownPosition.bottom,
                  left: dropdownPosition.left,
                  width: dropdownPosition.width,
                  maxHeight: dropdownPosition.maxHeight,
                },
              ]}
              onPress={(event) => event.stopPropagation()}
            >
              {searchableDropdown && (
                <View style={styles.dropdownSearchBox}>
                  <Ionicons
                    name="search-outline"
                    size={17}
                    color={COLORS.textMuted}
                  />
                  <TextInput
                    style={styles.dropdownSearchInput}
                    value={dropdownSearch}
                    onChangeText={setDropdownSearch}
                    placeholder={
                      dropdown === "assignedBy"
                        ? "Search or enter a name"
                        : "Search organization members"
                    }
                    placeholderTextColor={COLORS.placeholder}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
              )}
              <ScrollView
                style={[
                  styles.floatingDropdownScroll,
                  { flexShrink: 1 },
                ]}
                nestedScrollEnabled
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
              >
                {filteredDropdownOptions.map((option) => {
                  const selected =
                    (dropdown === "unit" && option === unit) ||
                    (dropdown === "accountManager" && option === accountManager) ||
                    (dropdown === "assignedBy" && option === assignedBy) ||
                    (dropdown === "assignedTo" && selectedAssigneeIds.some((id) => metaOptions?.assignedToOptions.find((e) => e.id === id)?.displayName === option)) ||
                    (dropdown === "priority" && option === priority);
                  return (
                    <TouchableOpacity
                      key={option}
                      style={styles.floatingDropdownOption}
                      onPress={() => {
                        if (dropdown === "unit") setUnit(option);
                        if (dropdown === "accountManager") setAccountManager(option);
                        if (dropdown === "assignedBy") setAssignedBy(option);
                        if (dropdown === "assignedTo") {
                          const employee = metaOptions?.assignedToOptions.find((e) => e.displayName === option);
                          if (employee) setSelectedAssigneeIds((current) => current.includes(employee.id) ? current.filter((id) => id !== employee.id) : [...current, employee.id]);
                        }
                        if (dropdown === "priority") setPriority(option);
                        if (dropdown !== "assignedTo") closeDropdown();
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.floatingDropdownText}>
                        {option}
                      </Text>
                      {selected && (
                        <Ionicons
                          name="checkmark"
                          size={18}
                          color={COLORS.navigationActive}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
                {dropdown === "assignedTo" && (
                  <TouchableOpacity onPress={closeDropdown} style={{ padding: 12, alignItems: "center" }}>
                    <Text style={{ color: COLORS.navigationActive, fontWeight: "700" }}>Done ({selectedAssigneeIds.length} selected)</Text>
                  </TouchableOpacity>
                )}
                {filteredDropdownOptions.length === 0 &&
                  !canUseCustomAssignedBy && (
                    <Text style={styles.dropdownEmptyText}>
                      {dropdown === "assignedTo"
                        ? "No organization members found"
                        : "No options available"}
                    </Text>
                  )}
                {canUseCustomAssignedBy && (
                  <TouchableOpacity
                    style={styles.customNameOption}
                    onPress={() => {
                      setAssignedBy(customAssignedByName);
                      closeDropdown();
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.customNameText}>
                      Use &quot;{customAssignedByName}&quot;
                    </Text>
                    <Ionicons
                      name="add-circle-outline"
                      size={19}
                      color={COLORS.navigationActive}
                    />
                  </TouchableOpacity>
                )}
              </ScrollView>
              {dropdown === "accountManager" && (
                <TouchableOpacity
                  style={styles.addManagerOption}
                  onPress={() => {
                    closeDropdown();
                    setShowAccountManagerModal(true);
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={18}
                    color={COLORS.navigationActive}
                  />
                  <Text style={styles.addManagerText}>
                    Add new account manager
                  </Text>
                </TouchableOpacity>
              )}
            </Pressable>
          </Pressable>
        </Modal>
      )}
      {/* BOTTOM ACTION BAR */}
      <View
        style={[
          styles.actionBar,
          {
            paddingBottom: Math.max(insets.bottom, 10),
          },
        ]}
      >
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleSaveProject}
          disabled={isSavingProject}
          activeOpacity={0.8}
        >
          <Text style={styles.createText}>
            {isSavingProject ? "Saving..." : "Save Changes"}
          </Text>
        </TouchableOpacity>
      </View>
      {/* ADD ACCOUNT MANAGER MODAL */}
      {showAccountManagerModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Add Account Manager
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setShowAccountManagerModal(false)
                }
                activeOpacity={0.7}
              >
                <Ionicons
                  name="close"
                  size={22}
                  color={COLORS.textFilterIcon}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalLabel}>
              Name
            </Text>
            <TextInput
              style={styles.modalInput}
              value={newAccountManagerName}
              onChangeText={setNewAccountManagerName}
              placeholder="Enter name"
              placeholderTextColor={COLORS.placeholder}
            />
            <Text style={styles.modalLabel}>
              Email
            </Text>
            <TextInput
              style={styles.modalInput}
              value={newAccountManagerEmail}
              onChangeText={setNewAccountManagerEmail}
              placeholder="Enter email"
              placeholderTextColor={COLORS.placeholder}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.addManagerButton}
              onPress={addAccountManager}
              activeOpacity={0.8}
            >
              <Text style={styles.addManagerButtonText}>
                Add Account Manager
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <Modal
        visible={companyModalVisible}
        transparent
        animationType="none"
        onRequestClose={closeCompanyModal}
      >
        <View style={styles.modalRoot}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={closeCompanyModal}
          />
          <Animated.View
            pointerEvents="none"
            style={[
              styles.modalBackdrop,
              { opacity: companyBackdropOpacity },
            ]}
          />
          <Animated.View
            style={[
              styles.companyModal,
              {
                transform: [
                  { translateY: companySheetTranslateY },
                ],
              },
            ]}
          >
            <View style={styles.companyModalHeader}>
              <Text style={styles.companyModalTitle}>
                Select Company
              </Text>
              <TouchableOpacity
                style={styles.companyModalClose}
                onPress={closeCompanyModal}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="close"
                  size={21}
                  color={COLORS.iconGrey}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.companySearchBox}>
              <Ionicons
                name="search-outline"
                size={18}
                color={COLORS.textLight}
              />
              <TextInput
                style={styles.companySearchInput}
                placeholder="Search company..."
                placeholderTextColor={COLORS.placeholder}
                value={companySearch}
                onChangeText={setCompanySearch}
                autoCorrect={false}
                autoCapitalize="words"
              />
            </View>
            <ScrollView
              style={styles.companyList}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {filteredCompanies.map((company) => (
                <TouchableOpacity
                  key={company.name}
                  style={styles.companyOption}
                  onPress={() => selectCompany(company)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={styles.companyOptionText}
                    numberOfLines={2}
                  >
                    {company.name}
                  </Text>
                  {company.name === companyName && (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={COLORS.navigationActive}
                    />
                  )}
                </TouchableOpacity>
              ))}
              {companySearch.trim().length > 0 && !hasExactCompanyMatch && (
                <TouchableOpacity
                  style={[styles.companyOption, styles.newCompanyOption]}
                  onPress={selectNewCompany}
                  activeOpacity={0.7}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.companyOptionText}>
                      Use &quot;{companySearch.trim()}&quot;
                    </Text>
                    <Text style={styles.newCompanyHint}>
                      Create as a new company
                    </Text>
                  </View>
                  <Ionicons
                    name="add-circle-outline"
                    size={20}
                    color={COLORS.navigationActive}
                  />
                </TouchableOpacity>
              )}
              {filteredCompanies.length === 0 &&
                (companySearch.trim().length === 0 || hasExactCompanyMatch) && (
                  <Text style={styles.companyEmptyText}>
                    No companies found
                  </Text>
                )}
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
      {/* START DATE PICKER */}
      {showStartDatePicker && Platform.OS === "android" && (
        <DateTimePicker
          value={startDate}
          mode="date"
          
          display="calendar"
          onChange={(event, date) => {
            setShowStartDatePicker(false);
            if (event.type === "dismissed") {
              return;
            }
            if (date) {
              setStartDate(date);
            }
          }}
        />
      )}
      {Platform.OS === "ios" && (
        <Modal
          visible={showStartDatePicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowStartDatePicker(false)}
        >
          <View style={styles.dateModalOverlay}>
            <View style={styles.dateModalCard}>
              <TouchableOpacity
                style={styles.dateModalDone}
                onPress={() => setShowStartDatePicker(false)}
              >
                <Text style={styles.dateModalDoneText}>Done</Text>
              </TouchableOpacity>
              <DateTimePicker
                value={startDate}
                mode="date"
                textColor={COLORS.textPrimary}
                display="inline"
                accentColor={COLORS.navigationActive}
                onChange={(_event, date) => {
                  if (date) setStartDate(date);
                }}
              />
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}
function FieldLabel({
  label,
  required = false,
}: {
  label: string;
  required?: boolean;
}) {
  return (
    <Text style={styles.fieldLabel}>
      {label}
      {required && <Text style={styles.requiredAsterisk}> *</Text>}
    </Text>
  );
}
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    fontSize: 13,
    color: COLORS.textBody,
    textAlign: "center",
  },
  dateModalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  dateModalCard: {
    borderRadius: 18,
    backgroundColor: COLORS.white,
    padding: 12,
  },
  dateModalDone: {
    alignSelf: "flex-end",
    padding: 10,
  },
  dateModalDoneText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.navigationActive,
  },
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  titleRow: {
    height: 52,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownSearchBox: {
    minHeight: 42,
    margin: 7,
    paddingHorizontal: 10,
    borderRadius: 9,
    backgroundColor: COLORS.searchButtonBackground,
    flexDirection: "row",
    alignItems: "center",
  },
  dropdownSearchInput: {
    flex: 1,
    minHeight: 42,
    marginLeft: 7,
    paddingVertical: 0,
    fontSize: 13,
    color: COLORS.textBody,
  },
  customNameOption: {
    minHeight: 44,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  customNameText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textBody,
  },
  newCompanyOption: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  newCompanyHint: {
    marginTop: 9,
    fontSize: 10,
    color: COLORS.textMuted,
  },
  pageTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  resetText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textFilterIcon,
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
    overflow: "hidden",
  },
  sectionHeader: {
    minHeight: 42,
    backgroundColor: COLORS.surfaceSoft,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.7,
    color: COLORS.textSearchButton,
    marginLeft: 7,
  },
  sectionBody: {
    padding: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSearchButton,
    marginBottom: 7,
    marginTop: 2,
  },
  requiredAsterisk: {
    color: COLORS.danger,
  },
  input: {
    minHeight: 44,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceSoft,
    paddingHorizontal: 12,
    marginBottom: 13,
    flexDirection: "row",
    alignItems: "center",
    color: COLORS.textBody,
    fontSize: 13,
  },
  inputText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textBody,
  },
  iconFieldText: {
    marginLeft: 8,
  },
  placeholderText: {
    color: COLORS.placeholder,
  },
  disabledInput: {
    backgroundColor: COLORS.searchButtonBackground,
  },
  addressInput: {
    minHeight: 66,
    alignItems: "flex-start",
    paddingTop: 12,
  },
  multilineInput: {
    minHeight: 95,
    paddingTop: 12,
    alignItems: "flex-start",
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  floatingDropdown: {
    position: "absolute",
    maxHeight: 260,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 8,
  },
  floatingDropdownScroll: {
    maxHeight: 220,
  },
  floatingDropdownOption: {
    minHeight: 40,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  floatingDropdownText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textBody,
  },
  dropdownEmptyText: {
    paddingHorizontal: 14,
    paddingVertical: 18,
    fontSize: 12,
    textAlign: "center",
    color: COLORS.textMuted,
  },
  addManagerOption: {
    minHeight: 43,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  addManagerText: {
    marginLeft: 7,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.navigationActive,
  },
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.overlay,
  },
  companyModal: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "55%",
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: 16,
    paddingBottom: 16,
    overflow: "hidden",
  },
  companyModalHeader: {
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 13,
  },
  companyModalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textBody,
  },
  companyModalClose: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    transform: [
      { translateX: 6 },
      { translateY: -2 },
    ],
  },
  companySearchBox: {
    marginHorizontal: 16,
    minHeight: 43,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9,
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  companySearchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: COLORS.textBody,
  },
  companyList: {
    flex: 1,
    marginTop: 10,
  },
  companyOption: {
    minHeight: 44,
    paddingHorizontal: 17,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  companyOptionText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textBody,
    marginRight: 10,
  },
  companyEmptyText: {
    paddingHorizontal: 17,
    paddingVertical: 20,
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: "center",
  },
  componentHeadingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 13,
  },
  componentTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSearchButton,
  },
  componentHint: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 4,
    maxWidth: 220,
  },
  addComponentButton: {
    minHeight: 32,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  addComponentText: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.navigationActive,
    marginLeft: 3,
  },
  componentCard: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: COLORS.surfaceSoft,
  },
  componentCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  componentNumber: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textSubtle,
  },
  bottomSpace: {
    height: 35,
  },
  actionBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: 16,
    paddingTop: 10,
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 0.72,
    minHeight: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  createButton: {
    flex: 1.55,
    minHeight: 50,
    borderRadius: 12,
    backgroundColor: COLORS.primaryDark,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  createText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.white,
    marginLeft: 7,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.overlay,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 2000,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 18,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSearchButton,
    marginBottom: 7,
  },
  modalInput: {
    height: 44,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceSoft,
    paddingHorizontal: 12,
    fontSize: 13,
    color: COLORS.textBody,
    marginBottom: 14,
  },
  addManagerButton: {
    height: 46,
    borderRadius: 10,
    backgroundColor: COLORS.primaryDark,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  addManagerButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "700",
  },
});
