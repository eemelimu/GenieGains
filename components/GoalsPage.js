import { useEffect, useState } from "react";
import { colorKit } from "reanimated-color-picker";
import DropDownPicker from "react-native-dropdown-picker";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Dimensions,
  Modal,
  Pressable,
} from "react-native";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";
import { Rect, Text as TextSVG, Svg } from "react-native-svg";
import { epochToDate } from "../assets/utils/utils";
export const GoalsPage = () => {
  const [goalsData, setGoalsData] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Fetch goals data from backend
    // setGoalsData(response.data);
    setGoalsData([
      {
        id: 1,
        name: "Workout",
        date: 1744028000000,
        unit: "steps",
        target: 1000000,
        data: [
          { date: 1704060000000, value: 1, note: "Was lazy", unit: "steps" },
          { date: 1706738400000, value: 3, note: "Was lazy", unit: "steps" },
          { date: 1709310400000, value: 4, note: "Was lazy", unit: "steps" },
          { date: 1711982400000, value: 5, note: "Was lazy", unit: "steps" },
          { date: 1714574400000, value: 6, note: "Was lazy", unit: "steps" },
          { date: 1717252800000, value: 7, note: "Was lazy", unit: "steps" },
          { date: 1719844800000, value: 8, note: "Was lazy", unit: "steps" },
          { date: 1722523200000, value: 9, note: "Was lazy", unit: "steps" },
          { date: 1725201600000, value: 10, note: "Was lazy", unit: "steps" },
          { date: 1727793600000, value: 11, note: "Was lazy", unit: "steps" },
          { date: 1730472000000, value: 12, note: "Was lazy", unit: "steps" },
          { date: 1733064000000, value: 13, note: "Was lazy", unit: "steps" },
        ],
      },
      {
        id: 2,
        name: "Weight",
        date: 1767218400000,
        unit: "kg",
        target: -100,
        data: [
          { date: 1704060000000, value: -1, note: "Was lazy", unit: "kg" },
          { date: 1706738400000, value: -3, note: "Was lazy", unit: "kg" },
          { date: 1709310400000, value: -4, note: "Was lazy", unit: "kg" },
          { date: 1711982400000, value: -5, note: "Was lazy", unit: "kg" },
          { date: 1714574400000, value: -6, note: "Was lazy", unit: "kg" },
          { date: 1717252800000, value: -7, note: "Was lazy", unit: "kg" },
          { date: 1719844800000, value: -8, note: "Was lazy", unit: "kg" },
          { date: 1722523200000, value: -9, note: "Was lazy", unit: "kg" },
          { date: 1725201600000, value: -10, note: "Was lazy", unit: "kg" },
          { date: 1727793600000, value: -11, note: "Was lazy", unit: "kg" },
          { date: 1730472000000, value: -12, note: "Was lazy", unit: "kg" },
          { date: 1733064000000, value: -13, note: "Was lazy", unit: "kg" },
        ],
      },
      {
        id: 3,
        name: "Shorter goal",
        date: 1710540000000,
        unit: "steps",
        target: 10000,
        data: [
          { date: 1708120800000, value: 1000, note: "Was lazy", unit: "kg" },
          { date: 1708207200000, value: 1500, note: "Was lazy", unit: "kg" },
          { date: 1708293600000, value: 1000, note: "Was lazy", unit: "kg" },
          { date: 1708380000000, value: 100, note: "Was lazy", unit: "kg" },
          { date: 1708466400000, value: 270, note: "Was lazy", unit: "kg" },
          { date: 1708552800000, value: 50, note: "Was lazy", unit: "kg" },
          { date: 1708639200000, value: 0, note: "Was lazy", unit: "kg" },
          { date: 1708725600000, value: 1000, note: "Was lazy", unit: "kg" },
          { date: 1708812000000, value: 1000, note: "Was lazy", unit: "kg" },
          { date: 1708898400000, value: 500, note: "Was lazy", unit: "kg" },
          { date: 1708984800000, value: 1200, note: "Was lazy", unit: "kg" },
          { date: 1709071200000, value: 100, note: "Was lazy", unit: "kg" },
        ],
      },
    ]);
  }, []);
  useEffect(() => {
    setItems(goalsData.map((goal) => ({ label: goal.name, value: goal.id })));
  }, [goalsData]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
    btn: {
      backgroundColor: "#00ff00",
      padding: 10,
      borderRadius: 10,
      margin: 10,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#000000",
      opacity: 0.8,
    },
  });
  const ChartElement = ({ id }) => {
    const [isDatapointModalVisible, setIsDatapointModalVisible] =
      useState(false);
    const [chartData, setChartData] = useState({});
    const [selectedDatapoint, setSelectedDatapoint] = useState({});
    useEffect(() => {
      setChartData(goalsData.find((goal) => goal.id === value));
    }, [goalsData]);

    const calculateRemainingData = (data, target) => {
      const latestEntry = data[0];
      let sum = 0;
      for (i in data) {
        sum += data[i].value;
      }
      console.log(sum);
      const difference = target.target; //-sum
      const daysDifference =
        (target.date - latestEntry.date) / (1000 * 3600 * 24);
      console.log(daysDifference);
      const remainingWeightPerDay = difference / daysDifference;
      const remainingData = [];
      let currentDate = latestEntry.date;
      while (currentDate < target.date) {
        //remainingData.push({ date: currentDate, value: remainingWeightPerDay });
        remainingData.push(remainingWeightPerDay);
        currentDate += 1000 * 3600 * 24; // Add one day
      }
      console.log(remainingData);
      return remainingData;
    };

    if (!chartData?.data) {
      return <Text>No data for this goal</Text>;
    } else
      return (
        <View style={styles.container}>
          <Text>
            {chartData?.name} Goal of {chartData?.target} {chartData?.unit} by{" "}
            {epochToDate(chartData?.date)}
          </Text>
          <View>
            <LineChart
              onDataPointClick={(data) => {
                setSelectedDatapoint(chartData.data[data.index]);
                setIsDatapointModalVisible(true);
              }}
              decorator={() => {
                return (
                  <View>
                    <Modal
                      style={styles.modalContainer}
                      onRequestClose={() => setIsDatapointModalVisible(false)}
                      visible={isDatapointModalVisible}
                      animationType="slide"
                    >
                      <View style={styles.modalContainer}>
                        <Text>Selected datapoint:</Text>
                        <Text>Date:{epochToDate(selectedDatapoint?.date)}</Text>
                        <Text>
                          Progress:{selectedDatapoint?.value}{" "}
                          {selectedDatapoint?.unit}
                        </Text>
                        <Text>Note:{selectedDatapoint?.note}</Text>
                        <Pressable
                          style={styles.btn}
                          onPress={() => setIsDatapointModalVisible(false)}
                        >
                          <Text style={{ fontWeight: "bold" }}>Close</Text>
                        </Pressable>
                      </View>
                    </Modal>
                    <Svg>
                      <TextSVG
                        x={Dimensions.get("window").width / 2 - 20}
                        y={205}
                        fill="black"
                        fontSize="16"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        Time
                      </TextSVG>
                    </Svg>
                    <Svg>
                      <TextSVG
                        x={25}
                        y={205}
                        fill="black"
                        fontSize="16"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {chartData?.unit}
                      </TextSVG>
                    </Svg>
                  </View>
                );
              }}
              data={{
                datasets: [
                  {
                    data: calculateRemainingData(chartData.data, {
                      target: chartData.target,
                      date: chartData.date,
                    }),
                    color: (opacity = 1) => `rgba(255, 25, 25, ${opacity})`,
                  },
                  {
                    data: chartData.data.map((item) => item.value),
                  },
                ],
              }}
              width={Dimensions.get("window").width - 40}
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              yAxisInterval={100} // optional, defaults to 1
              chartConfig={{
                backgroundGradientFrom: "#eb5234",
                backgroundGradientTo: "#23d962",
                decimalPlaces: 0, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 2555, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                propsForDots: {
                  r: "5",
                  strokeWidth: "3",
                  stroke: "#23d9bb",
                },
              }}
              bezier={true}
              style={{
                marginVertical: 8,
                marginHorizontal: 8,
                borderRadius: 16,
              }}
            />
          </View>
        </View>
      );
  };

  return (
    <View style={styles.container}>
      {goalsData.length > 0 && value ? (
        <>
          <ChartElement id={value}></ChartElement>
        </>
      ) : (
        <Text>You have no goal selected</Text>
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
export default GoalsPage;
