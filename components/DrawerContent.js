import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

// TODO
// - FEEDBACK: Animoi inputin avaaminen ja sulkeminen

export const DrawerContent = () => {
  const navigation = useNavigation();
  const [feedbackInputVisible, setFeedbackInputVisible] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  const handleSendFeedback = () => {
    if (feedbackText.length > 0) {
      // Luo toiminnallisuus lähettää palautetta
      console.log("Send feedback: ", feedbackText);
      setFeedbackText("");
    }
    setFeedbackInputVisible(false);
  };

  return (
    <View style={styles.drawerContainer}>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => console.log("luo navigointi kun mergetty")}
      >
        <AntDesign
          name="user"
          size={24}
          color="black"
          style={styles.drawerItemIcon}
        />
        <Text>Account</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => console.log("luo navigointi kun mergetty")}
      >
        <Feather
          name="settings"
          size={24}
          color="black"
          style={styles.drawerItemIcon}
        />
        <Text>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => console.log("Tai sitten FAQ.")}
      >
        <MaterialIcons
          name="support-agent"
          size={24}
          color="black"
          style={styles.drawerItemIcon}
        />
        <Text>Help and Support / FAQ</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() =>
          console.log(
            "Navigoi Terms of Service sivulle, jossa on myös sovelluksen versio yms."
          )
        }
      >
        <Entypo
          name="help"
          size={24}
          color="black"
          style={styles.drawerItemIcon}
        />
        <Text>About</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => setFeedbackInputVisible(!feedbackInputVisible)}
      >
        <AntDesign
          name="mail"
          size={24}
          color="black"
          style={styles.drawerItemIcon}
        />
        <Text>Send Feedback</Text>
      </TouchableOpacity>
      {feedbackInputVisible && (
        <View style={styles.sendFeedBackItem}>
          <TextInput
            style={styles.sendFeedbackInput}
            placeholder="What's on your mind?"
            onChangeText={setFeedbackText}
          />
          <TouchableOpacity onPress={handleSendFeedback}>
            <Feather
              name="send"
              size={24}
              color="black"
              style={{ fontSize: 22 }}
            />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.drawerFooter}>
        <TouchableOpacity
          style={styles.drawerFooterItem}
          onPress={() => console.log("luo logout toiminnallisuus")}
        >
          <SimpleLineIcons
            name="logout"
            size={24}
            color="black"
            style={styles.drawerItemIcon}
          />
          <Text style={{ fontWeight: "bold" }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  sendFeedBackItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  sendFeedbackInput: {
    padding: 8,
    paddingHorizontal: 20,
    backgroundColor: "lightgrey",
    width: 250,
    borderRadius: 5,
    marginHorizontal: 5,
    textAlign: "center",
    fontStyle: "italic",
    color: "grey",
  },
  drawerItem: {
    fontSize: 25,
    padding: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
    flexDirection: "row",
    alignItems: "center",
  },
  drawerFooterItem: {
    fontSize: 25,
    padding: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  drawerItemIcon: {
    marginRight: 10,
  },
  drawerFooter: {
    position: "absolute",
    bottom: 10,
    width: "100%",
  },
});
