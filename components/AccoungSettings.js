import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  TextInput,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemeColors } from "../assets/ThemeColors";

const AccountSettings = () => {
  const [username, setUsername] = useState("Username"); //fetch the username from the database
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleEmailChange = () => {
    setEmailModalVisible(true);
  };

  const handlePasswordChange = () => {
    setPasswordModalVisible(true);
  };

  const saveEmailChange = () => {
    // Logic to save email change
    setEmailModalVisible(false);
  };

  const savePasswordChange = () => {
    // Logic to save password change
    //check the old password is actually the old password
    setPasswordModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.username}>Username: {username}</Text>

      <Pressable style={styles.button} onPress={handleEmailChange}>
        <MaterialIcons name="email" size={24} color={ThemeColors.tertiary}  />
        <Text style={styles.buttonText}>Change Email</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={handlePasswordChange}>
        <MaterialIcons name="lock" size={24} color={ThemeColors.tertiary} />
        <Text style={styles.buttonText}>Change Password</Text>
      </Pressable>

      {/* Email Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={emailModalVisible}
        onRequestClose={() => setEmailModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Email change form */}
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholder={email ? email : "New Email"}
            />
            <Pressable style={styles.saveButton} onPress={saveEmailChange}>
              <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
            <Pressable
              style={styles.cancelButton}
              onPress={() => setEmailModalVisible(false)} //fetch the old email back and set it as the email
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Password Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={passwordModalVisible}
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Password change form */}
            <TextInput
              style={styles.input}
              placeholderTextColor={ThemeColors.tertiary}
              placeholder="Old Password"
              secureTextEntry
              value={oldPassword}
              onChangeText={setOldPassword}
            />
            <TextInput
              placeholderTextColor={ThemeColors.tertiary}
              style={styles.input}
              placeholder="New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <Pressable style={styles.saveButton} onPress={savePasswordChange}>
              <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
            <Pressable
              style={styles.cancelButton}
              onPress={() => setPasswordModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: ThemeColors.primary,
  },
  username: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "bold",
    color: ThemeColors.tertiary,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    marginLeft: 10,
    color: ThemeColors.tertiary,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: ThemeColors.secondary,
    opacity: 0.8,
  },
  modalContent: {
    backgroundColor: ThemeColors.secondary,
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: ThemeColors.quaternary,
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  saveButton: {
    backgroundColor: ThemeColors.primary,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  saveButtonText: {
    color: ThemeColors.tertiary,
  },
  cancelButton: {
    marginTop: 10,
    padding: 5,
  },
  cancelButtonText: {
    color: ThemeColors.quaternary,
  },
});

export default AccountSettings;
