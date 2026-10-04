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
import { COLORS } from "../../constants/colors";


import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
    router,
    useLocalSearchParams,
} from "expo-router";

import { temporaryCustomers } from "../../data/customer";
import { temporaryTickets } from "../../data/tickets";

import { companies } from "../../data/newTicket";
import { Company, NewTicketForm } from "../../types/newTicket";
import EmployeeBackHeader from "../../components/employee/navigation/EmployeeBackHeader";

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
    "Pranesh Kute",
    "Raghavendra Mishra",
    "Rohit Kumar",
    "Yash Gupta",
];

const priorities = ["P1", "P2", "P3", "P4"];

const internalTags = ["External", "Internal"];

// const formatDate = (date: Date) => {
//     const day = String(date.getDate()).padStart(2, "0");
//     /*const month = String(date.getMonth() + 1).padStart(2, "0");*/
//     const year = date.getFullYear();

//     return `${day} ${date.toLocaleString("en-US", {
//         month: "short",
//     })} ${year}`;
// };

const formatDateForForm = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

export default function EditTicketScreen() {
    const insets = useSafeAreaInsets();

    const {
        ticketNo,
    } = useLocalSearchParams<{
        ticketNo?: string;
    }>();

    const temporaryCurrentEmployee =
        "Pranesh Kute";

    const ticket =
        temporaryTickets.find(
            (item) =>
                item.ticketNo === ticketNo &&
                item.assignedTo ===
                temporaryCurrentEmployee
        );

    const customer =
        ticket
            ? temporaryCustomers.find(
                (item) =>
                    item.id ===
                    ticket.customerId
            )
            : undefined;


    const [form, setForm] =
        useState<NewTicketForm>(() => ({
            dateReceived: ticket?.date ?? "",
            mode: ticket?.mode ?? "Call",
            companyName: customer?.company ?? "",
            contactName: customer?.contactName ?? "",
            contactNo: customer?.contactNo ?? "",
            emailId: customer?.email ?? "",
            address: customer?.address ?? "",
            model: ticket?.model ?? "",
            serialNumbers: ticket?.serialNumbers ?? "",
            problem: ticket?.problem ?? "",
            callType: ticket?.callType ?? "",
            accountManager: ticket?.accountManager ?? "",
            assignedBy: ticket?.assignedBy ?? "",
            assignedTo: ticket?.assignedTo ?? "",
            deadlineDate: ticket?.deadline === "—" ? "" : ticket?.deadline ?? "",
            priority: ticket?.priority ?? "P3",
            internalTag: ticket?.internalTag ?? "External",
        }));

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
                "Please fill all mandatory fields before saving the ticket."
            );
            return false;
        }

        return true;
    };

    const handleSaveChanges = () => {
        if (!validateForm()) {
            return;
        }

        Alert.alert(
            "Save Changes",
            "Ticket update is ready. API submission will be connected when the backend integration is available."
        );
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
                                    color={COLORS.navigationActive}
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
                                color={COLORS.navigationActive}
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
        <SafeAreaView style={styles.screen}
            edges={["top", "left", "right"]}>
            <StatusBar
                style="dark"
                backgroundColor={COLORS.white}
            />
            {/* Header */}
            <EmployeeBackHeader
                title="Edit Ticket"
                onBackPress={() => router.back()}
            />

            {/* Page heading */}
            <View style={styles.pageHeader}>
                <Text style={styles.pageTitle}>Edit Ticket</Text>

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
                                    color={COLORS.iconGrey}
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



                        </View>
                    </View>




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
                                    color={COLORS.iconGrey}
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
                                placeholderTextColor={COLORS.danger}
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
                                placeholderTextColor={COLORS.placeholder}
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
                                placeholderTextColor={COLORS.placeholder}
                                value={form.problem}
                                onChangeText={(value) =>
                                    updateField("problem", value)
                                }
                                multiline
                                textAlignVertical="top"
                            />

                        </View>
                    </View>



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
                                    name="calendar-outline"
                                    size={17}
                                    color={COLORS.iconGrey}
                                />

                                <Text
                                    style={[
                                        styles.selectText,
                                        !form.deadlineDate &&
                                        styles.placeholderText,
                                    ]}
                                >
                                    {form.deadlineDate ||
                                        "No deadline"}
                                </Text>
                            </TouchableOpacity>

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
                    onPress={handleSaveChanges}
                    activeOpacity={0.8}
                >
                    <Text style={styles.createText}>
                        Save Changes
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
                                color={COLORS.iconGrey}
                            />

                            <TextInput
                                style={styles.companySearchInput}
                                placeholder="Search company..."
                                placeholderTextColor={COLORS.placeholder}
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
                            placeholderTextColor={COLORS.placeholder}
                            value={newAccountManagerName}
                            onChangeText={setNewAccountManagerName}
                        />

                        <Text style={styles.modalLabel}>
                            Email *
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Enter email address"
                            placeholderTextColor={COLORS.placeholder}
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
        backgroundColor: COLORS.background,
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
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.white,
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
        color: COLORS.navigationActive,
    },

    brandDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: COLORS.navigationActive,
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
        borderColor: COLORS.border,
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
        backgroundColor: COLORS.background,
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
        color: COLORS.textBody,
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
        color: COLORS.textBody,
        marginLeft: 3,
    },

    placeholderText: {
        color: "#8797A9",
    },

    lockedInput: {
        minHeight: 43,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 9,
        backgroundColor: COLORS.background,
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
        borderColor: COLORS.border,
        borderRadius: 9,
        backgroundColor: COLORS.background,
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
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
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
        borderBottomColor: COLORS.border,
    },

    dropdownOptionText: {
        fontSize: 12,
        color: COLORS.textBody,
    },

    addAccountManagerOption: {
        minHeight: 43,
        paddingHorizontal: 13,
        flexDirection: "row",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: COLORS.divider,
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
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingHorizontal: 16,
        paddingTop: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    cancelButton: {
        width: 112,
        minHeight: 46,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#C9D5E3",
        backgroundColor: COLORS.white,
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
        backgroundColor: COLORS.primaryDark,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
    },

    createText: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.white,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.38)",
        justifyContent: "flex-end",
    },

    companyModal: {
        backgroundColor: COLORS.white,
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
        color: COLORS.textBody,
    },

    companySearchBox: {
        marginHorizontal: 16,
        minHeight: 43,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 9,
        backgroundColor: COLORS.background,
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
        marginTop: 10,
    },

    companyOption: {
        minHeight: 44,
        paddingHorizontal: 17,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
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
        backgroundColor: COLORS.white,
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
        color: COLORS.textDark,
    },

    dateModalCancel: {
        fontSize: 13,
        fontWeight: "600",
        color: "#174F8A",
    },

    accountManagerModal: {
        width: "90%",
        maxWidth: 360,
        backgroundColor: COLORS.white,
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
        backgroundColor: COLORS.primaryDark,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 14,
    },

    addManagerButtonText: {
        color: COLORS.white,
        fontSize: 13,
        fontWeight: "700",
    },

    /* =========================================================
   FORM SECTIONS
========================================================= */

    formSection: {
        backgroundColor: COLORS.white,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 14,
        overflow: "hidden",
    },

    sectionHeader: {
        minHeight: 42,
        backgroundColor: COLORS.background,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
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