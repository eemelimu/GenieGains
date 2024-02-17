import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
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
import { epochToDate } from "../assets/utils/utils";
import DropDownPicker from "react-native-dropdown-picker";
import { Text as TextSVG, Svg } from "react-native-svg";

const calculateRemainingData = (target) => {
  const data = target.data;
  const latestEntry = data[0];
  let sum = 0;
  for (i in data) {
    sum += data[i].value;
  }
  const difference = target.target; //-sum
  const daysDifference = (target.date - latestEntry.date) / (1000 * 3600 * 24);
  const remainingProgressPerDay = difference / daysDifference;
  return [remainingProgressPerDay, difference - sum];
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
    if (entry.date >= start && entry.date <= end) {
      combinedValue += entry.value;
    }
  }

  return combinedValue;
};

const GoalsPage = () => {
  const [goalsData, setGoalsData] = useState([]);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const font = useFont(DMSansBold, 15);
  const { state, isActive } = useChartPressState({
    x: 0,
    y: { value: 0, target: 0 },
  });
  const { state: secondState, isActive: secondIsActive } = useChartPressState({
    x: 0,
    y: { value: 0, target: 0 },
  });
  const [initialXPosition, setInitialXPosition] = useState(null);
  const [SecondinitialXPosition, setSecondInitialXPosition] = useState(null);

  useEffect(() => {
    // Mocking goals data for demonstration
    const data = [
      {
        id: 1,
        name: "Workout",
        date: 1736928000000,
        unit: "steps",
        target: 1000000,
        data: [
          { value: 3, note: "Was lazy", unit: "steps", date: 1736028000000 },
          { value: 3400, note: "Was lazy", unit: "steps", date: 1736114400000 },
          { value: 34, note: "Was lazy", unit: "steps", date: 1736200800000 },
          { value: 3, note: "Was lazy", unit: "steps", date: 1736287200000 },
          { value: 34, note: "Was lazy", unit: "steps", date: 1736373600000 },
          { value: 6, note: "Was lazy", unit: "steps", date: 1736460000000 },
          { value: 324, note: "Was lazy", unit: "steps", date: 1736546400000 },
          { value: 234, note: "Was lazy", unit: "steps", date: 1736632800000 },
          { value: 343, note: "Was lazy", unit: "steps", date: 1736719200000 },
          { value: 156, note: "Was lazy", unit: "steps", date: 1736805600000 },
        ],
      },
      {
        id: 2,
        name: "Weight",
        date: 1767218400000,
        unit: "kg",
        target: -100,
        data: [],
      },
      // Rest of the goals
    ];
    setGoalsData(data);
  }, []);

  useEffect(() => {
    setItems(goalsData.map((goal) => ({ label: goal.name, value: goal.id })));
  }, [goalsData]);

  useEffect(() => {
    if (isActive) {
      console.log("set the position", state.x.position.value);
      setInitialXPosition(state.x.position);
    } else {
      setInitialXPosition(null);
      console.log("reset the position");
    }
  }, [isActive]);
  useEffect(() => {
    if (secondIsActive) {
      console.log("set the second position", secondState.x.position.value);
      setSecondInitialXPosition(secondState.x.position);
    } else {
      setSecondInitialXPosition(null);
      console.log("reset the second position");
    }
  }, [secondIsActive]);

  useEffect(() => {
    if (value) {
      setSelectedGoal(goalsData.find((goal) => goal.id === value));
    }
  }, [value, goalsData]);

  const ToolTip = ({ x, y, value, xValue }) => {
    return <></>;
  };
  const formatXLabel = (epochDate) => {
    return epochToDate(epochDate).split(".").join("/").slice(0, -5);
  };

  const formatYLabel = (value) => {
    return `   ${value} ${selectedGoal.unit}`;
  };

  return (
    <View style={styles.container}>
      {selectedGoal ? (
        <View>
          <Text style={styles.goalHeader}>
            {`${selectedGoal.name} Goal of ${selectedGoal.target} ${
              selectedGoal.unit
            } by ${epochToDate(selectedGoal.date)}`}
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
                xKey="date"
                yKeys={["value"]}
                axisOptions={{ font, formatXLabel, formatYLabel }}
                chartPressState={[state, secondState]}
                gestureLongPressDelay={1}
              >
                {({ points }) => (
                  <>
                    <Line points={points.value} color="red" strokeWidth={3} />
                    {isActive && initialXPosition !== null && (
                      <Rect
                        x={initialXPosition.value}
                        y={0}
                        width={1}
                        height={Dimensions.get("window").height / 2.5}
                        color="rgba(0, 0, 0, 0.9)"
                      />
                    )}
                    {secondIsActive &&
                      isActive &&
                      initialXPosition !== null &&
                      SecondinitialXPosition !== null && (
                        <>
                          <Rect
                            x={SecondinitialXPosition.value}
                            y={0}
                            width={1}
                            height={Dimensions.get("window").height / 2.5}
                            color="rgba(0, 0, 0, 0.9)"
                          />
                          <Rect
                            x={SecondinitialXPosition.value}
                            y={0}
                            width={
                              initialXPosition.value -
                              SecondinitialXPosition.value
                            }
                            height={Dimensions.get("window").height / 2.5}
                            color="rgba(0, 0, 0, 0.3)"
                          />
                        </>
                      )}
                  </>
                )}
              </CartesianChart>
            )}
            {isActive &&
            initialXPosition !== null &&
            SecondinitialXPosition !== null &&
            secondIsActive ? (
              <>
                <Text>{`You have selected dates between ${epochToDate(
                  state.x.value.value
                )}-${epochToDate(secondState.x.value.value)}`}</Text>
                <Text>{`You have achieved ${calculateCombinedValueBetweenDates(
                  state.x.value.value,
                  secondState.x.value.value,
                  selectedGoal
                )} ${selectedGoal.unit} between these dates`}</Text>
              </>
            ) : null}
            {state.y.value.value.value === 0 ? (
              <Text>No data selected</Text>
            ) : (
              <>
                {!secondIsActive && (
                  <>
                    <Text>Selected value is:</Text>
                    <Text>{`${state.y.value.value.value} ${selectedGoal.unit}`}</Text>
                    <Text>{"On Date:" + epochToDate(state.x.value.value)}</Text>
                    <Text>{`${
                      calculateRemainingData(selectedGoal)[0]
                    } is your daily ${
                      selectedGoal.unit
                    } amount based on the goal you have set`}</Text>
                    <Text>{`You have ${
                      calculateRemainingData(selectedGoal)[1]
                    } ${selectedGoal.unit} left to reach your goal`}</Text>
                  </>
                )}
              </>
            )}
          </View>
        </View>
      ) : (
        <Text style={styles.noGoalText}>You have no goal selected</Text>
      )}
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder={"Choose a goal to view progress for"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  chartPlaceHolder: {
    height: Dimensions.get("window").height / 2.5 - 20,
    width: Dimensions.get("window").width - 40 - 20,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 22,
  },
  goalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  chartContainer: {
    height: Dimensions.get("window").height / 2.5,
    width: Dimensions.get("window").width - 40,
    marginBottom: 20,
  },
  tooltipContainer: {
    position: "absolute",
    zIndex: 1,
  },
  tooltip: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    position: "absolute",
    zIndex: 2,
  },
  tooltipText: {
    fontSize: 14,
    marginBottom: 5,
  },
  noGoalText: {
    fontSize: 16,
  },
});

export default GoalsPage;
