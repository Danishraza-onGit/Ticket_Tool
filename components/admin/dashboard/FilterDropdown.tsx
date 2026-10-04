import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../constants/colors";

type FilterDropdownProps = {
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
};

export default function FilterDropdown({
  options,
  selectedValue,
  onSelect,
}: FilterDropdownProps) {
  return (
    <View style={styles.dropdown}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        bounces={false}
      >
        {options.map((option, index) => {
          const isSelected = option === selectedValue;

          return (
            <TouchableOpacity
              key={`${option}-${index}`}
              style={styles.option}
              onPress={() => onSelect(option)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.selectedText,
                ]}
              >
                {option}
              </Text>

              {isSelected && (
                <Ionicons
                  name="checkmark"
                  size={17}
                  color={COLORS.textBody}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    maxHeight: 240,

    backgroundColor: COLORS.white,

    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,

    overflow: "hidden",

    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 5,

    elevation: 4,
  },

  option: {
    minHeight: 38,

    paddingHorizontal: 12,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },

  optionText: {
    fontSize: 11,
    color: COLORS.textPrimary,
  },

  selectedText: {
    fontWeight: "500",
  },
});