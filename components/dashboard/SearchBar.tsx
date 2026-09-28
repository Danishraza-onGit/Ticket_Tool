import React from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";


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
        color={COLORS.textSearchIcon}
      />

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Search company or ticket no..."
        placeholderTextColor={COLORS.textMuted}
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
    borderColor: COLORS.searchBorder,
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

  searchButton: {
    height: 30,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: COLORS.searchButtonBackground,
    alignItems: "center",
    justifyContent: "center",
  },

  searchText: {
    fontSize: 10,
    fontWeight: "500",
    color: COLORS.textSearchButton,
  },
});