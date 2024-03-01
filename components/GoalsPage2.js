import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
} from "react-native";
import { CartesianChart, Line, useChartPressState } from "victory-native";
import {
  Canvas,
  Text as CanvasText,
  useFont,
  Fill,
  Circle,
  Rect,
} from "@shopify/react-native-skia";
import DMSansBold from "../assets/fonts/DMSans-Bold.ttf";
import { epochToDate, lightOrDark } from "../assets/utils/utils";
import DropDownPicker from "react-native-dropdown-picker";
import { Text as TextSVG, Svg } from "react-native-svg";
import { ThemeColors } from "../assets/ThemeColors";
import { BACKEND_URL } from "../assets/config";
const CHART_HEIGHT = Dimensions.get("window").height / 2.6 - 20;
const CHART_WIDTH = Dimensions.get("window").width - 40;

const calculateRemainingData = (target) => {
  const data = target.data;
  const latestEntry = target;
  console.log("latestEntry", latestEntry?.created);
  let sum = 0;
  for (i in data) {
    sum += data[i].number;
  }
  const difference = target.number; //-sum
  const daysDifference =
    (target?.end - latestEntry?.created) / (1000 * 3600 * 24);
  const remainingProgressPerDay = difference / daysDifference;
  return [remainingProgressPerDay, difference - sum];
};

const getDataByDateAndValue = (date, value, goal) => {
  console.log("date", date);
  console.log("value", value);
  console.log("goal", goal);
  console.log(
    goal.data.find((entry) => entry.created === date && entry.number === value)
  );
  return goal.data.find(
    (entry) => entry.created === date && entry.number === value
  );
};

const calculateCombinedValueBetweenDates = (
  startDateEpoch,
  endDateEpoch,
  goal
) => {
  const { data } = goal;
  let combinedValue = 0;
  let start = startDateEpoch;
  let end = endDateEpoch;

  if (startDateEpoch > endDateEpoch) {
    start = endDateEpoch;
    end = startDateEpoch;
  }

  for (const entry of data) {
    if (entry?.created >= start && entry?.created <= end) {
      combinedValue += entry.number;
    }
  }

  return combinedValue;
};

