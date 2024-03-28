import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  Modal,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import useRequest from "../hooks/useRequest";
import { Fontisto } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { BACKEND_URL } from "../assets/config";
import { ThemeContext } from "../contexts/ThemeContext";
import { useLocalization } from "../contexts/LocalizationContext";
import { ThemeColors } from "../assets/theme/ThemeColors";

// TODO
// Localisaatio ekaan viestiin

export const AiChat = (username) => {
  const name = username.username;
  const [openChat, setOpenChat] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [conversation, setConversation] = useState([
    {
      type: "received",
      content: `Hello, ${name}! I'm your AI personal trainer! Feel free to ask me anything workout related! :)`,
    },
  ]);
  const { state } = useAuth();
  const { theme: ThemeColors } = useContext(ThemeContext);
  const token = state.token;
  const { fetcher } = useRequest(token);
  const { t } = useLocalization();

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      const updatedConversation = [
        ...conversation,
        { type: "sent", content: newMessage.trim() },
      ];
      setConversation(updatedConversation);
      setNewMessage("");
      getResponse(updatedConversation, newMessage);
    }
  };

  const getResponse = async (prevConversation, message) => {
    console.log("message", message);
    console.log("prevConversation", prevConversation);
    const res = await fetcher({
      url: BACKEND_URL + "question",
      reqMethod: "POST",
      object: { question: message },
    });
    if (res) {
      res.answer &&
        setConversation([
          ...prevConversation,
          { type: "received", content: res.answer },
        ]);
    }
  };

  return (
    <View style={styles.container}>
      {openChat && (
        <Modal
          transparent={true}
          visible={openChat}
          onRequestClose={() => setOpenChat(!openChat)}
          animationType="slide"
        >
          <View style={styles.chatbox}>
            <View style={styles.messageContainer}>
              {conversation.map((message, index) => (
                <Text
                  key={index}
                  style={[
                    styles.messageBubble,
                    message.type === "sent"
                      ? styles.sentMessage
                      : styles.receivedMessages,
                  ]}
                >
                  {message.content}
                </Text>
              ))}
            </View>
            <View style={styles.inputRow}>
              <TextInput
                onSubmitEditing={sendMessage}
                style={styles.input}
                value={newMessage}
                onChangeText={(text) => setNewMessage(text)}
                placeholder={t("feedback-placeholder")}
                color={ThemeColors.tertiary}
                placeholderTextColor={ThemeColors.tertiary}
                keyboardType="default"
              />
              <Pressable onPress={sendMessage} style={styles.sendIcon}>
                <Feather
                  name="send"
                  size={24}
                  color={ThemeColors.tertiary}
                  style={{
                    paddingHorizontal: 5,
                    opacity: newMessage === "" ? 0.2 : 1,
                  }}
                />
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
      {!openChat && (
        <Pressable
          style={styles.openChat}
          onPress={() => setOpenChat(!openChat)}
        >
          <Fontisto name="hipchat" size={50} color="orange" />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  chatbox: {
    flex: 1,
    backgroundColor: ThemeColors.primary,
    borderRadius: 10,
    overflow: "scroll",
    width: "98%",
    alignSelf: "center",
  },
  messageBubble: {
    maxWidth: "70%",
    marginBottom: 10,
    alignSelf: "flex-end",
    borderRadius: 10,
    padding: 10,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    position: "absolute",
    bottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: ThemeColors.tertiary,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 5,
  },
  sendIcon: {
    marginLeft: 10,
  },
  messageContainer: {
    paddingVertical: 10,
    overflow: "scroll",
    justifyContent: "flex-start",
    textAlign: "right",
  },
  sentMessage: {
    fontSize: 16,
    padding: 10,
    textAlign: "right",
    backgroundColor: "#DCF8C6",
    marginRight: 10,
  },
  receivedMessages: {
    fontSize: 16,
    padding: 10,
    textAlign: "left",
    width: "100%",
    backgroundColor: ThemeColors.tertiary,
    marginLeft: 10,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  closeChat: {
    position: "absolute",
    bottom: 0,
    padding: 5,
  },
  openChat: {
    alignItems: "flex-end",
    position: "absolute",
    right: 0,
    bottom: 100,
    zIndex: 0,
  },
  closeChat: {
    alignItems: "flex-end",
    position: "absolute",
    right: "45%",
    top: 0,
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
  },
});
