
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../../constants/colors";
import { ROUTINE_CHECK_SECTIONS } from "../../../constants/routineChecks";
import type { RoutineCheckItem } from "../../../types/ticket";

type Props = {
  value: RoutineCheckItem[];
  onChange?: (items: RoutineCheckItem[]) => void;
  readOnly?: boolean;
};

export default function RoutineChecklist({
  value,
  onChange,
  readOnly = false,
}: Props) {
  const [expandedSection, setExpandedSection] = useState<
    RoutineCheckItem["section"] | null
  >("Routine Checks");

  const [expandedTask, setExpandedTask] = useState<string | null>(
    null
  );

  const updateItem = (
    index: number,
    changes: Partial<Pick<RoutineCheckItem, "status" | "note">>
  ) => {
    if (readOnly || !onChange) return;

    onChange(
      value.map((item, position) =>
        position === index
          ? { ...item, ...changes }
          : item
      )
    );
  };

  return (
    <View style={styles.container}>
      {ROUTINE_CHECK_SECTIONS.map((section) => {
        const tasks = value
          .map((item, index) => ({ item, index }))
          .filter(({ item }) => item.section === section);

        const completed = tasks.filter(
          ({ item }) => item.status === "Completed"
        ).length;

        const isOpen = expandedSection === section;

        return (
          <View key={section} style={styles.section}>
            <Pressable
              onPress={() =>
                setExpandedSection(isOpen ? null : section)
              }
              style={styles.sectionHeader}
              accessibilityRole="button"
            >
              <View style={styles.sectionHeading}>
                <View style={styles.blueDot} />

                <Text style={styles.sectionTitle}>
                  {section}
                </Text>
              </View>

              <View style={styles.sectionRight}>
                <Text style={styles.progress}>
                  {completed}/{tasks.length} Done
                </Text>

                <Ionicons
                  name={isOpen ? "chevron-up" : "chevron-down"}
                  size={16}
                  color={COLORS.textMuted}
                />
              </View>
            </Pressable>

            {isOpen &&
              tasks.map(({ item, index }) => {
                const key = `${item.section}-${item.task}`;
                const isTaskOpen = expandedTask === key;

                return (
                  <View key={key} style={styles.task}>
                    <Pressable
                      style={styles.taskHeader}
                      onPress={() =>
                        setExpandedTask(isTaskOpen ? null : key)
                      }
                      accessibilityRole="button"
                    >
                      <View style={styles.taskDetails}>
                        <Text style={styles.taskName}>
                          {item.task}
                          {item.detail ? (
                            <Text style={styles.taskDetail}>
                              {" "}({item.detail})
                            </Text>
                          ) : null}
                        </Text>

                        {!!item.note?.trim() && (
                          <Text
                            style={styles.taskNotePreview}
                            numberOfLines={1}
                          >
                            {item.note}
                          </Text>
                        )}
                      </View>

                      {item.status === "Completed" ? (
                        <View style={styles.completedIcon}>
                          <Ionicons
                            name="checkmark"
                            size={15}
                            color={COLORS.statusClosedText}
                          />
                        </View>
                      ) : (
                        <View style={styles.naBadge}>
                          <Text style={styles.naText}>N/A</Text>
                        </View>
                      )}

                      <Ionicons
                        name={
                          isTaskOpen
                            ? "chevron-down"
                            : "chevron-forward"
                        }
                        size={16}
                        color={COLORS.textMuted}
                      />
                    </Pressable>

                    {isTaskOpen && (
                      <View style={styles.editor}>
                        <Text style={styles.fieldLabel}>
                          ITEM STATUS
                        </Text>

                        {readOnly ? (
                          <View style={styles.readOnlyStatusRow}>
                            <Ionicons
                              name={
                                item.status === "Completed"
                                  ? "checkmark-circle"
                                  : "remove-circle-outline"
                              }
                              size={17}
                              color={
                                item.status === "Completed"
                                  ? COLORS.statusClosedText
                                  : COLORS.textMuted
                              }
                            />

                            <Text
                              style={[
                                styles.readOnlyStatusText,
                                {
                                  color:
                                    item.status === "Completed"
                                      ? COLORS.statusClosedText
                                      : COLORS.textSecondary,
                                },
                              ]}
                            >
                              {item.status}
                            </Text>
                          </View>
                        ) : (
                          <View style={styles.statusRow}>
                            {(["Completed", "N/A"] as const).map(
                              (status) => {
                                const selected = item.status === status;

                                return (
                                  <Pressable
                                    key={status}
                                    onPress={() =>
                                      updateItem(index, { status })
                                    }
                                    style={[
                                      styles.statusOption,
                                      selected &&
                                      styles.selectedStatusOption,
                                    ]}
                                  >
                                    <Text
                                      style={[
                                        styles.statusOptionText,
                                        selected &&
                                        styles.selectedStatusText,
                                      ]}
                                    >
                                      {status}
                                    </Text>
                                  </Pressable>
                                );
                              }
                            )}
                          </View>
                        )}

                        <Text style={styles.fieldLabel}>
                          NOTES
                        </Text>

                        {readOnly ? (
                          <Text style={styles.readOnlyNote}>
                            {item.note?.trim() || "—"}
                          </Text>
                        ) : (
                          <TextInput
                            style={styles.notesInput}
                            multiline
                            textAlignVertical="top"
                            placeholder="Enter notes (optional)"
                            placeholderTextColor={
                              COLORS.placeholder
                            }
                            value={item.note ?? ""}
                            onChangeText={(note) =>
                              updateItem(index, { note })
                            }
                          />
                        )}
                      </View>
                    )}
                  </View>
                );
              })}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    marginTop: 16,
  },
  section: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 13,
    overflow: "hidden",
  },
  sectionHeader: {
    backgroundColor: COLORS.surfaceSoft,
    paddingHorizontal: 13,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  sectionHeading: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  blueDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.navigationActive,
  },
  sectionTitle: {
    flexShrink: 1,
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.textBody,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  sectionRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progress: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  task: {
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  taskHeader: {
    minHeight: 60,
    paddingHorizontal: 13,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  taskDetails: {
    flex: 1,
    gap: 4,
  },
  taskName: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  taskDetail: {
    fontSize: 10,
    fontWeight: "400",
    color: COLORS.textPrimary,
  },
  taskNotePreview: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  completedIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.statusClosedBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  naBadge: {
    backgroundColor: COLORS.searchButtonBackground,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  naText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textMuted,
  },
  editor: {
    padding: 13,
    paddingTop: 5,
    gap: 9,
    backgroundColor: COLORS.surfaceSoft,
  },
  fieldLabel: {
    fontSize: 10,
    letterSpacing: 0.7,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  statusRow: {
    backgroundColor: COLORS.searchButtonBackground,
    borderRadius: 10,
    padding: 4,
    flexDirection: "row",
    gap: 4,
    marginBottom: 7,
  },
  statusOption: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 11,
    borderRadius: 8,
  },
  selectedStatusOption: {
    backgroundColor: COLORS.textBody,
  },
  statusOptionText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  selectedStatusText: {
    color: COLORS.white,
  },
  notesInput: {
    minHeight: 88,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    padding: 12,
    fontSize: 12,
    color: COLORS.textPrimary,
  },
  readOnlyNote: {
    fontSize: 12,
    lineHeight: 19,
    color: COLORS.textPrimary,
  },
  readOnlyStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingVertical: 8,
  },

  readOnlyStatusText: {
    fontSize: 12,
    fontWeight: "700",
  },
});
