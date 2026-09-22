import React, { useMemo, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";

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

const companies: Company[] = [
  {
    name: "Bhargava D.N.S",
    customerName: "Bhargava D.N.S",
    contactNumber: "",
    email: "",
    address: "",
  },
  {
    name: "CEWELL ONGC Vadodara",
    customerName: "Braj Bala",
    contactNumber: "9968282356",
    email: "brajbala@ongc.co.in",
    address: "Cewell ONGC Vadodara",
  },
  {
    name: "CISPL",
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
  },
  {
    name: "CLSA India NTT Datacenter",
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
  },
  {
    name: "Cygnus",
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
  },
  {
    name: "Cygnus Information Solution Pvt Ltd",
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
  },
  {
    name: "Cygnus Information Solutions",
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
  },
  {
    name: "Cygnus Information Solutions Pvt Ltd",
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
  },
  {
    name: "DNVGL (ONGC 11 HIGH)",
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
  },
  {
    name: "GIC Kuthnaur uttarkashi",
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
  },
  {
    name: "Grauer & Weil (India) Limited",
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
  },
  {
    name: "Gyan Bharatam",
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
  },
  {
    name: "Hindusthan National Glass & Industries Ltd",
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
  },
  {
    name: "IES College",
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
  },
  {
    name: "IIT Patna",
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
  },
  {
    name: "Mukesh Bharati",
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
  },
  {
    name: "NSDL Payment Gatway, Mumbai",
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
  },
  {
    name: "Omnenest Technologies Pvt Ltd",
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
  },
  {
    name: "ONGC",
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
  },
  {
    name: "ONGC Chennai",
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
  },
  {
    name: "ONGC GEOPIC",
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
  },
  {
    name: "ONGC GEOPIC CLAP & GMS",
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
  },
  {
    name: "ONGC GEOPIC HCI-VDI",
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
  },
  {
    name: "ONGC GEOPIC HPCC",
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
  },
  {
    name: "ONGC Godavari Bhavan - Rajamundry",
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
  },
  {
    name: "ONGC Ltd",
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
  },
  {
    name: "ONGC LTD-Ahmedabad",
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
  },
  {
    name: "ONGC Ltd, VB,MH-Asset",
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
  },
  {
    name: "ONGC Ltd, VB, NH Asset",
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
  },
  {
    name: "ONGC Rajahmundry",
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
  },
  {
    name: "ONGC SPIC",
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
  },
  {
    name: "Sameer Gayakwad",
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
  },
  {
    name: "Saregama",
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
  },
  {
    name: "Saregama-Pocket Aces Pictures Pvt. Ltd",
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
  },
  {
    name: "SHIVOHAM GLOBAL TECHNOLOGIES (OPC) PVT LTD",
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
  },
  {
    name: "SLB (CTRL-S)",
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
  },
  {
    name: "S.N. Yadav",
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
  },
  {
    name: "Sundaram Ramakrishnaiyer",
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
  },
  {
    name: "UIDAI",
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
  },
];

const accountManagers = [
  "All",
  "Aishwarya",
  "Aishwarya Tambe",
  "Anjaneyulu Mallelli",
  "Archana Mishra",
  "Braj Bala",
  "Computer Center",
  "Dil B Thapa",
  "D.S. Rawat",
  "Gaurav Dubey",
  "Hardik Narielwala",
  "Hardik Sir",
  "Hemang Shah",
  "Himanshu Parikh",
  "Jitesh Malhotra",
  "Manoj Mohite",
  "Mr. Sundaram",
  "Parmanand Pandey",
  "Pranesh Kute",
  "Radheshyam G",
  "Rajesh Mishra",
  "R Arul Babu",
  "Sachin Gupta",
  "Sanyukt Saransh",
  "Sheetal Sawant",
  "T Srinivasa",
];

const assignedPeople = [
  "Ajay Malik",
  "Jitesh Malhotra",
  "Manoj",
  "Narendar Kumar",
  "Nikhil Kumar",
  "Parmanand Pandey",
  "Pranesh",
  "Raghavendra Mishra",
  "Rohit Kumar",
  "Yash Gupta",
];

const priorities = ["P1", "P2", "P3", "P4"];
const units = ["Days", "Week", "months"];

const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  {/*const month = String(date.getMonth() + 1).padStart(2, "0");*/}
  const year = date.getFullYear();

  return `${day} ${date.toLocaleString("en-US", {
    month: "short",
  })} ${year}`;
};

