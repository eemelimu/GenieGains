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
import { useAuth } from "./AuthContext";

// TODO
// - FEEDBACK: Animoi inputin avaaminen ja sulkeminen
// - FEEDBACK: Lähetä palautetta toiminnallisuus
// - FEEDBACK: Feedback Sent -viesti ja sen animointi

export const DrawerContent = () => {
  const [feedbackInputVisible, setFeedbackInputVisible] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackWarning, setFeedbackWarning] = useState(false);
  const navigation = useNavigation();
  const { dispatch } = useAuth();

  const handleLogout = () => {
    dispatch({
      type: "LOGOUT",
    });
  };

  const handleAbout = () => {
    navigation.navigate("About");
  };
  const handleSendFeedback = () => {
    if (feedbackText.length > 0) {
      // Luo toiminnallisuus lähettää palautetta
      setFeedbackText("");
      setFeedbackSent(true);
      setTimeout(() => {
        setFeedbackSent(false);
      }, 3000);
      setFeedbackInputVisible(false);
    } else {
      setFeedbackWarning(true);
      setTimeout(() => {
        setFeedbackWarning(false);
      }, 3000);
    }
  };

  return (
    <View style={styles.drawerContainer}>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => console.log("Navigoi profiili sivulle.")}
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
        onPress={() => {
          console.log("Navigoi aseukset sivulle.");
          navigation.navigate("Settings");
        }}
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
        onPress={() =>
          console.log(
            "Päättäkää onko FAQ vai Help and Support. Uuden sivun luonti ja navigointi sinne."
          )
        }
      >
        <MaterialIcons
          name="support-agent"
          size={24}
          color="black"
          style={styles.drawerItemIcon}
        />
        <Text>Help and Support / FAQ</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.drawerItem} onPress={() => handleAbout()}>
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
            style={[
              styles.sendFeedbackInput,
              feedbackWarning && { borderWidth: 1, borderColor: "red" },
            ]}
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
      {feedbackSent && (
        <View style={styles.sendFeedBackItemSent}>
          <Text>Feedback Sent</Text>
        </View>
      )}
      <View style={styles.drawerFooter}>
        <TouchableOpacity
          style={styles.drawerFooterItem}
          onPress={handleLogout}
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
    marginTop: 50,
    flex: 1,
    backgroundColor: "#fff",
  },
  sendFeedBackItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  sendFeedBackItemSent: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#CCFFCC",
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 10,
  },
  sendFeedbackInput: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "lightgrey",
    width: 250,
    borderRadius: 5,
    marginHorizontal: 5,
    textAlign: "center",
    fontStyle: "italic",
    color: "grey",
    alignSelf: "center",
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
