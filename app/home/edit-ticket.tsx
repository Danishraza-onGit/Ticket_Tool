import { useEffect, useMemo, useState } from "react";
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

import BackHeader from "../../components/admin/navigation/BackHeader";
import RoutineChecklist from "../../components/admin/routine-check/RoutineChecklist";
import { createEmptyRoutineChecks } from "../../constants/routineChecks";
import type { NewTicketForm } from "../../types/newTicket";
import type {
    CustomerDirectoryEntry,
    MetaOptions,
    RoutineCheckItem,
    Ticket,
    TicketFormInput,
} from "../../types/ticket";

import {
    fetchMetaOptions,
    fetchTicket,
    updateTicket,
} from "../../api/tickets";

const formatDateForForm = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

const formatDateForApi = (
    date: Date
) => {
    const year =
        date.getFullYear();

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
    | "assignedBy"
    | "assignedTo"
    | "priority"
    | "internalTag";

const formatApiDateForDisplay = (
    value: string | null | undefined
) => {
    if (!value) {
        return "";
    }

    const [year, month, day] = value.split("-");

    if (!year || !month || !day) {
        return value;
    }

    return `${day}/${month}/${year}`;
};

export default function EditTicketScreen() {
    const insets = useSafeAreaInsets();

    const {
        srNo,
    } = useLocalSearchParams<{
        srNo?: string;
    }>();

    const [ticket, setTicket] =
        useState<Ticket | null>(null);

    const [metaOptions, setMetaOptions] =
        useState<MetaOptions | null>(null);

    const [isLoading, setIsLoading] =
        useState(true);

    const [loadError, setLoadError] =
        useState<string | null>(null);

    const [isSaving, setIsSaving] =
        useState(false);

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

    const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<number[]>([]);

    const [form, setForm] =
        useState<NewTicketForm>({
            dateReceived: "",
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
    const isRoutineChecks = form.callType === "Routine Checks";

    const [routineChecks, setRoutineChecks] = useState<RoutineCheckItem[]>(
        createEmptyRoutineChecks
    );

    const [companyModalVisible, setCompanyModalVisible] = useState(false);
    const [companyBackdropOpacity] =
        useState(
            () => new Animated.Value(0)
        );

    const [companySheetTranslateY] =
        useState(
            () => new Animated.Value(300)
        );
    const [companySearch, setCompanySearch] = useState("");

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

    const [dropdown, setDropdown] =
        useState<DropdownKey | null>(null);

    const [dropdownPosition, setDropdownPosition] =
        useState<{
            top: number;
            left: number;
            width: number;
        } | null>(null);

    const [deadlinePickerVisible, setDeadlinePickerVisible] = useState(false);
    const [
        deadlineDate,
        setDeadlineDate,
    ] = useState<Date | null>(null);

    const [accountManagerModalVisible, setAccountManagerModalVisible] =
        useState(false);

    const [newAccountManagerName, setNewAccountManagerName] = useState("");
    const [newAccountManagerEmail, setNewAccountManagerEmail] = useState("");

    const [errors, setErrors] = useState<Record<string, boolean>>({});

    const filteredCompanies =
        useMemo(() => {
            const customers =
                metaOptions?.customers ?? [];

            const search =
                companySearch
                    .trim()
                    .toLowerCase();

            if (!search) {
                return customers;
            }

            return customers.filter(
                (company) =>
                    company.name
                        .toLowerCase()
                        .includes(search)
            );
        }, [
            companySearch,
            metaOptions,
        ]);

    const hasExactCompanyMatch =
        useMemo(() => {
            const search =
                companySearch
                    .trim()
                    .toLowerCase();

            if (!search) {
                return false;
            }

            return (
                metaOptions?.customers.some(
                    (company) =>
                        company.name
                            .trim()
                            .toLowerCase() ===
                        search
                ) ?? false
            );
        }, [
            companySearch,
            metaOptions,
        ]);

    const openCompanyModal = () => {
        companyBackdropOpacity.setValue(0);

        companySheetTranslateY.setValue(
            300
        );

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

    const toggleAssignee = (displayName: string) => {
        const employee = metaOptions?.assignedToOptions.find(
            (person) => person.displayName === displayName
        );
        if (!employee) return;
        setSelectedAssigneeIds((current) =>
            current.includes(employee.id)
                ? current.filter((id) => id !== employee.id)
                : [...current, employee.id]
        );
        setErrors((current) => ({ ...current, assignedTo: false }));
    };

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
            contactName:
                company.contactName ?? "",
            contactNo:
                company.contactNo ?? "",
            emailId:
                company.emailId ?? "",
            address:
                company.address ?? "",
        }));

        setErrors((current) => ({
            ...current,
            companyName: false,
            contactName: false,
            contactNo: false,
            emailId: false,
            address: false,
        }));

        closeCompanyModal();
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
        ];

        if (!isRoutineChecks) {
            requiredFields.push(
                "accountManager",
                "assignedBy",
                "assignedTo",
                "priority"
            );
        }

        const nextErrors: Record<string, boolean> = {};

        requiredFields.forEach((field) => {
            if (!(field === "assignedTo" ? selectedAssigneeIds.length > 0 : String(form[field] ?? "").trim())) {
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

        if (isRoutineChecks) {
            if (routineChecks.length === 0) {
                Alert.alert(
                    "Routine Checks",
                    "The Routine Checks checklist cannot be empty."
                );
                return false;
            }

            if (
                routineChecks.some(
                    (item) =>
                        item.status !== "N/A" &&
                        item.status !== "Completed"
                )
            ) {
                Alert.alert(
                    "Routine Checks",
                    "Every task must have either N/A or Completed status."
                );
                return false;
            }
        }

        return true;
    };


    const handleSaveChanges =
        async () => {
            if (!validateForm()) {
                return;
            }

            if (!ticket || !metaOptions) {
                Alert.alert(
                    "Unable to Update",
                    "The ticket information is incomplete. Please reopen the ticket and try again."
                );

                return;
            }

            if (isSaving) {
                return;
            }


            const selectedAccountManager = isRoutineChecks
                ? undefined
                : metaOptions.accountManagerDirectory.find(
                    (manager) =>
                        manager.name === form.accountManager
                );

            if (!isRoutineChecks && !selectedAccountManager) {
                Alert.alert(
                    "Account Manager",
                    "Please select a valid account manager."
                );
                return;
            }

            if (!isRoutineChecks && selectedAssigneeIds.length === 0) {
                Alert.alert("Assigned To", "Please select at least one employee.");
                return;
            }

            const input: Partial<TicketFormInput> = {
                mode: form.mode,
                companyName: form.companyName.trim(),
                contactName: form.contactName.trim(),
                contactNo: form.contactNo.trim(),
                emailId: form.emailId.trim(),
                address: form.address.trim(),

                model: form.model.trim() || undefined,
                serialNumber: form.serialNumbers.trim() || undefined,
                problem: form.problem.trim(),
                callType: form.callType,

                ...(isRoutineChecks
                    ? {
                        routineChecks: routineChecks.map((item) => ({
                            section: item.section,
                            task: item.task,
                            ...(item.detail
                                ? { detail: item.detail }
                                : {}),
                            status: item.status,
                            note: item.note ?? "",
                        })),
                    }
                    : {
                        accountManagerId: selectedAccountManager?.id,
                        assignedBy: form.assignedBy.trim(),
                        assigneeUserIds: selectedAssigneeIds,
                        priority: form.priority,
                        deadlineDate: deadlineDate
                            ? formatDateForApi(deadlineDate)
                            : undefined,
                        internalTag: form.internalTag,
                    }),
            };


            try {
                setIsSaving(true);

                const updatedTicket =
                    await updateTicket(
                        ticket.srNo,
                        {
                            ...input,
                            rowVersion:
                                ticket.rowVersion,
                        }
                    );

                setTicket(updatedTicket);

                Alert.alert(
                    "Ticket Updated",
                    `Ticket #${updatedTicket.ticketNo} was updated successfully.`,
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                router.back();
                            },
                        },
                    ]
                );
            } catch (error: any) {
                console.log(
                    "Update ticket error:",
                    error
                );

                if (
                    error?.response?.status === 409
                ) {
                    Alert.alert(
                        "Ticket Changed",
                        "This ticket was updated by someone else. Please go back, reopen it, and try again."
                    );

                    return;
                }

                const responseData = error?.response?.data;

                const backendMessage =
                    responseData &&
                        typeof responseData === "object" &&
                        typeof responseData.error === "string"
                        ? responseData.error
                        : null;

                Alert.alert(
                    "Unable to Update",
                    backendMessage ??
                    "The ticket could not be updated. Please check the information and try again."
                );
            } finally {
                setIsSaving(false);
            }
        };

    useEffect(() => {
        let active = true;

        const loadEditData = async () => {
            if (!srNo) {
                setLoadError(
                    "Ticket identifier is missing."
                );
                setIsLoading(false);
                return;
            }

            const numericSrNo =
                Number(srNo);

            if (Number.isNaN(numericSrNo)) {
                setLoadError(
                    "Invalid ticket identifier."
                );
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setLoadError(null);

                const [
                    ticketDetail,
                    options,
                ] = await Promise.all([
                    fetchTicket(numericSrNo),
                    fetchMetaOptions(),
                ]);

                if (!active) {
                    return;
                }

                const loadedTicket =
                    ticketDetail.ticket;

                setTicket(loadedTicket);
                setSelectedAssigneeIds(loadedTicket.assignees.map((assignee) => assignee.id));
                setMetaOptions(options);

                setRoutineChecks(
                    loadedTicket.callType === "Routine Checks"
                        ? loadedTicket.routineChecks?.length
                            ? loadedTicket.routineChecks.map((item) => ({
                                ...item,
                                note: item.note ?? "",
                            }))
                            : createEmptyRoutineChecks()
                        : createEmptyRoutineChecks()
                );

                setForm({
                    dateReceived:
                        formatApiDateForDisplay(
                            loadedTicket.ticketDate
                        ),

                    mode:
                        loadedTicket.mode,

                    companyName:
                        loadedTicket.companyName,

                    contactName:
                        loadedTicket.contactName ?? "",

                    contactNo:
                        loadedTicket.contactNo ?? "",

                    emailId:
                        loadedTicket.emailId ?? "",

                    address:
                        loadedTicket.address ?? "",

                    model:
                        loadedTicket.model ?? "",

                    serialNumbers:
                        loadedTicket.serialNumber ?? "",

                    problem:
                        loadedTicket.problem,

                    callType:
                        loadedTicket.callType,

                    accountManager:
                        loadedTicket.accountManager,

                    assignedBy:
                        loadedTicket.assignedBy ?? "",

                    assignedTo:
                        loadedTicket.assignees
                            .map(
                                (assignee) =>
                                    assignee.displayName
                            )
                            .join(", "),

                    deadlineDate:
                        formatApiDateForDisplay(
                            loadedTicket.deadlineDate
                        ),

                    priority:
                        loadedTicket.priority,

                    internalTag:
                        loadedTicket.internalTag,
                });

                if (
                    loadedTicket.deadlineDate
                ) {
                    setDeadlineDate(
                        new Date(
                            `${loadedTicket.deadlineDate}T00:00:00`
                        )
                    );
                } else {
                    setDeadlineDate(null);
                }
            } catch (error) {
                console.log(
                    "Edit Ticket load error:",
                    error
                );

                if (!active) {
                    return;
                }

                setLoadError(
                    "Unable to load ticket information."
                );
            } finally {
                if (active) {
                    setIsLoading(false);
                }
            }
        };

        void loadEditData();

        return () => {
            active = false;
        };
    }, [srNo]);

    const modes =
        metaOptions?.modes ?? [];

    const callTypes =
        metaOptions?.callTypes ?? [];

    const accountManagers =
        metaOptions?.accountManagerDirectory.map(
            (manager) => manager.name
        ) ?? [];

    const assignedByOptions =
        metaOptions?.assignedBys ?? [];

    const assignedToOptions =
        metaOptions?.assignedToOptions.map(
            (employee) =>
                employee.displayName
        ) ?? [];

    const priorities =
        metaOptions?.priorities ?? [];

    const internalTags =
        metaOptions?.internalTags ?? [];

    if (isLoading) {
        return (
            <SafeAreaView
                style={styles.screen}
                edges={[
                    "top",
                    "left",
                    "right",
                ]}
            >
                <StatusBar
                    style="dark"
                // backgroundColor={
                //     COLORS.white
                // }
                />

                <BackHeader
                    title="Edit Ticket"
                    onBackPress={() =>
                        router.back()
                    }
                />

                <View
                    style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingHorizontal: 24,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 13,
                            color:
                                COLORS.textMuted,
                        }}
                    >
                        Loading ticket...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    if (loadError || !ticket) {
        return (
            <SafeAreaView
                style={styles.screen}
                edges={[
                    "top",
                    "left",
                    "right",
                ]}
            >
                <StatusBar
                    style="dark"
                // backgroundColor={
                //     COLORS.white
                // }
                />

                <BackHeader
                    title="Edit Ticket"
                    onBackPress={() =>
                        router.back()
                    }
                />

                <View
                    style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingHorizontal: 24,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: "700",
                            color:
                                COLORS.textDark,
                        }}
                    >
                        Ticket unavailable
                    </Text>

                    <Text
                        style={{
                            marginTop: 6,
                            textAlign: "center",
                            fontSize: 11,
                            color:
                                COLORS.textMuted,
                        }}
                    >
                        {loadError ??
                            "The requested ticket could not be found."}
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.screen}
            edges={["top", "left", "right"]}>
            <StatusBar
                style="dark"
            // backgroundColor={COLORS.white}
            />
            <BackHeader
                title="Edit Ticket"
                onBackPress={() => router.back()}
            />

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
                                    color={COLORS.navigationActive}
                                />

                                <Text style={styles.sectionTitle}>
                                    1. TIMELINE & CHANNEL
                                </Text>
                            </View>

                        </View>

                        <View style={styles.sectionBody}>

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

                            <FieldLabel label="Mode" required />

                            <DropdownField
                                value={form.mode}
                                placeholder="Select mode"
                                hasError={!!errors.mode}
                                onPress={(event) =>
                                    openDropdown(
                                        "mode",
                                        event
                                    )
                                }
                            />

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
                                onPress={openCompanyModal}
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

                            <FieldLabel
                                label="Contact Name"
                                required
                            />

                            <ReadOnlyField
                                value={form.contactName}
                                placeholder="Automatically populated"
                                hasError={!!errors.contactName}
                            />

                            <FieldLabel
                                label="Contact No"
                                required
                            />

                            <ReadOnlyField
                                value={form.contactNo}
                                placeholder="Automatically populated"
                                hasError={!!errors.contactNo}
                            />

                            <FieldLabel
                                label="Email ID"
                                required
                            />

                            <ReadOnlyField
                                value={form.emailId}
                                placeholder="Automatically populated"
                                hasError={!!errors.emailId}
                            />

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
                                    color={COLORS.navigationActive}
                                />

                                <Text style={styles.sectionTitle}>
                                    3. ASSET & PROBLEM DESCRIPTION
                                </Text>
                            </View>

                        </View>

                        <View style={styles.sectionBody}>

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
                            {!isRoutineChecks && (
                                <>
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

                                    <FieldLabel
                                        label="Assigned By"
                                        required
                                    />

                                    <DropdownField
                                        value={form.assignedBy}
                                        placeholder="Enter or select a name"
                                        hasError={!!errors.assignedBy}
                                        onPress={(event) =>
                                            openDropdown(
                                                "assignedBy",
                                                event
                                            )
                                        }
                                    />

                                    <FieldLabel
                                        label="Assigned To"
                                        required
                                    />

                                    <DropdownField
                                        value={selectedAssigneeIds
                                            .map((id) => metaOptions?.assignedToOptions.find((e) => e.id === id)?.displayName)
                                            .filter(Boolean).join(", ")}
                                        placeholder="Select employees"
                                        hasError={!!errors.assignedTo}
                                        onPress={(event) =>
                                            openDropdown(
                                                "assignedTo",
                                                event
                                            )
                                        }
                                    />

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
                                            color={COLORS.textLight}
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
                                </>
                            )}
                            {isRoutineChecks && (
                                <RoutineChecklist
                                    value={routineChecks}
                                    onChange={setRoutineChecks}
                                />
                            )}

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
                                                if (dropdown === "assignedTo") {
                                                    toggleAssignee(option);
                                                } else {
                                                    updateField(dropdown, option as never);
                                                    closeDropdown();
                                                }
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

                                            {(dropdown === "assignedTo"
                                            ? selectedAssigneeIds.some((id) => metaOptions?.assignedToOptions.find((e) => e.id === id)?.displayName === option)
                                            : form[dropdown] === option) && (
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

                                {dropdown === "assignedTo" && (
                                    <TouchableOpacity onPress={closeDropdown} style={{ padding: 12, alignItems: "center", borderTopWidth: 1, borderColor: COLORS.border }}>
                                        <Text style={{ color: COLORS.navigationActive, fontWeight: "700" }}>Done ({selectedAssigneeIds.length} selected)</Text>
                                    </TouchableOpacity>
                                )}

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

            <View
                style={[
                    styles.actionBar,
                    {
                        paddingBottom: Math.max(insets.bottom + 10, 10),
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
                        isSaving && {
                            opacity: 0.6,
                        },
                    ]}
                    onPress={handleSaveChanges}
                    activeOpacity={0.8}
                    disabled={isSaving}
                >
                    <Text style={styles.createText}>
                        {isSaving
                            ? "Saving..."
                            : "Save Changes"}
                    </Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={companyModalVisible}
                transparent
                animationType="none"
                onRequestClose={
                    closeCompanyModal
                }
            >
                <View style={styles.modalRoot}>
                    <Pressable
                        style={
                            StyleSheet.absoluteFill
                        }
                        onPress={
                            closeCompanyModal
                        }
                    />

                    <Animated.View
                        pointerEvents="none"
                        style={[
                            styles.modalBackdrop,
                            {
                                opacity:
                                    companyBackdropOpacity,
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
                        <View
                            style={
                                styles.companyModalHeader
                            }
                        >
                            <Text
                                style={
                                    styles.companyModalTitle
                                }
                            >
                                Select Company
                            </Text>

                            <TouchableOpacity
                                style={
                                    styles.companyModalClose
                                }
                                onPress={
                                    closeCompanyModal
                                }
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name="close"
                                    size={21}
                                    color={
                                        COLORS.iconGrey
                                    }
                                />
                            </TouchableOpacity>
                        </View>

                        <View
                            style={
                                styles.companySearchBox
                            }
                        >
                            <Ionicons
                                name="search-outline"
                                size={18}
                                color={
                                    COLORS.textLight
                                }
                            />

                            <TextInput
                                style={
                                    styles.companySearchInput
                                }
                                placeholder="Search company..."
                                placeholderTextColor={
                                    COLORS.placeholder
                                }
                                value={
                                    companySearch
                                }
                                onChangeText={
                                    setCompanySearch
                                }
                                autoFocus
                            />
                        </View>

                        <ScrollView
                            style={
                                styles.companyList
                            }
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={
                                false
                            }
                        >
                            {filteredCompanies.map(
                                (company) => (
                                    <TouchableOpacity
                                        key={
                                            company.name
                                        }
                                        style={
                                            styles.companyOption
                                        }
                                        onPress={() =>
                                            selectCompany(
                                                company
                                            )
                                        }
                                        activeOpacity={
                                            0.7
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.companyOptionText
                                            }
                                        >
                                            {
                                                company.name
                                            }
                                        </Text>

                                        {form.companyName ===
                                            company.name && (
                                                <Ionicons
                                                    name="checkmark"
                                                    size={
                                                        18
                                                    }
                                                    color={
                                                        COLORS.navigationActive
                                                    }
                                                />
                                            )}
                                    </TouchableOpacity>
                                )
                            )}

                            {companySearch.trim()
                                .length > 0 &&
                                !hasExactCompanyMatch && (
                                    <TouchableOpacity
                                        style={[
                                            styles.companyOption,
                                            styles.newCompanyOption,
                                        ]}
                                        onPress={() => {
                                            const newCompanyName =
                                                companySearch.trim();

                                            setForm(
                                                (
                                                    current
                                                ) => ({
                                                    ...current,

                                                    companyName:
                                                        newCompanyName,

                                                    contactName:
                                                        "",

                                                    contactNo:
                                                        "",

                                                    emailId:
                                                        "",

                                                    address:
                                                        "",
                                                })
                                            );

                                            setErrors(
                                                (
                                                    current
                                                ) => ({
                                                    ...current,

                                                    companyName:
                                                        false,

                                                    contactName:
                                                        false,

                                                    contactNo:
                                                        false,

                                                    emailId:
                                                        false,

                                                    address:
                                                        false,
                                                })
                                            );

                                            closeCompanyModal();
                                        }}
                                        activeOpacity={
                                            0.7
                                        }
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
                                themeVariant="light"
                                textColor={COLORS.textPrimary}
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
                                    color={COLORS.textMuted}
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
    // Layout
    screen: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    flex: {
        flex: 1,
    },

    scroll: {
        flex: 1,
    },

    content: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 20,
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

    bottomSpace: {
        height: 35,
    },

    // Form sections
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

    sectionBody: {
        padding: 16,
    },

    // Fields
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

    multilineInput: {
        minHeight: 100,
        paddingTop: 12,
        textAlignVertical: "top",
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

    errorField: {
        borderColor: "#E33434",
    },

    // Floating dropdown
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

    // Bottom action bar
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

    // Company modal
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

        backgroundColor:
            COLORS.overlay,
    },

    companyModal: {
        position: "absolute",

        left: 0,
        right: 0,
        bottom: 0,

        height: "55%",

        backgroundColor:
            COLORS.white,

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
        justifyContent:
            "space-between",

        marginBottom: 13,
    },

    companyModalTitle: {
        fontSize: 16,
        fontWeight: "700",

        color:
            COLORS.textBody,
    },

    companyModalClose: {
        width: 32,
        height: 32,

        alignItems: "center",
        justifyContent: "center",

        transform: [
            {
                translateX: 6,
            },
            {
                translateY: -2,
            },
        ],
    },

    companySearchBox: {
        marginHorizontal: 16,

        minHeight: 43,

        borderWidth: 1,
        borderColor:
            COLORS.border,

        borderRadius: 9,

        backgroundColor:
            COLORS.white,

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
        borderBottomColor:
            COLORS.divider,

        flexDirection: "row",
        alignItems: "center",
        justifyContent:
            "space-between",
    },

    companyOptionText: {
        flex: 1,
        fontSize: 12,
        color: COLORS.textBody,
        marginRight: 10,
    },

    newCompanyOption: {
        paddingTop: 8,
        paddingBottom: 8,
    },

    newCompanyHint: {
        marginTop: 9,

        fontSize: 10,

        color:
            COLORS.textMuted,
    },

    // Date modal
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

    // Account manager modal
    modalOverlay: {
        flex: 1,
        backgroundColor: COLORS.overlay,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },

    accountManagerModal: {
        width: "90%",
        maxWidth: 360,
        backgroundColor: COLORS.white,
        borderRadius: 18,
        padding: 18,
        alignSelf: "center",
    },

    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 14,
    },

    modalTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: COLORS.textDark,
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

});
