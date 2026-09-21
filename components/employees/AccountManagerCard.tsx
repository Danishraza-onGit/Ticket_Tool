import { Ionicons } from "@expo/vector-icons";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import type {
    AccountManager,
} from "../../types/employee";

type AccountManagerCardProps = {
    accountManager: AccountManager;
    onEdit: () => void;
};

export default function AccountManagerCard({
    accountManager,
    onEdit,
}: AccountManagerCardProps) {
    return (
        <View style={styles.card}>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                    {accountManager.initials}
                </Text>
            </View>

            <View style={styles.info}>
                <Text
                    style={styles.name}
                    numberOfLines={1}
                >
                    {accountManager.fullName}
                </Text>

                <Text
                    style={styles.email}
                    numberOfLines={1}
                >
                    {accountManager.email}
                </Text>
            </View>

            <TouchableOpacity
                style={styles.editButton}
                onPress={onEdit}
                activeOpacity={0.7}
                accessibilityLabel={`Edit ${accountManager.fullName}`}
            >
                <Ionicons
                    name="pencil-outline"
                    size={14}
                    color="#174F8A"
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        minHeight: 78,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#DCE4ED",
        marginBottom: 10,
        paddingHorizontal: 14,
        paddingVertical: 13,
        flexDirection: "row",
        alignItems: "center",
    },

    avatar: {
        width: 44,
        height: 44,
        borderRadius: 13,
        backgroundColor: "#E8EEF5",
        alignItems: "center",
        justifyContent: "center",
    },

    avatarText: {
        fontSize: 13,
        fontWeight: "700",
        color: "#000000",
    },

    info: {
        flex: 1,
        marginLeft: 12,
        marginRight: 10,
    },

    name: {
        fontSize: 13,
        fontWeight: "700",
        color: "#16243A",
    },

    email: {
        marginTop: 5,
        fontSize: 9.5,
        color: "#8A9BAE",
    },

    editButton: {
        width: 30,
        height: 30,
        borderRadius: 9,
        borderWidth: 1,
        borderColor: "#D6E2EF",
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
    },

    editText: {
        fontSize: 10,
        fontWeight: "600",
        color: "#174F8A",
    },
});