import { useState, useEffect, useCallback, useContext } from "react";
import { useLocalization } from "../contexts/LocalizationContext";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import Button from "../components/Button";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { BACKEND_URL } from "../assets/config";
import { useAuth } from "../contexts/AuthContext";
import { AntDesign } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { ThemeContext } from "../contexts/ThemeContext";
import { useNotification } from "../contexts/NotificationContext";
import { MaterialIcons } from "@expo/vector-icons";
import useRequest from "../hooks/useRequest";

const Routines = () => {
  const { t } = useLocalization();
  const { setError, setSuccess, startLoading, stopLoading } = useNotification();
  const { theme: ThemeColors } = useContext(ThemeContext);
  const [trainingPlans, setTrainingPlans] = useState([]);
  const [editable, setEditable] = useState(false);

  const navigation = useNavigation();
  const { state } = useAuth();
  const token = state.token;
  const { fetcher } = useRequest(token);
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

  const handleDeleteRoutine = async (routineId) => {
    const res = await fetcher({
      url: BACKEND_URL + "trainingplan/" + routineId,
      reqMethod: "DELETE",
      errorMessage: t("something-went-wrong"),
      showLoading: true,
    });
    if (res) {
      setTrainingPlans(trainingPlans.filter((t) => t.id !== routineId));
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const res = await fetcher({
          url: BACKEND_URL + "trainingplan",
          reqMethod: "GET",
          errorMessage: t("something-went-wrong"),
          showLoading: true,
        });
        if (res) {
          setTrainingPlans(res.trainingplan_list);
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
      marginTop: 40,
      justifyContent: "center",
      paddingHorizontal: 10,
    },
    singleRoutine: {
      display: "flex",
      width: "75%",
      height: "auto",
      paddingVertical: 20,
      backgroundColor: ThemeColors.secondary,
      justifyContent: "center",
      alignItems: "space-between",
      borderRadius: 15,
      // paddingHorizontal: 15,
      marginTop: 20,
      position: "relative",
      flexDirection: "row",
    },

    RoutineName: {
      // padding: 10,
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
      flex: 1,
      fontSize: 15,
      fontFamily: "DMRegular",
      color: ThemeColors.tertiary,
      textAlign: "left",
      flexWrap: "wrap",
    },
    buttonText: {
      color: ThemeColors.primary,
      fontSize: 15,
      fontFamily: "DMRegular",
    },
    deleteMovementIcon: {
      position: "absolute",
      right: 10,
      top: 10,
    },
    notFoundText: {
      fontSize: 20,
      fontFamily: "DMRegular",
      color: ThemeColors.tertiary,
      textAlign: "center",
      marginTop: 50,
    },
    startButton: {
      // position: "absolute",
      alignSelf: "flex-end",
      marginLeft: "auto",
      marginRight: "auto",
      // bottom: -10,
    },
    jokuContainer: {
      justifyContent: "space-between",
      flexDirection: "column",
    },
  });

  const Routine = ({ name, routine }) => {
    return (
      <View style={styles.singleRoutine}>
        <View style={styles.jokuContainer}>
          <Text style={styles.RoutineName}>{name}</Text>
          <TouchableOpacity
            style={styles.deleteMovementIcon}
            onPress={() => handleDeleteRoutine(routine.id)}
          >
            <MaterialIcons
              name="delete-outline"
              size={24}
              color={ThemeColors.tertiary}
            />
          </TouchableOpacity>
          <View style={styles.movementsContainer}>
            <Text style={styles.movementName}>
              {routine.movements.map((movement) => movement.name).join(", ")}
            </Text>
          </View>
          <View style={styles.startButton}>
            <Button
              testID="start"
              isHighlighted={true}
              width={70}
              text={t("start")}
              onPress={() =>
                navigation.navigate("Workout", {
                  movements: routine,
                  from: "routines",
                })
              }
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        {trainingPlans.length === 0 ? (
          <View>
            <Text style={styles.notFoundText} testID="no-training-plans">{t("no-training-plans")}</Text>
            <Text style={styles.notFoundText} testID="create-routine-hint">{t("create-routine-hint")}</Text>
          </View>
        ) : (
          trainingPlans.map((trainingPlan) => (
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
          ))
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          testID="create-movement"
          width={170}
          isHighlighted={true}
          text={t("create-movement")}
          onPress={moveToCreateMovement}
          renderIcon={(color) => (
            <AntDesign name="plus" size={24} color={color} />
          )}
        />

        <Button
          testID="create-routine"
          width={170}
          text={t("create-routine")}
          onPress={moveToCreateRoutine}
          isHighlighted={true}
          renderIcon={(color) => (
            <AntDesign name="plus" size={24} color={color} />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default Routines;