import { useState, useEffect, useCallback, useContext } from "react";
import { BACKEND_URL } from "../assets/config";
import { SimpleLineIcons } from "@expo/vector-icons";
import { ThemeContext } from "../contexts/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import useRequest from "../hooks/useRequest";
import { AiChat } from "../components/AiChat"
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
  Pressable,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Button from "../components/Button";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";
import { useSettings } from "../contexts/SettingsContext";
import { useLocalization } from "../contexts/LocalizationContext";

const HomeScreen = () => {
  const { locale, formatDate, formatNumber, t } = useLocalization();
  const { settings } = useSettings();
  const seed =
    new Date().getDate() + new Date().getMonth() + new Date().getFullYear();
  const { setError, setSuccess, startLoading, stopLoading } = useNotification();
  const { theme: ThemeColors } = useContext(ThemeContext);
  const [unit, setUnit] = useState("metric");
  const [date] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const [experience, setExperience] = useState("beginner");
  const [name, setName] = useState("name");
  const [workouts, setWorkouts] = useState([]);
  const { state } = useAuth();
  const token = state.token;
  const { fetcher } = useRequest(token);
  const navigation = useNavigation();
  const [searchMenuVisible, setSearchMenuVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedWorkouts, setSearchedWorkouts] = useState(workouts);
  const [workoutMovements, setWorkoutMovements] = useState(null);

  const beginnerTips = [
    "beginner-tip1",
    "beginner-tip2",
    "beginner-tip3",
    "beginner-tip4",
    "beginner-tip5",
    "beginner-tip6",
    "beginner-tip7",
    "beginner-tip8",
    "beginner-tip9",
    "beginner-tip10",
    "beginner-tip11",
  ];

  const intermediateTips = [
    "intermediate-tip1",
    "intermediate-tip2",
    "intermediate-tip3",
    "intermediate-tip4",
    "intermediate-tip5",
    "intermediate-tip6",
    "intermediate-tip7",
    "intermediate-tip8",
    "intermediate-tip9",
    "intermediate-tip10",
    "intermediate-tip11",
  ];

  const expertTips = [
    "expert-tip1",
    "expert-tip2",
    "expert-tip3",
    "expert-tip4",
    "expert-tip5",
    "expert-tip6",
    "expert-tip7",
    "expert-tip8",
    "expert-tip9",
    "expert-tip10",
    "expert-tip11",
  ];
  const dateToString = date.toLocaleDateString(locale.languageTag, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const res = await fetcher({
          url: BACKEND_URL + "exercisemovementconnection",
          reqMethod: "GET",
        });
        if (res) {
          console.log(res);
          const groupedMovements = {};
          (res.exercisemovementconnection_list || []).forEach((workout) => {
            const {
              exercise_id,
              id,
              exercise_name,
              updated,
              movement_name,
              reps,
              weight,
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
            });
          });
          setWorkoutMovements(Object.values(groupedMovements));
        }
      };
      fetchData();
    }, [token])
  );

  useFocusEffect(
    useCallback(() => {
      //remove hadrware back button from homexcreen so the user cannot
      //navigate back to login accidentally
      const backAction = () => {
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      const fetchData = async () => {
        const res = await fetcher({
          url: BACKEND_URL + "exercise",
          reqMethod: "GET",
          showLoading: true,
        });
        if (res) {
          setWorkouts(res.exercise_list);
          setSearchedWorkouts(res.exercise_list);
        }
      };
      fetchData();
      return () => {
        backHandler.remove();
      };
    }, [token])
  );

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const res = await fetcher({
          url: BACKEND_URL + "user",
          reqMethod: "GET",
          errorMessage: "Error fetching user information",
          showLoading: true,
        });
        if (res) {
          setName(res.username);
          setUnit(res.unit);
          setExperience(res.experience);
        }
      };
      fetchData();
    }, [token])
  );

  const handleDeleteWorkout = async (id) => {
    const res = await fetcher({
      url: BACKEND_URL + "exercise/" + id,
      reqMethod: "DELETE",
      errorMessage: "Something went wrong",
      successMessage: "Workout deleted succesfully",
      showLoading: true,
    });
    if (res) {
      setWorkouts(workouts.filter((workout) => workout.id !== id));
      setSearchedWorkouts(
        searchedWorkouts.filter((workout) => workout.id !== id)
      );
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

  const handleShareWorkout = async (id) => {
    console.log(workoutMovements);
    const clickedWorkout = workoutMovements.find(
      (workout) => workout.exercise_id == id
    );

    const weightUnit = locale.measurementSystem; //unit === "metric" ? "kg" : "lbs";
    //const note=clickedWorkout.notes.length==0?"":`\nNote:${clickedWorkout.notes}`;
    const clickedWorkoutMovements = clickedWorkout.movements;
    const workoutInfo = `${clickedWorkout?.name}(${formatDate(
      clickedWorkout.updated
    )})\n\n`;
    const copiedWorkout = clickedWorkoutMovements.map(
      (movement) =>
        "\n" +
        movement.name +
        ": " +
        movement.weight +
        " " +
        weightUnit +
        " x" +
        movement.reps
    );
    await Clipboard.setStringAsync(workoutInfo + copiedWorkout.join("\n"));
    setSuccess(t("workout-clipboard-copied-success"));
  };

  const getworkoutInformation = async (id) => {
    return await fetcher({
      url: BACKEND_URL + "exercise/" + id,
      reqMethod: "GET",
    });
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
      setGreeting("good-morning");
    } else if (currentTime < 18) {
      setGreeting("good-afternoon");
    } else {
      setGreeting("good-evening");
    }
  }, []);

  const styles = StyleSheet.create({
    column: {
      flexDirection: "column",
    },
    searchItem: {
      marginTop: 26,
      position: "absolute",
      right: 30,
      color: ThemeColors.tertiary,
    },
    searchItemInput: {
      position: "absolute",
      right: 30,
      width: 125,
      backgroundColor: `${ThemeColors.secondary}80`,
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
      fontStyle: "italic",
      fontSize: 14,
      color: ThemeColors.tertiary,
      position: "absolute",
      top: 14,
      right: 40,
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
      right: 5,
      top: 10,
    },
    shareBtn: {
      position: "absolute",
      right: 5,
      bottom: 10,
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
      backgroundColor: ThemeColors.tertiary,
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
    noWorkouts: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    tipsContainer: {
      marginTop: 10,
      backgroundColor: `${ThemeColors.tertiary}25`,
      borderRadius: 10,
      padding: 10,
      textAlign: "center",
      width: "100%",
      minWidth: "100%",
    },
    regularTextTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: ThemeColors.tertiary,
      alignSelf: "center",
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
        <Text style={styles.workoutDate}>{formatDate(date)}</Text>
        <MaterialCommunityIcons
          onPress={() => handleDeleteWorkout(id)}
          style={styles.deleteBtn}
          name="delete"
          size={24}
          color={ThemeColors.tertiary}
        />
        <Entypo
          onPress={() => handleShareWorkout(id)}
          style={styles.shareBtn}
          name="share"
          size={24}
          color={ThemeColors.tertiary}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.column}>
          <Text style={styles.date}>{dateToString.toUpperCase()}</Text>
          <Text style={styles.greetings}>
            {t("welcome-message", { greeting: t(greeting), name: name })}
          </Text>
          {settings.tips ? (
            <View style={styles.tipsContainer}>
              <Text style={styles.regularTextTitle}>
                {t("tip-information", { experience_level: t(experience) })}
              </Text>
              <Text style={styles.regularText}>
                {t(
                  experience === "beginner"
                    ? beginnerTips[(seed * 1337) % beginnerTips.length]
                    : experience === "intermediate"
                    ? intermediateTips[(seed * 1337) % intermediateTips.length]
                    : expertTips[(seed * 1337) % expertTips.length]
                )}
              </Text>
            </View>
          ) : null}
        </View>
        {searchMenuVisible ? (
          <View style={styles.searchItem}>
            <TextInput
              style={styles.searchItemInput}
              placeholderTextColor={ThemeColors.tertiary}
              placeholder={t("search-placeholder")}
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
              <View style={styles.noWorkouts}>
                <Text style={styles.regularText}>{t("no-workouts")}</Text>
              </View>
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
              <View style={styles.noWorkouts}>
                <Text style={styles.regularText}>{t("no-workouts")}</Text>
              </View>
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
      <AiChat username={name} />
      <View style={styles.footer}>
        <Button
          isHighlighted={false}
          width={120}
          height={"80%"}
          text={t("routines")}
          renderIcon={(color) => (
            <SimpleLineIcons name="notebook" size={24} color={color} />
          )}
          onPress={handleLog}
        />
        <Button
          isHighlighted={true}
          width={150}
          height={"80%"}
          text={t("start-workout")}
          onLongPress={() => console.log("long press")}
          onPress={() => navigation.navigate("Workout")}
          renderIcon={(color) => (
            <AntDesign name="plus" size={24} color={color} />
          )}
        />
        <Button
          isHighlighted={false}
          width={120}
          height={"80%"}
          text={t("progress")}
          onLongPress={() => console.log("long press")}
          onPress={() => navigation.navigate("Goals")}
          renderIcon={(color) => (
            <Ionicons name="stats-chart" size={24} color={color} />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