export default function NewProjectScreen() {
  const insets = useSafeAreaInsets();

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
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("P3");
  const [accountManager, setAccountManager] = useState("");

  const [components, setComponents] = useState<ProjectComponent[]>([]);

  const [activeDropdown, setActiveDropdown] = useState<
    "unit" | "company" | "accountManager" | "assignedBy" | "assignedTo" | "priority" | null
  >(null);

  const [companySearch, setCompanySearch] = useState("");

  const [showAccountManagerModal, setShowAccountManagerModal] = useState(false);
  const [newAccountManagerName, setNewAccountManagerName] = useState("");
  const [newAccountManagerEmail, setNewAccountManagerEmail] = useState("");

  const filteredCompanies = useMemo(() => {
    const query = companySearch.trim().toLowerCase();

    if (!query) {
      return companies;
    }

    return companies.filter((company) =>
      company.name.toLowerCase().includes(query)
    );
  }, [companySearch]);

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
    setCompanySearch("");
    setActiveDropdown(null);
  };

  const resetForm = () => {
    setStartDate(new Date());
    setShowStartDatePicker(false);
    setTime("30");
    setUnit("Days");

    setCompanyName("");
    setCustomerName("");
    setContactNumber("");
    setEmail("");
    setDesignation("");
    setDepartment("");
    setAddress("");

    setPoNumber("");
    setContractNumber("");
    setScopeOfWork("");

    setAssignedBy("");
    setAssignedTo("");
    setPriority("P3");
    setAccountManager("");

    setComponents([]);

    setActiveDropdown(null);
    setCompanySearch("");

    setNewAccountManagerName("");
    setNewAccountManagerEmail("");
    setShowAccountManagerModal(false);
  };

  const addAccountManager = () => {
    const name = newAccountManagerName.trim();
    const managerEmail = newAccountManagerEmail.trim();

    if (!name || !managerEmail) {
      Alert.alert(
        "Required Fields",
        "Please enter both name and email."
      );
      return;
    }

    setAccountManager(name);
    setShowAccountManagerModal(false);
    setNewAccountManagerName("");
    setNewAccountManagerEmail("");
  };

  const handleCreateProject = () => {
    const missingFields: string[] = [];

    if (!companyName) missingFields.push("Company Name");
    if (!customerName) missingFields.push("Customer Name");
    if (!contactNumber) missingFields.push("Contact Number");
    if (!email) missingFields.push("Email ID");
    if (!address) missingFields.push("Address");

    if (components.length === 0) {
      missingFields.push("At least one Project Component");
    }

    components.forEach((component, index) => {
      if (!component.model.trim()) {
        missingFields.push(`Component ${index + 1} Model`);
      }

      if (!component.quantity.trim()) {
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

    Alert.alert(
      "Create Project",
      "Project form is valid. API submission will be connected later."
    );
  };

  const renderDropdown = (
    type:
      | "unit"
      | "accountManager"
      | "assignedBy"
      | "assignedTo"
      | "priority",
    options: string[]
  ) => {
    if (activeDropdown !== type) {
      return null;
    }

    return (
      <View style={styles.dropdown}>
        <ScrollView
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {options.map((option, index) => {
            const selected =
              (type === "unit" && option === unit) ||
              (type === "accountManager" && option === accountManager) ||
              (type === "assignedBy" && option === assignedBy) ||
              (type === "assignedTo" && option === assignedTo) ||
              (type === "priority" && option === priority);

            return (
              <TouchableOpacity
                key={`${option}-${index}`}
                style={styles.dropdownOption}
                onPress={() => {
                  if (type === "unit") setUnit(option);
                  if (type === "accountManager") setAccountManager(option);
                  if (type === "assignedBy") setAssignedBy(option);
                  if (type === "assignedTo") setAssignedTo(option);
                  if (type === "priority") setPriority(option);

                  setActiveDropdown(null);
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dropdownText,
                    selected && styles.dropdownSelectedText,
                  ]}
                >
                  {option}
                </Text>

                {selected && (
                  <Ionicons
                    name="checkmark"
                    size={17}
                    color="#174F8A"
                  />
                )}
              </TouchableOpacity>
            );
          })}

          {type === "accountManager" && (
            <TouchableOpacity
              style={styles.addManagerOption}
              onPress={() => {
                setActiveDropdown(null);
                setShowAccountManagerModal(true);
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name="add-circle-outline"
                size={17}
                color="#174F8A"
              />
              <Text style={styles.addManagerText}>
                Add new account manager
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView 
    style={styles.screen}
    edges={["top", "left", "right"]}
    >
      <StatusBar style="dark" backgroundColor="#FFFFFF" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons
            name="chevron-back"
            size={28}
            color="#174F8A"
          />
        </TouchableOpacity>

        <View style={styles.brandContainer}>
          <View style={styles.brandRow}>
            <Text style={styles.brand}>CYGNUS</Text>
          </View>

          <Text style={styles.brandSubtitle}>
            TICKETING SYSTEM
          </Text>
        </View>

        <View style={styles.userBadge}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>SH</Text>
          </View>

          <Text style={styles.adminText}>Admin</Text>
        </View>
      </View>

      {/* TITLE */}
      <View style={styles.titleRow}>
        <Text style={styles.pageTitle}>New Project</Text>

        <TouchableOpacity
          onPress={resetForm}
          activeOpacity={0.7}
        >
          <Text style={styles.resetText}>Clear</Text>
        </TouchableOpacity>
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
                color="#174F8A"
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
              disabled
            >
              <Ionicons
                name="calendar-outline"
                size={17}
                color="#8AA0B8"
              />

              <Text style={styles.inputText}>
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
              placeholderTextColor="#8AA0B8"
            />

            <FieldLabel label="Unit" required />

            <TouchableOpacity
              style={styles.input}
              onPress={() => {
                setActiveDropdown(
                  activeDropdown === "unit" ? null : "unit"
                );
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.inputText}>{unit}</Text>

              <Ionicons
                name="chevron-down"
                size={17}
                color="#687A91"
              />
            </TouchableOpacity>

            {renderDropdown("unit", units)}
          </View>
        </View>

        {/* 2. COMPANY & CUSTOMER DETAILS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons
                name="business-outline"
                size={17}
                color="#174F8A"
              />
              <Text style={styles.sectionTitle}>
                2. COMPANY & CUSTOMER DETAILS
              </Text>
            </View>

            
          </View>

          <View style={styles.sectionBody}>
            <FieldLabel label="Company Name" required />

            <TouchableOpacity
              style={styles.input}
              onPress={() => {
                setActiveDropdown(
                  activeDropdown === "company" ? null : "company"
                );
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name="search-outline"
                size={18}
                color="#8AA0B8"
              />

              <Text
                style={[
                  styles.inputText,
                  !companyName && styles.placeholderText,
                ]}
                numberOfLines={1}
              >
                {companyName || "Select or type a company name"}
              </Text>

              <Ionicons
                name="chevron-down"
                size={17}
                color="#687A91"
              />
            </TouchableOpacity>

            {activeDropdown === "company" && (
              <View style={styles.companyDropdown}>
                <View style={styles.companySearchBox}>
                  <Ionicons
                    name="search-outline"
                    size={17}
                    color="#8AA0B8"
                  />

                  <TextInput
                    style={styles.companySearchInput}
                    value={companySearch}
                    onChangeText={setCompanySearch}
                    placeholder="Search company..."
                    placeholderTextColor="#8AA0B8"
                    autoFocus
                  />
                </View>

                <ScrollView
                  nestedScrollEnabled
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  {filteredCompanies.map((company, index) => (
                    <TouchableOpacity
                      key={`${company.name}-${index}`}
                      style={styles.dropdownOption}
                      onPress={() => selectCompany(company)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={styles.dropdownText}
                        numberOfLines={2}
                      >
                        {company.name}
                      </Text>

                      {company.name === companyName && (
                        <Ionicons
                          name="checkmark"
                          size={17}
                          color="#174F8A"
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <FieldLabel label="Customer Name" required />

            <View style={[styles.input, styles.disabledInput]}>
              <Text
                style={[
                  styles.inputText,
                  !customerName && styles.placeholderText,
                ]}
                numberOfLines={1}
              >
                {customerName || "Automatically populated"}
              </Text>
            </View>

            <FieldLabel label="Contact Number" required />

            <View style={[styles.input, styles.disabledInput]}>
              <Text
                style={[
                  styles.inputText,
                  !contactNumber && styles.placeholderText,
                ]}
                numberOfLines={1}
              >
                {contactNumber || "Automatically populated"}
              </Text>
            </View>

            <FieldLabel label="Email ID" required />

            <View style={[styles.input, styles.disabledInput]}>
              <Text
                style={[
                  styles.inputText,
                  !email && styles.placeholderText,
                ]}
                numberOfLines={1}
              >
                {email || "Automatically populated"}
              </Text>
            </View>

            <FieldLabel label="Designation" />

            <TextInput
              style={styles.input}
              value={designation}
              onChangeText={setDesignation}
              placeholder="Enter customer's job title"
              placeholderTextColor="#8AA0B8"
            />

            <FieldLabel label="Department" />

            <TextInput
              style={styles.input}
              value={department}
              onChangeText={setDepartment}
              placeholder="Enter customer's department"
              placeholderTextColor="#8AA0B8"
            />

            <FieldLabel label="Address" required />

            <View
              style={[
                styles.input,
                styles.addressInput,
                styles.disabledInput,
              ]}
            >
              <Text
                style={[
                  styles.inputText,
                  !address && styles.placeholderText,
                ]}
              >
                {address || "Automatically populated"}
              </Text>
            </View>
          </View>
        </View>

        {/* 3. PROJECT COMPONENTS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons
                name="cube-outline"
                size={17}
                color="#174F8A"
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
                  color="#174F8A"
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
                      color="#8A5A5A"
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
                  placeholderTextColor="#8AA0B8"
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
                  placeholderTextColor="#8AA0B8"
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
                  placeholderTextColor="#8AA0B8"
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
                color="#174F8A"
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
              placeholderTextColor="#8AA0B8"
            />

            <FieldLabel label="Contract Number" />

            <TextInput
              style={styles.input}
              value={contractNumber}
              onChangeText={setContractNumber}
              placeholder="Contract number"
              placeholderTextColor="#8AA0B8"
            />

            <FieldLabel label="Scope of Work" required />

            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={scopeOfWork}
              onChangeText={setScopeOfWork}
              placeholder="Describe the project scope"
              placeholderTextColor="#8AA0B8"
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
                color="#174F8A"
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
              onPress={() => {
                setActiveDropdown(
                  activeDropdown === "accountManager"
                    ? null
                    : "accountManager"
                );
              }}
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
                color="#687A91"
              />
            </TouchableOpacity>

            {renderDropdown(
              "accountManager",
              accountManagers
            )}

            <FieldLabel label="Assigned By" required />

            <TouchableOpacity
              style={styles.input}
              onPress={() => {
                setActiveDropdown(
                  activeDropdown === "assignedBy"
                    ? null
                    : "assignedBy"
                );
              }}
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
                color="#687A91"
              />
            </TouchableOpacity>

            {renderDropdown("assignedBy", assignedPeople)}

            <FieldLabel label="Assigned To" required />

            <TouchableOpacity
              style={styles.input}
              onPress={() => {
                setActiveDropdown(
                  activeDropdown === "assignedTo"
                    ? null
                    : "assignedTo"
                );
              }}
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
                color="#687A91"
              />
            </TouchableOpacity>

            {renderDropdown("assignedTo", assignedPeople)}

            <FieldLabel label="Priority" required />

            <TouchableOpacity
              style={styles.input}
              onPress={() => {
                setActiveDropdown(
                  activeDropdown === "priority"
                    ? null
                    : "priority"
                );
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.inputText}>
                {priority}
              </Text>

              <Ionicons
                name="chevron-down"
                size={17}
                color="#687A91"
              />
            </TouchableOpacity>

            {renderDropdown("priority", priorities)}
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* BOTTOM ACTION BAR */}
      <View
        style={[
          styles.actionBar,
          {
            paddingBottom:
              Platform.OS === "ios"
                ? Math.max(insets.bottom, 10)
                : 10,
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
          onPress={handleCreateProject}
          activeOpacity={0.8}
        >
          <Ionicons
            name="add"
            size={21}
            color="#FFFFFF"
          />

          <Text style={styles.createText}>
            Create Project
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
                  color="#687A91"
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
              placeholderTextColor="#8AA0B8"
            />

            <Text style={styles.modalLabel}>
              Email
            </Text>

            <TextInput
              style={styles.modalInput}
              value={newAccountManagerEmail}
              onChangeText={setNewAccountManagerEmail}
              placeholder="Enter email"
              placeholderTextColor="#8AA0B8"
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
  screen: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  header: {
    height: 62,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#DCE4ED",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  backButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },

  brandContainer: {
    flex: 1,
    marginLeft: 4,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  brand: {
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: 0.7,
    color: "#174F8A",
  },

  brandDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#2D72C7",
    marginLeft: 3,
    marginTop: 2,
  },

  brandSubtitle: {
    fontSize: 7,
    letterSpacing: 1.4,
    color: "#8AA0B8",
    marginTop: -1,
  },

  userBadge: {
    height: 34,
    borderRadius: 17,
    paddingHorizontal: 7,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F7FB",
    borderWidth: 1,
    borderColor: "#DCE4ED",
  },

  avatar: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: "#DCE5EF",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#53677D",
  },

  adminText: {
    fontSize: 10,
    color: "#53677D",
    marginLeft: 5,
  },

  titleRow: {
    height: 52,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  pageTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: "#16243A",
  },

  resetText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#687A91",
  },

  scroll: {
    flex: 1,
  },

  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },

  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#DCE4ED",
    marginBottom: 14,
    overflow: "hidden",
  },

  sectionHeader: {
    minHeight: 42,
    backgroundColor: "#F8FAFC",
    borderBottomWidth: 1,
    borderBottomColor: "#E6ECF2",
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
    color: "#34465E",
    marginLeft: 7,
  },

  requiredText: {
    fontSize: 10,
    color: "#E53935",
    fontWeight: "500",
  },

  sectionBody: {
    padding: 16,
  },

  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#34465E",
    marginBottom: 7,
    marginTop: 2,
  },

  requiredAsterisk: {
    color: "#E53935",
  },

  input: {
    minHeight: 44,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#D6E0EB",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    marginBottom: 13,
    flexDirection: "row",
    alignItems: "center",
    color: "#25364C",
    fontSize: 13,
  },

  inputText: {
    flex: 1,
    fontSize: 13,
    color: "#25364C",
  },

  placeholderText: {
    color: "#8AA0B8",
  },

  disabledInput: {
    backgroundColor: "#F1F4F7",
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

  dropdown: {
    maxHeight: 220,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DCE4ED",
    marginTop: -7,
    marginBottom: 13,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 5,
  },

  dropdownOption: {
    minHeight: 40,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#EEF1F5",
  },

  dropdownText: {
    flex: 1,
    fontSize: 12,
    color: "#25364C",
    paddingVertical: 9,
  },

  dropdownSelectedText: {
    fontWeight: "600",
  },

  companyDropdown: {
    maxHeight: 270,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DCE4ED",
    marginTop: -7,
    marginBottom: 13,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 5,
  },

  companySearchBox: {
    height: 42,
    margin: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D6E0EB",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  companySearchInput: {
    flex: 1,
    marginLeft: 7,
    fontSize: 12,
    color: "#25364C",
  },

  addManagerOption: {
    minHeight: 42,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#DCE4ED",
  },

  addManagerText: {
    marginLeft: 7,
    fontSize: 12,
    fontWeight: "600",
    color: "#174F8A",
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
    color: "#34465E",
  },

  componentHint: {
    fontSize: 10,
    color: "#8A98A8",
    marginTop: 4,
    maxWidth: 220,
  },

  addComponentButton: {
    minHeight: 32,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D6E0EB",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  addComponentText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#174F8A",
    marginLeft: 3,
  },

  componentCard: {
    borderWidth: 1,
    borderColor: "#DCE4ED",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#FAFCFE",
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
    color: "#53677D",
  },

  bottomSpace: {
    height: 35,
  },

  actionBar: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#DCE4ED",
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
    borderColor: "#C9D7E6",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  cancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#465B72",
  },

  createButton: {
    flex: 1.55,
    minHeight: 50,
    borderRadius: 12,
    backgroundColor: "#092E63",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  createText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    marginLeft: 7,
  },

  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 2000,
  },

  modalCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
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
    color: "#16243A",
  },

  modalLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#34465E",
    marginBottom: 7,
  },

  modalInput: {
    height: 44,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#D6E0EB",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    fontSize: 13,
    color: "#25364C",
    marginBottom: 14,
  },

  addManagerButton: {
    height: 46,
    borderRadius: 10,
    backgroundColor: "#092E63",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },

  addManagerButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});