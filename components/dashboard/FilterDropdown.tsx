import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
                  color="#1F2937"
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

    backgroundColor: "#FFFFFF",

    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E1E7EF",

    overflow: "hidden",

    shadowColor: "#000",
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
    borderBottomColor: "#EEF1F5",
  },

  optionText: {
    fontSize: 11,
    color: "#1F2937",
  },

  selectedText: {
    fontWeight: "500",
  },
});