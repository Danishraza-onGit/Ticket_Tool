import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type FilterChipProps = {
  label: string;
  value?: string;
  onPress?: () => void;
};

export default function FilterChip({
  label,
  value,
  onPress,
}: FilterChipProps) {
  return (
    <TouchableOpacity
      style={styles.chip}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>
        {label}
        {value ? `: ${value}` : ""}
      </Text>

      {value && (
        <Ionicons
          name="chevron-down"
          size={12}
          color="#687A91"
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 28,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#DCE4ED",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginRight: 7,
  },

  text: {
    fontSize: 10,
    color: "#26364C",
  },
});