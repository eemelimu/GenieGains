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
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "./AuthContext";
const HomeScreen = () => {
  const [date] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const [name, setName] = useState("name");
  const [workouts, setWorkouts] = useState([]);
  //const [token, setToken] = useState("723614a8-47b4-4c22-8328-969f649d048a");
  const { state } = useAuth();
  const token = state.token;
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);

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

  const handleProgress = () => {
    console.log("Progress button pressed");
  };

  const handleLog = () => {
    console.log("Log button pressed");
  };

  const handleNewWorkout = () => {
    console.log("New workout button pressed");
    navigation.navigate("Workout");
  };

  const handleFromRoutines = () => {
    console.log("From routines button pressed");
  };

  // TODO:
  // Search bar yläreunaan jolla voi hakea treenejä nimen perusteella

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
          <Text>
            {workouts.map((workout) => {
              return (
                <Workout
                  key={workout.id}
                  name={workout.name}
                  date={workout.updated}
                />
              );
            })}
          </Text>
        </View>
      </ScrollView>
      {menuVisible && (
        <View style={styles.workoutMenu}>
          <TouchableOpacity style={styles.menuItem} onPress={handleNewWorkout}>
            <Text>New</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleFromRoutines}
          >
            <Text>From routines</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={handleLog}>
          <Entypo name="back-in-time" size={24} color="black" />
          <Text>Log</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerButton, styles.startWorkoutButton]}
          onPress={() => setMenuVisible(!menuVisible)}
        >
          <AntDesign name="plus" size={24} color="black" />
          <Text style={{ fontWeight: "bold", fontSize: 15 }}>
            Start Workout
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={handleProgress}>
          <Ionicons name="stats-chart" size={24} color="black" />
          <Text>Progress</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const Workout = ({ name, date }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.singleWorkout}
      onPress={() => console.log(`${name} workout pressed`)}
    >
      <Text style={styles.workoutName}>{name}</Text>
      <Text style={styles.workoutDate}>{date}</Text>
      <Text>Days since last: -</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // jos ongelmia nappien kanssa, laita bottom: 0 ja height: 100
  workoutMenu: {
    position: "absolute",
    bottom: 80,
    width: "100%",
    height: 40,
    justifyContent: "center",
    flexDirection: "row",
  },
  menuItem: {
    marginHorizontal: 10,
    backgroundColor: "#D8D8D8",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
  },
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
