import React, { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Animated,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { StatusBar } from "expo-status-bar";
import { COLORS } from "../../constants/colors";

import type {
    CustomerDirectoryEntry,
    MetaOptions,
    TicketFormInput,
} from "../../types/ticket";

import {
    createTicket,
    fetchMetaOptions,
} from "../../api/tickets";

// import {
//     createAccountManager,
// } from "../../api/accountManagers";

import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";

// import { companies } from "../../data/newTicket";
// import { Company, NewTicketForm } from "../../types/newTicket";
import { NewTicketForm } from "../../types/newTicket";
import BackHeader from "../../components/admin/navigation/BackHeader";

// const modes : TicketMode [] = [
//     "Call",
//     "Whatsapp",
//     "Mail",
//     "Verbally",
//     "Website",
// ];

// const callTypes: CallType[] = [
//   "Warranty",
//   "OEM",
//   "AMC",
//   "Office",
//   "Installation",
//   "POC",
//   "Call",
//   "Chargeable",
//   "Non-Chargeable",
//   "Routine Checks",
// ];

// const accountManagers = [
//     "Aishwarya",
//     "Aishwarya Tambe",
//     "Anjaneyulu Mallelli",
//     "Archana Mishra",
//     "Braj Bala",
//     "Computer Center",
//     "Dil B Thapa",
//     "D.S. Rawat",
//     "Gaurav Dubey",
//     "Hardik Narielwala",
//     "Hardik Sir",
//     "Hemang Shah",
//     "Himanshu Parikh",
//     "Jitesh Malhotra",
//     "Manoj Mohite",
//     "Mr. Sundaram",
//     "Parmanand Pandey",
//     "Pranesh Kute",
//     "Radheshyam G",
//     "Rajesh Mishra",
//     "R Arul Babu",
//     "Sachin Gupta",
//     "Sanyukt Saransh",
//     "Sheetal Sawant",
//     "T Srinivasa",
// ];

// const assignedPeople = [
//     "Ajay Malik",
//     "Jitesh Malhotra",
//     "Manoj",
//     "Narendar Kumar",
//     "Nikhil Kumar",
//     "Parmanand Pandey",
//     "Pranesh",
//     "Raghavendra Mishra",
//     "Rohit Kumar",
//     "Yash Gupta",
// ];

// const priorities: TicketPriority[] = [
//   "P1",
//   "P2",
//   "P3",
//   "P4",
// ];

// const internalTags: InternalTag[] = [
//   "External",
//   "Internal",
// ];

const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    /*const month = String(date.getMonth() + 1).padStart(2, "0");*/
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

const formatDateForApi = (date: Date) => {
    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
};
type DropdownKey =
    | "mode"
    | "callType"
    | "accountManager"
    | "assignedTo"
    | "assignedBy"
    | "priority"
    | "internalTag";

export default function NewTicketScreen() {
    const insets = useSafeAreaInsets();

    const today = new Date();
    const [metaOptions, setMetaOptions] =
        useState<MetaOptions | null>(null);

    const [companyBackdropOpacity] =
        useState(() => new Animated.Value(0));

    const [companySheetTranslateY] =
        useState(() => new Animated.Value(300));

    const [isLoadingOptions, setIsLoadingOptions] =
        useState(true);

    const [optionsError, setOptionsError] =
        useState<string | null>(null);

    const [isCreatingTicket, setIsCreatingTicket] =
        useState(false);

    const assignedByOptions =
        metaOptions?.assignedBys ?? [];
    // const [
    //     isCreatingAccountManager,
    //     setIsCreatingAccountManager,
    // ] = useState(false);

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

    const [dropdown, setDropdown] = useState<DropdownKey | null>(null);


    const [dropdownPosition, setDropdownPosition] =
        useState<{
            top: number;
            left: number;
            width: number;
        } | null>(null);

    const openCompanyModal = () => {
        companyBackdropOpacity.setValue(0);
        companySheetTranslateY.setValue(300);

        setCompanyModalVisible(true);

        requestAnimationFrame(() => {
            Animated.parallel([
                Animated.timing(
                    companyBackdropOpacity,
                    {
                        toValue: 1,
                        duration: 180,
                        useNativeDriver: true,
                    }
                ),

                Animated.timing(
                    companySheetTranslateY,
                    {
                        toValue: 0,
                        duration: 220,
                        useNativeDriver: true,
                    }
                ),
            ]).start();
        });
    };
    const closeCompanyModal = () => {
        Animated.parallel([
            Animated.timing(
                companyBackdropOpacity,
                {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }
            ),

            Animated.timing(
                companySheetTranslateY,
                {
                    toValue: 300,
                    duration: 190,
                    useNativeDriver: true,
                }
            ),
        ]).start(() => {
            setCompanyModalVisible(false);
            setCompanySearch("");
        });
    };

    const [deadlinePickerVisible, setDeadlinePickerVisible] = useState(false);
    const [deadlineDate, setDeadlineDate] = useState<Date | null>(null);

    const [accountManagerModalVisible, setAccountManagerModalVisible] =
        useState(false);

    const [newAccountManagerName, setNewAccountManagerName] = useState("");
    const [newAccountManagerEmail, setNewAccountManagerEmail] = useState("");

    // const [
    //     assignedByModalVisible,
    //     setAssignedByModalVisible,
    // ] = useState(false);

    // const [
    //     newAssignedByName,
    //     setNewAssignedByName,
    // ] = useState("");

    const [errors, setErrors] = useState<Record<string, boolean>>({});
    useEffect(() => {
        let active = true;

        fetchMetaOptions()
            .then((data) => {
                if (!active) {
                    return;
                }

                setMetaOptions(data);
                setOptionsError(null);
            })
            .catch((error) => {
                console.log(
                    "New Ticket meta options error:",
                    error
                );

                if (!active) {
                    return;
                }

                setOptionsError(
                    "Unable to load ticket form options."
                );
            })
            .finally(() => {
                if (active) {
                    setIsLoadingOptions(false);
                }
            });

        return () => {
            active = false;
        };
    }, []);

    const modes =
        metaOptions?.modes ?? [];

    const callTypes =
        metaOptions?.callTypes ?? [];

    const accountManagers =
        metaOptions?.accountManagerDirectory.map(
            (manager) => manager.name
        ) ?? [];

    const assignedToOptions =
        metaOptions?.assignedToOptions.map(
            (employee) => employee.displayName
        ) ?? [];

    const priorities =
        metaOptions?.priorities ?? [];

    const internalTags =
        metaOptions?.internalTags ?? [];

    // const filteredCompanies = useMemo(() => {
    //     const search = companySearch.trim().toLowerCase();

    //     if (!search) {
    //         return companies;
    //     }

    //     return companies.filter((company) =>
    //         company.name.toLowerCase().includes(search)
    //     );
    // }, [companySearch]);

    const filteredCompanies = useMemo(() => {
        const customers =
            metaOptions?.customers ?? [];

        const search =
            companySearch.trim().toLowerCase();

        if (!search) {
            return customers;
        }

        return customers.filter((company) =>
            company.name
                .toLowerCase()
                .includes(search)
        );
    }, [
        companySearch,
        metaOptions,
    ]);
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

    const selectCompany = (
        company: CustomerDirectoryEntry
    ) => {
        setForm((current) => ({
            ...current,
            companyName: company.name,
            contactName: company.contactName ?? "",
            contactNo: company.contactNo ?? "",
            emailId: company.emailId ?? "",
            address: company.address ?? "",
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

    // const handleCreateTicket = () => {
    //     if (!validateForm()) {
    //         return;
    //     }

    //     Alert.alert(
    //         "Ready to Create",
    //         "All required fields are filled. API submission will be connected later."
    //     );
    // };

    const handleCreateTicket = async () => {
        if (!validateForm()) {
            return;
        }

        if (!metaOptions) {
            Alert.alert(
                "Unable to Create Ticket",
                "Ticket options have not finished loading."
            );

            return;
        }

        if (isCreatingTicket) {
            return;
        }

        const selectedAccountManager =
            metaOptions.accountManagerDirectory.find(
                (manager) =>
                    manager.name ===
                    form.accountManager
            );

        if (!selectedAccountManager) {
            Alert.alert(
                "Account Manager",
                "Please select a valid account manager."
            );

            return;
        }

        const selectedAssignee =
            metaOptions.assignedToOptions.find(
                (employee) =>
                    employee.displayName ===
                    form.assignedTo
            );

        if (!selectedAssignee) {
            Alert.alert(
                "Assigned To",
                "Please select a valid employee."
            );

            return;
        }

        const input: TicketFormInput = {
            ticketDate:
                formatDateForApi(today),

            mode: form.mode,

            companyName:
                form.companyName.trim(),

            contactName:
                form.contactName.trim() ||
                undefined,

            contactNo:
                form.contactNo.trim() ||
                undefined,

            emailId:
                form.emailId.trim() ||
                undefined,

            address:
                form.address.trim() ||
                undefined,

            model:
                form.model.trim() ||
                undefined,

            serialNumber:
                form.serialNumbers.trim() ||
                undefined,

            problem:
                form.problem.trim(),

            accountManagerId:
                selectedAccountManager.id,

            assignedBy:
                form.assignedBy.trim(),

            callType:
                form.callType,

            assigneeUserIds: [
                selectedAssignee.id,
            ],

            priority:
                form.priority,

            deadlineDate:
                deadlineDate
                    ? formatDateForApi(
                        deadlineDate
                    )
                    : undefined,

            internalTag:
                form.internalTag,
        };

        try {
            setIsCreatingTicket(true);

            const createdTicket =
                await createTicket(input);

            Alert.alert(
                "Ticket Created",
                `Ticket #${createdTicket.ticketNo} was created successfully.`,
                [
                    {
                        text: "OK",
                        onPress: () => {
                            router.replace("/home");
                        },
                    },
                ]
            );
        } catch (error) {
            console.log(
                "Create ticket error:",
                error
            );

            Alert.alert(
                "Unable to Create Ticket",
                "The ticket could not be created. Please check the entered information and try again."
            );
        } finally {
            setIsCreatingTicket(false);
        }
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

    const openDropdown = (
        field: DropdownKey,
        event: any
    ) => {
        event.currentTarget.measureInWindow(
            (
                x: number,
                y: number,
                width: number,
                height: number
            ) => {
                setDropdown(field);

                setDropdownPosition({
                    left: x,
                    top: y + height + 4,
                    width,
                });
            }
        );
    };

    const closeDropdown = () => {
        setDropdown(null);
        setDropdownPosition(null);
    };

    // const renderDropdown = (
    //     field: "mode" | "callType" | "accountManager" | "assignedBy" | "assignedTo" | "priority" | "internalTag",
    //     options: string[]
    // ) => {
    //     if (dropdown !== field) {
    //         return null;
    //     }

    //     return (
    //         <View style={styles.dropdownList}>
    //             <ScrollView
    //                 nestedScrollEnabled
    //                 showsVerticalScrollIndicator={false}
    //                 keyboardShouldPersistTaps="handled"
    //             >
    //                 {options.map((option) => (
    //                     <TouchableOpacity
    //                         key={option}
    //                         style={styles.dropdownOption}
    //                         onPress={() => {
    //                             updateField(field, option);
    //                             setDropdown(null);
    //                         }}
    //                         activeOpacity={0.7}
    //                     >
    //                         <Text style={styles.dropdownOptionText}>{option}</Text>

    //                         {form[field] === option && (
    //                             <Ionicons
    //                                 name="checkmark"
    //                                 size={17}
    //                                 color="#174F8A"
    //                             />
    //                         )}
    //                     </TouchableOpacity>
    //                 ))}

    //                 {field === "accountManager" && (
    //                     <TouchableOpacity
    //                         style={styles.addAccountManagerOption}
    //                         onPress={() => {
    //                             setDropdown(null);
    //                             setAccountManagerModalVisible(true);
    //                         }}
    //                         activeOpacity={0.7}
    //                     >
    //                         <Ionicons
    //                             name="add"
    //                             size={18}
    //                             color="#174F8A"
    //                         />
    //                         <Text style={styles.addAccountManagerText}>
    //                             Add Account Manager
    //                         </Text>
    //                     </TouchableOpacity>
    //                 )}
    //             </ScrollView>
    //         </View>
    //     );
    // };


    const getDropdownOptions = (
        field: DropdownKey
    ): string[] => {
        switch (field) {
            case "mode":
                return modes;

            case "callType":
                return callTypes;

            case "accountManager":
                return accountManagers;

            case "assignedTo":
                return assignedToOptions;

            case "assignedBy":
                return assignedByOptions;

            case "priority":
                return priorities;

            case "internalTag":
                return internalTags;

            default:
                return [];
        }
    };
    return (
        <SafeAreaView style={styles.screen}
            edges={["top", "left", "right"]}>
            <StatusBar
                style="dark"
                backgroundColor={COLORS.white}
            />
            {/* Header */}
            <BackHeader
                title="New Ticket"
                onBackPress={() => router.back()}
            />

            {/* Page heading */}
            <View style={styles.pageHeader}>
                <Text style={styles.pageTitle}></Text> 

                <TouchableOpacity
                    onPress={resetForm}
                    activeOpacity={0.7}
                >
                    <Text style={styles.resetText}>Clear</Text>
                </TouchableOpacity>
            </View>

            {isLoadingOptions && (
                <Text style={styles.formStatusText}>
                    Loading ticket options...
                </Text>
            )}

            {optionsError && (
                <Text style={styles.formErrorText}>
                    {optionsError}
                </Text>
            )}

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
                                    color={COLORS.navigationActive}
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
                                    color={COLORS.textLight}
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
                                onPress={(event) =>
                                    openDropdown("mode", event)
                                }
                            />

                            {/* {renderDropdown("mode", modes)} */}

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
                                    color={COLORS.textLight}
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




                    <View style={styles.formSection}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionTitleRow}>
                                <Ionicons
                                    name="business-outline"
                                    size={17}
                                    color={COLORS.navigationActive}
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
                                onPress={openCompanyModal
                                }
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name="search-outline"
                                    size={17}
                                    color={COLORS.textLight}
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
                                    color={COLORS.iconGrey}
                                />
                            </TouchableOpacity>

                            {/* Contact Name */}
                            <FieldLabel
                                label="Contact Name"
                                required
                            />

                            <TextInput
                                style={[
                                    styles.input,
                                    errors.contactName &&
                                    styles.errorField,
                                ]}
                                value={form.contactName}
                                placeholder="Enter contact name"
                                placeholderTextColor={
                                    COLORS.placeholder
                                }
                                onChangeText={(value) =>
                                    updateField(
                                        "contactName",
                                        value
                                    )
                                }
                            />

                            {/* Contact No */}
                            <FieldLabel
                                label="Contact No"
                                required
                            />

                            <TextInput
                                style={[
                                    styles.input,
                                    errors.contactNo &&
                                    styles.errorField,
                                ]}
                                value={form.contactNo}
                                placeholder="Enter contact number"
                                placeholderTextColor={
                                    COLORS.placeholder
                                }
                                keyboardType="phone-pad"
                                onChangeText={(value) =>
                                    updateField(
                                        "contactNo",
                                        value
                                    )
                                }
                            />

                            {/* Email */}
                            <FieldLabel
                                label="Email ID"
                                required
                            />

                            <TextInput
                                style={[
                                    styles.input,
                                    errors.emailId &&
                                    styles.errorField,
                                ]}
                                value={form.emailId}
                                placeholder="Enter email address"
                                placeholderTextColor={
                                    COLORS.placeholder
                                }
                                keyboardType="email-address"
                                autoCapitalize="none"
                                onChangeText={(value) =>
                                    updateField(
                                        "emailId",
                                        value
                                    )
                                }
                            />

                            {/* Address */}
                            <FieldLabel
                                label="Address"
                                required
                            />

                            <TextInput
                                style={[
                                    styles.input,
                                    styles.multilineInput,
                                    errors.address &&
                                    styles.errorField,
                                ]}
                                value={form.address}
                                placeholder="Enter company address"
                                placeholderTextColor={
                                    COLORS.placeholder
                                }
                                multiline
                                textAlignVertical="top"
                                onChangeText={(value) =>
                                    updateField(
                                        "address",
                                        value
                                    )
                                }
                            />

                        </View>
                    </View>




                    <View style={styles.formSection}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionTitleRow}>
                                <Ionicons
                                    name="desktop-outline"
                                    size={17}
                                    color={COLORS.navigationActive}
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
                                placeholderTextColor={COLORS.placeholder}
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
                                    color={COLORS.navigationActive}
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
                                onPress={(event) =>
                                    openDropdown(
                                        "callType",
                                        event
                                    )
                                }
                            />

                            {/* Account Manager */}
                            <FieldLabel
                                label="Account Manager"
                                required
                            />

                            <DropdownField
                                value={form.accountManager}
                                placeholder="Select an account manager"
                                hasError={!!errors.accountManager}
                                onPress={(event) =>
                                    openDropdown(
                                        "accountManager",
                                        event
                                    )
                                }
                            />



                            {/* Assigned By */}
                            <FieldLabel
                                label="Assigned By"
                                required
                            />

                            <View
                                style={[
                                    styles.assignedByField,
                                    errors.assignedBy &&
                                    styles.errorField,
                                ]}
                            >
                                <TextInput
                                    style={styles.assignedByInput}
                                    value={form.assignedBy}
                                    placeholder="Enter or select a name"
                                    placeholderTextColor={
                                        COLORS.placeholder
                                    }
                                    onChangeText={(value) =>
                                        updateField(
                                            "assignedBy",
                                            value
                                        )
                                    }
                                />

                                <TouchableOpacity
                                    style={styles.assignedByDropdownButton}
                                    onPress={(event) =>
                                        openDropdown(
                                            "assignedBy",
                                            event
                                        )
                                    }
                                    activeOpacity={0.7}
                                >
                                    <Ionicons
                                        name="chevron-down"
                                        size={17}
                                        color={COLORS.iconGrey}
                                    />
                                </TouchableOpacity>
                            </View>



                            {/* Assigned To */}
                            <FieldLabel
                                label="Assigned To"
                                required
                            />

                            <DropdownField
                                value={form.assignedTo}
                                placeholder="Select employees"
                                hasError={!!errors.assignedTo}
                                onPress={(event) =>
                                    openDropdown(
                                        "assignedTo",
                                        event
                                    )
                                }
                            />



                            {/* Priority */}
                            <FieldLabel
                                label="Priority"
                                required
                            />

                            <DropdownField
                                value={form.priority}
                                placeholder="Select priority"
                                hasError={!!errors.priority}
                                onPress={(event) =>
                                    openDropdown(
                                        "priority",
                                        event
                                    )
                                }
                            />


                            {/* Internal Tag */}
                            <FieldLabel label="Internal Tag" />

                            <DropdownField
                                value={form.internalTag}
                                placeholder="Select internal tag"
                                onPress={(event) =>
                                    openDropdown(
                                        "internalTag",
                                        event
                                    )
                                }
                            />



                        </View>
                    </View>

                    <View style={styles.bottomSpace} />
                </ScrollView>
            </KeyboardAvoidingView>

            {dropdown &&
                dropdownPosition && (
                    <Modal
                        transparent
                        visible
                        animationType="none"
                        onRequestClose={
                            closeDropdown
                        }
                    >
                        <Pressable
                            style={
                                styles.dropdownOverlay
                            }
                            onPress={
                                closeDropdown
                            }
                        >
                            <Pressable
                                style={[
                                    styles.floatingDropdown,
                                    {
                                        top:
                                            dropdownPosition.top,

                                        left:
                                            dropdownPosition.left,

                                        width:
                                            dropdownPosition.width,
                                    },
                                ]}
                                onPress={(event) =>
                                    event.stopPropagation()
                                }
                            >
                                <ScrollView
                                    style={
                                        styles.floatingDropdownScroll
                                    }
                                    nestedScrollEnabled
                                    showsVerticalScrollIndicator={
                                        false
                                    }
                                >
                                    {getDropdownOptions(
                                        dropdown
                                    ).map((option) => (
                                        <TouchableOpacity
                                            key={option}
                                            style={
                                                styles.floatingDropdownOption
                                            }
                                            onPress={() => {
                                                updateField(
                                                    dropdown,
                                                    option as never
                                                );

                                                closeDropdown();
                                            }}
                                            activeOpacity={0.7}
                                        >
                                            <Text
                                                style={
                                                    styles.floatingDropdownText
                                                }
                                            >
                                                {option}
                                            </Text>

                                            {form[dropdown] ===
                                                option && (
                                                    <Ionicons
                                                        name="checkmark"
                                                        size={18}
                                                        color={
                                                            COLORS.navigationActive
                                                        }
                                                    />
                                                )}
                                        </TouchableOpacity>
                                    ))}

                                    {getDropdownOptions(
                                        dropdown
                                    ).length === 0 && (
                                            <Text
                                                style={
                                                    styles.dropdownEmptyText
                                                }
                                            >
                                                No options available
                                            </Text>
                                        )}
                                </ScrollView>

                                {dropdown ===
                                    "accountManager" && (
                                        <TouchableOpacity
                                            style={
                                                styles.addAccountManagerOption
                                            }
                                            onPress={() => {
                                                closeDropdown();

                                                setAccountManagerModalVisible(
                                                    true
                                                );
                                            }}
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons
                                                name="add"
                                                size={18}
                                                color={
                                                    COLORS.navigationActive
                                                }
                                            />

                                            <Text
                                                style={
                                                    styles.addAccountManagerText
                                                }
                                            >
                                                Add Account Manager
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                            </Pressable>
                        </Pressable>
                    </Modal>
                )}

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
                    style={[
                        styles.createButton,
                        isCreatingTicket &&
                        styles.createButtonDisabled,
                    ]}
                    onPress={handleCreateTicket}
                    activeOpacity={0.8}
                    disabled={isCreatingTicket}
                >
                    <Ionicons
                        name="add"
                        size={21}
                        color={COLORS.white}
                    />

                    <Text style={styles.createText}>
                        {isCreatingTicket
                            ? "Creating..."
                            : "Create Ticket"}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Company picker */}
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
                            {
                                opacity: companyBackdropOpacity,
                            },
                        ]}
                    />

                    <Animated.View
                        style={[
                            styles.companyModal,
                            {
                                transform: [
                                    {
                                        translateY:
                                            companySheetTranslateY,
                                    },
                                ],
                            },
                        ]}
                    >
                        <View style={styles.accountManagerModalHeader}>
                            <Text style={styles.modalTitle}>
                                Select Company
                            </Text>

                            <TouchableOpacity
                                onPress={closeCompanyModal}
                            >
                                <Ionicons
                                    name="close"
                                    size={23}
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
                                placeholderTextColor={
                                    COLORS.placeholder
                                }
                                value={companySearch}
                                onChangeText={setCompanySearch}
                                autoFocus
                            />
                        </View>

                        <ScrollView
                            style={styles.companyList}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                        >
                            {filteredCompanies.map(
                                (company) => (
                                    <TouchableOpacity
                                        key={company.name}
                                        style={styles.companyOption}
                                        onPress={() =>
                                            selectCompany(company)
                                        }
                                        activeOpacity={0.7}
                                    >
                                        <Text
                                            style={
                                                styles.companyOptionText
                                            }
                                        >
                                            {company.name}
                                        </Text>

                                        {form.companyName ===
                                            company.name && (
                                                <Ionicons
                                                    name="checkmark"
                                                    size={18}
                                                    color={
                                                        COLORS.navigationActive
                                                    }
                                                />
                                            )}
                                    </TouchableOpacity>
                                )
                            )}

                            {filteredCompanies.length === 0 &&
                                companySearch.trim().length >
                                0 && (
                                    <TouchableOpacity
                                        style={styles.companyOption}
                                        onPress={() => {
                                            const newCompanyName =
                                                companySearch.trim();

                                            setForm((current) => ({
                                                ...current,
                                                companyName:
                                                    newCompanyName,
                                                contactName: "",
                                                contactNo: "",
                                                emailId: "",
                                                address: "",
                                            }));

                                            setErrors((current) => ({
                                                ...current,
                                                companyName: false,
                                            }));

                                            closeCompanyModal();
                                        }}
                                        activeOpacity={0.7}
                                    >
                                        <View>
                                            <Text
                                                style={
                                                    styles.companyOptionText
                                                }
                                            >
                                                Use &quot;
                                                {companySearch.trim()}
                                                &quot;
                                            </Text>

                                            <Text
                                                style={
                                                    styles.newCompanyHint
                                                }
                                            >
                                                Create as a new company
                                            </Text>
                                        </View>

                                        <Ionicons
                                            name="add-circle-outline"
                                            size={20}
                                            color={
                                                COLORS.navigationActive
                                            }
                                        />
                                    </TouchableOpacity>
                                )}
                        </ScrollView>
                    </Animated.View>
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
                                accentColor={COLORS.navigationActive}
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
                <Pressable
                    style={styles.accountManagerOverlay}
                    onPress={() =>
                        setAccountManagerModalVisible(false)
                    }
                >
                    <Pressable
                        style={styles.accountManagerModal}
                        onPress={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <View style={styles.accountManagerHeader}>
                            <Text style={styles.accountManagerTitle}>
                                Add Account Manager
                            </Text>

                            <TouchableOpacity
                                style={styles.accountManagerClose}
                                onPress={() =>
                                    setAccountManagerModalVisible(false)
                                }
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name="close"
                                    size={20}
                                    color={COLORS.textMuted}
                                />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.accountManagerLabel}>
                            Name *
                        </Text>

                        <TextInput
                            style={styles.accountManagerInput}
                            placeholder="Enter name"
                            placeholderTextColor={COLORS.placeholder}
                            value={newAccountManagerName}
                            onChangeText={setNewAccountManagerName}
                        />

                        <Text style={styles.accountManagerLabel}>
                            Email *
                        </Text>

                        <TextInput
                            style={styles.accountManagerInput}
                            placeholder="Enter email"
                            placeholderTextColor={COLORS.placeholder}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={newAccountManagerEmail}
                            onChangeText={setNewAccountManagerEmail}
                        />

                        <TouchableOpacity
                            style={styles.addManagerButton}
                            onPress={async () => {
                                const name =
                                    newAccountManagerName.trim();

                                const email =
                                    newAccountManagerEmail.trim();

                                if (!name || !email) {
                                    Alert.alert(
                                        "Required Fields",
                                        "Please enter both name and email."
                                    );
                                    return;
                                }

                                /*
                                 * Keep your real createAccountManager()
                                 * API call here if you already added it.
                                 *
                                 * Do NOT only update the frontend name,
                                 * because tickets require a real
                                 * accountManagerId.
                                 */

                                updateField(
                                    "accountManager",
                                    name
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
                    </Pressable>
                </Pressable>
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
    onPress: (event: any) => void;
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
                color={COLORS.iconGrey}
            />
        </TouchableOpacity>
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
        borderBottomColor: COLORS.border,
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

    // brand: {
    //     fontSize: 17,
    //     fontWeight: "800",
    //     letterSpacing: 0.8,
    //     color: COLORS.navigationActive,
    // },

    // brandDot: {
    //     width: 7,
    //     height: 7,
    //     borderRadius: 4,
    //     backgroundColor: COLORS.navigationActive,
    //     marginLeft: 4,
    // },

    // brandSubtitle: {
    //     fontSize: 8,
    //     letterSpacing: 1,
    //     color: COLORS.navigationActive,
    //     marginTop: 1,
    // },

    // profileBadge: {
    //     height: 34,
    //     borderRadius: 18,
    //     backgroundColor: COLORS.navigationActive,
    //     borderWidth: 1,
    //     borderColor: COLORS.border,
    //     flexDirection: "row",
    //     alignItems: "center",
    //     paddingRight: 9,
    //     paddingLeft: 3,
    // },

    // avatar: {
    //     width: 28,
    //     height: 28,
    //     borderRadius: 14,
    //     backgroundColor: COLORS.navigationActive,
    //     alignItems: "center",
    //     justifyContent: "center",
    // },

    // avatarText: {
    //     fontSize: 9,
    //     fontWeight: "700",
    //     color: "#53677D",
    // },

    // adminText: {
    //     fontSize: 10,
    //     color: COLORS.navigationActive,
    //     marginLeft: 5,
    // },

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
        color: COLORS.navigationActive,
    },

    resetText: {
        fontSize: 12,
        fontWeight: "600",
        color: COLORS.textPrimary,
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
        color: COLORS.textPrimary,
        marginBottom: 7,
        marginTop: 12,
    },

    required: {
        color: COLORS.danger,
    },

    input: {
        minHeight: 43,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 9,
        backgroundColor: COLORS.white,
        paddingHorizontal: 13,
        fontSize: 13,
        color: COLORS.textBody,
    },

    selectField: {
        minHeight: 43,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 9,
        backgroundColor: COLORS.white,
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
        color: COLORS.placeholder,
    },

    lockedInput: {
        minHeight: 43,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 9,
        backgroundColor: COLORS.searchButtonBackground,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
    },

    lockedText: {
        fontSize: 13,
        color: COLORS.placeholder,
        marginLeft: 9,
    },

    textArea: {
        minHeight: 92,
        paddingTop: 12,
    },

    errorField: {
        borderColor: COLORS.danger,
    },

    // dropdownList: {
    //     maxHeight: 220,
    //     marginTop: 5,
    //     backgroundColor: COLORS.white,
    //     borderWidth: 1,
    //     borderColor: "#D8E1EC",
    //     borderRadius: 10,
    //     overflow: "hidden",
    // },

    // dropdownOption: {
    //     minHeight: 40,
    //     paddingHorizontal: 13,
    //     flexDirection: "row",
    //     alignItems: "center",
    //     justifyContent: "space-between",
    //     borderBottomWidth: 1,
    //     borderBottomColor: "#EEF2F6",
    // },

    // dropdownOptionText: {
    //     fontSize: 12,
    //     color: COLORS.textBody,
    // },

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
        minHeight: 46,

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
        color: COLORS.navigationActive,
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
        borderColor: COLORS.border,
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center",
    },

    cancelText: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.textPrimary,
    },

    createButton: {
        flex: 1,
        // opacity: 0.8,
        minHeight: 46,
        borderRadius: 12,
        backgroundColor: COLORS.navigationActive,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
    },

    createButtonDisabled: {
        opacity: 0.6,
    },

    createText: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.white,
    },

    // modalOverlay: {
    //     flex: 1,
    //     backgroundColor: COLORS.overlay,
    //     justifyContent: "flex-end",
    // },

    modalOverlay: {
        flex: 1,
        backgroundColor: COLORS.overlay,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
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

    modalHeader: {
        paddingHorizontal: 17,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 13,
    },

    modalTitle: {
        fontSize: 16,
        left: 20,
        transform: [{ translateY: 4 }],
        fontWeight: "700",
        color: COLORS.textBody,
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

    // noResults: {
    //     textAlign: "center",
    //     paddingVertical: 30,
    //     fontSize: 12,
    //     color: COLORS.danger,
    // },

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
        color: COLORS.navigationActive,
    },

    // accountManagerModal: {
    //     width: "86%",
    //     maxWidth: 340,

    //     backgroundColor: COLORS.white,

    //     borderRadius: 20,

    //     paddingHorizontal: 20,
    //     paddingTop: 18,
    //     paddingBottom: 20,

    //     alignSelf: "center",

    //     shadowColor: COLORS.shadow,
    //     shadowOffset: {
    //         width: 0,
    //         height: 8,
    //     },
    //     shadowOpacity: 0.16,
    //     shadowRadius: 18,

    //     elevation: 10,
    // },

    // modalLabel: {
    //     fontSize: 12,
    //     fontWeight: "600",
    //     color: COLORS.textBody,

    //     marginBottom: 7,
    //     marginTop: 10,
    // },

    accountManagerOverlay: {
        flex: 1,

        backgroundColor: "rgba(0, 0, 0, 0.32)",

        justifyContent: "center",
        alignItems: "center",

        paddingHorizontal: 20,
    },

    accountManagerModal: {
        width: "100%",
        maxWidth: 360,

        backgroundColor: COLORS.white,

        borderRadius: 14,

        paddingHorizontal: 18,
        paddingTop: 16,
        paddingBottom: 18,

        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.14,
        shadowRadius: 14,

        elevation: 8,
    },

    accountManagerHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        marginBottom: 14,
    },

    accountManagerTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: COLORS.textDark,
    },

    accountManagerClose: {
        width: 28,
        height: 28,

        alignItems: "center",
        justifyContent: "center",
    },

    accountManagerLabel: {
        fontSize: 11,
        fontWeight: "600",
        color: COLORS.textBody,

        marginBottom: 6,
        marginTop: 8,
    },

    accountManagerInput: {
        height: 44,

        borderWidth: 1,
        borderColor: COLORS.border,

        borderRadius: 9,

        backgroundColor: COLORS.white,

        paddingHorizontal: 12,

        fontSize: 12,
        color: COLORS.textBody,
    },

    addManagerButton: {
        height: 45,

        borderRadius: 9,

        backgroundColor: COLORS.primaryDark,

        alignItems: "center",
        justifyContent: "center",

        marginTop: 16,
    },

    addManagerButtonText: {
        fontSize: 12,
        fontWeight: "700",
        color: COLORS.white,
    },

    // accountManagerInput: {
    //     minHeight: 46,

    //     borderWidth: 1,
    //     borderColor: COLORS.border,

    //     borderRadius: 10,

    //     backgroundColor: COLORS.white,

    //     paddingHorizontal: 13,

    //     fontSize: 13,
    //     color: COLORS.textBody,
    // },

    // addManagerButton: {
    //     minHeight: 46,

    //     borderRadius: 11,

    //     backgroundColor: COLORS.primaryDark,

    //     alignItems: "center",
    //     justifyContent: "center",

    //     marginTop: 18,
    // },

    // addManagerButtonText: {
    //     color: COLORS.white,
    //     fontSize: 13,
    //     fontWeight: "700",
    // },

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
        backgroundColor: COLORS.searchButtonBackground,
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
        flexShrink: 1,
    },

    sectionTitle: {
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 0.7,
        color: COLORS.navigationActive,
        marginLeft: 7,
        flexShrink: 1,
    },

    requiredText: {
        fontSize: 10,
        color: COLORS.danger,
        fontWeight: "500",
        marginLeft: 8,
    },

    sectionBody: {
        padding: 16,
    },

    formStatusText: {
        paddingHorizontal: 16,
        paddingBottom: 8,
        fontSize: 11,
        color: COLORS.textMuted,
    },

    formErrorText: {
        paddingHorizontal: 16,
        paddingBottom: 8,
        fontSize: 11,
        color: COLORS.danger,
    },
    newCompanyHint: {
        marginTop: 3,
        fontSize: 10,
        color: COLORS.textMuted,
    },

    accountManagerModalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        marginBottom: 16,
    },

    accountManagerModalTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: COLORS.textDark,

    },

    assignedByField: {
        minHeight: 43,

        borderWidth: 1,
        borderColor: COLORS.border,

        borderRadius: 9,

        backgroundColor: COLORS.white,

        flexDirection: "row",
        alignItems: "center",
    },

    assignedByInput: {
        flex: 1,

        minHeight: 43,

        paddingLeft: 13,
        paddingRight: 8,

        fontSize: 13,
        color: COLORS.textBody,
    },

    assignedByDropdownButton: {
        width: 42,
        height: 43,

        alignItems: "center",
        justifyContent: "center",
    },
});