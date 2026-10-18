import React from "react";
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../../constants/colors";

type Props = {
  visible: boolean;
  ticketNo: string;
  busy?: boolean;
  onSkip: () => void;
  onAdd: () => void;
};
export default function InventoryPromptModal({ visible, ticketNo, busy = false, onSkip, onAdd }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => { if (!busy) onSkip(); }}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Add this ticket to Inward/Outward?</Text>
          <Text style={styles.subtitle}>Ticket {ticketNo} is assigned to Team Field. Add it now or later from the ticket details page.</Text>
          <View style={styles.actions}>
            <Pressable disabled={busy} onPress={onSkip} style={styles.secondary} accessibilityRole="button">
              <Text style={styles.secondaryText}>Not now</Text>
            </Pressable>
            <Pressable disabled={busy} onPress={onAdd} style={[styles.primary,busy && styles.disabled]} accessibilityRole="button">
              {busy ? <ActivityIndicator size="small" color={COLORS.white} /> : <Text style={styles.primaryText}>Add to Inward/Outward</Text>}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay:{flex:1,justifyContent:"center",backgroundColor:"rgba(0,0,0,0.4)",paddingHorizontal:24},
  dialog:{backgroundColor:COLORS.white,borderRadius:17,padding:20},
  title:{fontSize:17,fontWeight:"700",color:COLORS.textDark},
  subtitle:{marginTop:9,fontSize:13,lineHeight:19,color:COLORS.textMuted},
  actions:{marginTop:22,flexDirection:"row",justifyContent:"flex-end",gap:9,alignItems:"center"},
  secondary:{borderWidth:1,borderColor:COLORS.border,borderRadius:9,paddingHorizontal:12,paddingVertical:12},
  secondaryText:{fontSize:12,fontWeight:"600",color:COLORS.textDark},
  primary:{backgroundColor:COLORS.navigationActive,borderRadius:9,paddingHorizontal:12,paddingVertical:12,minHeight:42,justifyContent:"center"},
  primaryText:{fontSize:12,color:COLORS.white,fontWeight:"700"},disabled:{opacity:.6},
});
