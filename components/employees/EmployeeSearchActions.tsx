import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type EmployeeSearchActionsProps = {
  searchText: string;
  onSearchTextChange: (text: string) => void;
  onAddPress: () => void;
};

export default function EmployeeSearchActions({
  searchText,
  onSearchTextChange,
  onAddPress,
}: EmployeeSearchActionsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={17}
          color="#8A9BAE"
        />

        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={onSearchTextChange}
          placeholder="Search..."
          placeholderTextColor="#9AAABC"
          autoCapitalize="none"
          returnKeyType="search"
        />
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={onAddPress}
        activeOpacity={0.8}
      >
        <Text style={styles.addButtonText}>
          ＋ Add
        </Text>

        <Ionicons
          name="chevron-down"
          size={15}
          color="#FFFFFF"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  searchContainer: {
    flex: 1,
    height: 42,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#DCE4ED",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  searchInput: {
    flex: 1,
    height: "100%",
    paddingVertical: 0,
    fontSize: 12,
    color: "#26364C",
  },

  addButton: {
    height: 42,
    minWidth: 94,
    borderRadius: 10,
    backgroundColor: "#092E63",
    paddingHorizontal: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },

  addButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});