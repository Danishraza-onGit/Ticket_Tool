
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../../constants/colors";
import type {
  InventoryEditForm,
  InventoryItem,
  InventoryUpdateInput,
  RepairLocation,
} from "../../../types/inwardOutward";

type Props = {
  item: InventoryItem;
  busy: boolean;
  onClose: () => void;
  onSave: (input: InventoryUpdateInput) => Promise<void>;
};

type DateKey =
  | "inwardDate"
  | "expectedReturnDate"
  | "outwardDate";

type InfoKey = "inwardDate" | "outwardDate";

type DropdownPosition = {
  top: number;
  left: number;
  width: number;
};

const REPAIR_LOCATIONS: RepairLocation[] = [
  "In-House",
  "Outsourced",
];

const INFO_MESSAGES: Record<InfoKey, string> = {
  inwardDate:
    "Set this when the product physically arrives for repair from customer.",
  outwardDate:
    "Set this when the product is dispatched back after repair to customer.",
};

const DROPDOWN_HEIGHT = 94;

const toISO = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const fromISO = (value: string): Date => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date();
  }

  const [year, month, day] = value.split("-").map(Number);

  return new Date(year, month - 1, day);
};

const initial = (item: InventoryItem): InventoryEditForm => ({
  inwardDate: item.inwardDate?.slice(0, 10) ?? "",
  outwardDate: item.outwardDate?.slice(0, 10) ?? "",
  repairLocation: item.repairLocation ?? "In-House",
  outsourceVendor: item.outsourceVendor ?? "",
  expectedReturnDate:
    item.expectedReturnDate?.slice(0, 10) ?? "",
  deliveryPerson: item.deliveryPerson ?? "",
});

