import React from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
        color="#8FA0B4"
      />

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Search by company name..."
        placeholderTextColor="#7D8DA1"
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
            color="#8FA0B4"
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
    borderColor: "#DEE6EF",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 4,
  },

  input: {
    flex: 1,
    height: "100%",
    fontSize: 11,
    color: "#26364C",
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