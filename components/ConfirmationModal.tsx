import { BlurView } from "expo-blur";
import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

interface ConfirmationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView intensity={20} tint="extraLight" style={styles.modalBlur}>
        <Pressable style={styles.modalBackdrop} onPress={onClose}>
          <Pressable>
            <View style={styles.innerModal}>
              <View
                style={{
                  backgroundColor: "#0F6E56",
                  width: "100%",
                  borderTopLeftRadius: 14,
                  borderTopRightRadius: 14,
                  padding: 20,
                }}
              >
                <Text
                  style={[
                    styles.buttonText,
                    { textAlign: "auto", paddingBottom: 8 },
                  ]}
                >
                  Save Changes?
                </Text>
                <Text
                  style={{
                    color: "#9FE1CB",
                    fontSize: 16,
                    fontWeight: "500",
                  }}
                >
                  You're about to update this bank holiday.
                </Text>
                <Text
                  style={{
                    color: "#9FE1CB",
                    fontSize: 16,
                    fontWeight: "500",
                  }}
                >
                  This can be updated at any time
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  paddingHorizontal: 20,
                  paddingBottom: 20,
                }}
              >
                <Pressable
                  onPress={() => onClose()}
                  style={[
                    styles.buttonWrapper,
                    {
                      backgroundColor: "white",
                      borderWidth: 1,
                      borderColor: "#D3D1C7",
                      flex: 1,
                      marginRight: 4,
                    },
                  ]}
                >
                  <Text style={[styles.buttonText, { color: "#888780" }]}>
                    Go Back
                  </Text>
                </Pressable>
                <Pressable
                  onPress={onConfirm}
                  style={[styles.buttonWrapper, { flex: 1, marginLeft: 4 }]}
                >
                  <Text style={styles.buttonText}>Confirm</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    marginTop: 20,
    paddingHorizontal: 10,
    paddingVertical: 16,
    backgroundColor: "#1D9E75",
    borderRadius: 14,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 20,
    color: "#FFF",
    fontWeight: "600",
  },
  modalBlur: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(29, 158, 117, 0.3)",
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerModal: {
    backgroundColor: "white",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
});
