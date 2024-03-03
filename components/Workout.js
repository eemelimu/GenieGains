import React, { useState, useEffect, useContext } from "react";
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
import { useNavigation } from "@react-navigation/native";
import ModalDropdown from "react-native-modal-dropdown";
import { useAuth } from "./AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { ThemeColors } from "../assets/ThemeColors";

// TODO:
// - Video
// - Dropdown menun fonttia selkeemmäks
// - Finish Workout -nappi, joka lähettää tiedot serverille ja navigoi takaisin etusivulle
// - Bug: Jos lisää kaksi liikettä ja lisää toiseen liikkeeseen lisää sarjoja,
//   niin toisen liikkeen päälle ilmestyy tyhjää tilaa.
//   COPILOTIN rakaisu: Tämä johtuu siitä, että molemmat liikkeet käyttävät samaa statea sarjojen lisäämiseen.
//   Ratkaisu: Jokaiselle liikkeelle oma state sarjojen lisäämiseen.
// BUG: Kun lisäät liikkeeksi "penkkipunnerrus" niin maastaveto katoaa listasta.
// - Workout automaattinen nimen luonti: Ottaa jokaisen liikkeen kategorian ja listaa sen nimeen

export const Workout = () => {
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedMovement, setSelectedMovement] = useState(null);
  const [movements, setMovements] = useState([]);
  const [addedMovements, setAddedMovements] = useState([]);
  const { state } = useAuth();
  const token = state.token;
  const [dropdownKey, setDropdownKey] = useState(0);
  const [workoutData, setWorkoutData] = useState([]);
  const navigation = useNavigation();
  const [inProgress, setInProgress] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState("");

  const handleAddMovement = () => {
    const selectedMovementFilter = movements.filter(
      (movement) => movement.name === selectedMovement
    );
    if (selectedMovement) {
      if (addedMovements.includes(selectedMovementFilter[0])) {
        // Jos liike on jo lisätty, ei lisätä sitä uudestaan
        setDropdownKey((prevKey) => prevKey + 1);
        return;
      }
      setAddedMovements([...addedMovements, selectedMovementFilter[0]]);
      setDropdownKey((prevKey) => prevKey + 1);
      setWorkoutData([selectedMovementFilter[0], ...workoutData]);
    }
  };

  const handleRemoveMovement = (movement) => {
    const newMovements = addedMovements.filter(
      (addedMovement) => addedMovement.id !== movement.id
    );
    setAddedMovements(newMovements);
    setWorkoutData(workoutData.filter((data) => data.id !== movement.id));
  };

  const createExercise = async (name, notes) => {
    try {
      const res = await fetch("http://localhost:8000/exercise", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Auth-Token": token,
        },
        body: JSON.stringify({
          name: name,
          note: notes,
          type: name,
        }),
      });
      const data = await res.json();
      return data.id;
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    const allWorkoutsHaveSets = workoutData.every((workout) => {
      return (
        Array.isArray(workout.sets) &&
        workout.sets.every((set) => set.weight !== "" && set.reps !== "")
      );
    });
    console.log(allWorkoutsHaveSets);
    workoutData.length > 0 && allWorkoutsHaveSets
      ? setInProgress(true)
      : setInProgress(false);
  }, [workoutData]);

  const addSetsToExercise = async (exerciseId, sets, movement) => {
    try {
      const res = await fetch(
        `http://localhost:8000/exercisemovementconnection`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Auth-Token": token,
          },
          body: JSON.stringify({
            exercise_id: exerciseId,
            movement_id: movement.id,
            weight: sets.weight,
            reps: sets.reps,
            video: "",
            time: 0,
          }),
        }
      );
      const data = await res.json();
      return data;
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const handleFinishWorkout = async () => {
    if (inProgress) {
      // name === "" && setName(`${timeOfDay} Workout`);
      try {
        const exerciseId = await createExercise(name, notes);
        await Promise.all(
          workoutData.map(async (movement) => {
            await Promise.all(
              movement.sets.map(async (set) => {
                await addSetsToExercise(exerciseId, set, movement);
              })
            );
          })
        );
      } catch (error) {
        console.log("Error: ", error);
      }
      navigation.navigate("Home");
    }
  };

  useEffect(() => {
    try {
      fetch("http://localhost:8000/movement", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Auth-Token": token,
        },
      })
        .then((response) => response.json())
        .then((data) => setMovements(data.movement_list))
        .catch((error) => {
          console.log("Error fetching movements: ", error);
        });
    } catch (error) {
      console.log("Error fetching movements: ", error);
    }
  }, []);

  const NoMovements = () => {
    const handleLoadMovements = () => {
      console.log("Loading movements");
    };
    return (
      <View>
        <TouchableOpacity onPress={handleLoadMovements}>
          <Text>No movements available</Text>
        </TouchableOpacity>
      </View>
    );
  };

  useEffect(() => {
    const currentTime = new Date().getHours();
    if (currentTime < 12) {
      setTimeOfDay("Morning");
    } else if (currentTime < 18) {
      setTimeOfDay("Afternoon");
    } else {
      setTimeOfDay("Evening");
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={(text) => setName(text)}
            placeholder="Workout name"
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={styles.input}
            value={notes}
            onChangeText={(text) => setNotes(text)}
            placeholder="Notes"
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
          />
        </View>
      </View>
      <View style={styles.line} />
      <View style={styles.addMenu}>
        <View style={styles.addMenuItem}>
          <ModalDropdown
            key={dropdownKey}
            options={movements.map((movement) => movement.name)}
            onSelect={(index, value) => {
              setSelectedMovement(value);
            }}
            defaultValue="Select Movement"
            textStyle={styles.dropdownText}
            dropdownStyle={styles.dropdown}
          />
        </View>
        <View style={styles.addMenuItem}>
          <TouchableOpacity
            style={styles.addExercise}
            onPress={handleAddMovement}
          >
            <Text>Add exercise</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.addedMovements}>
          {addedMovements.length > 0 ? (
            addedMovements.map((movement) => (
              <SingleMovement
                key={movement.id}
                movement={movement}
                handleRemoveMovement={handleRemoveMovement}
                workoutData={workoutData}
                setWorkoutData={setWorkoutData}
              />
            ))
          ) : (
            <Text>No exercises added</Text>
          )}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={{
            ...styles.finishWorkout,
            visibility: inProgress ? "visible" : "hidden",
          }}
          onPress={handleFinishWorkout}
        >
          <Text>Finish Workout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const SingleMovement = ({
  movement,
  handleRemoveMovement,
  workoutData,
  setWorkoutData,
}) => {
  const [sets, setSets] = useState([{ weight: "", reps: "" }]);

  const handleAddSet = () => {
    setSets([...sets, { weight: "", reps: "" }]);
    if (workoutData.includes(movement)) {
      const index = workoutData.indexOf(movement);
      const newWorkoutData = [...workoutData];
      newWorkoutData[index].sets = sets;
      setWorkoutData(newWorkoutData);
    }
  };

  const handleSetOnChange = (index, text) => {
    const newSets = [...sets];
    newSets[index] = text;
    setSets(newSets);
    if (workoutData.includes(movement)) {
      const index = workoutData.indexOf(movement);
      const newWorkoutData = [...workoutData];
      newWorkoutData[index].sets = sets;
      setWorkoutData(newWorkoutData);
    }
  };

  const handleRemoveSet = (index) => {
    index >= 1 ? setSets(sets.filter((set, i) => i !== index)) : null;
    if (index >= 1) {
      const newWorkoutData = [...workoutData];
      newWorkoutData[workoutData.indexOf(movement)].sets = sets.filter(
        (set, i) => i !== index
      );
      setWorkoutData(newWorkoutData);
    }
  };

  const handleRepsChange = (index, text) => {
    const newSets = [...sets];
    newSets[index].reps = text;
    setSets(newSets);
  };

  const handleWeightChange = (index, text) => {
    const newSets = [...sets];
    newSets[index].weight = text;
    setSets(newSets);
  };

  return (
    <View style={styles.singleMovementContainer}>
      <Text style={styles.singleMovementTitle}>
        {movement.name}
        <TouchableOpacity
          onPress={() => handleRemoveMovement(movement)}
          style={styles.removeIcon}
        >
          <MaterialIcons name="delete-outline" size={24} color="black" />
        </TouchableOpacity>
      </Text>
      {sets.map((set, index) => (
        <SingleSet
          key={index}
          set={set}
          setWeight={(text) => handleWeightChange(index, text)}
          setReps={(text) => handleRepsChange(index, text)}
          setNumber={index + 1}
          handleRemoveSet={() => handleRemoveSet(index)}
          handleSetOnChange={() => handleSetOnChange(index)}
        />
      ))}
      <View>
        <Button
          title="Add set"
          onPress={handleAddSet}
          style={styles.addSetButton}
        />
      </View>
    </View>
  );
};

const SingleSet = ({
  set,
  setWeight,
  setReps,
  setNumber,
  handleRemoveSet,
  handleSetOnChange,
}) => {
  const { weight, reps } = set;

  return (
    <View style={styles.singleMovementRow}>
      <Text style={styles.singleMovementLabel}>{setNumber}.</Text>
      <Text style={styles.singleMovementLabel}>Weight</Text>
      <TextInput
        style={styles.singleMovementInput}
        value={weight}
        onChangeText={(text) => setWeight(text)}
        placeholder="Weight"
        keyboardType="numeric"
        placeholderTextColor="rgba(0, 0, 0, 0.5)"
        onChange={handleSetOnChange}
      />
      <Text style={styles.singleMovementLabel}>Reps</Text>
      <TextInput
        style={styles.singleMovementInput}
        value={reps}
        onChangeText={(text) => setReps(text)}
        placeholder="Reps"
        keyboardType="numeric"
        placeholderTextColor="rgba(0, 0, 0, 0.5)"
        onChange={handleSetOnChange}
      />
      <TouchableOpacity onPress={handleRemoveSet}>
        <Ionicons name="remove" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // Single Movement Styles
  singleMovementContainer: {
    flex: 1,
    padding: 20,
    marginBottom: 20,
  },
  singleMovementRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  singleMovementColumn: {
    flexDirection: "column",
  },
  singleMovementLabel: {
    // width: 60,
    marginBottom: 2,
    top: 5,
    paddingLeft: 5,
    paddingRight: 5,
  },
  singleMovementInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 7,
    textAlign: "top",
    marginTop: 5,
    width: 60,
  },
  singleMovementTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  singleMovementReps: {
    fontSize: 14,
    marginBottom: 5,
    alignSelf: "center",
    position: "absolute",
    top: 40,
    left: 10,
  },
  singleMovementSets: {
    fontSize: 14,
    marginBottom: 5,
    alignSelf: "center",
    position: "absolute",
    top: 70,
    left: 10,
  },
  addSetButton: {
    backgroundColor: "#D8D8D8",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  removeIcon: {
    position: "absolute",
    right: 0,
  },
  // Add Movement Styles
  addMenu: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  addMenuItem: {
    marginHorizontal: 10,
  },
  addedMovements: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  inputContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  label: {
    marginBottom: 5,
    top: 15,
    backgroundColor: "white",
    paddingHorizontal: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    textAlign: "center",
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
    marginBottom: 20,
    paddingBottom: 20,
  },
  dropdownText: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    textAlign: "center",
  },
  dropdown: {
    marginTop: 2,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#ccc",
    width: 144,
  },
  addExercise: {
    backgroundColor: "#D8D8D8",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    bottom: 5,
  },
  finishWorkout: {
    backgroundColor: ThemeColors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
