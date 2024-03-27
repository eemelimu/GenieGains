import { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useFonts } from "expo-font";
import { SafeAreaView } from "react-native-safe-area-context";
import { BACKEND_URL } from "../assets/config";
import { useAuth } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";
import useRequest from "../hooks/useRequest";
import { useLocalization } from "../contexts/LocalizationContext";

const InspectRoutine = ({ route }) => {
  const { t } = useLocalization();
  const { theme: ThemeColors } = useContext(ThemeContext);
  const { params } = route;
  const { routineName } = params;
  const [trainingPlan, setTrainingPlan] = useState(null);
  const { state } = useAuth();
  const token = state.token;
  const { fetcher } = useRequest(token);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetcher({
        url: BACKEND_URL + "trainingplan",
        reqMethod: "GET",
      });
      const selectedPlan = res.trainingplan_list.find(
        (plan) => plan.training_plan_name === routineName
      );
      setTrainingPlan(selectedPlan);
    };
    fetchData();
  }, [routineName]);

  console.log(route.params.routineName);

  let [fontsLoaded] = useFonts({
    DMBold: require("../assets/fonts/DMSans-Bold.ttf"),
    DMRegular: require("../assets/fonts/DMSans-Regular.ttf"),
  });
  if (!fontsLoaded) {
    return null;
  }

  const styles = StyleSheet.create({
    notes: {
      width: "90%",
      height: 100,
      backgroundColor: ThemeColors.white,
      marginVertical: 7,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 15,
      paddingHorizontal: 10,
      position: "relative",
      alignSelf: "center",
      marginTop: 10,
      fontFamily: "DMRegular",
      textAlignVertical: "top",
    },

    container: {
      flex: 1,
      backgroundColor: ThemeColors.primary,
    },
    header: {
      backgroundColor: ThemeColors.secondary,
      height: 100,
      justifyContent: "center",
      alignItems: "center",
      width: "90%",
      alignSelf: "center",
      borderRadius: 15,
    },
    headerText: {
      fontSize: 24,
      color: ThemeColors.tertiary,
      fontFamily: "DMBold",
    },
    singleMovement: {
      width: "90%",
      height: 100,
      backgroundColor: ThemeColors.secondary,
      marginVertical: 7,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 15,
      paddingHorizontal: 10,
      position: "relative",
    },
    main: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 20,
      paddingHorizontal: 20,
    },
    movementName: {
      fontSize: 20,
      fontFamily: "DMRegular",
      bottom: 20,
      color: ThemeColors.tertiary,
    },
    movementNumbers: {
      fontSize: 20,
      fontFamily: "DMRegular",
    },
  });

  const Movement = ({ name, index }) => {
    return (
      <View style={styles.singleMovement}>
        <Text style={styles.movementName}>
          {index + 1}
          {". "}
          {t("movement", { movement_name: name })}
        </Text>
        {/* <Text style={styles.movementNumbers}> {set} x {reps} {weight} kg</Text> */}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {t("routine", { routine_name: routineName })}
        </Text>
      </View>
      {/*             <TextInput 
            style={styles.notes} 
            placeholder="Type notes..." 
            multiline={true}
            /> */}
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.main}>
          {trainingPlan &&
            trainingPlan.movements.map((movement, index) => (
              <Movement index={index} key={movement.id} name={movement.name} />
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InspectRoutine;
