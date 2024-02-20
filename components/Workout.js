import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Button,
} from "react-native";
import ModalDropdown from "react-native-modal-dropdown";

export const Workout = () => {
  const [name, setName] = useState("");
  const [selectedMovement, setSelectedMovement] = useState(null);
  const [movements, setMovements] = useState([]);
  const [addedMovements, setAddedMovements] = useState([]);
  const [token, setToken] = useState("a5eae033-3997-4845-b16d-2b11b14b6e29");
  const [dropdownKey, setDropdownKey] = useState(0);

  const handleAddExercise = () => {
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
            value={name}
            onChangeText={(text) => setName(text)}
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
            onPress={handleAddExercise}
          >
            <Text>Add exercise</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.addedMovements}>
        {addedMovements.length > 0 ? (
          addedMovements.map((movement) => (
            <SingleMovement key={movement.id} movement={movement} />
          ))
        ) : (
          <Text>No exercises added</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const SingleMovement = ({ movement }) => {
  const [sets, setSets] = useState([{ weight: '', reps: '' }]);

  const handleAddSet = () => {
    setSets([...sets, { weight: '', reps: '' }]);
  };

  return (
    <View style={styles.singleMovementContainer}>
      <Text style={styles.singleMovementTitle}>{movement.name}</Text>
      {sets.map((set, index) => (
        <SingleSet key={index} set={set} />
      ))}
      <TouchableOpacity style={styles.addSetButton} onPress={handleAddSet}>
        <Text>Add set</Text>
      </TouchableOpacity>
    </View>
  );
};



const SingleSet = ({ set }) => {
  const { weight, reps } = set;
  
  const handleWeightChange = (text) => {
    // Handle weight input change
  };

  const handleRepsChange = (text) => {
    // Handle reps input change
  };

  return (
    <View style={styles.singleMovementRow}>
      <Text style={styles.singleMovementLabel}>Weight</Text>
      <TextInput
        style={styles.singleMovementInput}
        value={weight}
        onChangeText={handleWeightChange}
        placeholder="Weight"
        keyboardType="numeric"
        placeholderTextColor="rgba(0, 0, 0, 0.5)"
      />
      <Text style={styles.singleMovementLabel}>Reps</Text>
      <TextInput
        style={styles.singleMovementInput}
        value={reps}
        onChangeText={handleRepsChange}
        placeholder="Reps"
        keyboardType="numeric"
        placeholderTextColor="rgba(0, 0, 0, 0.5)"
      />
    </View>
  );
};



const styles = StyleSheet.create({
  // Single Movement Styles
  singleMovementContainer: {
    flex: 1,
    padding: 20,
  },
  singleMovementRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  singleMovementColumn: {
    flexDirection: "column",
  },
  singleMovementLabel: {
    width: 100,
    marginBottom: 2,
    top: 5,
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
});