export default function InventoryEditModal({
  item,
  busy,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<InventoryEditForm>(
    () => initial(item)
  );

  const [dateKey, setDateKey] = useState<DateKey | null>(
    null
  );

  const [infoKey, setInfoKey] = useState<InfoKey | null>(
    null
  );

  const [locationOpen, setLocationOpen] = useState(false);

  const [locationPosition, setLocationPosition] =
    useState<DropdownPosition | null>(null);

  const cardRef = useRef<View>(null);
  const locationFieldRef = useRef<View>(null);

  const update = <K extends keyof InventoryEditForm>(
    key: K,
    value: InventoryEditForm[K]
  ) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const closeDropdown = () => {
    setLocationOpen(false);
    setLocationPosition(null);
  };

  const dismissFloatingUI = () => {
    closeDropdown();
    setInfoKey(null);
  };

  // Positions the dropdown relative to the modal card,
  // without inserting options into the form layout.
  const openLocationDropdown = () => {
    if (busy) return;

    setInfoKey(null);

    if (locationOpen) {
      closeDropdown();
      return;
    }

    const trigger = locationFieldRef.current;
    const card = cardRef.current;

    if (!trigger || !card) return;

    trigger.measureInWindow(
      (triggerX, triggerY, triggerWidth, triggerHeight) => {
        card.measureInWindow(
          (cardX, cardY, _cardWidth, cardHeight) => {
            const gap = 5;

            const below =
              triggerY -
              cardY +
              triggerHeight +
              gap;

            const above =
              triggerY -
              cardY -
              DROPDOWN_HEIGHT -
              gap;

            const hasSpaceBelow =
              below + DROPDOWN_HEIGHT <= cardHeight;

            const top = hasSpaceBelow
              ? below
              : above >= 0
                ? above
                : Math.max(
                  0,
                  cardHeight - DROPDOWN_HEIGHT
                );

            setLocationPosition({
              top,
              left: triggerX - cardX,
              width: triggerWidth,
            });

            setLocationOpen(true);
          }
        );
      }
    );
  };

  const validate = (): string | null => {
    if (form.outwardDate && !form.inwardDate) {
      return "Set an inward date before setting an outward date.";
    }

    if (
      form.outwardDate &&
      form.outwardDate < form.inwardDate
    ) {
      return "Outward date cannot be before inward date.";
    }

    if (form.repairLocation === "Outsourced") {
      if (!form.outsourceVendor.trim()) {
        return "Outsource vendor is required.";
      }

      if (!form.expectedReturnDate) {
        return "Expected return date is required.";
      }

      if (!form.deliveryPerson.trim()) {
        return "Delivery person is required.";
      }

      if (
        form.outwardDate &&
        form.expectedReturnDate > form.outwardDate
      ) {
        return "Expected return date cannot be after outward date.";
      }
    }

    return null;
  };

  const handleSave = async () => {
    dismissFloatingUI();

    const error = validate();

    if (error) {
      Alert.alert("Check inventory fields", error);
      return;
    }

    // The backend overwrites all inventory repair fields.
    await onSave({
      inwardDate: form.inwardDate,
      outwardDate: form.outwardDate,
      repairLocation: form.repairLocation,
      outsourceVendor:
        form.repairLocation === "Outsourced"
          ? form.outsourceVendor.trim()
          : "",
      expectedReturnDate:
        form.repairLocation === "Outsourced"
          ? form.expectedReturnDate
          : "",
      deliveryPerson:
        form.repairLocation === "Outsourced"
          ? form.deliveryPerson.trim()
          : "",
    });
  };

  const handleDateChange = (
    event: DateTimePickerEvent,
    value?: Date
  ) => {
    if (Platform.OS === "android") {
      setDateKey(null);
    }

    if (
      event.type === "dismissed" ||
      !value ||
      !dateKey
    ) {
      return;
    }

    update(dateKey, toISO(value));

    if (Platform.OS === "ios") {
      setDateKey(null);
    }
  };

  const renderLabel = (
    label: string,
    info?: InfoKey
  ) => (
    <View style={styles.labelRow}>
      <Text style={styles.label}>{label}</Text>

      {info && (
        <Pressable
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={`Information about ${label}`}
          onPress={() => {
            closeDropdown();

            setInfoKey((current) =>
              current === info ? null : info
            );
          }}
        >
          <Ionicons
            name="information-circle-outline"
            size={16}
            color={COLORS.navigationActive}
          />
        </Pressable>
      )}
    </View>
  );

  const renderDateField = (
    label: string,
    key: DateKey,
    disabled = false
  ) => {
    const info: InfoKey | undefined =
      key === "inwardDate" || key === "outwardDate"
        ? key
        : undefined;

    const placeholder =
      key === "inwardDate"
        ? "Not received yet"
        : key === "outwardDate"
          ? "Not dispatched yet"
          : "Not set";

    return (
      <View style={styles.field}>
        {renderLabel(label, info)}

        {info && infoKey === info && (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              {INFO_MESSAGES[info]}
            </Text>

            <Pressable
              onPress={() => setInfoKey(null)}
              hitSlop={10}
              accessibilityLabel="Dismiss information"
            >
              <Ionicons
                name="close"
                size={16}
                color={COLORS.white}
              />
            </Pressable>
          </View>
        )}

        <Pressable
          disabled={disabled || busy}
          onPress={() => {
            dismissFloatingUI();
            setDateKey(key);
          }}
          style={[
            styles.dateBox,
            disabled && styles.disabledField,
          ]}
          accessibilityRole="button"
        >
          <View style={styles.dateRow}>
            <Ionicons
              name="calendar-outline"
              size={17}
              color={
                disabled
                  ? COLORS.textLight
                  : COLORS.navigationActive
              }
            />

            <Text
              style={[
                styles.dateText,
                !form[key] && styles.placeholder,
              ]}
            >
              {form[key] || placeholder}
            </Text>
          </View>

          <Ionicons
            name="chevron-down"
            size={16}
            color={COLORS.textMuted}
          />
        </Pressable>

        {!!form[key] && !busy && (
          <Pressable
            style={styles.clearDate}
            onPress={() => update(key, "")}
          >
            <Text style={styles.clearDateText}>
              Clear date
            </Text>
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        {/* Outside-card touch dismisses open UI only */}
        <Pressable
          style={styles.outsideDismiss}
          onPress={dismissFloatingUI}
        />

        {/* Modal card */}
        <View
          ref={cardRef}
          collapsable={false}
          style={styles.card}
        >
          <View style={styles.header}>
            <Text
              style={styles.title}
              numberOfLines={2}
            >
              Update Inventory — {item.ticketNo}
            </Text>

            <Pressable
              onPress={onClose}
              disabled={busy}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Close inventory editor"
            >
              <Ionicons
                name="close"
                size={22}
                color={COLORS.textMuted}
              />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.form}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            onScrollBeginDrag={dismissFloatingUI}
          >
            {/* Inward Date */}
            {renderDateField(
              "Inward Date",
              "inwardDate"
            )}

            {/* Repair Location */}
            <View style={styles.field}>
              {renderLabel("Repair Location")}

              <View
                ref={locationFieldRef}
                collapsable={false}
              >
                <Pressable
                  disabled={busy}
                  onPress={openLocationDropdown}
                  style={[
                    styles.dropdownTrigger,
                    locationOpen &&
                    styles.dropdownTriggerOpen,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Choose repair location"
                >
                  <Text style={styles.dropdownValue}>
                    {form.repairLocation}
                  </Text>

                  <Ionicons
                    name={
                      locationOpen
                        ? "chevron-up"
                        : "chevron-down"
                    }
                    size={17}
                    color={COLORS.textMuted}
                  />
                </Pressable>
              </View>
            </View>

            {/* Conditional outsourced fields */}
            {form.repairLocation === "Outsourced" && (
              <>
                <View style={styles.field}>
                  {renderLabel("Outsource Vendor *")}

                  <TextInput
                    style={styles.input}
                    value={form.outsourceVendor}
                    onFocus={dismissFloatingUI}
                    onChangeText={(text) =>
                      update("outsourceVendor", text)
                    }
                    placeholder="e.g. ABC Repair Center"
                    placeholderTextColor={
                      COLORS.placeholder
                    }
                    editable={!busy}
                  />
                </View>

                {renderDateField(
                  "Expected Return Date *",
                  "expectedReturnDate"
                )}

                <View style={styles.field}>
                  {renderLabel("Delivery Person *")}

                  <TextInput
                    style={styles.input}
                    value={form.deliveryPerson}
                    onFocus={dismissFloatingUI}
                    onChangeText={(text) =>
                      update("deliveryPerson", text)
                    }
                    placeholder="e.g. Ramesh Kumar"
                    placeholderTextColor={
                      COLORS.placeholder
                    }
                    editable={!busy}
                  />
                </View>
              </>
            )}

            {/* Outward Date */}
            {renderDateField(
              "Outward Date",
              "outwardDate",
              !form.inwardDate
            )}

            {!form.inwardDate && (
              <Text style={styles.hint}>
                Set an inward date before choosing an
                outward date.
              </Text>
            )}
          </ScrollView>

          {/* Footer */}
          <View style={styles.actions}>
            <Pressable
              disabled={busy}
              onPress={onClose}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>
                Cancel
              </Text>
            </Pressable>

            <Pressable
              disabled={busy}
              onPress={() => void handleSave()}
              style={[
                styles.saveButton,
                busy && styles.disabledField,
              ]}
            >
              {busy ? (
                <ActivityIndicator
                  size="small"
                  color={COLORS.white}
                />
              ) : (
                <Text style={styles.saveText}>
                  Save
                </Text>
              )}
            </Pressable>
          </View>

          {/* Floating dropdown: outside ScrollView */}
          {locationOpen && locationPosition && (
            <View
              style={styles.floatingLayer}
              pointerEvents="box-none"
            >
              <Pressable
                style={styles.dropdownDismiss}
                onPress={dismissFloatingUI}
                accessibilityLabel="Dismiss repair location options"
              />

              <View
                style={[
                  styles.floatingDropdown,
                  {
                    top: locationPosition.top,
                    left: locationPosition.left,
                    width: locationPosition.width,
                  },
                ]}
              >
                {REPAIR_LOCATIONS.map((location) => {
                  const selected =
                    form.repairLocation === location;

                  return (
                    <Pressable
                      key={location}
                      style={styles.dropdownOption}
                      accessibilityRole="button"
                      onPress={() => {
                        update(
                          "repairLocation",
                          location
                        );
                        closeDropdown();
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownOptionText,
                          selected &&
                          styles.selectedOptionText,
                        ]}
                      >
                        {location}
                      </Text>

                      {selected && (
                        <Ionicons
                          name="checkmark"
                          size={18}
                          color={
                            COLORS.navigationActive
                          }
                        />
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}
        </View>

        {/* iOS Date Picker */}
        {dateKey && Platform.OS === "ios" && (
          <View style={styles.pickerOverlay}>
            <View style={styles.pickerCard}>
              <Pressable
                style={styles.pickerDone}
                onPress={() => setDateKey(null)}
              >
                <Text style={styles.pickerDoneText}>
                  Done
                </Text>
              </Pressable>

              <DateTimePicker
                mode="date"
                display="inline"
                themeVariant="light"
                textColor={COLORS.textPrimary}
                value={fromISO(form[dateKey])}
                onChange={handleDateChange}
                accentColor={
                  COLORS.navigationActive
                }
              />
            </View>
          </View>
        )}

        {/* Android Date Picker */}
        {dateKey && Platform.OS === "android" && (
          <DateTimePicker
            mode="date"
            themeVariant="light"
            textColor={COLORS.textPrimary}
            value={fromISO(form[dateKey])}
            onChange={handleDateChange}
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: "center",
    paddingHorizontal: 16,
  },

  outsideDismiss: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },

  card: {
    backgroundColor: COLORS.white,
    maxHeight: "85%",
    borderRadius: 16,
    padding: 16,
    overflow: "visible",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 16,
  },

  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textDark,
  },

  form: {
    paddingBottom: 8,
  },

  field: {
    marginBottom: 16,
  },

  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 8,
  },

  label: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textBody,
  },

  infoBox: {
    backgroundColor: COLORS.navigationActive,
    borderRadius: 9,
    padding: 11,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },

  infoText: {
    flex: 1,
    color: COLORS.white,
    fontSize: 12,
    lineHeight: 18,
  },

  dateBox: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9,
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  dateRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  dateText: {
    fontSize: 13,
    color: COLORS.textBody,
  },

  placeholder: {
    color: COLORS.placeholder,
  },

  disabledField: {
    opacity: 0.45,
  },

  clearDate: {
    alignSelf: "flex-end",
    paddingVertical: 5,
  },

  clearDateText: {
    fontSize: 11,
    color: COLORS.navigationActive,
  },

  dropdownTrigger: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9,
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dropdownTriggerOpen: {
    borderColor: COLORS.navigationActive,
  },

  dropdownValue: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textBody,
  },

  floatingLayer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 100,
  },

  dropdownDismiss: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },

  floatingDropdown: {
    position: "absolute",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
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

  dropdownOption: {
    minHeight: 46,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.divider,
  },

  dropdownOptionText: {
    fontSize: 13,
    color: COLORS.textBody,
  },

  selectedOptionText: {
    color: COLORS.navigationActive,
    fontWeight: "700",
  },

  input: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9,
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    fontSize: 13,
    color: COLORS.textBody,
  },

  hint: {
    fontSize: 11,
    lineHeight: 17,
    color: COLORS.textMuted,
    marginBottom: 5,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 9,
    marginTop: 12,
  },

  cancelButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9,
    paddingHorizontal: 17,
    paddingVertical: 11,
  },

  cancelText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textBody,
  },

  saveButton: {
    backgroundColor: COLORS.navigationActive,
    borderRadius: 9,
    minWidth: 75,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 11,
  },

  saveText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "700",
  },

  pickerOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: COLORS.overlay,
    justifyContent: "center",
    paddingHorizontal: 14,
  },

  pickerCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
  },

  pickerDone: {
    alignSelf: "flex-end",
    padding: 10,
  },

  pickerDoneText: {
    color: COLORS.navigationActive,
    fontWeight: "700",
  },
});
