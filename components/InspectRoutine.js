import {useEffect, useState} from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useFonts } from "expo-font";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeColors } from "../assets/ThemeColors";
import { BACKEND_URL } from "../assets/config";
import { useAuth } from "./AuthContext";



const InspectRoutine = ({route}) => {
    const { params }=route;
    const { routineName } = params;
    const [trainingPlan, setTrainingPlan] = useState(null);
    const {state} = useAuth();
    const token = state.token;


    useEffect(() => {
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
                const selectedPlan = data.trainingplan_list.find(
                    (plan) => plan.training_plan_name === routineName
                  );

                setTrainingPlan(selectedPlan);


                console.log(data);
            }
            catch (error) {
                console.log("Error: ", error);
            }
        };
        fetchData();
    }, [routineName]);




    console.log(route.params.routineName)

    let [fontsLoaded] = useFonts({
        DMBold: require("../assets/fonts/DMSans-Bold.ttf"),
        DMRegular: require("../assets/fonts/DMSans-Regular.ttf"),
      });
      if (!fontsLoaded) {
        return null;
      }

    





    return (
        <SafeAreaView style={styles.container}>
            
            <View style={styles.header}>
            <Text style={styles.headerText}>{routineName}</Text>
            </View>
{/*             <TextInput 
            style={styles.notes} 
            placeholder="Type notes..." 
            multiline={true}
            /> */}
            <ScrollView style={{ flex: 1 }}>
                <View style={styles.main}> 
                {trainingPlan && trainingPlan.movements.map((movement) => (
                    
                    <Movement key={movement.id} name= {movement.name} />
                ))}
                </View>
            </ScrollView>

        </SafeAreaView>

    );
    };

    const Movement = ({ name }) => {
        return (
            <View style={styles.singleMovement}>
                <Text style={styles.movementName}> {name}</Text>
                {/* <Text style={styles.movementNumbers}> {set} x {reps} {weight} kg</Text> */}
            </View>
        )
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
        },
        header: {
            backgroundColor: ThemeColors.tertiary,
            height: 100,
            justifyContent: "center",
            alignItems: "center",
            width: "90%",
            alignSelf: "center",
            borderRadius: 15,
            
            
        },
        headerText: {
            fontSize: 24,
            color: ThemeColors.black,
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
                fontFamily: "DMBold",
                bottom: 20,
            },
            movementNumbers: {
                fontSize: 20,
                fontFamily: "DMRegular",
            },
    });



export default InspectRoutine;