import React, { useState } from "react";
import Button from "../components/Button";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import useRequest from "../hooks/useRequest";
import CheckBox from "expo-checkbox";
import { ThemeColors } from "../assets/theme/ThemeColors";
import { BACKEND_URL } from "../assets/config";
import { useAuth } from "../contexts/AuthContext";
import { useLocalization } from "../contexts/LocalizationContext";

const Preferences = ({ route }) => {
  const { t } = useLocalization();
  const { fetcher } = useRequest();
  const { dispatch } = useAuth();
  const navigation = useNavigation();
  const [SelectedUnit, setSelectedUnit] = useState(null);

  console.log("data from register and preferences?", route.params);

  const registerUser = async () => {
    const res = await fetcher({
      url: BACKEND_URL + "register",
      reqMethod: "POST",
      object: {
        username: route?.params?.data?.username,
        password: route?.params?.data?.password,
        confirmPassword: route?.params?.data?.confirmPassword,
        email: route?.params?.data?.email,
        unit: SelectedUnit?.toLowerCase(),
        experience: route?.params?.data?.selectedSkill?.toLowerCase(),
      },
      errorMessage: t("something-went-wrong"),
      showLoading: true,
    });
    if (res) {
      dispatch({ type: "LOGIN", payload: { token: res.token } });
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.preferenceText}>{t("measurement-unit-hint")}</Text>
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={styles.checkboxItem}
          onPress={() => setSelectedUnit("Metric")}
        >
          <CheckBox
            style={styles.checkbox}
            value={SelectedUnit === "Metric"}
            onValueChange={() => setSelectedUnit("Metric")}
            color={SelectedUnit === "Metric" ? "orange" : ThemeColors.tertiary}
          />
          <View>
            <Text style={styles.skills}>{t("metric")}</Text>
            <Text style={[styles.skills, { fontSize: 15, paddingTop: 10 }]}>
              {t("metric-example")}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.checkboxItem}
          onPress={() => setSelectedUnit("Imperial")}
        >
          <CheckBox
            style={styles.checkbox}
            value={SelectedUnit === "Imperial"}
            onValueChange={() => setSelectedUnit("Imperial")}
            color={
              SelectedUnit === "Imperial" ? "orange" : ThemeColors.tertiary
            }
          />
          <View>
            <Text style={styles.skills}>{t("imperial")}</Text>
            <Text style={[styles.skills, { fontSize: 15, paddingTop: 10 }]}>
              {t("imperial-example")}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.nextButton}>
        <Button
          textSize={20}
          width={120}
          height={50}
          text={t("back")}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <View style={{ paddingLeft: 10 }}>
          <Button
            textSize={20}
            width={120}
            height={50}
            text={t("register")}
            onPress={() => {
              registerUser();
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  nextButton: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: ThemeColors.primary,
    alignItems: "center",
  },
  checkboxContainer: {
    flexDirection: "column",
    marginTop: 80,
    marginBottom: 20,
  },
  checkboxItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 70,
    color: ThemeColors.tertiary,
  },
  checkbox: {
    alignSelf: "center",
    width: 30,
    height: 30,
    position: "absolute",
    top: 5,
    left: 0,
  },
  preferenceText: {
    paddingTop: 50,
    fontSize: 25,
    marginBottom: 40,
    color: ThemeColors.tertiary,
    textAlign: "center",
  },
  skills: {
    fontSize: 20,
    fontFamily: "DMRegular",
    paddingLeft: 40,
    color: ThemeColors.tertiary,
  },
  NextBtnText: {
    backgroundColor: ThemeColors.secondary,
    color: ThemeColors.tertiary,
    fontSize: 30,
    padding: 10,
    borderRadius: 25,
    textShadowColor: ThemeColors.quaternary,
    fontFamily: "DMBold",
  },
});

export default Preferences;
