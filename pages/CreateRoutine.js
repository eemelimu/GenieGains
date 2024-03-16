import { useState, useEffect, useCallback, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Button,
  ScrollView,
} from "react-native";

import { useAuth } from "../contexts/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import ModalDropdown from "react-native-modal-dropdown";
import { BACKEND_URL } from "../assets/config";
import { ThemeContext } from "../contexts/ThemeContext";
import { useNotification } from "../contexts/NotificationContext";
import DropDownPicker from "react-native-dropdown-picker";

const CreateRoutine = () => {
  const { setError, setSuccess, startLoading, stopLoading } = useNotification();
  const { theme: ThemeColors } = useContext(ThemeContext);
  let [fontsLoaded] = useFonts({
    DMBold: require("../assets/fonts/DMSans-Bold.ttf"),
    DMRegular: require("../assets/fonts/DMSans-Regular.ttf"),
  });
  if (!fontsLoaded) {
    return null;
  }
  const [trainingPlans, setTrainingPlans] = useState([]);
  const navigation = useNavigation();
  const { state } = useAuth();
  const token = state.token;
  const [selectedRoutineMovements, setSelectedMovements] = useState([]);
  const [menuMovements, setMenuMovements] = useState([]);
  const [routineName, setRoutineName] = useState("");
  const [routineNotes, setRoutineNotes] = useState("");
  const [dropdownKey, setDropdownKey] = useState(0);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);

  const styles = StyleSheet.create({
    singleMovement: {
      flex: 1,
      width: 250,
      height: 50,
      backgroundColor: ThemeColors.secondary,
      marginVertical: 15,
      paddingLeft: 20,
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      borderRadius: 7,
    },
    finishRoutine: {
      width: "20%",
      minWidth: 120,
      height: 50,
      backgroundColor: ThemeColors.secondary,
      marginVertical: 7,
      marginBottom: 50,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 15,
      paddingHorizontal: 10,
      position: "relative",
      alignSelf: "center",
      fontFamily: "DMRegular",
    },
    nameInput: {
      borderWidth: 1,
      borderColor: ThemeColors.quaternary,
      borderRadius: 5,
      padding: 10,
      textAlign: "center",
      color: ThemeColors.tertiary,
      width: 150,
    },
    line: {
      left: 0,
      borderBottomWidth: 1,
      borderBottomColor: ThemeColors.quaternary,
      width: "100%",
      marginBottom: 20,
      paddingBottom: 20,
    },
    dropdownText: {
      fontSize: 16,
      padding: 10,
      borderWidth: 1,
      borderColor: ThemeColors.quaternary,
      color: ThemeColors.tertiary,
      borderRadius: 5,
      textAlign: "center",
    },
    dropdown: {
      marginTop: 2,
      borderRadius: 3,
      borderWidth: 1,
      borderColor: ThemeColors.quaternary,
      backgroundColor: ThemeColors.secondary,
      color: ThemeColors.tertiary,
    },
    MovementName: {
      fontSize: 18,
      fontFamily: "DMBold",
      color: ThemeColors.tertiary,
    },
    MovementType: {
      fontSize: 20,
      fontFamily: "DMRegular",
      color: ThemeColors.tertiary,
    },
    container: {
      flex: 1,
      backgroundColor: ThemeColors.primary,
    },
    main: {
      flex: 1,
      alignItems: "center",
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
      backgroundColor: ThemeColors.secondary,
      bottom: 10,
    },
    selectMovementButton: {
      backgroundColor: ThemeColors.secondary,
      borderRadius: 10,
      alignItems: "center",
    },
    footerButton: {
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
      width: 150,
      alignItems: "center",
    },
    header: {
      marginTop: 20,
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
    },
    deleteMovementIcon: {
      position: "absolute",
      right: 10,
    },
  });

  const saveRoutine = async () => {
    try {
      if (!routineName) {
        console.log("Routine name is required");
        setError("Routine name is required");
        return;
      }
      if (selectedRoutineMovements.length === 0) {
        console.log("Routine movements are required");
        setError("Routine movements are required");
        return;
      }
      const res = await fetch(BACKEND_URL + "trainingplan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          name: routineName,
          movements: selectedRoutineMovements.map((movement) => movement.id),
        }),
      });

      if (res.status === 200) {
        navigation.navigate("Routines");
        console.log("Routine created");
      } else {
        console.log("Error: ", res.status);
      }
    } catch (error) {
      console.log("Fetch error: ", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const res = await fetch(BACKEND_URL + "trainingplan", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
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
    }, [token])
  );

  useFocusEffect(
    useCallback(() => {
      const fetchMovements = async () => {
        try {
          const res = await fetch(BACKEND_URL + "movement", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          });
          const data = await res.json();
          setMenuMovements(data.movement_list);
        } catch (error) {
          console.log("Error: ", error);
        }
      };
      fetchMovements();
    }, [token])
  );

  const Movement = ({ name, index, handleRemoveMovement, movement }) => {
    return (
      <View style={styles.singleMovement}>
        <Text style={styles.MovementName}>
          {index}. {name}
        </Text>
        <TouchableOpacity
          onPress={() => handleRemoveMovement(movement)}
          style={styles.deleteMovementIcon}
        >
          <MaterialIcons
            name="delete-outline"
            size={24}
            color={ThemeColors.tertiary}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const handleAddMovement = (value) => {
    const selectedMovement = menuMovements.find(
      (movement) => movement.name === value.label
    );
    if (!selectedRoutineMovements.includes(selectedMovement)) {
      setSelectedMovements((prevMovements) => [
        ...prevMovements,
        selectedMovement,
      ]);
    }
  };

  handleRemoveMovement = (movement) => {
    setSelectedMovements((prevMovements) =>
      prevMovements.filter((m) => m.id !== movement.id)
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TextInput
          placeholder="Routine name"
          style={styles.nameInput}
          onChangeText={(text) => setRoutineName(text)}
          placeholderTextColor={ThemeColors.tertiary}
        />
        <TextInput
          placeholder="Routine Notes"
          style={styles.nameInput}
          onChangeText={(text) => setRoutineNotes(text)}
          placeholderTextColor={ThemeColors.tertiary}
        />
      </View>
      <View style={styles.line} />
      <View style={styles.main}>
        <DropDownPicker
          open={open}
          value={value}
          items={menuMovements.map((movement) => ({
            label: movement.name,
            value: movement.id,
          }))}
          setOpen={setOpen}
          onSelectItem={handleAddMovement}
          setValue={setValue}
          setItems={setItems}
          placeholder="Select movement"
          containerStyle={{ width: "80%" }}
        />
        <ScrollView style={{ flex: 1 }}>
          {selectedRoutineMovements.map((movement, index) => (
            <Movement
              key={movement.id}
              name={movement.name}
              index={index + 1}
              handleRemoveMovement={handleRemoveMovement}
              movement={movement}
            />
          ))}
        </ScrollView>
      </View>
      <TouchableOpacity style={styles.finishRoutine} onPress={saveRoutine}>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 15,
            color: ThemeColors.tertiary,
          }}
        >
          Save
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CreateRoutine;
