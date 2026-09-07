import React from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
};

export default function SearchBar({
  value,
  onChangeText,
  onSearch,
}: SearchBarProps) {
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
        placeholder="Search company or ticket no..."
        placeholderTextColor="#7D8DA1"
        returnKeyType="search"
        onSubmitEditing={onSearch}
      />

      <TouchableOpacity
        style={styles.searchButton}
        onPress={onSearch}
        activeOpacity={0.7}
      >
        <Text style={styles.searchText}>Search</Text>
      </TouchableOpacity>
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

  searchButton: {
    height: 30,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#f1f4f8",
    alignItems: "center",
    justifyContent: "center",
  },

  searchText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#34455B",
  },
});