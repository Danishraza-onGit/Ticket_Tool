import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import AppIcon from "../../ui/AppIcon";
import { COLORS } from "../../../constants/colors";

type BackHeaderProps = {
  title: string;
  onBackPress: () => void;
};

export default function BackHeader({
  title,
  onBackPress,
}: BackHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable
        style={({ pressed }) => [
          styles.backButton,
          pressed && styles.backButtonPressed,
        ]}
        onPress={onBackPress}
        hitSlop={6}
      >
        <AppIcon
          name="back"
          size={25}
          color={COLORS.iconBlack}
        />
      </Pressable>

      <Text
        style={styles.title}
        numberOfLines={1}
      >
        {title}
      </Text>

      {/* Keeps title mathematically centered */}
      <View style={styles.rightSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 64,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 16,

    backgroundColor: COLORS.white,

    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSoft,
  },

  backButton: {
    width: 42,
    height: 42,

    borderRadius: 11,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: COLORS.border,

    backgroundColor: COLORS.white,
  },

  backButtonPressed: {
    backgroundColor: COLORS.pressed,
  },

  title: {
    flex: 1,

    textAlign: "center",

    fontSize: 20,
    fontWeight: "700",

    color: COLORS.black,
  },

  rightSpacer: {
    width: 42,
    height: 42,
  },
});