import React, {
  useMemo,
  useState,
} from "react";

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

import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";

import { COLORS } from "../../constants/colors";

import EmployeeBackHeader from "../../components/employee/navigation/EmployeeBackHeader";

import { companies } from "../../data/newTicket";

import {
  ticketFilterOptions,
} from "../../data/ticketFilterOptions";

import type {
  Company,
  NewTicketForm,
} from "../../types/newTicket";

const modes = [
  "Call",
  "Whatsapp",
  "Mail",
  "Verbally",
  "Website",
];

const callTypes =
  ticketFilterOptions.callType.filter(
    (item) => item !== "All"
  );

const accountManagers =
  ticketFilterOptions.accountManager.filter(
    (item) => item !== "All"
  );

const assignedByPeople =
  ticketFilterOptions.assignedBy.filter(
    (item) => item !== "All"
  );

const priorities =
  ticketFilterOptions.priority.filter(
    (item) => item !== "All"
  );

const internalTags = [
  "External",
  "Internal",
];

const CURRENT_EMPLOYEE =
  "Mohammed Danish Raza";

const formatDate = (
  date: Date
) => {
  const day = String(
    date.getDate()
  ).padStart(2, "0");

  const year =
    date.getFullYear();

  return `${day} ${date.toLocaleString(
    "en-US",
    {
      month: "short",
    }
  )} ${year}`;
};

const formatDateForForm = (
  date: Date
) => {
  const day = String(
    date.getDate()
  ).padStart(2, "0");

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const year =
    date.getFullYear();

  return `${day}/${month}/${year}`;
};

type DropdownName =
  | "mode"
  | "callType"
  | "accountManager"
  | "assignedBy"
  | "priority"
  | "internalTag"
  | null;

