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
  Modal,
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

const HomeScreen = () => {
  const seed =
    new Date().getDate() + new Date().getMonth() + new Date().getFullYear();
  const { theme: ThemeColors } = useContext(ThemeContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [date] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const [experience, setExperience] = useState("beginner");
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

  const beginnerTips = [
    "Start Slow and Steady: Don't rush into intense workouts. Begin with light exercises to condition your body and avoid injury.",
    "Focus on Form: Proper form is crucial to prevent injury and maximize results. Take time to learn the correct techniques for each exercise.",
    "Listen to Your Body: Pay attention to how your body feels during workouts. If something doesn't feel right, stop and reassess rather than pushing through.",
    "Stay Hydrated: Drink water before, during, and after your workouts to stay hydrated and maintain performance.",
    "Consistency Over Intensity: Consistent workouts are more beneficial than occasional intense sessions. Aim for regular exercise routines.",
    "Rest and Recovery: Allow your body time to rest and recover between workouts. Overtraining can lead to burnout and injuries.",
  ];

  const intermediateTips = [
    "Progressive Overload: Continuously challenge yourself by increasing weights, reps, or intensity to stimulate muscle growth and strength gains.",
    "Vary Your Workouts: Incorporate a variety of exercises to target different muscle groups and prevent plateaus.",
    "Warm Up Properly: Spend at least 5-10 minutes warming up before each workout to increase blood flow and flexibility, reducing the risk of injury.",
    "Nutrition Matters: Pay attention to your diet, ensuring you're getting enough protein, carbohydrates, and healthy fats to support your fitness goals.",
    "Track Your Progress: Keep a workout log or use fitness apps to track your progress and adjust your routines accordingly.",
    "Don't Skip Recovery Days: Scheduled rest days are essential for muscle repair and growth. Use these days for light activity, stretching, or active recovery.",
  ];

  const expertTips = [
    "Periodize Your Training: Implement periodization techniques to vary intensity and volume over time for optimal performance and adaptation.",
    "Incorporate Mobility Work: Focus on mobility exercises and flexibility training to improve joint health and range of motion.",
    "Experiment with Advanced Techniques: Explore advanced training methods like supersets, drop sets, and pyramids to challenge your body in new ways.",
    "Listen to Your Body Again: As an expert, you may be tempted to push through discomfort, but it's crucial to recognize when to back off to prevent overuse injuries.",
    "Mental Conditioning: Develop mental resilience and focus through techniques like visualization, meditation, and mindfulness practices.",
    "Continual Learning: Stay updated on the latest research and trends in fitness and nutrition to refine your training methods and stay ahead in your field.",
  ];

  const dateToString = date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const handleWorkoutClose = () => {
    setIsModalVisible(false);
    setSelectedWorkout({});
  };

  const exercisesWithMovements = async () => {
    try {
      fetch(BACKEND_URL + "exercisemovementconnection", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Auth-Token": token,
        },
      })
        .then((response) => response.json())
        .then((data) =>
          setWorkoutMovements(
            data.exercisemovementconnection_list.map((workout) => ({
              id: workout.id,
              name: workout.exercise_name,
              updated: workout.updated,
              movements: [
                {
                  name: workout.movement_name,
                  reps: workout.reps,
                  weight: workout.weight,
                },
              ],
            }))
          )
        )
        .catch((error) => {
          console.log("Error fetching workouts: ", error);
        });
    } catch (error) {
      console.log("Error fetching workouts: ", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      try {
        fetch(BACKEND_URL + "user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Auth-Token": token,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setName(data.username);
            setExperience(data.experience);
          })
          .catch((error) => {
            console.log("Error fetching workouts: ", error);
          });
      } catch (error) {
        console.log("Error fetching workouts: ", error);
      }
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
          .then((data) => setWorkouts(data.exercise_list))
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

  const handleProgress = () => {
    // testauksen vuoksi tässä nämä
    //exercisesWithMovements();
    //console.log(workoutMovements);
    navigation.navigate("Goals");
  };

  const getworkoutInformation = async (id) => {
    console.log("Getting workout information for id: ", id);
    try {
      const res = await fetch(BACKEND_URL + "exercise/" + id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Auth-Token": token,
        },
      });
      const data = await res.json();
      console.log("Workout information: ", data);
      return data;
    } catch (error) {
      console.log("Error fetching workout information: ", error);
    }
    return null;
  };

  const handleLog = () => {
    console.log("Log button pressed");
  };

  const handleNewWorkout = () => {
    navigation.navigate("Workout");
  };

  const handleFromRoutines = () => {
    console.log("From routines button pressed");
  };

  const handleSearchTextChange = (text) => {
    setSearchText(text);
    setSearchedWorkouts(
      workouts.filter((workout) => workout.name.includes(text))
    );
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

  const Workout = ({ name, date, id }) => {
    return (
      <TouchableOpacity
        style={styles.singleWorkout}
        onPress={async () => {
          console.log(`${name} workout pressed with id: ${id}`);
          setSelectedWorkout(await getworkoutInformation(id));
          setIsModalVisible(true);
        }}
      >
        <Text style={styles.workoutName}>{name}</Text>
        <Text style={styles.workoutDate}>{date}</Text>
        <Text>Days since last: -</Text>
      </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    column: {
      flexDirection: "column",
    },
    searchItem: {
      marginTop: 10,
      position: "absolute",
      right: 20,
      color: ThemeColors.tertiary,
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
      flexDirection: "row",
      gap: 50,
      paddingVertical: 10,
      paddingHorizontal: "5%",
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

  // const Workout = ({ name, date, movements }) => {
  //   const handleWorkoutPress = () => {
  //     console.log("Workout pressed");
  //   };

  //   return (
  //     <TouchableOpacity style={styles.singleWorkout} onPress={handleWorkoutPress}>
  //       <Text style={styles.workoutName}>{name}</Text>
  //       <Text style={styles.workoutDate}>{date}</Text>
  //       <Text>Days since last: -</Text>
  //     </TouchableOpacity>
  //   );
  // };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.column}>
          <Text style={styles.date}>{dateToString.toUpperCase()}</Text>
          <Text style={styles.greetings}>
            {greeting}, {name}!
          </Text>
          <Text style={styles.regularText}>
            Your {experience} tip for today:{"\n"}
            {experience === "beginner"
              ? beginnerTips[(seed * 1337) % beginnerTips.length]
              : experience === "intermediate"
              ? intermediateTips[(seed * 1337) % intermediateTips.length]
              : expertTips[(seed * 1337) % expertTips.length]}
          </Text>
        </View>
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
              onPress={() => setSearchMenuVisible(!searchMenuVisible)}
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
                <Text style={styles.regularText}>No Workouts found</Text>
              </>
            )}
            renderItem={({ item }) => (
              <Workout
                key={item.id}
                id={item.id}
                name={item.name}
                date={item.updated}
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
                <Text style={styles.regularText}>No Workouts</Text>
              </>
            )}
            renderItem={({ item }) => (
              <Workout
                key={item.id}
                id={item.id}
                name={item.name}
                date={item.updated}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
      {menuVisible && (
        <View style={styles.workoutMenu}>
          <TouchableOpacity style={styles.menuItem} onPress={handleNewWorkout}>
            <Text style={styles.regularText}>New</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleFromRoutines}
          >
            <Text style={styles.regularText}>From routines</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={handleLog}>
          <Entypo name="back-in-time" size={24} color={ThemeColors.tertiary} />
          <Text style={styles.regularText}>Log</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.startWorkoutButton, styles.footerButton]}
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
        <TouchableOpacity style={styles.footerButton} onPress={handleProgress}>
          <Ionicons name="stats-chart" size={24} color={ThemeColors.tertiary} />
          <Text style={styles.regularText}>Progress</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
