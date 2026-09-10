import React, { useMemo, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { StatusBar } from "expo-status-bar";

import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";

import { companies } from "../../data/newTicket";
import { Company, NewTicketForm } from "../../types/newTicket";

const modes = [
    "Call",
    "Whatsapp",
    "Mail",
    "Verbally",
    "Website",
];

const callTypes = [
    "Warranty",
    "OEM",
    "AMC",
    "Office",
    "Installation",
    "POC",
    "Call",
    "Chargeable",
    "Non-Chargeable",
    "Routine checks",
];

const accountManagers = [
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

const internalTags = ["External", "Internal"];

const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day} ${date.toLocaleString("en-US", {
        month: "short",
    })} ${year}`;
};

const formatDateForForm = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

export default function NewTicketScreen() {
    const insets = useSafeAreaInsets();

    const today = new Date();

    const [form, setForm] = useState<NewTicketForm>({
        dateReceived: formatDate(today),
        mode: "Call",
        companyName: "",
        contactName: "",
        contactNo: "",
        emailId: "",
        address: "",
        model: "",
        serialNumbers: "",
        problem: "",
        callType: "Call",
        accountManager: "",
        assignedBy: "",
        assignedTo: "",
        deadlineDate: "",
        priority: "P3",
        internalTag: "External",
    });

    const [companyModalVisible, setCompanyModalVisible] = useState(false);
    const [companySearch, setCompanySearch] = useState("");

    const [dropdown, setDropdown] = useState<
        "mode" | "callType" | "accountManager" | "assignedBy" | "assignedTo" | "priority" | "internalTag" | null
    >(null);

    const [deadlinePickerVisible, setDeadlinePickerVisible] = useState(false);
    const [deadlineDate, setDeadlineDate] = useState<Date | null>(null);

    const [accountManagerModalVisible, setAccountManagerModalVisible] =
        useState(false);

    const [newAccountManagerName, setNewAccountManagerName] = useState("");
    const [newAccountManagerEmail, setNewAccountManagerEmail] = useState("");

    const [errors, setErrors] = useState<Record<string, boolean>>({});

    const filteredCompanies = useMemo(() => {
        const search = companySearch.trim().toLowerCase();

        if (!search) {
            return companies;
        }

        return companies.filter((company) =>
            company.name.toLowerCase().includes(search)
        );
    }, [companySearch]);

    const updateField = <K extends keyof NewTicketForm>(
        field: K,
        value: NewTicketForm[K]
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setErrors((current) => ({
            ...current,
            [field]: false,
        }));
    };

    const selectCompany = (company: Company) => {
        setForm((current) => ({
            ...current,
            companyName: company.name,
            contactName: company.contactName,
            contactNo: company.contactNo,
            emailId: company.emailId,
            address: company.address,
        }));

        setErrors((current) => ({
            ...current,
            companyName: false,
            contactName: false,
            contactNo: false,
            emailId: false,
            address: false,
        }));

        setCompanyModalVisible(false);
        setCompanySearch("");
    };

    const validateForm = () => {
        const requiredFields: (keyof NewTicketForm)[] = [
            "mode",
            "companyName",
            "contactName",
            "contactNo",
            "emailId",
            "address",
            "problem",
            "callType",
            "accountManager",
            "assignedBy",
            "assignedTo",
            "priority",
        ];

        const nextErrors: Record<string, boolean> = {};

        requiredFields.forEach((field) => {
            if (!String(form[field]).trim()) {
                nextErrors[field] = true;
            }
        });

        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            Alert.alert(
                "Required Fields",
                "Please fill all mandatory fields before creating the ticket."
            );
            return false;
        }

        return true;
    };

    const handleCreateTicket = () => {
        if (!validateForm()) {
            return;
        }

        Alert.alert(
            "Ready to Create",
            "All required fields are filled. API submission will be connected later."
        );
    };

    const resetForm = () => {
        setForm({
            dateReceived: formatDate(today),
            mode: "Call",
            companyName: "",
            contactName: "",
            contactNo: "",
            emailId: "",
            address: "",
            model: "",
            serialNumbers: "",
            problem: "",
            callType: "Call",
            accountManager: "",
            assignedBy: "",
            assignedTo: "",
            deadlineDate: "",
            priority: "P3",
            internalTag: "External",
        });

        setDeadlineDate(null);
        setErrors({});
    };

    const renderDropdown = (
        field: "mode" | "callType" | "accountManager" | "assignedBy" | "assignedTo" | "priority" | "internalTag",
        options: string[]
    ) => {
        if (dropdown !== field) {
            return null;
        }

        return (
            <View style={styles.dropdownList}>
                <ScrollView
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {options.map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={styles.dropdownOption}
                            onPress={() => {
                                updateField(field, option);
                                setDropdown(null);
                            }}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.dropdownOptionText}>{option}</Text>

                            {form[field] === option && (
                                <Ionicons
                                    name="checkmark"
                                    size={17}
                                    color="#174F8A"
                                />
                            )}
                        </TouchableOpacity>
                    ))}

                    {field === "accountManager" && (
                        <TouchableOpacity
                            style={styles.addAccountManagerOption}
                            onPress={() => {
                                setDropdown(null);
                                setAccountManagerModalVisible(true);
                            }}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name="add"
                                size={18}
                                color="#174F8A"
                            />
                            <Text style={styles.addAccountManagerText}>
                                Add Account Manager
                            </Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.screen}>
            <StatusBar
                style="dark"
                backgroundColor="#FFFFFF"
            />
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="chevron-back"
                        size={25}
                        color="#43546B"
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

                <View style={styles.profileBadge}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>SH</Text>
                    </View>
                    <Text style={styles.adminText}>Admin</Text>
                </View>
            </View>

            {/* Page heading */}
            <View style={styles.pageHeader}>
                <Text style={styles.pageTitle}>New Ticket</Text>

                <TouchableOpacity
                    onPress={resetForm}
                    activeOpacity={0.7}
                >
                    <Text style={styles.resetText}>Clear</Text>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* =========================================================
    1. TIMELINE & CHANNEL
========================================================= */}

                    <View style={styles.formSection}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionTitleRow}>
                                <Ionicons
                                    name="calendar-outline"
                                    size={17}
                                    color="#174F8A"
                                />

                                <Text style={styles.sectionTitle}>
                                    1. TIMELINE & CHANNEL
                                </Text>
                            </View>


                        </View>

                        <View style={styles.sectionBody}>

                            {/* Date Received */}
                            <FieldLabel label="Date Received" required />

                            <View style={styles.lockedInput}>
                                <Ionicons
                                    name="calendar-outline"
                                    size={17}
                                    color="#8AA0BA"
                                />

                                <Text style={styles.lockedText}>
                                    {form.dateReceived}
                                </Text>
                            </View>

                            {/* Mode */}
                            <FieldLabel label="Mode" required />

                            <DropdownField
                                value={form.mode}
                                placeholder="Select mode"
                                hasError={!!errors.mode}
                                onPress={() =>
                                    setDropdown(
                                        dropdown === "mode"
                                            ? null
                                            : "mode"
                                    )
                                }
                            />

                            {renderDropdown("mode", modes)}

                            {/* Deadline Date */}
                            <FieldLabel label="Deadline Date" />

                            <TouchableOpacity
                                style={styles.selectField}
                                onPress={() =>
                                    setDeadlinePickerVisible(true)
                                }
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name="time-outline"
                                    size={17}
                                    color="#8AA0BA"
                                />

                                <Text
                                    style={[
                                        styles.selectText,
                                        !form.deadlineDate &&
                                        styles.placeholderText,
                                    ]}
                                >
                                    {form.deadlineDate || "No deadline"}
                                </Text>
                            </TouchableOpacity>

                        </View>
                    </View>


                    {/* =========================================================
    2. COMPANY & CONTACT DETAILS
========================================================= */}

                    <View style={styles.formSection}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionTitleRow}>
                                <Ionicons
                                    name="business-outline"
                                    size={17}
                                    color="#174F8A"
                                />

                                <Text style={styles.sectionTitle}>
                                    2. COMPANY & CONTACT DETAILS
                                </Text>
                            </View>


                        </View>

                        <View style={styles.sectionBody}>

                            {/* Company */}
                            <FieldLabel
                                label="Company Name"
                                required
                            />

                            <TouchableOpacity
                                style={[
                                    styles.selectField,
                                    errors.companyName &&
                                    styles.errorField,
                                ]}
                                onPress={() =>
                                    setCompanyModalVisible(true)
                                }
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name="search-outline"
                                    size={17}
                                    color="#8AA0BA"
                                />

                                <Text
                                    style={[
                                        styles.selectText,
                                        !form.companyName &&
                                        styles.placeholderText,
                                    ]}
                                    numberOfLines={1}
                                >
                                    {form.companyName ||
                                        "Select or type a company name"}
                                </Text>

                                <Ionicons
                                    name="chevron-down"
                                    size={17}
                                    color="#71839A"
                                />
                            </TouchableOpacity>

                            {/* Contact Name */}
                            <FieldLabel
                                label="Contact Name"
                                required
                            />

                            <ReadOnlyField
                                value={form.contactName}
                                placeholder="Automatically populated"
                                hasError={!!errors.contactName}
                            />

                            {/* Contact No */}
                            <FieldLabel
                                label="Contact No"
                                required
                            />

                            <ReadOnlyField
                                value={form.contactNo}
                                placeholder="Automatically populated"
                                hasError={!!errors.contactNo}
                            />

                            {/* Email */}
                            <FieldLabel
                                label="Email ID"
                                required
                            />

                            <ReadOnlyField
                                value={form.emailId}
                                placeholder="Automatically populated"
                                hasError={!!errors.emailId}
                            />

                            {/* Address */}
                            <FieldLabel
                                label="Address"
                                required
                            />

                            <ReadOnlyField
                                value={form.address}
                                placeholder="Automatically populated"
                                multiline
                                hasError={!!errors.address}
                            />

                        </View>
                    </View>


                    {/* =========================================================
    3. ASSET & PROBLEM DESCRIPTION
========================================================= */}

                    <View style={styles.formSection}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionTitleRow}>
                                <Ionicons
                                    name="desktop-outline"
                                    size={17}
                                    color="#174F8A"
                                />

                                <Text style={styles.sectionTitle}>
                                    3. ASSET & PROBLEM DESCRIPTION
                                </Text>
                            </View>


                        </View>

                        <View style={styles.sectionBody}>

                            {/* Model */}
                            <FieldLabel label="Model" />

                            <TextInput
                                style={styles.input}
                                placeholder="Enter the model of product ( iPhone 13, Samsung )"
                                placeholderTextColor="#91A0B2"
                                value={form.model}
                                onChangeText={(value) =>
                                    updateField("model", value)
                                }
                            />

                            {/* Serial Number */}
                            <FieldLabel label="Serial Number(s)" />

                            <TextInput
                                style={styles.input}
                                placeholder="Comma-separated if multiple eg: 5CD6108XVF, 5CD6107CQM"
                                placeholderTextColor="#91A0B2"
                                value={form.serialNumbers}
                                onChangeText={(value) =>
                                    updateField(
                                        "serialNumbers",
                                        value.toUpperCase()
                                    )
                                }
                                autoCapitalize="characters"
                            />

                            {/* Problem */}
                            <FieldLabel
                                label="Problem"
                                required
                            />

                            <TextInput
                                style={[
                                    styles.input,
                                    styles.multilineInput,
                                    errors.problem &&
                                    styles.errorField,
                                ]}
                                placeholder="Describe the problem in detail"
                                placeholderTextColor="#91A0B2"
                                value={form.problem}
                                onChangeText={(value) =>
                                    updateField("problem", value)
                                }
                                multiline
                                textAlignVertical="top"
                            />

                        </View>
                    </View>


                    {/* =========================================================
    4. ASSIGNMENT & ROUTING
========================================================= */}

                    <View style={styles.formSection}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionTitleRow}>
                                <Ionicons
                                    name="people-outline"
                                    size={17}
                                    color="#174F8A"
                                />

                                <Text style={styles.sectionTitle}>
                                    4. ASSIGNMENT & ROUTING
                                </Text>
                            </View>


                        </View>

                        <View style={styles.sectionBody}>

                            {/* Call Type */}
                            <FieldLabel
                                label="Call Type"
                                required
                            />

                            <DropdownField
                                value={form.callType}
                                placeholder="Select call type"
                                hasError={!!errors.callType}
                                onPress={() =>
                                    setDropdown(
                                        dropdown === "callType"
                                            ? null
                                            : "callType"
                                    )
                                }
                            />

                            {renderDropdown(
                                "callType",
                                callTypes
                            )}

                            {/* Account Manager */}
                            <FieldLabel
                                label="Account Manager"
                                required
                            />

                            <DropdownField
                                value={form.accountManager}
                                placeholder="Select an account manager"
                                hasError={!!errors.accountManager}
                                onPress={() =>
                                    setDropdown(
                                        dropdown === "accountManager"
                                            ? null
                                            : "accountManager"
                                    )
                                }
                            />

                            {renderDropdown(
                                "accountManager",
                                accountManagers
                            )}

                            {/* Assigned By */}
                            <FieldLabel
                                label="Assigned By"
                                required
                            />

                            <DropdownField
                                value={form.assignedBy}
                                placeholder="Person in the company who assigned this ticket"
                                hasError={!!errors.assignedBy}
                                onPress={() =>
                                    setDropdown(
                                        dropdown === "assignedBy"
                                            ? null
                                            : "assignedBy"
                                    )
                                }
                            />

                            {renderDropdown(
                                "assignedBy",
                                assignedPeople
                            )}

                            {/* Assigned To */}
                            <FieldLabel
                                label="Assigned To"
                                required
                            />

                            <DropdownField
                                value={form.assignedTo}
                                placeholder="Select employees"
                                hasError={!!errors.assignedTo}
                                onPress={() =>
                                    setDropdown(
                                        dropdown === "assignedTo"
                                            ? null
                                            : "assignedTo"
                                    )
                                }
                            />

                            {renderDropdown(
                                "assignedTo",
                                assignedPeople
                            )}

                            {/* Priority */}
                            <FieldLabel
                                label="Priority"
                                required
                            />

                            <DropdownField
                                value={form.priority}
                                placeholder="Select priority"
                                hasError={!!errors.priority}
                                onPress={() =>
                                    setDropdown(
                                        dropdown === "priority"
                                            ? null
                                            : "priority"
                                    )
                                }
                            />

                            {renderDropdown(
                                "priority",
                                priorities
                            )}

                            {/* Internal Tag */}
                            <FieldLabel label="Internal Tag" />

                            <DropdownField
                                value={form.internalTag}
                                placeholder="Select internal tag"
                                onPress={() =>
                                    setDropdown(
                                        dropdown === "internalTag"
                                            ? null
                                            : "internalTag"
                                    )
                                }
                            />

                            {renderDropdown(
                                "internalTag",
                                internalTags
                            )}

                        </View>
                    </View>

                    <View style={styles.bottomSpace} />
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Bottom action bar */}
            <View style={[
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
                    onPress={handleCreateTicket}
                    activeOpacity={0.8}
                >
                    <Ionicons
                        name="add"
                        size={21}
                        color="#FFFFFF"
                    />

                    <Text style={styles.createText}>
                        Create Ticket
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Company picker */}
            <Modal
                visible={companyModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() =>
                    setCompanyModalVisible(false)
                }
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.companyModal}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                Select Company
                            </Text>

                            <TouchableOpacity
                                onPress={() =>
                                    setCompanyModalVisible(false)
                                }
                            >
                                <Ionicons
                                    name="close"
                                    size={23}
                                    color="#52647A"
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.companySearchBox}>
                            <Ionicons
                                name="search-outline"
                                size={18}
                                color="#8AA0BA"
                            />

                            <TextInput
                                style={styles.companySearchInput}
                                placeholder="Search company..."
                                placeholderTextColor="#91A0B2"
                                value={companySearch}
                                onChangeText={setCompanySearch}
                                autoFocus
                            />
                        </View>

                        <ScrollView
                            style={styles.companyList}
                            keyboardShouldPersistTaps="handled"
                        >
                            {filteredCompanies.map((company) => (
                                <TouchableOpacity
                                    key={company.name}
                                    style={styles.companyOption}
                                    onPress={() => selectCompany(company)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.companyOptionText}>
                                        {company.name}
                                    </Text>

                                    {form.companyName === company.name && (
                                        <Ionicons
                                            name="checkmark"
                                            size={18}
                                            color="#174F8A"
                                        />
                                    )}
                                </TouchableOpacity>
                            ))}

                            {filteredCompanies.length === 0 && (
                                <Text style={styles.noResults}>
                                    No companies found
                                </Text>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Deadline date picker */}
            {deadlinePickerVisible &&
                Platform.OS === "android" && (
                    <DateTimePicker
                        value={deadlineDate || new Date()}
                        mode="date"
                        display="calendar"
                        onChange={(event, date) => {
                            setDeadlinePickerVisible(false);

                            if (
                                event.type === "dismissed" ||
                                !date
                            ) {
                                return;
                            }

                            setDeadlineDate(date);
                            updateField(
                                "deadlineDate",
                                formatDateForForm(date)
                            );
                        }}
                    />
                )}

            {Platform.OS === "ios" && (
                <Modal
                    visible={deadlinePickerVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={() =>
                        setDeadlinePickerVisible(false)
                    }
                >
                    <View style={styles.dateModalOverlay}>
                        <View style={styles.dateModalCard}>
                            <View style={styles.dateModalHeader}>
                                <Text style={styles.dateModalTitle}>
                                    Select Deadline Date
                                </Text>

                                <TouchableOpacity
                                    onPress={() =>
                                        setDeadlinePickerVisible(false)
                                    }
                                >
                                    <Text style={styles.dateModalCancel}>
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <DateTimePicker
                                value={deadlineDate || new Date()}
                                mode="date"
                                display="inline"
                                accentColor="#174F8A"
                                onChange={(event, date) => {
                                    if (
                                        event.type === "dismissed"
                                    ) {
                                        setDeadlinePickerVisible(false);
                                        return;
                                    }

                                    if (date) {
                                        setDeadlineDate(date);
                                        updateField(
                                            "deadlineDate",
                                            formatDateForForm(date)
                                        );
                                        setDeadlinePickerVisible(false);
                                    }
                                }}
                            />
                        </View>
                    </View>
                </Modal>
            )}

            {/* Add Account Manager */}
            <Modal
                visible={accountManagerModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() =>
                    setAccountManagerModalVisible(false)
                }
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.accountManagerModal}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                Add Account Manager
                            </Text>

                            <TouchableOpacity
                                onPress={() =>
                                    setAccountManagerModalVisible(false)
                                }
                            >
                                <Ionicons
                                    name="close"
                                    size={23}
                                    color="#52647A"
                                />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.modalLabel}>
                            Name *
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Enter name"
                            placeholderTextColor="#91A0B2"
                            value={newAccountManagerName}
                            onChangeText={setNewAccountManagerName}
                        />

                        <Text style={styles.modalLabel}>
                            Email *
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Enter email address"
                            placeholderTextColor="#91A0B2"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={newAccountManagerEmail}
                            onChangeText={setNewAccountManagerEmail}
                        />

                        <TouchableOpacity
                            style={styles.addManagerButton}
                            onPress={() => {
                                if (
                                    !newAccountManagerName.trim() ||
                                    !newAccountManagerEmail.trim()
                                ) {
                                    Alert.alert(
                                        "Required Fields",
                                        "Please enter both name and email."
                                    );
                                    return;
                                }

                                updateField(
                                    "accountManager",
                                    newAccountManagerName.trim()
                                );

                                setNewAccountManagerName("");
                                setNewAccountManagerEmail("");
                                setAccountManagerModalVisible(false);
                            }}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.addManagerButtonText}>
                                Add Account Manager
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
            {required && (
                <Text style={styles.required}> *</Text>
            )}
        </Text>
    );
}

function DropdownField({
    value,
    placeholder,
    hasError,
    onPress,
}: {
    value: string;
    placeholder: string;
    hasError?: boolean;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity
            style={[
                styles.selectField,
                hasError && styles.errorField,
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text
                style={[
                    styles.selectText,
                    !value && styles.placeholderText,
                ]}
                numberOfLines={1}
            >
                {value || placeholder}
            </Text>

            <Ionicons
                name="chevron-down"
                size={17}
                color="#71839A"
            />
        </TouchableOpacity>
    );
}

function ReadOnlyField({
    value,
    placeholder,
    multiline = false,
    hasError = false,
}: {
    value: string;
    placeholder: string;
    multiline?: boolean;
    hasError?: boolean;
}) {
    return (
        <View
            style={[
                styles.readOnlyField,
                multiline && styles.readOnlyMultiline,
                hasError && styles.errorField,
            ]}
        >
            <Text
                style={[
                    styles.readOnlyText,
                    !value && styles.placeholderText,
                ]}
            >
                {value || placeholder}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#F4F7FB",
    },

    flex: {
        flex: 1,
    },
    multilineInput: {
        minHeight: 100,
        paddingTop: 12,
        textAlignVertical: "top",
    },

    header: {
        height: 62,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#E4EAF1",
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
    },

    brandRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    brand: {
        fontSize: 17,
        fontWeight: "800",
        letterSpacing: 0.8,
        color: "#174F8A",
    },

    brandDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: "#2E72D2",
        marginLeft: 4,
    },

    brandSubtitle: {
        fontSize: 8,
        letterSpacing: 1,
        color: "#8494A8",
        marginTop: 1,
    },

    profileBadge: {
        height: 34,
        borderRadius: 18,
        backgroundColor: "#F3F6FA",
        borderWidth: 1,
        borderColor: "#DCE4ED",
        flexDirection: "row",
        alignItems: "center",
        paddingRight: 9,
        paddingLeft: 3,
    },

    avatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#DCE5F0",
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

    pageHeader: {
        height: 43,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#F4F7FB",
    },

    pageTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: "#25354B",
    },

    resetText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#61748B",
    },

    scroll: {
        flex: 1,
    },

    content: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 20,
    },

    fieldLabel: {
        fontSize: 12,
        fontWeight: "500",
        color: "#34465D",
        marginBottom: 7,
        marginTop: 12,
    },

    required: {
        color: "#E33434",
    },

    input: {
        minHeight: 43,
        borderWidth: 1,
        borderColor: "#D8E1EC",
        borderRadius: 9,
        backgroundColor: "#F8FAFC",
        paddingHorizontal: 13,
        fontSize: 13,
        color: "#26364B",
    },

    selectField: {
        minHeight: 43,
        borderWidth: 1,
        borderColor: "#D8E1EC",
        borderRadius: 9,
        backgroundColor: "#F8FAFC",
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
    },

    selectText: {
        flex: 1,
        fontSize: 13,
        color: "#26364B",
        marginLeft: 3,
    },

    placeholderText: {
        color: "#8797A9",
    },

    lockedInput: {
        minHeight: 43,
        borderWidth: 1,
        borderColor: "#D8E1EC",
        borderRadius: 9,
        backgroundColor: "#F0F4F8",
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
    },

    lockedText: {
        fontSize: 13,
        color: "#52647A",
        marginLeft: 9,
    },

    readOnlyField: {
        minHeight: 43,
        borderWidth: 1,
        borderColor: "#D8E1EC",
        borderRadius: 9,
        backgroundColor: "#F0F4F8",
        justifyContent: "center",
        paddingHorizontal: 13,
    },

    readOnlyMultiline: {
        minHeight: 66,
        justifyContent: "flex-start",
        paddingTop: 11,
    },

    readOnlyText: {
        fontSize: 13,
        color: "#52647A",
        lineHeight: 19,
    },

    textArea: {
        minHeight: 92,
        paddingTop: 12,
    },

    errorField: {
        borderColor: "#E33434",
    },

    dropdownList: {
        maxHeight: 220,
        marginTop: 5,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#D8E1EC",
        borderRadius: 10,
        overflow: "hidden",
    },

    dropdownOption: {
        minHeight: 40,
        paddingHorizontal: 13,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "#EEF2F6",
    },

    dropdownOptionText: {
        fontSize: 12,
        color: "#26364B",
    },

    addAccountManagerOption: {
        minHeight: 43,
        paddingHorizontal: 13,
        flexDirection: "row",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "#E5EAF0",
    },

    addAccountManagerText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#174F8A",
        marginLeft: 6,
    },

    bottomSpace: {
        height: 35,
    },

    actionBar: {
        minHeight: 73,
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: "#DCE4ED",
        paddingHorizontal: 16,
        paddingTop: 10,
        flexDirection: "row",
        gap: 12,
    },

    cancelButton: {
        width: 112,
        minHeight: 46,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#C9D5E3",
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
    },

    cancelText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#405269",
    },

    createButton: {
        flex: 1,
        minHeight: 46,
        borderRadius: 12,
        backgroundColor: "#092E63",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
    },

    createText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#FFFFFF",
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.38)",
        justifyContent: "flex-end",
    },

    companyModal: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: "82%",
        paddingTop: 15,
        paddingBottom: 15,
    },

    modalHeader: {
        paddingHorizontal: 17,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 13,
    },

    modalTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#26364B",
    },

    companySearchBox: {
        marginHorizontal: 16,
        minHeight: 43,
        borderWidth: 1,
        borderColor: "#D8E1EC",
        borderRadius: 9,
        backgroundColor: "#F8FAFC",
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
    },

    companySearchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 13,
        color: "#26364B",
    },

    companyList: {
        marginTop: 10,
    },

    companyOption: {
        minHeight: 44,
        paddingHorizontal: 17,
        borderBottomWidth: 1,
        borderBottomColor: "#EEF2F6",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    companyOptionText: {
        flex: 1,
        fontSize: 12,
        color: "#26364B",
        marginRight: 10,
    },

    noResults: {
        textAlign: "center",
        paddingVertical: 30,
        fontSize: 12,
        color: "#7C8DA1",
    },

    dateModalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.35)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 18,
    },

    dateModalCard: {
        width: "100%",
        maxWidth: 360,
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        paddingTop: 16,
        paddingBottom: 12,
    },

    dateModalHeader: {
        paddingHorizontal: 18,
        paddingBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    dateModalTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#16243A",
    },

    dateModalCancel: {
        fontSize: 13,
        fontWeight: "600",
        color: "#174F8A",
    },

    accountManagerModal: {
        width: "90%",
        maxWidth: 360,
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 18,
        alignSelf: "center",
    },

    modalLabel: {
        fontSize: 12,
        fontWeight: "500",
        color: "#34465D",
        marginBottom: 7,
        marginTop: 8,
    },

    addManagerButton: {
        minHeight: 45,
        borderRadius: 10,
        backgroundColor: "#092E63",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 14,
    },

    addManagerButtonText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "700",
    },

    /* =========================================================
   FORM SECTIONS
========================================================= */

    formSection: {
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
        flexShrink: 1,
    },

    sectionTitle: {
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 0.7,
        color: "#34465E",
        marginLeft: 7,
        flexShrink: 1,
    },

    requiredText: {
        fontSize: 10,
        color: "#E53935",
        fontWeight: "500",
        marginLeft: 8,
    },

    sectionBody: {
        padding: 16,
    },
});