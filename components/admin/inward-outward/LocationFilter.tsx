import React, {
    useRef,
    useState,
} from "react";

import {
    Dimensions,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../constants/colors";
import type {
    LocationFilterValue,
} from "../../../types/inwardOutward";

type LocationFilterProps = {
    value: LocationFilterValue;
    onChange: (
        value: LocationFilterValue
    ) => void;
};

const options: LocationFilterValue[] = [
    "All Locations",
    "In-House",
    "Outsourced",
];

export default function LocationFilter({
    value,
    onChange,
}: LocationFilterProps) {
    const [open, setOpen] = useState(false);

    const [dropdownPosition, setDropdownPosition] =
        useState({
            top: 0,
            right: 0,
            width: 150,
        });

    const buttonRef = useRef<View>(null);

    const openDropdown = () => {
        buttonRef.current?.measureInWindow(
            (x, y, width, height) => {
                setDropdownPosition({
                    top: y + height + 5,
                    right:
                        Math.max(
                            12,
                            Dimensions.get("window").width -
                            x -
                            width
                        ),
                    width: Math.max(width, 150),
                });

                setOpen(true);
            }
        );
    };

    const handleButtonPress = () => {
        if (open) {
            setOpen(false);
            return;
        }

        openDropdown();
    };

    const handleSelect = (
        option: LocationFilterValue
    ) => {
        onChange(option);
        setOpen(false);
    };

    return (
        <>
            <View
                ref={buttonRef}
                collapsable={false}
            >
                <Pressable
                    style={styles.button}
                    onPress={handleButtonPress}
                >
                    <Text style={styles.buttonText}>
                        {value}
                    </Text>

                    <Ionicons
                        name={
                            open
                                ? "chevron-up"
                                : "chevron-down"
                        }
                        size={15}
                        color={COLORS.iconGrey}
                    />
                </Pressable>
            </View>

            <Modal
                visible={open}
                transparent
                animationType="none"
                onRequestClose={() => setOpen(false)}
            >
                <View style={styles.modalRoot}>
                    {/* Tap anywhere outside */}
                    <Pressable
                        style={StyleSheet.absoluteFill}
                        onPress={() => setOpen(false)}
                    />

                    <View
                        style={[
                            styles.dropdown,
                            {
                                top: dropdownPosition.top,
                                right: dropdownPosition.right,
                                width: dropdownPosition.width,
                            },
                        ]}
                    >
                        {options.map((option) => {
                            const selected =
                                option === value;

                            return (
                                <Pressable
                                    key={option}
                                    style={({ pressed }) => [
                                        styles.option,
                                        pressed &&
                                        styles.optionPressed,
                                    ]}
                                    onPress={() =>
                                        handleSelect(option)
                                    }
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            selected &&
                                            styles.selectedText,
                                        ]}
                                    >
                                        {option}
                                    </Text>

                                    {selected && (
                                        <Ionicons
                                            name="checkmark"
                                            size={16}
                                            color={COLORS.iconGrey}
                                        />
                                    )}
                                </Pressable>
                            );
                        })}
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 40,
        minWidth: 130,

        paddingHorizontal: 12,

        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,

        backgroundColor: COLORS.white,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        gap: 10,
    },

    buttonText: {
        fontSize: 11,
        fontWeight: "500",
        color: COLORS.textPrimary,
    },

    modalRoot: {
        flex: 1,
    },

    dropdown: {
        position: "absolute",

        backgroundColor: COLORS.white,

        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 11,

        paddingVertical: 5,

        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.12,
        shadowRadius: 8,

        elevation: 20,
    },

    option: {
        minHeight: 40,

        paddingHorizontal: 12,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    optionPressed: {
        backgroundColor: COLORS.pressed,
    },

    optionText: {
        fontSize: 11,
        color: COLORS.textPrimary,
    },

    selectedText: {
        fontWeight: "700",
        color: COLORS.navigationActive,
    },
});