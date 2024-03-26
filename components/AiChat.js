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
    width: "80%",
    position: "absolute",
    bottom: 110,
    right: 20,
  },
  chatbox: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    maxHeight: 200,
    overflow: "scroll",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 5,
  },
  inputRow: {
    justifyContent: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    padding: 3,
  },
  messageContainer: {
    padding: 10,
    overflow: "scroll",
    justifyContent: "flex-start",
    textAlign: "right",
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
  },
});