export default function EmployeeNewTicketScreen() {
  const insets =
    useSafeAreaInsets();

  const today = new Date();

  const [form, setForm] =
    useState<NewTicketForm>({
      dateReceived:
        formatDate(today),

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

      // TODO:
      // replace with authenticated
      // employee from API.
      assignedTo:
        CURRENT_EMPLOYEE,

      deadlineDate: "",
      priority: "P3",
      internalTag: "External",
    });

  const [
    companyModalVisible,
    setCompanyModalVisible,
  ] = useState(false);

  const [
    companySearch,
    setCompanySearch,
  ] = useState("");

  const [
    deadlinePickerVisible,
    setDeadlinePickerVisible,
  ] = useState(false);

  const [
    deadlineDate,
    setDeadlineDate,
  ] = useState<Date | null>(
    null
  );

  const [
    dropdown,
    setDropdown,
  ] = useState<DropdownName>(
    null
  );

  const [
    errors,
    setErrors,
  ] = useState<
    Record<string, boolean>
  >({});

  const filteredCompanies =
    useMemo(() => {
      const search =
        companySearch
          .trim()
          .toLowerCase();

      if (!search) {
        return companies;
      }

      return companies.filter(
        (company) =>
          company.name
            .toLowerCase()
            .includes(search)
      );
    }, [companySearch]);

  const updateField = <
    K extends keyof NewTicketForm
  >(
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
    company: Company
  ) => {
    setForm((current) => ({
      ...current,

      companyName:
        company.name,

      contactName:
        company.contactName,

      contactNo:
        company.contactNo,

      emailId:
        company.emailId,

      address:
        company.address,
    }));

    setCompanyModalVisible(
      false
    );

    setCompanySearch("");
  };

  const validateForm = () => {
    const requiredFields: (
      keyof NewTicketForm
    )[] = [
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

    const nextErrors: Record<
      string,
      boolean
    > = {};

    requiredFields.forEach(
      (field) => {
        if (
          !String(
            form[field]
          ).trim()
        ) {
          nextErrors[field] =
            true;
        }
      }
    );

    setErrors(nextErrors);

    if (
      Object.keys(
        nextErrors
      ).length > 0
    ) {
      Alert.alert(
        "Required Fields",
        "Please fill all mandatory fields before creating the ticket."
      );

      return false;
    }

    return true;
  };

  const handleCreateTicket =
    () => {
      if (!validateForm()) {
        return;
      }

      Alert.alert(
        "Ready to Create",
        "Ticket submission will be connected when the API is available."
      );
    };

  const renderDropdown = (
    field: Exclude<
      DropdownName,
      null
    >,
    options: string[]
  ) => {
    if (
      dropdown !== field
    ) {
      return null;
    }

    return (
      <View
        style={
          styles.dropdownList
        }
      >
        <ScrollView
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={
            false
          }
        >
          {options.map(
            (option) => (
              <TouchableOpacity
                key={option}
                style={
                  styles.dropdownOption
                }
                onPress={() => {
                  updateField(
                    field,
                    option
                  );

                  setDropdown(
                    null
                  );
                }}
              >
                <Text
                  style={
                    styles.dropdownText
                  }
                >
                  {option}
                </Text>

                {form[field] ===
                  option && (
                  <Ionicons
                    name="checkmark"
                    size={17}
                    color={
                      COLORS.navigationActive
                    }
                  />
                )}
              </TouchableOpacity>
            )
          )}
        </ScrollView>
      </View>
    );
  };

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
        backgroundColor={
          COLORS.white
        }
      />

      <EmployeeBackHeader
        title="New Ticket"
        onBackPress={() =>
          router.back()
        }
      />

      <View
        style={
          styles.pageHeader
        }
      >
        <Text
          style={
            styles.pageTitle
          }
        >
          New Ticket
        </Text>

        <TouchableOpacity
          onPress={() => {
            setForm({
              dateReceived:
                formatDate(today),

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

              assignedTo:
                CURRENT_EMPLOYEE,

              deadlineDate: "",

              priority: "P3",

              internalTag:
                "External",
            });

            setDeadlineDate(
              null
            );

            setErrors({});
          }}
        >
          <Text
            style={
              styles.clearText
            }
          >
            Clear
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={
            styles.content
          }
          showsVerticalScrollIndicator={
            false
          }
          keyboardShouldPersistTaps="handled"
        >
          <Section title="TICKET DETAILS">
            <FieldLabel
              label="Date Received"
              required
            />

            <View
              style={
                styles.lockedField
              }
            >
              <Ionicons
                name="calendar-outline"
                size={17}
                color={
                  COLORS.textLight
                }
              />

              <Text
                style={
                  styles.lockedText
                }
              >
                {form.dateReceived}
              </Text>
            </View>

            <FieldLabel
              label="Mode"
              required
            />

            <DropdownField
              value={form.mode}
              placeholder="Select mode"
              onPress={() =>
                setDropdown(
                  dropdown ===
                    "mode"
                    ? null
                    : "mode"
                )
              }
            />

            {renderDropdown(
              "mode",
              modes
            )}

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
                setCompanyModalVisible(
                  true
                )
              }
            >
              <Text
                numberOfLines={1}
                style={[
                  styles.selectText,
                  !form.companyName &&
                    styles.placeholder,
                ]}
              >
                {form.companyName ||
                  "Select or type a company name"}
              </Text>

              <Ionicons
                name="chevron-down"
                size={17}
                color={
                  COLORS.textMuted
                }
              />
            </TouchableOpacity>

            <FieldLabel
              label="Contact Name"
              required
            />

            <ReadOnlyField
              value={
                form.contactName
              }
              placeholder="Automatically populated"
            />

            <FieldLabel
              label="Contact No"
              required
            />

            <ReadOnlyField
              value={
                form.contactNo
              }
              placeholder="Automatically populated"
            />

            <FieldLabel
              label="Email ID"
              required
            />

            <ReadOnlyField
              value={form.emailId}
              placeholder="Automatically populated"
            />

            <FieldLabel
              label="Address"
              required
            />

            <ReadOnlyField
              value={form.address}
              placeholder="Automatically populated"
              multiline
            />

            <FieldLabel
              label="Model"
            />

            <TextInput
              style={styles.input}
              value={form.model}
              onChangeText={(
                value
              ) =>
                updateField(
                  "model",
                  value
                )
              }
              placeholder="Enter the model of product"
              placeholderTextColor={
                COLORS.placeholder
              }
            />

            <FieldLabel
              label="Serial Number(s)"
            />

            <TextInput
              style={styles.input}
              value={
                form.serialNumbers
              }
              onChangeText={(
                value
              ) =>
                updateField(
                  "serialNumbers",
                  value.toUpperCase()
                )
              }
              placeholder="Comma-separated if multiple"
              placeholderTextColor={
                COLORS.placeholder
              }
            />

            <FieldLabel
              label="Problem"
              required
            />

            <TextInput
              style={[
                styles.input,
                styles.textArea,
                errors.problem &&
                  styles.errorField,
              ]}
              value={form.problem}
              onChangeText={(
                value
              ) =>
                updateField(
                  "problem",
                  value
                )
              }
              multiline
              textAlignVertical="top"
              placeholder="Describe the problem in detail"
              placeholderTextColor={
                COLORS.placeholder
              }
            />

            <FieldLabel
              label="Call Type"
              required
            />

            <DropdownField
              value={
                form.callType
              }
              placeholder="Select call type"
              onPress={() =>
                setDropdown(
                  dropdown ===
                    "callType"
                    ? null
                    : "callType"
                )
              }
            />

            {renderDropdown(
              "callType",
              callTypes
            )}

            <FieldLabel
              label="Account Manager"
              required
            />

            <DropdownField
              value={
                form.accountManager
              }
              placeholder="Select an account manager"
              onPress={() =>
                setDropdown(
                  dropdown ===
                    "accountManager"
                    ? null
                    : "accountManager"
                )
              }
            />

            {renderDropdown(
              "accountManager",
              accountManagers
            )}

            <FieldLabel
              label="Assigned By"
              required
            />

            <DropdownField
              value={
                form.assignedBy
              }
              placeholder="Person in the company who assigned this ticket"
              onPress={() =>
                setDropdown(
                  dropdown ===
                    "assignedBy"
                    ? null
                    : "assignedBy"
                )
              }
            />

            {renderDropdown(
              "assignedBy",
              assignedByPeople
            )}

            <FieldLabel
              label="Assigned To"
              required
            />

            <View
              style={
                styles.lockedField
              }
            >
              <Text
                style={
                  styles.lockedText
                }
              >
                {form.assignedTo}
              </Text>
            </View>

            <FieldLabel
              label="Deadline Date"
            />

            <TouchableOpacity
              style={
                styles.selectField
              }
              onPress={() =>
                setDeadlinePickerVisible(
                  true
                )
              }
            >
              <Ionicons
                name="calendar-outline"
                size={17}
                color={
                  COLORS.textLight
                }
              />

              <Text
                style={[
                  styles.selectText,
                  !form.deadlineDate &&
                    styles.placeholder,
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
              value={
                form.priority
              }
              placeholder="Select priority"
              onPress={() =>
                setDropdown(
                  dropdown ===
                    "priority"
                    ? null
                    : "priority"
                )
              }
            />

            {renderDropdown(
              "priority",
              priorities
            )}

            <FieldLabel
              label="Internal Tag"
            />

            <DropdownField
              value={
                form.internalTag
              }
              placeholder="Select internal tag"
              onPress={() =>
                setDropdown(
                  dropdown ===
                    "internalTag"
                    ? null
                    : "internalTag"
                )
              }
            />

            {renderDropdown(
              "internalTag",
              internalTags
            )}
          </Section>

          <View
            style={
              styles.bottomSpace
            }
          />
        </ScrollView>

        <View
          style={[
            styles.actionBar,
            {
              paddingBottom:
                Platform.OS ===
                "ios"
                  ? Math.max(
                      insets.bottom,
                      10
                    )
                  : 10,
            },
          ]}
        >
          <TouchableOpacity
            style={
              styles.cancelButton
            }
            onPress={() =>
              router.back()
            }
          >
            <Text
              style={
                styles.cancelText
              }
            >
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={
              styles.createButton
            }
            onPress={
              handleCreateTicket
            }
          >
            <Ionicons
              name="add"
              size={20}
              color={COLORS.white}
            />

            <Text
              style={
                styles.createText
              }
            >
              Create Ticket
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={
          companyModalVisible
        }
        transparent
        animationType="slide"
        onRequestClose={() =>
          setCompanyModalVisible(
            false
          )
        }
      >
        <View
          style={
            styles.modalOverlay
          }
        >
          <View
            style={
              styles.companyModal
            }
          >
            <View
              style={
                styles.modalHeader
              }
            >
              <Text
                style={
                  styles.modalTitle
                }
              >
                Select Company
              </Text>

              <TouchableOpacity
                onPress={() =>
                  setCompanyModalVisible(
                    false
                  )
                }
              >
                <Ionicons
                  name="close"
                  size={23}
                  color={
                    COLORS.textSecondary
                  }
                />
              </TouchableOpacity>
            </View>

            <TextInput
              style={
                styles.searchInput
              }
              value={
                companySearch
              }
              onChangeText={
                setCompanySearch
              }
              placeholder="Search company..."
              placeholderTextColor={
                COLORS.placeholder
              }
            />

            <ScrollView
              style={
                styles.companyList
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
                  >
                    <Text
                      style={
                        styles.companyText
                      }
                    >
                      {company.name}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {deadlinePickerVisible &&
        Platform.OS ===
          "android" && (
          <DateTimePicker
            value={
              deadlineDate ||
              new Date()
            }
            mode="date"
            onChange={(
              event,
              date
            ) => {
              setDeadlinePickerVisible(
                false
              );

              if (
                event.type ===
                  "dismissed" ||
                !date
              ) {
                return;
              }

              setDeadlineDate(
                date
              );

              updateField(
                "deadlineDate",
                formatDateForForm(
                  date
                )
              );
            }}
          />
        )}

      {Platform.OS === "ios" && (
        <Modal
          visible={
            deadlinePickerVisible
          }
          transparent
          animationType="fade"
        >
          <View
            style={
              styles.dateOverlay
            }
          >
            <View
              style={
                styles.dateCard
              }
            >
              <DateTimePicker
                value={
                  deadlineDate ||
                  new Date()
                }
                mode="date"
                display="inline"
                accentColor={
                  COLORS.navigationActive
                }
                onChange={(
                  _event,
                  date
                ) => {
                  if (date) {
                    setDeadlineDate(
                      date
                    );

                    updateField(
                      "deadlineDate",
                      formatDateForForm(
                        date
                      )
                    );

                    setDeadlinePickerVisible(
                      false
                    );
                  }
                }}
              />

              <TouchableOpacity
                onPress={() =>
                  setDeadlinePickerVisible(
                    false
                  )
                }
              >
                <Text
                  style={
                    styles.dateCancel
                  }
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children:
    React.ReactNode;
}) {
  return (
    <View
      style={
        styles.formSection
      }
    >
      <View
        style={
          styles.sectionHeader
        }
      >
        <Text
          style={
            styles.sectionTitle
          }
        >
          {title}
        </Text>
      </View>

      <View
        style={
          styles.sectionBody
        }
      >
        {children}
      </View>
    </View>
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
    <Text style={styles.label}>
      {label}

      {required && (
        <Text
          style={
            styles.required
          }
        >
          {" "}
          *
        </Text>
      )}
    </Text>
  );
}

function DropdownField({
  value,
  placeholder,
  onPress,
}: {
  value: string;
  placeholder: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={
        styles.selectField
      }
      onPress={onPress}
    >
      <Text
        numberOfLines={1}
        style={[
          styles.selectText,
          !value &&
            styles.placeholder,
        ]}
      >
        {value ||
          placeholder}
      </Text>

      <Ionicons
        name="chevron-down"
        size={17}
        color={
          COLORS.textMuted
        }
      />
    </TouchableOpacity>
  );
}

function ReadOnlyField({
  value,
  placeholder,
  multiline = false,
}: {
  value: string;
  placeholder: string;
  multiline?: boolean;
}) {
  return (
    <View
      style={[
        styles.lockedField,
        multiline &&
          styles.readOnlyMultiline,
      ]}
    >
      <Text
        style={[
          styles.lockedText,
          !value &&
            styles.placeholder,
        ]}
      >
        {value ||
          placeholder}
      </Text>
    </View>
  );
}

const styles =
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor:
        COLORS.background,
    },

    flex: {
      flex: 1,
    },

    pageHeader: {
      minHeight: 48,

      paddingHorizontal: 16,

      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
    },

    pageTitle: {
      fontSize: 17,
      fontWeight: "700",
      color:
        COLORS.textDark,
    },

    clearText: {
      fontSize: 12,
      fontWeight: "600",
      color:
        COLORS.textMuted,
    },

    content: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 20,
    },

    formSection: {
      backgroundColor:
        COLORS.white,

      borderRadius: 13,

      borderWidth: 1,
      borderColor:
        COLORS.border,

      overflow: "hidden",
    },

    sectionHeader: {
      minHeight: 42,

      backgroundColor:
        COLORS.surfaceSoft,

      borderBottomWidth: 1,
      borderBottomColor:
        COLORS.divider,

      paddingHorizontal: 14,

      justifyContent:
        "center",
    },

    sectionTitle: {
      fontSize: 12,
      fontWeight: "700",

      letterSpacing: 0.7,

      color:
        COLORS.textBody,
    },

    sectionBody: {
      padding: 16,
    },

    label: {
      fontSize: 12,
      fontWeight: "500",

      color:
        COLORS.textBody,

      marginBottom: 7,
      marginTop: 12,
    },

    required: {
      color: COLORS.danger,
    },

    input: {
      minHeight: 43,

      borderWidth: 1,
      borderColor:
        COLORS.border,

      borderRadius: 9,

      backgroundColor:
        COLORS.surfaceSoft,

      paddingHorizontal: 13,

      fontSize: 13,

      color:
        COLORS.textBody,
    },

    textArea: {
      minHeight: 96,

      paddingTop: 12,

      textAlignVertical:
        "top",
    },

    selectField: {
      minHeight: 43,

      borderWidth: 1,
      borderColor:
        COLORS.border,

      borderRadius: 9,

      backgroundColor:
        COLORS.surfaceSoft,

      paddingHorizontal: 12,

      flexDirection: "row",
      alignItems: "center",
    },

    selectText: {
      flex: 1,

      fontSize: 13,

      color:
        COLORS.textBody,

      marginLeft: 3,
    },

    placeholder: {
      color:
        COLORS.placeholder,
    },

    lockedField: {
      minHeight: 43,

      borderWidth: 1,
      borderColor:
        COLORS.border,

      borderRadius: 9,

      backgroundColor:
        COLORS.inputBackground,

      paddingHorizontal: 12,

      flexDirection: "row",
      alignItems: "center",
    },

    lockedText: {
      fontSize: 13,

      color:
        COLORS.textSecondary,

      marginLeft: 5,

      lineHeight: 19,
    },

    readOnlyMultiline: {
      minHeight: 66,

      alignItems:
        "flex-start",

      paddingTop: 11,
    },

    errorField: {
      borderColor:
        COLORS.danger,
    },

    dropdownList: {
      maxHeight: 220,

      marginTop: 5,

      backgroundColor:
        COLORS.white,

      borderWidth: 1,
      borderColor:
        COLORS.border,

      borderRadius: 10,

      overflow: "hidden",
    },

    dropdownOption: {
      minHeight: 40,

      paddingHorizontal: 13,

      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",

      borderBottomWidth: 1,
      borderBottomColor:
        COLORS.divider,
    },

    dropdownText: {
      fontSize: 12,

      color:
        COLORS.textBody,
    },

    actionBar: {
      backgroundColor:
        COLORS.white,

      borderTopWidth: 1,
      borderTopColor:
        COLORS.border,

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
      borderColor:
        COLORS.border,

      backgroundColor:
        COLORS.white,

      alignItems: "center",
      justifyContent:
        "center",
    },

    cancelText: {
      fontSize: 14,
      fontWeight: "600",

      color:
        COLORS.textSecondary,
    },

    createButton: {
      flex: 1,

      minHeight: 46,

      borderRadius: 12,

      backgroundColor:
        COLORS.primaryDark,

      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "center",

      gap: 7,
    },

    createText: {
      fontSize: 14,
      fontWeight: "700",

      color:
        COLORS.white,
    },

    bottomSpace: {
      height: 35,
    },

    modalOverlay: {
      flex: 1,

      backgroundColor:
        COLORS.overlay,

      justifyContent:
        "flex-end",
    },

    companyModal: {
      backgroundColor:
        COLORS.white,

      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,

      maxHeight: "82%",

      padding: 16,
    },

    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",

      marginBottom: 13,
    },

    modalTitle: {
      fontSize: 16,
      fontWeight: "700",

      color:
        COLORS.textBody,
    },

    searchInput: {
      minHeight: 43,

      borderWidth: 1,
      borderColor:
        COLORS.border,

      borderRadius: 9,

      backgroundColor:
        COLORS.surfaceSoft,

      paddingHorizontal: 12,

      color:
        COLORS.textBody,
    },

    companyList: {
      marginTop: 10,
    },

    companyOption: {
      minHeight: 44,

      justifyContent:
        "center",

      borderBottomWidth: 1,
      borderBottomColor:
        COLORS.divider,
    },

    companyText: {
      fontSize: 12,

      color:
        COLORS.textBody,
    },

    dateOverlay: {
      flex: 1,

      backgroundColor:
        COLORS.overlay,

      justifyContent:
        "center",

      paddingHorizontal: 18,
    },

    dateCard: {
      backgroundColor:
        COLORS.white,

      borderRadius: 18,

      padding: 16,
    },

    dateCancel: {
      textAlign: "center",

      marginTop: 8,

      fontSize: 13,
      fontWeight: "600",

      color:
        COLORS.navigationActive,
    },
  });