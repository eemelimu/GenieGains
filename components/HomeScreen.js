import { useState, useEffect, useCallback, useContext } from "react";
import { BACKEND_URL } from "../assets/config";
import { ThemeContext } from "./ThemeContext";
import {
  BackHandler,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Button,
  Pressable,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useAuth } from "./AuthContext";

// TODO
// Search bar styles paremmaksi
// Search barin hightlightaus (aktivointi) kun painaa search iconia
// Workout notet ja movementit näkyviin SingleWorkoutissa

const HomeScreen = () => {
  const { theme: ThemeColors } = useContext(ThemeContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [date] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const [name, setName] = useState("name");
  const [selectedWorkout, setSelectedWorkout] = useState({});
  const [workouts, setWorkouts] = useState([]);
  const { state } = useAuth();
  const token = state.token;
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchMenuVisible, setSearchMenuVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedWorkouts, setSearchedWorkouts] = useState(workouts);
  const [workoutMovements, setWorkoutMovements] = useState(null);

  const dateToString = date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const handleWorkoutClose = () => {
    setIsModalVisible(false);
    setSelectedWorkout({});
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const res = await fetch(BACKEND_URL + "exercisemovementconnection", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Auth-Token": token,
            },
          });
          const data = await res.json();

          const groupedMovements = {};

          data.exercisemovementconnection_list.forEach((workout) => {
            const {
              exercise_id,
              id,
              exercise_name,
              updated,
              movement_name,
              reps,
              weight,
              video,
            } = workout;

            if (!groupedMovements[exercise_id]) {
              groupedMovements[exercise_id] = {
                exercise_id: exercise_id,
                name: exercise_name,
                updated: updated,
                movements: [],
              };
            }

            groupedMovements[exercise_id].movements.push({
              id: id,
              name: movement_name,
              reps: reps,
              weight: weight,
              video: video,
            });
          });

          setWorkoutMovements(Object.values(groupedMovements));
        } catch (error) {
          console.log("Error fetching workout movements: ", error);
        }
      };

      fetchData();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      try {
        fetch(BACKEND_URL + "exercise", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Auth-Token": token,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setWorkouts(data.exercise_list);
            setSearchedWorkouts(data.exercise_list);
          })
          .catch((error) => {
            console.log("Error fetching workouts: ", error);
          });
      } catch (error) {
        console.log("Error fetching workouts: ", error);
      }
      return () => {
        backHandler.remove();
      };
    }, [])
  );

  useEffect(() => {
    try {
      fetch(BACKEND_URL + "user", {
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

  const getWorkoutMovements = async (id) => {
    try {
      await exercisesWithMovements();
    } catch (error) {
      console.log("Error fetching workout movements: ", error);
    }
    return null;
  };

  const getworkoutInformation = async (id) => {
    try {
      const res = await fetch(BACKEND_URL + "exercise/" + id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Auth-Token": token,
        },
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log("Error fetching workout information: ", error);
    }
    return null;
  };

  const handleLog = () => {
    console.log(workoutMovements);
  };

  const handleSearchTextChange = (text) => {
    setSearchText(text);
    const regex = new RegExp(text, "i");
    setSearchedWorkouts(workouts.filter((workout) => regex.test(workout.name)));
  };

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

  const SingleWorkout = ({ name, date, id }) => {
    const handleWorkoutPress = async () => {
      const clickedWorkout = workoutMovements.find(
        (workout) => workout.exercise_id == id
      );

      const getNotesById = await getworkoutInformation(id);
      navigation.navigate("ViewWorkout", {
        workout: clickedWorkout,
        notes: getNotesById["note"],
      });
    };

    return (
      <TouchableOpacity
        style={styles.singleWorkout}
        onPress={handleWorkoutPress}
      >
        <Text style={styles.workoutName}>{name}</Text>
        <Text style={styles.workoutDate}>{date}</Text>
      </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    searchItem: {
      position: "absolute",
      right: 10,
    },
    searchItemInput: {
      position: "absolute",
      right: 30,
      width: 125,
      backgroundColor: "lightgrey",
      borderRadius: 5,
      paddingVertical: 5,
      paddingHorizontal: 10,
    },
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
      backgroundColor: ThemeColors.secondary,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 50,
    },
    singleWorkout: {
      width: "90%",
      height: 100,
      backgroundColor: ThemeColors.secondary,
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
      color: ThemeColors.tertiary,
      position: "absolute",
      top: 10,
      right: 10,
    },
    container: {
      flex: 1,
      backgroundColor: ThemeColors.primary,
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
    flatListStyle: {
      width: "90%",
    },
    date: {
      color: ThemeColors.tertiary,
      fontSize: 10,
      opacity: 0.5,
    },
    greetings: {
      color: ThemeColors.tertiary,
      fontSize: 20,
    },
    footer: {
      bottom: 0,
      width: "100%",
      height: 75,
      backgroundColor: ThemeColors.secondary,
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
    },
    startWorkoutButton: {
      backgroundColor: ThemeColors.quaternary,
      borderRadius: 5,
      paddingVertical: 10,
      paddingHorizontal: 20,
      width: 150,
      alignItems: "center",
    },
    footerButton: {
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
      width: 150,
      alignItems: "center",
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: ThemeColors.primary,
      opacity: 0.9,
    },
    modalHeaderText: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 20,
      color: ThemeColors.tertiary,
    },
    regularText: {
      fontSize: 16,
      color: ThemeColors.tertiary,
    },
    closeBtnText: {
      fontSize: 21,
      fontWeight: "bold",
      color: ThemeColors.tertiary,
    },
    modalContent: {
      flexDirection: "column",
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",
      gap: 20,
      backgroundColor: ThemeColors.secondary,
      borderRadius: 10,
      padding: 20,
      width: "80%",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.date}>{dateToString.toUpperCase()}</Text>
        <Text style={styles.greetings}>
          {greeting}, {name}!
          {searchMenuVisible ? (
            <View style={styles.searchItem}>
              <TextInput
                style={styles.searchItemInput}
                placeholder="Search..."
                value={searchText}
                onChangeText={handleSearchTextChange}
              />
              <Ionicons
                name="remove"
                size={24}
                color={ThemeColors.secondary}
                onPress={() => {
                  setSearchMenuVisible(!searchMenuVisible);
                  setSearchText("");
                  setSearchedWorkouts(workouts);
                }}
              />
            </View>
          ) : (
            <AntDesign
              name="search1"
              size={24}
              color={ThemeColors.secondary}
              style={styles.searchItem}
              onPress={() => setSearchMenuVisible(!searchMenuVisible)}
            />
          )}
        </Text>
      </View>
      <View style={styles.main}>
        {searchText || searchMenuVisible ? (
          <FlatList
            contentContainerStyle={styles.flatListContainer}
            style={styles.flatListStyle}
            horizontal={false}
            data={searchedWorkouts}
            ListEmptyComponent={() => (
              <>
                <Text>No Workouts found</Text>
              </>
            )}
            renderItem={({ item }) => (
              <SingleWorkout
                key={item.id}
                id={item.id}
                name={item.name}
                date={item.updated}
                exercise_id={item.exercise_id}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <FlatList
            contentContainerStyle={styles.flatListContainer}
            style={styles.flatListStyle}
            horizontal={false}
            data={workouts}
            ListEmptyComponent={() => (
              <>
                <Text>No Workouts</Text>
              </>
            )}
            renderItem={({ item }) => (
              <SingleWorkout
                key={item.id}
                id={item.id}
                name={item.name}
                date={item.updated}
                exercise_id={item.exercise_id}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
      {menuVisible && (
        <View style={styles.workoutMenu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("Workout")}
          >
            <Text>New</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => console.log("From routines button pressed")}
          >
            <Text>From routines</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={handleLog}>
          <Entypo name="back-in-time" size={24} color={ThemeColors.tertiary} />
          <Text>Log</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerButton, styles.startWorkoutButton]}
          onPress={() => setMenuVisible(!menuVisible)}
        >
          <AntDesign name="plus" size={24} color={ThemeColors.secondary} />
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 15,
              color: ThemeColors.secondary,
            }}
          >
            Start Workout
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate("Goals")}
        >
          <Ionicons name="stats-chart" size={24} color={ThemeColors.tertiary} />
          <Text>Progress</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;