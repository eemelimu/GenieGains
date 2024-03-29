import React, { useState, useEffect, useContext, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast, { ErrorToast, BaseToast } from "react-native-toast-message";
import Button from "../components/Button";
import * as Clipboard from "expo-clipboard";
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
import { ThemeContext } from "../contexts/ThemeContext";
import {
  Canvas,
  Text as CanvasText,
  useFont,
  Fill,
  Circle,
  Rect,
} from "@shopify/react-native-skia";
import DMSansBold from "../assets/fonts/DMSans-Bold.ttf";
import { useLocalization } from "../contexts/LocalizationContext";
import useRequest from "../hooks/useRequest";
import { epochToDate, lightOrDark, hexToRgba } from "../utils/utils";
import DropDownPicker from "react-native-dropdown-picker";
import { Text as TextSVG, Svg } from "react-native-svg";
//import { ThemeColors } from "../assets/ThemeColors";
import { BACKEND_URL } from "../assets/config";
import { useNotification } from "../contexts/NotificationContext";
import { useFocusEffect } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import format from "@testing-library/react-native/build/helpers/format";

const CHART_HEIGHT = Dimensions.get("window").height / 3 - 20;
const CHART_WIDTH = Dimensions.get("window").width - 40;

const calculateRemainingData = (target) => {
  const data = target.data;
  const latestEntry = target;
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
  const { locale, t, formatDate, formatNumber } = useLocalization();
  const [unit, setUnit] = useState("metric");
  //const unit = locale.measurementSystem;
  const { setError, setSuccess, startLoading, stopLoading } = useNotification();
  const { theme: ThemeColors } = useContext(ThemeContext);
  const [openAdditionPicker, setOpenAdditionPicker] = useState(false);
  const [goalName, setGoalName] = useState("");
  const { state: authState } = useAuth();
  const token = authState.token;
  const { fetcher } = useRequest(token);
  const [units, setUnits] = useState("");
  const [additionTargetAmount, setAdditionTargetAmount] = useState("");
  const [additionNote, setAdditionNote] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [goalsData, setGoalsData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAdditionModalVisible, setIsAdditionModalVisible] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date().getTime());
  const [value, setValue] = useState(null);
  const [additionGoalsList, setadditionGoalsList] = useState([]);
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

  const getUserData = async () => {
    const res = await fetcher({
      url: BACKEND_URL + "user",
      reqMethod: "GET",
      errorMessage: t("something-went-wrong"),
    });
    if (res) {
      setUnit(res.unit);
    }
  };

  const getGoalsData = async (id) => {
    const res = await fetcher({
      url: BACKEND_URL + `goal/${id}`,
      reqMethod: "GET",
      errorMessage: t("something-went-wrong"),
      showLoading: true,
    });
    if (res) {
      console.log(res);
      const additions = res.data;
      const additionsCopy = additions.map((addition, index) => {
        return { ...addition, created: addition.created + index };
      });
      //append 1 addition with value 0 to the end
      additionsCopy.push({
        created: res.end,
        number: 0,
        note: "",
        goal_id: id,
      });
      setSelectedGoal({ ...res, data: additionsCopy });
    }
  };

  const getGoalsDataList = async () => {
    const res = await fetcher({
      url: BACKEND_URL + "goal",
      reqMethod: "GET",
      errorMessage: t("something-went-wrong"),
      showLoading: true,
    });
    if (res) {
      console.log(res);
      setGoalsData(res.goal_list);
    }
  };

  useEffect(() => {
    getUserData();
    getGoalsDataList();
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
    }
  }, [value, goalsData]);

  const handleCreateGoal = async () => {
    if (goalName === "" || units === "" || targetAmount === "") {
      setError(t("fill-all-fields"));
      return;
    }
    const res = await fetcher({
      url: BACKEND_URL + "goal",
      reqMethod: "POST",
      errorMessage: t("failed-to-create-goal"),
      object: {
        name: goalName,
        unit: units,
        number: targetAmount,
        end: date,
      },
      showLoading: true,
    });
    if (res) {
      setDate(new Date());
      setGoalName("");
      setUnits("");
      setTargetAmount("");
      getGoalsDataList();
      setIsModalVisible(false);
    }
  };

  const addAdditionalData = async () => {
    if (additionGoalsList.length == 0) {
      setError(t("select-goal"));
      return;
    }
    if (additionTargetAmount == "") {
      setError(t("enter-amount-progress"));
      return;
    }
    const noteWithoutNewLines = additionNote.replace("/\r?\n|\r/g", " ");
    for (i in additionGoalsList) {
      const res = await fetcher({
        url: BACKEND_URL + "addition",
        reqMethod: "POST",
        object: {
          goal_id: additionGoalsList[i],
          number: additionTargetAmount,
          note: noteWithoutNewLines,
        },
        errorMessage: t("failed-to-add-progress"),
        showLoading: true,
      });
    }
    if (res) {
      setAdditionTargetAmount("");
      setAdditionNote("");
      setadditionGoalsList([]);
      getGoalsDataList();
      setIsAdditionModalVisible(false);
    }
  };

  const formatXLabel = (epochDate) => {
    //return epochToDate(epochDate);
    return formatDate(epochDate);
  };

  const formatYLabel = (number) => {
    return `   ${formatNumber(number)} ${selectedGoal.unit}`;
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
      padding: 10,
      backgroundColor: ThemeColors.secondary,
      alignItems: "left",
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
      backgroundColor: ThemeColors.primary,
      borderRadius: 10,
      padding: 10,
      fontSize: 16,
      textAlign: "left",
      margin: 5,
      color: ThemeColors.tertiary,
    },
    modalContainer: {
      flex: 1,
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: hexToRgba(ThemeColors.primary, 0.8),
    },
    modalContent: {
      backgroundColor: hexToRgba(ThemeColors.secondary, 0.9),
      padding: 20,
      borderRadius: 10,
      width: "80%",
      opacity: 1,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
      textAlign: "center",
      color: ThemeColors.tertiary,
    },
    input: {
      marginTop: 10,
      borderWidth: 1,
      borderColor: ThemeColors.quaternary,
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
      color: ThemeColors.tertiary,
    },
    buttonText: {
      color: ThemeColors.tertiary,
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
    scrollContainer: {
      flex: 1,
      backgroundColor: ThemeColors.primary,
    },
  });

  return (
    <View style={styles.container}>
      {selectedGoal ? (
        <View>
          <Text style={styles.goalHeader}>
            {t("goal-header", {
              goal_name: selectedGoal.name,
              goal_amount: formatNumber(selectedGoal.number),
              goal_unit: selectedGoal.unit,
              goal_date: formatDate(selectedGoal?.end),
            })}
          </Text>

          <View style={styles.chartContainer}>
            {selectedGoal.data.length < 3 ? (
              <View style={styles.chartPlaceHolder}>
                <Text style={styles.boldText}>{t("not-enough-data")}</Text>
              </View>
            ) : (
              <CartesianChart
                data={selectedGoal.data}
                xKey="created"
                yKeys={["number"]}
                axisOptions={{
                  font,
                  formatXLabel,
                  formatYLabel,
                  tickCount: { y: 7, x: 2 },
                  lineColor: ThemeColors.quaternary,
                  labelColor: {
                    x: ThemeColors.tertiary,
                    y: ThemeColors.tertiary,
                  },
                }}
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
                        color={
                          lightOrDark(ThemeColors.primary) === "light"
                            ? "rgba(0, 0, 0, 0.9)"
                            : "rgba(255, 255, 255, 0.9)"
                        }
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
                            color={
                              lightOrDark(ThemeColors.primary) === "light"
                                ? "rgba(0, 0, 0, 0.9)"
                                : "rgba(255, 255, 255, 0.9)"
                            }
                          />
                          <Rect
                            x={SecondinitialXPosition?.value}
                            y={0}
                            width={
                              initialXPosition?.value -
                              SecondinitialXPosition?.value
                            }
                            height={CHART_HEIGHT}
                            color={
                              lightOrDark(ThemeColors.primary) === "light"
                                ? "rgba(0, 0, 0, 0.3)"
                                : "rgba(255, 255, 255, 0.3)"
                            }
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
                <Text style={styles.informationText}>
                  {t("you-have-selected-dates", {
                    start_date: formatDate(state.x?.value?.value),
                    end_date: formatDate(secondState.x?.value?.value),
                  })}
                </Text>
                <Text style={styles.informationText}>
                  {t("you-have-achieved-between", {
                    number: formatNumber(
                      calculateCombinedValueBetweenDates(
                        state.x?.value?.value,
                        secondState.x?.value?.value,
                        selectedGoal
                      )
                    ),
                    unit: selectedGoal.unit,
                  })}
                </Text>
              </>
            ) : null}
            {state.y?.number?.value?.value === 0 ? (
              <Text style={styles.informationText}>
                {t("no-data-selected")}
              </Text>
            ) : (
              <>
                {!secondIsActive && selectedGoal.data.length > 0 && (
                  <>
                    <Text style={styles.informationText}>
                      {t("you-have-selected-value", {
                        value: state.y?.number?.value?.value,
                        unit: selectedGoal.unit,
                        date: formatDate(state.x?.value?.value),
                      })}
                    </Text>
                    <Text style={styles.informationText}>
                      {t("note-information", {
                        note: getDataByDateAndValue(
                          state.x?.value?.value,
                          state.y?.number?.value?.value,
                          selectedGoal
                        )?.note,
                      })}
                    </Text>
                    <Text style={styles.informationText}>
                      {t("daily-recommendation-amount", {
                        number: formatNumber(
                          calculateRemainingData(selectedGoal)[0].toFixed(2)
                        ),
                        unit: selectedGoal.unit.toLowerCase(),
                      })}
                    </Text>
                    <Text style={styles.informationText}>
                      {t("goal-left", {
                        number: formatNumber(
                          calculateRemainingData(selectedGoal)[1]
                        ),
                        unit: selectedGoal.unit.toLowerCase(),
                      })}
                    </Text>
                  </>
                )}
              </>
            )}
          </View>
        </View>
      ) : (
        <Text style={styles.informationText}>{t("no-goal-selected")}</Text>
      )}
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder={t("choose-goal")}
        theme={lightOrDark(ThemeColors.primary).toUpperCase() || "DEFAULT"}
      />
      <Button
        height={50}
        width={"100%"}
        text={t("new-goal")}
        onPress={() => setIsModalVisible(true)}
      />
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
            <Text style={styles.modalTitle}>{t("new-goal")}</Text>
            <Text style={styles.informationText}>{t("goal-name")}</Text>
            <TextInput
              maxLength={100}
              style={styles.input}
              placeholder={t("goal-name-placeholder")}
              value={goalName}
              onChangeText={(text) => setGoalName(text)}
              placeholderTextColor={ThemeColors.tertiary}
            />
            <Text style={styles.informationText}>{t("goal-unit")}</Text>
            <TextInput
              placeholderTextColor={ThemeColors.tertiary}
              style={styles.input}
              placeholder={
                unit === "metric"
                  ? t("metric-unit-examples")
                  : t("imperial-unit-examples")
              }
              value={units}
              maxLength={10}
              onChangeText={(text) => setUnits(text)}
            />
            <Text style={styles.informationText}>
              {t("goal-target-amount")}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={t("goal-target-amount-placeholder")}
              value={targetAmount}
              onChangeText={(text) => setTargetAmount(text)}
              keyboardType="numeric"
              placeholderTextColor={ThemeColors.tertiary}
            />
            {/* <Pressable
              style={styles.button}
              onPress={() => setOpenDatePicker(true)}
            >
              <Text style={styles.buttonText}>Select Date</Text>
              <Text style={styles.buttonText}>{epochToDate(date)}</Text>
            </Pressable> */}
            <Button
              width={"100%"}
              text={t("select-date", { date: formatDate(date) })}
              onPress={() => setOpenDatePicker(true)}
            />
            {openDatePicker && (
              <DateTimePicker
                locale={locale.languageTag}
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
            <Button
              width={"100%"}
              text={t("new-goal")}
              onPress={handleCreateGoal}
            />
            <Button
              width={"100%"}
              isHighlighted={true}
              text={t("cancel")}
              onPress={() => {
                setIsModalVisible(false);
                setDate(new Date());
                setGoalName("");
                setUnits("");
                setTargetAmount("");
              }}
            />
          </View>
        </View>
        <Toast />
      </Modal>
      <Button
        width={"100%"}
        height={50}
        text={t("add-progress")}
        onPress={() => {
          setIsAdditionModalVisible(true);
        }}
      />
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
            <Text style={styles.modalTitle}>{t("add-progress-to-goal")}</Text>
            <Text style={styles.informationText}>{t("note")}</Text>
            <TextInput
              style={styles.input}
              placeholder={t("add-note-placeholder")}
              multiline
              numberOfLines={4}
              maxLength={250}
              value={additionNote}
              onChangeText={(val) => {
                setAdditionNote(val);
              }}
              placeholderTextColor={ThemeColors.tertiary}
            ></TextInput>
            <Text style={styles.informationText}>{t("amount")}</Text>
            <TextInput
              style={styles.input}
              placeholder={t("amount-placeholder")}
              value={additionTargetAmount}
              onChangeText={(val) => setAdditionTargetAmount(val)}
              keyboardType="numeric"
              placeholderTextColor={ThemeColors.tertiary}
            />
            <DropDownPicker
              mode="BADGE"
              multiple={true}
              min={1}
              max={5}
              open={openAdditionPicker}
              value={additionGoalsList}
              items={additionItems}
              setOpen={setOpenAdditionPicker}
              setValue={setadditionGoalsList}
              setItems={setAdditionItems}
              placeholder={t("goal-choice-placeholder")}
              theme={
                lightOrDark(ThemeColors.primary).toUpperCase() || "DEFAULT"
              }
            />
            <Button
              width={"100%"}
              text={t("add")}
              onPress={addAdditionalData}
            />
            <Button
              width={"100%"}
              isHighlighted={true}
              text={t("cancel")}
              onPress={() => {
                setIsAdditionModalVisible(false);
                setAdditionTargetAmount("");
                setAdditionNote("");
                setadditionGoalsList([]);
              }}
            />
          </View>
        </View>
        <Toast />
      </Modal>
    </View>
  );
};

export default GoalsPage;
