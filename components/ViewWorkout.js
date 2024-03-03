import React, { useState, useEffect } from "react";
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

export const ViewWorkout = ({ route }) => {
  const { workout, notes } = route.params;
  const navigation = useNavigation();
  const [workoutData, setWorkoutData] = useState([]);

  const handleEditWorkout = () => {
    console.log("Workout Movements");
    console.log(workout.movements);
    console.log("workoutData");
    console.log(workoutData);
  };

  useEffect(() => {
    const groupMovementsByName = (movements) => {
      const groupedMovements = [];
      movements.forEach((movement) => {
        const { name, ...rest } = movement;
        const existingIndex = groupedMovements.findIndex(
          (item) => item.name === name
        );
        if (existingIndex === -1) {
          groupedMovements.push({ name, movements: [rest] });
        } else {
          groupedMovements[existingIndex].movements.push(rest);
        }
      });
      return groupedMovements;
    };
    setWorkoutData(groupMovementsByName(workout.movements));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput style={styles.input} value={workout.name} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Notes</Text>
          <TextInput style={styles.input} value={notes} 
            placeholder="Notes"
          />
        </View>
      </View>
      <View style={styles.line} />
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.addedMovements}>
          {workoutData.map((movement, index) => (
            <SingleMovement key={index} movement={movement} />
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity onPress={handleEditWorkout} style={styles.editButton}>
        <Text>Edit Workout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const SingleMovement = ({ movement }) => {
  const [sets, setSets] = useState([{ weight: "", reps: "" }]);
  return (
    <View style={styles.singleMovementContainer}>
      <Text style={styles.singleMovementTitle}>{movement.name}</Text>
      {movement.movements.map((set, index) => (
        <SingleSet
          key={index}
          set={set}
          setWeight={(text) => {
            const newSets = [...sets];
            newSets[index].weight = text;
            setSets(newSets);
          }}
          setReps={(text) => {
            const newSets = [...sets];
            newSets[index].reps = text;
            setSets(newSets);
          }}
          setNumber={index + 1}
          handleRemoveSet={() => {
            const newSets = [...sets];
            newSets.splice(index, 1);
            setSets(newSets);
          }}
          handleSetOnChange={() => console.log("set changed")}
        />
      ))}
    </View>
  );
};

const SingleSet = ({
  set,
  setNumber,
}) => {
  const { weight, reps } = set;

  return (
    <View style={styles.singleMovementRow}>
      <Text style={styles.singleMovementLabel}>{setNumber}.</Text>
      <Text style={styles.singleMovementLabel}>Weight</Text>
      <TextInput
        style={styles.singleMovementInput}
        value={parseFloat(weight).toString()}
        keyboardType="numeric"
        editable={false}
      />
      <Text style={styles.singleMovementLabel}>Reps</Text>
      <TextInput
        style={styles.singleMovementInput}
        value={reps}
        keyboardType="numeric"
        editable={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  singleMovementInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 7,
    textAlign: "top",
    marginTop: 5,
    width: 60,
  },
  singleMovementLabel: {
    marginBottom: 2,
    top: 5,
    paddingLeft: 5,
    paddingRight: 5,
  },
  singleMovementRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  singleMovementContainer: {
    flex: 1,
    padding: 20,
    marginBottom: 20,
  },
  singleMovementTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  setsContainer: {
    marginTop: 10,
  },
  singleSetContainer: {
    marginBottom: 5,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
    marginBottom: 20,
    paddingBottom: 20,
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
  singleMovementContainer: {
    flex: 1,
    padding: 20,
    marginBottom: 20,
  },
  singleMovementTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  addedMovements: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#DDDDDD",
    marginTop: 20,
    borderRadius: 5,
  },
});
