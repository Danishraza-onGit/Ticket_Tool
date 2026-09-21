import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type AddEmployeeData = {
    fullName: string;
    username: string;
    email: string;
    password: string;
    role: string;
    team: string;
};

type AddEmployeeModalProps = {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: AddEmployeeData) => void;
};

const roleOptions = ["Employee", "Admin"];
const teamOptions = ["None", "FMS", "Field"];

export default function AddEmployeeModal({
    visible,
    onClose,
    onSubmit,
}: AddEmployeeModalProps) {
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [role, setRole] = useState("Employee");
    const [team, setTeam] = useState("None");

    const [showRoleOptions, setShowRoleOptions] =
        useState(false);

    const [showTeamOptions, setShowTeamOptions] =
        useState(false);

    const handleClose = () => {
        setShowRoleOptions(false);
        setShowTeamOptions(false);
        onClose();
    };
    const isEmailValid =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            email.trim()
        );
        

    const isFormValid =
        fullName.trim().length > 0 &&
        username.trim().length > 0 &&
        email.trim().length > 0 &&
        password.trim().length > 0 &&
        role.trim().length > 0 &&
        team !== "None" &&
        isEmailValid;

    const handleSubmit = () => {
        if (!isFormValid) {
            return;
        }

        onSubmit({
            fullName: fullName.trim(),
            username: username.trim(),
            email: email.trim(),
            password,
            role,
            team,
        });
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={
                    Platform.OS === "ios"
                        ? "padding"
                        : undefined
                }
            >
                <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={handleClose}
                />

                <View style={styles.card}>
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            Add Employee
                        </Text>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={handleClose}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name="close"
                                size={18}
                                color="#1F2937"
                            />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <Text style={styles.label}>
                            Full Name
                        </Text>

                        <TextInput
                            style={styles.input}
                            value={fullName}
                            onChangeText={setFullName}
                            placeholder="Enter your name"
                            placeholderTextColor="#6B7280"
                        />

                        <Text style={styles.label}>
                            Username
                        </Text>

                        <TextInput
                            style={styles.input}
                            value={username}
                            onChangeText={setUsername}
                            placeholder="Enter your username"
                            placeholderTextColor="#6B7280"
                            autoCapitalize="none"
                        />

                        <Text style={styles.label}>
                            Email
                        </Text>

                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="name@cygnussolutions.co.in"
                            placeholderTextColor="#6B7280"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <Text style={styles.label}>
                            Password
                        </Text>

                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Enter your password"
                            placeholderTextColor="#6B7280"
                            secureTextEntry
                            autoCapitalize="none"
                        />

                        <Text style={styles.label}>
                            Role
                        </Text>

                        <View style={styles.dropdownWrapper}>
                            <TouchableOpacity
                                style={styles.dropdownButton}
                                onPress={() => {
                                    setShowRoleOptions(
                                        (current) => !current
                                    );
                                    setShowTeamOptions(false);
                                }}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.dropdownText}>
                                    {role}
                                </Text>

                                <Ionicons
                                    name={
                                        showRoleOptions
                                            ? "chevron-up"
                                            : "chevron-down"
                                    }
                                    size={15}
                                    color="#737B86"
                                />
                            </TouchableOpacity>

                            {showRoleOptions && (
                                <View style={styles.dropdownMenu}>
                                    {roleOptions.map((option) => (
                                        <TouchableOpacity
                                            key={option}
                                            style={styles.dropdownOption}
                                            onPress={() => {
                                                setRole(option);
                                                setShowRoleOptions(false);
                                            }}
                                        >
                                            <Text
                                                style={[
                                                    styles.dropdownOptionText,
                                                    role === option &&
                                                    styles.selectedOptionText,
                                                ]}
                                            >
                                                {option}
                                            </Text>

                                            {role === option && (
                                                <Ionicons
                                                    name="checkmark"
                                                    size={15}
                                                    color="#174F8A"
                                                />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                        <Text style={styles.label}>
                            Team
                        </Text>

                        <View style={styles.dropdownWrapper}>
                            <TouchableOpacity
                                style={styles.dropdownButton}
                                onPress={() => {
                                    setShowTeamOptions(
                                        (current) => !current
                                    );
                                    setShowRoleOptions(false);
                                }}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.dropdownText}>
                                    {team}
                                </Text>

                                <Ionicons
                                    name={
                                        showTeamOptions
                                            ? "chevron-up"
                                            : "chevron-down"
                                    }
                                    size={15}
                                    color="#737B86"
                                />
                            </TouchableOpacity>

                            {showTeamOptions && (
                                <View style={styles.dropdownMenu}>
                                    {teamOptions.map((option) => (
                                        <TouchableOpacity
                                            key={option}
                                            style={styles.dropdownOption}
                                            onPress={() => {
                                                setTeam(option);
                                                setShowTeamOptions(false);
                                            }}
                                        >
                                            <Text
                                                style={[
                                                    styles.dropdownOptionText,
                                                    team === option &&
                                                    styles.selectedOptionText,
                                                ]}
                                            >
                                                {option}
                                            </Text>

                                            {team === option && (
                                                <Ionicons
                                                    name="checkmark"
                                                    size={15}
                                                    color="#174F8A"
                                                />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.submitButton,
                                !isFormValid && styles.submitButtonDisabled,
                            ]}
                            onPress={handleSubmit}
                            activeOpacity={0.8}
                            disabled={!isFormValid}
                        >
                            <Text
                                style={[
                                    styles.submitText,
                                    !isFormValid && styles.submitTextDisabled,
                                ]}
                            >
                                Add Employee
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.35)",
        justifyContent: "center",
        paddingHorizontal: 16,
    },

    card: {
        maxHeight: "88%",
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        paddingHorizontal: 22,
        paddingTop: 18,
        paddingBottom: 20,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 18,
    },

    title: {
        flex: 1,
        fontSize: 16,
        fontWeight: "700",
        color: "#171717",
    },

    closeButton: {
        width: 28,
        height: 28,
        borderRadius: 9,
        backgroundColor: "#F5F5F5",
        alignItems: "center",
        justifyContent: "center",
    },

    label: {
        marginBottom: 7,
        fontSize: 12,
        fontWeight: "600",
        color: "#171717",
    },

    input: {
        height: 42,
        borderRadius: 9,
        backgroundColor: "#F1F1F1",
        paddingHorizontal: 12,
        fontSize: 12,
        color: "#172238",
        marginBottom: 14,
    },

    dropdownWrapper: {
        position: "relative",
        marginBottom: 14,
        zIndex: 10,
    },

    dropdownButton: {
        height: 42,
        borderRadius: 9,
        backgroundColor: "#F1F1F1",
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
    },

    dropdownText: {
        flex: 1,
        fontSize: 12,
        color: "#646B74",
    },

    dropdownMenu: {
        marginTop: 5,
        borderRadius: 9,
        borderWidth: 1,
        borderColor: "#DCE4ED",
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
    },

    dropdownOption: {
        minHeight: 40,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
    },

    dropdownOptionText: {
        flex: 1,
        fontSize: 12,
        color: "#52647B",
    },

    selectedOptionText: {
        fontWeight: "600",
        color: "#174F8A",
    },

    submitButton: {
        height: 42,
        borderRadius: 9,
        backgroundColor: "#194F8C",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 2,
    },

    submitText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#FFFFFF",
    },

    submitButtonDisabled: {
        backgroundColor: "#D7DEE8",
    },

    submitTextDisabled: {
        color: "#8A98AA",
    },
});