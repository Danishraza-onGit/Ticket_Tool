import React from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

type CustomerSearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
};

export default function CustomerSearchBar({
  value,
  onChangeText,
}: CustomerSearchBarProps) {
  return (
    <View style={styles.container}>
      <Ionicons
        name="search-outline"
        size={17}
        color={COLORS.iconGrey}
      />

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Search by company name..."
        placeholderTextColor={COLORS.textNeutral}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />

      {value.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => onChangeText("")}
          activeOpacity={0.7}
          accessibilityLabel="Clear customer search"
        >
          <Ionicons
            name="close"
            size={15}
            color={COLORS.iconGrey}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 38,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 4,
  },

  input: {
    flex: 1,
    height: "100%",
    fontSize: 11,
    color: COLORS.textPrimary,
    paddingHorizontal: 8,
  },

  clearButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});