const GoalsPage = () => {
  const [openAdditionPicker, setOpenAdditionPicker] = useState(false);
  const [goalName, setGoalName] = useState("");
  const { state: authState } = useAuth();
  const token = authState.token;
  const [units, setUnits] = useState("");
  const [additionUnits, setAdditionUnits] = useState("");
  const [additionTargetAmount, setAdditionTargetAmount] = useState("");
  const [additionDate, setAdditionDate] = useState(new Date());
  const [additionNote, setAdditionNote] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [goalsData, setGoalsData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAdditionModalVisible, setIsAdditionModalVisible] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [value, setValue] = useState(null);
  const [additionValue, setAdditionValue] = useState([]);
  const [items, setItems] = useState([]);
  const [additionItems, setAdditionItems] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const font = useFont(DMSansBold, 15);
  const { state, isActive } = useChartPressState({
    x: 0,
    y: { number: 0, target: 0 },
  });
  const { state: secondState, isActive: secondIsActive } = useChartPressState({
    x: 0,
    y: { number: 0, target: 0 },
  });
  const [initialXPosition, setInitialXPosition] = useState(null);
  const [SecondinitialXPosition, setSecondInitialXPosition] = useState(null);

  const getGoalsData = async (id) => {
    try {
      const res = await fetch(BACKEND_URL + `goal/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Auth-Token": token,
        },
      });
      const data = await res.json();
      console.log("data", data);
      if (res.ok) {
        console.log(data);
        const additions = data.data;
        const additionsCopy = additions.map((addition, index) => {
          return { ...addition, created: addition.created + index };
        });
        additionsCopy.push({ number: 0, created: data.end });
        additionsCopy.push({ number: 0, created: data.created - 1 });
        setSelectedGoal({ ...data, data: additionsCopy });
      } else {
        throw new Error("Failed to fetch goals");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getGoalsDataList = async () => {
    try {
      const res = await fetch(BACKEND_URL + "goal", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Auth-Token": token,
        },
      });
      const data = await res.json();
      console.log("data", data);
      if (res.ok) {
        setGoalsData(data.goal_list);
      } else {
        throw new Error("Failed to fetch goals");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getGoalsDataList();
    //setGoalsData(data);
  }, []);

  useEffect(() => {
    setItems(goalsData.map((goal) => ({ label: goal.name, value: goal.id })));
    setAdditionItems(
      goalsData.map((goal) => ({ label: goal.name, value: goal.id }))
    );
  }, [goalsData]);

  useEffect(() => {
    if (isActive) {
      console.log("set the position", state.x.position?.value);
      setInitialXPosition(state.x.position);
    } else {
      setInitialXPosition(null);
      setSecondInitialXPosition(null);
      console.log("reset the position");
    }
  }, [isActive]);
  useEffect(() => {
    if (secondIsActive) {
      console.log("set the second position", secondState.x.position?.value);
      setSecondInitialXPosition(secondState.x.position);
    } else {
      setSecondInitialXPosition(null);
      console.log("reset the second position");
    }
  }, [secondIsActive]);

  useEffect(() => {
    if (value) {
      getGoalsData(value);
      //setSelectedGoal(goalsData.find((goal) => goal.id === value));
    }
  }, [value, goalsData]);

  const handleCreateGoal = async () => {
    console.log("Goal Name:", goalName);
    console.log("Units:", units);
    console.log("Target Amount:", targetAmount);
    console.log("Date:", date);
    try {
      const res = await fetch(BACKEND_URL + "goal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Auth-Token": token,
        },
        body: JSON.stringify({
          name: goalName,
          unit: units,
          number: targetAmount,
          end: date,
        }),
      });
      const data = await res.json();
      console.log(data);
      if (res.ok) {
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setIsModalVisible(false);
    setDate(new Date());
    setGoalName("");
    setUnits("");
    setTargetAmount("");
    getGoalsDataList();
  };

  const addAdditionalData = async () => {
    console.log("Addition Units:", additionUnits);
    console.log("Addition Target Amount:", additionTargetAmount);
    console.log("Addition Date:", additionDate);
    console.log("Addition Note:", additionNote);
    console.log(additionValue);
    const noteWithoutNewLines = additionNote.replace("/\r?\n|\r/g", " ");
    for (i in additionValue) {
      try {
        const res = await fetch(BACKEND_URL + "addition", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Auth-Token": token,
          },
          body: JSON.stringify({
            goal_id: additionValue[i],
            number: additionTargetAmount,
            unit: additionUnits,
            note: noteWithoutNewLines,
          }),
        });
        getGoalsData(value);
      } catch (error) {
        console.error("Error:", error);
      }
    }
    setIsAdditionModalVisible(false);
    setAdditionUnits("");
    setAdditionTargetAmount("");
    setAdditionDate(new Date());
    setAdditionNote("");
    setAdditionValue([]);
  };

  const formatXLabel = (epochDate) => {
    return epochToDate(epochDate);
  };

  const formatYLabel = (number) => {
    return `   ${number} ${selectedGoal.unit}`;
  };

  return (
    <View style={styles.container}>
      {selectedGoal ? (
        <View>
          <Text style={styles.goalHeader}>
            {`${selectedGoal.name} Goal of ${selectedGoal.number} ${
              selectedGoal.unit
            } by ${epochToDate(selectedGoal?.end)}`}
          </Text>

          <View style={styles.chartContainer}>
            {selectedGoal.data.length === 0 ? (
              <View style={styles.chartPlaceHolder}>
                <Text style={styles.boldText}>
                  No data available for selected goal
                </Text>
              </View>
            ) : (
              <CartesianChart
                data={selectedGoal.data}
                xKey="created"
                yKeys={["number"]}
                axisOptions={{ font, formatXLabel, formatYLabel }}
                chartPressState={[state, secondState]}
                gestureLongPressDelay={1}
                labelOffset={{
                  x: 0,
                  y: 0,
                }}
              >
                {({ points }) => (
                  <>
                    <Line
                      points={points.number}
                      color={ThemeColors.quaternary}
                      strokeWidth={3}
                    />
                    {isActive && initialXPosition !== null && (
                      <Rect
                        x={initialXPosition?.value}
                        y={0}
                        width={1}
                        height={CHART_HEIGHT}
                        color="rgba(0, 0, 0, 0.9)"
                      />
                    )}
                    {secondIsActive &&
                      isActive &&
                      initialXPosition !== null &&
                      SecondinitialXPosition !== null && (
                        <>
                          <Rect
                            x={SecondinitialXPosition?.value}
                            y={0}
                            width={1}
                            height={CHART_HEIGHT}
                            color="rgba(0, 0, 0, 0.9)"
                          />
                          <Rect
                            x={SecondinitialXPosition?.value}
                            y={0}
                            width={
                              initialXPosition?.value -
                              SecondinitialXPosition?.value
                            }
                            height={CHART_HEIGHT}
                            color="rgba(0, 0, 0, 0.3)"
                          />
                        </>
                      )}
                  </>
                )}
              </CartesianChart>
            )}
          </View>
          <View style={styles.dataContainer}>
            {isActive &&
            initialXPosition !== null &&
            SecondinitialXPosition !== null &&
            secondIsActive ? (
              <>
                <Text
                  style={styles.informationText}
                >{`You have selected dates between ${epochToDate(
                  state.x?.value?.value
                )}-${epochToDate(secondState.x?.value?.value)}`}</Text>
                <Text
                  style={styles.informationText}
                >{`You have achieved ${calculateCombinedValueBetweenDates(
                  state.x?.value?.value,
                  secondState.x?.value?.value,
                  selectedGoal
                )} ${selectedGoal.unit} between these dates`}</Text>
              </>
            ) : null}
            {state.y?.number?.value?.value === 0 ? (
              <Text style={styles.informationText}>No data selected</Text>
            ) : (
              <>
                {!secondIsActive && selectedGoal.data.length > 0 && (
                  <>
                    <Text
                      style={styles.informationText}
                    >{`Selected value is:${state.y?.number?.value?.value} ${selectedGoal.unit}`}</Text>
                    <Text style={styles.informationText}>
                      {"On Date:" + epochToDate(state.x?.value?.value)}
                    </Text>
                    <Text style={styles.informationText}>{`Note: ${
                      getDataByDateAndValue(
                        state.x?.value?.value,
                        state.y?.number?.value?.value,
                        selectedGoal
                      )?.note
                    }`}</Text>
                    <Text style={styles.informationText}>{`${
                      calculateRemainingData(selectedGoal)[0]
                    } is your daily ${
                      selectedGoal.unit
                    } amount based on the goal you have set`}</Text>
                    <Text style={styles.informationText}>{`You have ${
                      calculateRemainingData(selectedGoal)[1]
                    } ${selectedGoal.unit} left to reach your goal`}</Text>
                  </>
                )}
              </>
            )}
          </View>
        </View>
      ) : (
        <Text style={styles.informationText}>You have no goal selected</Text>
      )}
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder={"Choose a goal to view progress for"}
        theme={lightOrDark(ThemeColors.primary).toUpperCase() || "DEFAULT"}
      />
      <Pressable style={styles.button} onPress={() => setIsModalVisible(true)}>
        <Text style={styles.boldText}>Create New Goal</Text>
      </Pressable>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setIsModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Workout Goal</Text>
            <Text style={styles.informationText}>Goal's name:</Text>
            <TextInput
              maxLength={100}
              style={styles.input}
              placeholder="Goal Name"
              value={goalName}
              onChangeText={(text) => setGoalName(text)}
            />
            <Text style={styles.informationText}>Goal's unit:</Text>
            <TextInput
              style={styles.input}
              placeholder="Units (e.g., steps, kilograms)"
              value={units}
              maxLength={10}
              onChangeText={(text) => setUnits(text)}
            />
            <Text style={styles.informationText}>Goal's target:</Text>
            <TextInput
              style={styles.input}
              placeholder="Target Amount"
              value={targetAmount}
              onChangeText={(text) => setTargetAmount(text)}
              keyboardType="numeric"
            />
            <Pressable
              style={styles.button}
              onPress={() => setOpenDatePicker(true)}
            >
              <Text style={styles.buttonText}>Select Date</Text>
              <Text style={styles.buttonText}>{epochToDate(date)}</Text>
            </Pressable>
            {openDatePicker && (
              <DateTimePicker
                value={new Date()}
                onChange={(event, selectedDate) => {
                  console.log("event", event);
                  console.log("selectedDate", selectedDate);
                  const currentDate = selectedDate || date;
                  if (event.type === "set") {
                    console.log("selectedDate", currentDate.toUTCString());
                    setDate(event.nativeEvent.timestamp);
                  }
                  setOpenDatePicker(false);
                }}
                mode="date"
                display="default"
              />
            )}
            <Pressable style={styles.createButton} onPress={handleCreateGoal}>
              <Text style={styles.buttonText}>Create Goal</Text>
            </Pressable>
            <Pressable
              style={styles.cancelButton}
              onPress={() => {
                setIsModalVisible(false);
                setDate(new Date());
                setGoalName("");
                setUnits("");
                setTargetAmount("");
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Pressable
        style={styles.button}
        onPress={() => {
          setIsAdditionModalVisible(true);
        }}
      >
        <Text style={styles.boldText}>Add progress</Text>
      </Pressable>
      <Modal
        visible={isAdditionModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setIsAdditionModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Add Your Progress To Your Goal
            </Text>
            <Text style={styles.informationText}>Note:</Text>
            <TextInput
              style={styles.input}
              placeholder="Add a note to your progress for this day"
              multiline
              numberOfLines={4}
              maxLength={250}
              value={additionNote}
              onChangeText={(val) => {
                setAdditionNote(val);
              }}
            ></TextInput>
            <Text style={styles.informationText}>Unit:</Text>
            <TextInput
              maxLength={10}
              style={styles.input}
              placeholder="Units (e.g., steps, kg)"
              value={additionUnits}
              onChangeText={(val) => setAdditionUnits(val)}
            />
            <Text style={styles.informationText}>Amount:</Text>
            <TextInput
              style={styles.input}
              placeholder="How much progress did you make (e.g., 5, 10)"
              value={additionTargetAmount}
              onChangeText={(val) => setAdditionTargetAmount(val)}
              keyboardType="numeric"
            />
            <DropDownPicker
              mode="BADGE"
              multiple={true}
              min={1}
              max={5}
              open={openAdditionPicker}
              value={additionValue}
              items={additionItems}
              setOpen={setOpenAdditionPicker}
              setValue={setAdditionValue}
              setItems={setAdditionItems}
              placeholder={"Choose goal or goals to add progress to"}
              theme={
                lightOrDark(ThemeColors.primary).toUpperCase() || "DEFAULT"
              }
            />
            <Pressable style={styles.createButton} onPress={addAdditionalData}>
              <Text style={styles.buttonText}>Add</Text>
            </Pressable>
            <Pressable
              style={styles.cancelButton}
              onPress={() => {
                setIsAdditionModalVisible(false);
                setAdditionDate(new Date());
                setAdditionUnits("");
                setAdditionTargetAmount("");
                setAdditionNote("");
                setAdditionValue([]);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  dataContainer: {
    backgroundColor: ThemeColors.secondary,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 110,
    borderRadius: 10,
    marginBottom: 20,
  },
  chartPlaceHolder: {
    height: CHART_HEIGHT,
    width: CHART_WIDTH,
    backgroundColor: ThemeColors.secondary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 22,
    color: ThemeColors.tertiary,
  },
  goalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: ThemeColors.tertiary,
  },
  chartContainer: {
    height: CHART_HEIGHT,
    width: CHART_WIDTH,
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: ThemeColors.secondary,
  },
  informationText: {
    fontSize: 16,
    color: ThemeColors.tertiary,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  createButton: {
    marginTop: 10,
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  cancelButtonText: {
    color: ThemeColors.quaternary,
    fontSize: 16,
  },
  button: {
    marginTop: 10,
    backgroundColor: ThemeColors.secondary,
    width: "100%",
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
  },
  buttonSmall: {
    marginTop: 10,
    backgroundColor: ThemeColors.secondary,
    width: "50%",
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
  },
});

export default GoalsPage;
