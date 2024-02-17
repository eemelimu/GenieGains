import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { ThemeColors } from "../assets/ThemeColors";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { withRadialActionMenu } from 'react-native-radial-context-menu'

const HomeScreen = () => {
  const [date] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const [name, setName] = useState("name");
  const [workouts, setWorkouts] = useState([]);
  const [token, setToken] = useState("723614a8-47b4-4c22-8328-969f649d048a");

  const dateToString = date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  // Fetch workouts from the server
  useEffect(() => {
    try {
      fetch("http://localhost:8000/exercise", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Auth-Token": token,
        },
      })
        .then((response) => response.json())
        .then((data) => setWorkouts(data.exercise_list))
        .catch((error) => {
          console.log("Error fetching workouts: ", error);
        });
    } catch (error) {
      console.log("Error fetching workouts: ", error);
    }
  }, []);

  useEffect(() => {
    try {
      fetch("http://localhost:8000/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Auth-Token": token,
        },
      })
        .then((response) => response.json())
        .then((data) => setName(data.username))
        .catch((error) => {
          console.log("Error fetching workouts: ", error);
        });
    } catch (error) {
      console.log("Error fetching workouts: ", error);
    }
  }, []);

  const handleStartWorkout = async () => {
    console.log(workouts);
  };

  const handleSettings = () => {
    console.log("Settings button pressed");
  };

  const handleJournal = () => {
    console.log("Journal button pressed");
  };

  // TODO:
  // Search bar yläreunaan jolla voi hakea treenejä nimen perusteella
  // Radial menu start workouttiin: https://github.com/thegreatercurve/react-native-radial-context-menu
  useEffect(() => {
    const currentTime = new Date().getHours();
    if (currentTime < 12) {
      setGreeting("Good morning");
    } else if (currentTime < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.date}>{dateToString.toUpperCase()}</Text>
        <Text style={styles.greetings}>
          {greeting}, {name}!
        </Text>
      </View>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.main}>
        <Text>{
          workouts.map((workout) => {
            return <Workout key={workout.id} name={workout.name} date={workout.updated} />;
          })
        }</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={handleJournal}>
          <Entypo name="back-in-time" size={24} color="black" />
          <Text>Log</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerButton, styles.startWorkoutButton]}
          onPress={handleStartWorkout}
        >
          <AntDesign name="plus" size={24} color="black" />
          <Text style={{ fontWeight: "bold", fontSize: 15 }}>
            Start Workout
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={handleJournal}>
          <Ionicons name="stats-chart" size={24} color="black" />
          <Text>Progress</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const Workout = ({ name, date }) => {
  return (
    <TouchableOpacity style={styles.singleWorkout} onPress={() => console.log(name)}>
      <Text style={styles.workoutName}>{name}</Text>
      <Text style={styles.workoutDate}>{date}</Text>
      <Text>Days since last: -</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  singleWorkout: {
    width: "90%",
    height: 100,
    backgroundColor: "#D8D8D8",
    marginVertical: 7,
    justifyContent: "center",
    alignItems: "flex-start",
    borderRadius: 15,
    paddingHorizontal: 10,
    position: "relative",
  },
  workoutName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    alignSelf: "flex-start",
    position: "absolute",
    top: 10,
    left: 10,
  },
  workoutDate: {
    fontSize: 14,
    color: "#666",
    position: "absolute",
    top: 10,
    right: 10,
  },
  container: {
    flex: 1,
  },
  main: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 100,
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: 150, // Fixed width for all buttons
    alignItems: "center", // Center button content horizontally
  },
  footerButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: 150, // Fixed width for all buttons
    alignItems: "center", // Center button content horizontally
  },
});

export default HomeScreen;
