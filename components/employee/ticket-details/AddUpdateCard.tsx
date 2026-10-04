import React, {
    useState,
} from "react";

import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { COLORS } from "../../../constants/colors";

type AddUpdateCardProps = {
    onAddUpdate?: (
        message: string
    ) => void;
};

export default function AddUpdateCard({
    onAddUpdate,
}: AddUpdateCardProps) {
    const [
        message,
        setMessage,
    ] = useState("");

    const trimmedMessage =
        message.trim();

    const handlePress = () => {
        if (!trimmedMessage) {
            return;
        }

        onAddUpdate?.(
            trimmedMessage
        );

        setMessage("");
    };

    return (
        <View style={styles.card}>
            <Text style={styles.title}>
                ADD UPDATE
            </Text>

            <TextInput
                style={styles.input}
                value={message}
                onChangeText={setMessage}
                placeholder="Describe the update..."
                placeholderTextColor={
                    COLORS.placeholder
                }
                multiline
                textAlignVertical="top"
            />

            <TouchableOpacity
                style={[
                    styles.button,
                    !trimmedMessage &&
                    styles.disabledButton,
                ]}
                onPress={handlePress}
                disabled={!trimmedMessage}
                activeOpacity={0.8}
            >
                <Text
                    style={styles.buttonText}
                >
                    Add Update
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        marginTop: 16,
        marginBottom: 16,

        padding: 16,

        backgroundColor: COLORS.white,

        borderRadius: 16,

        borderWidth: 1,
        borderColor: COLORS.border,
    },

    title: {
        fontSize: 10,
        fontWeight: "700",

        letterSpacing: 0.8,

        color:
            COLORS.textSecondary,
    },

    input: {
        minHeight: 96,

        marginTop: 14,

        paddingHorizontal: 12,
        paddingVertical: 12,

        borderRadius: 11,

        borderWidth: 1,
        borderColor:
            COLORS.border,

        backgroundColor:
            COLORS.surfaceSoft,

        fontSize: 11,
        lineHeight: 17,

        color: COLORS.black,
    },

    button: {
        alignSelf: "flex-end",

        minWidth: 108,
        height: 40,

        marginTop: 14,

        paddingHorizontal: 16,

        borderRadius: 9,

        backgroundColor:
            COLORS.navigationActive,

        alignItems: "center",
        justifyContent: "center",
    },

    disabledButton: {
        opacity: 0.45,
    },

    buttonText: {
        fontSize: 10,
        fontWeight: "700",

        color: COLORS.white,
    },
});