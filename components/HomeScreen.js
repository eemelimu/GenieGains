import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { ThemeColors } from "../assets/ThemeColors";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const HomeScreen = () => {
  const [date] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  const [name, setName] = useState('name');

  const dateToString = date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const handleStartWorkout = () => {
    console.log("Start workout button pressed");
  };

  const handleSettings = () => {
    console.log("Settings button pressed");
  };

  const handleJournal = () => {
    console.log("Journal button pressed");
  };

  const handleNewWorkout = () => {
    console.log("New workout button pressed");
  };

  // TODO: Hae käyttäjän nimi useEffectin avulla
  
  useEffect(() => {
    const currentTime = new Date().getHours();
    if (currentTime < 12) {
      setGreeting('Good morning');
    } else if (currentTime < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
      <Text style={styles.date}>{dateToString.toUpperCase()}</Text>
        <Text style={styles.greetings}>{greeting}, {name}!</Text>
      </View>
      <View style={styles.main}>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={handleJournal}>
          <MaterialCommunityIcons
            name="file-document-multiple-outline"
            size={24}
            color="black"
          />
          <Text>Journal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerButton, styles.startWorkoutButton]}
          onPress={handleNewWorkout}
        >
          <AntDesign name="plus" size={24} color="black" />
          <Text style={{fontWeight: 'bold', fontSize: 15}}>Start Workout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={handleSettings}>
          <Feather name="settings" size={24} color="black" />
          <Text>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  header: {
    top: 0,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  date: {
    color: "#02075d",
    fontSize: 10,
    opacity: 0.5,
  },
  greetings: {
    color: "black",
    fontSize: 20,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 75,
    backgroundColor: "#D8D8D8",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  startWorkoutButton: {
    backgroundColor: ThemeColors.primary,
    borderRadius: 5,
    padding: 10,
  },
  footerButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
});

export default HomeScreen;
