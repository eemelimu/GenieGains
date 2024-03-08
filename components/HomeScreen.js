import { useState, useEffect, useCallback, useContext } from "react";
import { BACKEND_URL } from "../assets/config";
import { SimpleLineIcons } from "@expo/vector-icons";
import { ThemeContext } from "./ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
import { useNotification } from "./NotificationContext";

// TODO
// Search bar styles paremmaksi
// Search barin hightlightaus (aktivointi) kun painaa search iconia
// Workout notet ja movementit näkyviin SingleWorkoutissa

const HomeScreen = () => {
  const seed =
    new Date().getDate() + new Date().getMonth() + new Date().getFullYear();
  const { setError, setSuccess, startLoading, stopLoading } = useNotification();
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
    "Recovery Nutrition: After workouts, refuel your body with a balanced meal or snack containing carbohydrates and protein to aid in muscle recovery and replenish energy stores.",
    "Practice Mind-Muscle Connection: Focus on engaging the target muscles during exercises by consciously contracting and squeezing them, which can enhance muscle activation and growth.",
    "Learn Proper Equipment Usage: Take the time to familiarize yourself with gym equipment to ensure safe and effective usage, and don't hesitate to ask gym staff for guidance if needed.",
    "Set Realistic Expectations: Understand that progress takes time, and avoid comparing yourself to others. Focus on your own journey and celebrate small victories along the way.",
    "Hygiene Matters: Always wipe down equipment before and after use, and practice good hygiene habits like washing your hands regularly to prevent the spread of germs and bacteria.",
  ];

  const intermediateTips = [
    "Progressive Overload: Continuously challenge yourself by increasing weights, reps, or intensity to stimulate muscle growth and strength gains.",
    "Vary Your Workouts: Incorporate a variety of exercises to target different muscle groups and prevent plateaus.",
    "Warm Up Properly: Spend at least 5-10 minutes warming up before each workout to increase blood flow and flexibility, reducing the risk of injury.",
    "Nutrition Matters: Pay attention to your diet, ensuring you're getting enough protein, carbohydrates, and healthy fats to support your fitness goals.",
    "Track Your Progress: Keep a workout log or use fitness apps to track your progress and adjust your routines accordingly.",
    "Don't Skip Recovery Days: Scheduled rest days are essential for muscle repair and growth. Use these days for light activity, stretching, or active recovery.",
    "Mindful Recovery Techniques: Incorporate mindfulness practices such as deep breathing exercises, meditation, or yoga to promote relaxation and stress reduction, which can aid in recovery and improve overall well-being.",
    "Utilize Resistance Bands: Integrate resistance bands into your workouts to add variety and challenge different muscle groups while also improving stability and joint mobility.",
    "Experiment with Tempo Training: Manipulate the tempo (speed) of your repetitions during exercises to create different training stimuli and elicit specific adaptations such as muscle hypertrophy or strength gains.",
    "Practice Pre-Workout Activation: Perform dynamic warm-up exercises or activation drills targeting specific muscle groups before your workouts to enhance muscle recruitment and improve performance.",
    "Attend Group Fitness Classes: Participate in group fitness classes such as spinning, Pilates, or dance workouts to add diversity to your routine, stay motivated, and connect with like-minded individuals.",
  ];

  const expertTips = [
    "Periodize Your Training: Implement periodization techniques to vary intensity and volume over time for optimal performance and adaptation.",
    "Incorporate Mobility Work: Focus on mobility exercises and flexibility training to improve joint health and range of motion.",
    "Experiment with Advanced Techniques: Explore advanced training methods like supersets, drop sets, and pyramids to challenge your body in new ways.",
    "Listen to Your Body Again: As an expert, you may be tempted to push through discomfort, but it's crucial to recognize when to back off to prevent overuse injuries.",
    "Mental Conditioning: Develop mental resilience and focus through techniques like visualization, meditation, and mindfulness practices.",
    "Continual Learning: Stay updated on the latest research and trends in fitness and nutrition to refine your training methods and stay ahead in your field.",
    "Optimize Nutrient Timing: Strategically time your meals and snacks around your workouts to optimize performance, recovery, and nutrient absorption, considering factors like macronutrient composition and meal timing.",
    "Utilize Recovery Tools: Invest in recovery tools such as compression garments, percussion massagers, or cold therapy devices to accelerate recovery, reduce muscle soreness, and enhance overall recovery efficiency.",
    "Implement Deload Weeks: Periodically incorporate deload weeks into your training program, where you reduce training volume and intensity to allow for systemic recovery and prevent overtraining.",
    "Focus on Mindful Movement: Practice mindful movement techniques such as tai chi, qigong, or Feldenkrais method to improve body awareness, movement quality, and neuromuscular coordination.",
    "Embrace Active Lifestyle Habits: Incorporate physical activity into your daily routine beyond structured workouts, such as taking the stairs instead of the elevator or walking or biking for transportation whenever possible, to promote overall health and longevity.",
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
          .catch((error) => {
            console.log("Error fetching workouts: ", error);
          })
          .then((data) => {
            setWorkouts(data.exercise_list || []);
            setSearchedWorkouts(data.exercise_list || []);
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

  const handleDeleteWorkout = async (id) => {
    try {
      const res = await fetch(BACKEND_URL + "exercise/" + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Auth-Token": token,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setWorkouts(workouts.filter((workout) => workout.id !== id));
        setSearchedWorkouts(
          searchedWorkouts.filter((workout) => workout.id !== id)
        );
        setSuccess("Workout deleted succesfully");
      } else {
        setError("Something went wrong");
      }
    } catch (error) {
      setError("Check your internet connection");
      console.log("Error deleting workout: ", error);
    }
  };

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
    navigation.navigate("Routines", { token: token });
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
      backgroundColor: ThemeColors.secondary,
      borderRadius: 5,
      paddingVertical: 5,
      paddingHorizontal: 10,
      color: ThemeColors.tertiary,
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
      color: ThemeColors.tertiary,
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
    deleteBtn: {
      position: "absolute",
      right: 10,
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
        <MaterialCommunityIcons
          onPress={() => handleDeleteWorkout(id)}
          style={styles.deleteBtn}
          name="delete"
          size={24}
          color={ThemeColors.tertiary}
        />
      </TouchableOpacity>
    );
  };

  const getRoutine = async (id) => {
    try {
      const res = await fetch(BACKEND_URL + "trainingplan/" + id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Auth-Token": token,
        },
      });
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.log("Error fetching routine: ", error);
    }
    return null;
  };

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
              color={ThemeColors.tertiary}
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
            color={ThemeColors.tertiary}
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
                <Text style={styles.regularText}>No Workouts</Text>
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
                <Text style={styles.regularText}>No Workouts</Text>
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
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={handleLog}>
          <SimpleLineIcons
            name="notebook"
            size={24}
            color={ThemeColors.tertiary}
          />
          <Text style={styles.regularText}>Routines</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.startWorkoutButton, styles.footerButton]}
          onPress={() => navigation.navigate("Workout")}
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
          <Text style={styles.regularText}>Progress</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
