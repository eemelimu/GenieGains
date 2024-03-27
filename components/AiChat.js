import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, TextInput } from "react-native";
import { Fontisto } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

export const AiChat = () => {
  const [openChat, setOpenChat] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [conversation, setConversation] = useState([
    { type: "sent", content: "Hello! :))" },
    { type: "received", content: "hello, t. chatgpt!" },
  ]);

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      const updatedConversation = [
        ...conversation,
        { type: "sent", content: newMessage.trim() },
      ];
      setConversation(updatedConversation);
      setNewMessage("");
    }
  };

  return (
    <View style={styles.container}>
      {openChat && (
        <View style={styles.chatbox}>
          <View style={styles.messageContainer}>
            {conversation.map((message, index) => (
              <Text
                key={index}
                style={
                  message.type === "sent"
                    ? styles.sentMessage
                    : styles.receivedMessages
                }
              >
                {message.content}
              </Text>
            ))}
          </View>
          <View style={styles.line} />
          <View style={styles.inputRow}>
            <TextInput
              onSubmitEditing={sendMessage}
              style={styles.input}
              value={newMessage}
              onChangeText={(text) => setNewMessage(text)}
              placeholder="Type your question..."
              placeholderTextColor={"#ccc"}
              width="85%"
              keyboardType="default"
            />
            <Pressable onPress={sendMessage} style={styles.sendIcon}>
              <Feather
                name="send"
                size={24}
                color="black"
                style={{ paddingHorizontal: 5 }}
              />
            </Pressable>
          </View>
        </View>
      )}
      <View style={styles.chatControl}>
        {!openChat && (
          <Pressable onPress={() => setOpenChat(!openChat)}>
            <Fontisto name="hipchat" size={50} color="orange" />
          </Pressable>
        )}
        {openChat && (
          <Pressable onPress={() => setOpenChat(!openChat)}>
            <AntDesign name="closesquareo" size={50} color="orange" />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "80%",
    position: "absolute",
    bottom: 150,
    zIndex: 1000,
  },
  chatbox: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    overflow: "scroll",
    paddingBottom: 50,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 5,
  },
  sendIcon: {
    marginLeft: 10,
  },
  messageContainer: {
    padding: 10,
    overflow: "scroll",
    justifyContent: "flex-start",
    textAlign: "right",
    minHeight: "90%",
  },
  sentMessage: {
    borderRadius: 10,
    marginBottom: 5,
    textAlign: "right",
  },
  receivedMessages: {
    borderRadius: 10,
    marginBottom: 5,
    textAlign: "left",
  },
  line: {
    left: 0,
    borderBottomWidth: 1,
    borderBottomColor: "white",
    width: "100%",
  },
  closeChat: {
    position: "absolute",
    bottom: 0,
    padding: 5,
  },
  chatControl: {
    alignItems: "flex-end",
    position: "absolute",
    right: 0,
    bottom: -60,
  },
});
