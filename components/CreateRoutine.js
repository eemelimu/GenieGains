import { useState, useEffect, useCallback } from "react";
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

import { useAuth } from "./AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { ThemeColors } from "../assets/ThemeColors";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import ModalDropdown from "react-native-modal-dropdown";
import { BACKEND_URL } from "../assets/config";


const CreateRoutine = () => {
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


      const saveRoutine = async () => {
        try { 
          if (!routineName) {
            console.log("Routine name is required");
            return;
            
        }
        
          const res = await fetch(BACKEND_URL + "trainingplan", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Auth-Token": token,
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
              const res = await fetch(BACKEND_URL+  "trainingplan", {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "Auth-Token": token,
                },
              });
              const data = await res.json();
              setTrainingPlans(data.trainingplan_list);
              console.log("luk"+data);
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
                  "Auth-Token": token,
                },
              });
              const data = await res.json();
              setMenuMovements(data.movement_list);
            } catch (error) {
              console.log("Error: ", error);
            }
          };
          fetchMovements();
        }
        , [token])
      );


      // useEffect(() => {
      //   setSelectedMovements([])
      //   if (trainingPlans.length > 0) {
      //     setSelectedMovements(trainingPlans[0].movements);
      //   }
      // }, [trainingPlans]);




      return (
        <SafeAreaView style={styles.container}>
          
          <ScrollView style={{ flex: 1 }}>
            <View style={styles.main}>
              <TextInput placeholder="Routine name" 
              style={styles.nameInput}
              onChangeText={(text) => setRoutineName(text)} />




              <ModalDropdown
                options={menuMovements
                .filter((movement) => 
                !selectedRoutineMovements
                .find((selectedMovement)=> selectedMovement.id === movement.id))
                .map((movement) => movement.name)}
              onSelect={(index, value) => {
                console.log("Selected: ", value);
                const selectedMovement = menuMovements.find(
                  (movement) => movement.name === value
                );
                setSelectedMovements((prevMovements) => [
                  ...prevMovements,
                  selectedMovement,
                ]);
              }}

                textStyle={styles.dropdownText}
                dropdownStyle={styles.dropdown}
                defaultValue="Select movement"
              />
              
              {selectedRoutineMovements.map((movement) => (
                
                  <Movement key = {movement.id} name={movement.name} />
                
              ))}
            </View>
          </ScrollView>
          <TouchableOpacity style={styles.finishRoutine} onPress={saveRoutine}>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>Finish routine</Text>
          </TouchableOpacity>
    
          {/* <View style={styles.footer}></View> */}
        </SafeAreaView>
      );
    };
  
    
    const Movement = ({ name }) => {
      return (
        <View style={styles.singleMovement}>
          <Text style={styles.MovementName}>{name}</Text>
      
        </View>
      );
    };
  
    
    const styles = StyleSheet.create({
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
      finishRoutine: {
        width: "20%",
        height: 50,
        backgroundColor: ThemeColors.tertiary,
        marginVertical: 7,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
        paddingHorizontal: 10,
        position: "relative",
        alignSelf: "center",
        fontFamily: "DMRegular",
      },
      nameInput: {
        width: "20%",
        height: 50,
        backgroundColor: ThemeColors.primary,
        marginVertical: 7,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
        paddingHorizontal: 10,
        position: "relative",
        alignSelf: "center",
        fontFamily: "DMRegular",
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
    
      MovementName: {
        fontSize: 20,
        fontFamily: "DMBold",
        bottom: 20,
    
      },
    
      MovementType: {
        fontSize: 20,
        fontFamily: "DMRegular",
    
      },
    
      container: {
        flex: 1,
      },
      main: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 20,
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
      selectMovementButton: {
        backgroundColor: ThemeColors.secondary,
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
    });
    

export default CreateRoutine;