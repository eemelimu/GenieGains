import { useState, useEffect, useCallback, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Button,
} from "react-native";

import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { BACKEND_URL } from "../assets/config";
import { useAuth } from "./AuthContext";
import { ThemeColors } from "../assets/ThemeColors";
import { AntDesign } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { ThemeContext } from "./ThemeContext";
import { useNotification } from "./NotificationContext";

const Routines = () => {
  const { setError, setSuccess, startLoading, stopLoading } = useNotification();
  const { theme: ThemeColors } = useContext(ThemeContext);
  const [trainingPlans, setTrainingPlans] = useState([]);
  const [editable, setEditable] = useState(false);

  const navigation = useNavigation();
  const { state } = useAuth();
  const token = state.token;

  let [fontsLoaded] = useFonts({
    DMBold: require("../assets/fonts/DMSans-Bold.ttf"),
    DMRegular: require("../assets/fonts/DMSans-Regular.ttf"),
  });

  const moveToCreateRoutine = () => {
    navigation.navigate("Create Routine");
  };

  const moveToCreateMovement = () => {
    navigation.navigate("Create Movement");
  };

  const moveToInspectRoutine = (routineName) => {
    console.log("called movetoCreateRoutine");
    navigation.navigate("Inspect Routine", { routineName });
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const res = await fetch(BACKEND_URL + "trainingplan", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Auth-Token": token,
            },
          });
          const data = await res.json();
          setTrainingPlans(data.trainingplan_list);
          console.log("luk" + data);
        } catch (error) {
          console.log("Error: ", error);
        }
      };
      fetchData();
    }, [])
  );

  if (!fontsLoaded) {
    return <></>;
  }
  const styles = StyleSheet.create({
    movementsContainer: {
      position: "absolute",
      left: 5,
      top: 40,
      justifyContent: "center",
      paddingHorizontal: 10,
    },
    singleRoutine: {
      width: "75%",
      height: 125,
      backgroundColor: ThemeColors.secondary,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 15,
      paddingHorizontal: 15,
      marginTop: 20,
      position: "relative",
      flexDirection: "row",
    },

    RoutineName: {
      padding: 10,
      position: "absolute",
      top: 0,
      left: 5,
      fontSize: 18,
      fontFamily: "DMBold",
      color: ThemeColors.tertiary,
    },

    RoutineType: {
      fontSize: 20,
      fontFamily: "DMRegular",
    },

    container: {
      flex: 1,
      backgroundColor: ThemeColors.primary,
    },
    main: {
      flex: 1,
      alignItems: "center",
      paddingHorizontal: 20,
    },

    Type: {
      color: "#02075d",
      fontSize: 10,
      opacity: 0.5,
    },
    footer: {
      bottom: 0,
      width: "100%",
      height: 75,
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      backgroundColor: ThemeColors.primary,
      bottom: 10,
    },
    selectRoutineButton: {
      position: "absolute",
      bottom: 5,
      padding: 10,
      backgroundColor: ThemeColors.tertiary,
      borderRadius: 5,
      paddingVertical: 10,
      paddingHorizontal: 10,
      width: 70,
      alignItems: "center",
    },
    selectRoutineButtonCreate: {
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
    createMovementBtn: {
      backgroundColor: ThemeColors.tertiary,
      padding: 10,
      borderRadius: 5,
      width: 170,
      alignItems: "center",
    },
    movementName: {
      fontSize: 15,
      fontFamily: "DMRegular",
      color: ThemeColors.tertiary,
    },
    buttonText: {
      color: ThemeColors.primary,
      fontSize: 15,
      fontFamily: "DMRegular",
    },
  });

  const Routine = ({ name, routine }) => {
    return (
      <View style={styles.singleRoutine}>
        <Text style={styles.RoutineName}>{name}</Text>
        <View style={styles.movementsContainer}>
          <Text style={styles.movementName}>
            {routine.movements.map((movement) => movement.name).join(", ")}
          </Text>
        </View>
        <Pressable
          style={styles.selectRoutineButton}
          onPress={() => navigation.navigate("Workout", { movements: routine })}
        >
          <Text style={styles.buttonText}>Start</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        {trainingPlans.map((trainingPlan) => (
          <TouchableOpacity
            style={styles.main}
            key={trainingPlan.id}
            onPress={() =>
              moveToInspectRoutine(trainingPlan.training_plan_name)
            }
          >
            <Routine
              name={trainingPlan.training_plan_name}
              routine={trainingPlan}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.createMovementBtn}
          onPress={moveToCreateMovement}
        >
          <AntDesign name="plus" size={24} color={ThemeColors.secondary} />

          <Text
            style={{
              fontWeight: "bold",
              fontSize: 15,
              color: ThemeColors.secondary,
            }}
          >
            Create movement
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.selectRoutineButtonCreate}
          onPress={moveToCreateRoutine}
        >
          <AntDesign name="plus" size={24} color={ThemeColors.secondary} />

          <Text
            style={{
              fontWeight: "bold",
              fontSize: 15,
              color: ThemeColors.secondary,
            }}
          >
            Create routine
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Routines;
