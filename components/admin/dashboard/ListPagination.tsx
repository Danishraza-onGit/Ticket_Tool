import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../constants/colors";

type Props = {
  page: number;
  total: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
};

export default function ListPagination({
  page,
  total,
  pageSize = 10,
  onPageChange,
}: Props) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const first = Math.max(1, Math.min(page - 1, totalPages - 2));
  const last = Math.min(totalPages, first + 2);
  const numbers = Array.from(
    { length: last - first + 1 },
    (_, index) => first + index
  );

  return (
    <View style={styles.container}>
      <Text style={styles.summary}>Page {page} of {totalPages}</Text>
      <View style={styles.row}>
        <Pressable
          style={[styles.button, page <= 1 && styles.disabled]}
          disabled={page <= 1}
          onPress={() => onPageChange(page - 1)}
          accessibilityLabel="Previous page"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={17} color={COLORS.navigationActive} />
        </Pressable>
        {numbers.map((number) => (
          <Pressable
            key={number}
            style={[styles.button, number === page && styles.selected]}
            onPress={() => onPageChange(number)}
            accessibilityLabel={`Page ${number}`}
            accessibilityRole="button"
          >
            <Text style={[styles.pageText, number === page && styles.selectedText]}>
              {number}
            </Text>
          </Pressable>
        ))}
        <Pressable
          style={[styles.button, page >= totalPages && styles.disabled]}
          disabled={page >= totalPages}
          onPress={() => onPageChange(page + 1)}
          accessibilityLabel="Next page"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-forward" size={17} color={COLORS.navigationActive} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 18, marginBottom: 12, alignItems: "center", gap: 10 },
  summary: { fontSize: 11, color: COLORS.textSecondary },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  button: {
    minWidth: 36, height: 36, paddingHorizontal: 8,
    borderRadius: 9, borderWidth: 1, borderColor: COLORS.border,
    backgroundColor: COLORS.white, alignItems: "center", justifyContent: "center",
  },
  disabled: { opacity: 0.35 },
  selected: { backgroundColor: COLORS.navigationActive, borderColor: COLORS.navigationActive },
  pageText: { color: COLORS.textBody, fontSize: 12, fontWeight: "600" },
  selectedText: { color: COLORS.white },
});
