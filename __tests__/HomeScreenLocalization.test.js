import React from "react";
import renderer from "react-test-renderer";
import { act } from "react-dom/test-utils";
import HomeScreen from "../pages/HomeScreen";
import { SettingsProvider } from "../contexts/SettingsContext";
import { createStackNavigator } from "@react-navigation/stack";
import { ThemeProvider } from "../contexts/ThemeContext";
import { AuthProvider } from "../contexts/AuthContext";
import { toBe } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import Login from "../pages/Login";
import { NotificationProvider } from "../contexts/NotificationContext";
import { LocalizationProvider } from "../contexts/LocalizationContext";
import Notification from "../components/Notification";
import Toast, { ErrorToast } from "react-native-toast-message";
import * as Localization from "expo-localization";

jest.useFakeTimers();

test("Homescreen localization works in Finnish", async () => {
  jest
    .spyOn(Localization, "getLocales")
    .mockReturnValue([{ languageTag: "fi-FI" }]);

  const Stack = createStackNavigator();
  let component;
  await act(async () => {
    component = renderer.create(
      <NavigationContainer>
        <NotificationProvider>
          <SettingsProvider>
            <ThemeProvider>
              <AuthProvider>
                <LocalizationProvider>
                  <Stack.Navigator>
                    <Stack.Screen name="Home" component={HomeScreen} />
                  </Stack.Navigator>
                  <Notification />
                </LocalizationProvider>
              </AuthProvider>
            </ThemeProvider>
            <Toast />
          </SettingsProvider>
        </NotificationProvider>
      </NavigationContainer>
    );
  });
  const startWorkoutButton = component.root.findByProps({
    testID: "start-workout",
  });
  const startButtonText = startWorkoutButton.props.text;
  expect(startButtonText).toEqual("Aloita treeni");
  expect(startButtonText).not.toEqual("Start Workout");
  expect(startButtonText).not.toEqual("ワークアウトを開始");

  const progressButton = component.root.findByProps({ testID: "progress" });
  const progressButtonText = progressButton.props.text;
  expect(progressButtonText).toEqual("Edistyminen");
  expect(progressButtonText).not.toEqual("Progress");
  expect(progressButtonText).not.toEqual("進捗");

  const routinesButton = component.root.findByProps({ testID: "routines" });
  const routinesButtonText = routinesButton.props.text;
  expect(routinesButtonText).toEqual("Rutiinit");
  expect(routinesButtonText).not.toEqual("Routines");
  expect(routinesButtonText).not.toEqual("ルーティン");

  jest.restoreAllMocks();
});

test("Homescreen localization works in English", async () => {
  jest
    .spyOn(Localization, "getLocales")
    .mockReturnValue([{ languageTag: "en-EN" }]);

  const Stack = createStackNavigator();
  let component;
  await act(async () => {
    component = renderer.create(
      <NavigationContainer>
        <NotificationProvider>
          <SettingsProvider>
            <ThemeProvider>
              <AuthProvider>
                <LocalizationProvider>
                  <Stack.Navigator>
                    <Stack.Screen name="Home" component={HomeScreen} />
                  </Stack.Navigator>
                  <Notification />
                </LocalizationProvider>
              </AuthProvider>
            </ThemeProvider>
            <Toast />
          </SettingsProvider>
        </NotificationProvider>
      </NavigationContainer>
    );
  });

  const startWorkoutButton = component.root.findByProps({
    testID: "start-workout",
  });
  const startButtonText = startWorkoutButton.props.text;
  expect(startButtonText).toEqual("Start Workout");
  expect(startButtonText).not.toEqual("Aloita treeni");
  expect(startButtonText).not.toEqual("ワークアウトを開始");

  const progressButton = component.root.findByProps({ testID: "progress" });
  const progressButtonText = progressButton.props.text;
  expect(progressButtonText).toEqual("Progress");
  expect(progressButtonText).not.toEqual("Edistyminen");
  expect(progressButtonText).not.toEqual("進捗");

  const routinesButton = component.root.findByProps({ testID: "routines" });
  const routinesButtonText = routinesButton.props.text;
  expect(routinesButtonText).toEqual("Routines");
  expect(routinesButtonText).not.toEqual("Rutiinit");
  expect(routinesButtonText).not.toEqual("ルーティン");

  jest.restoreAllMocks();
});

test("Homescreen localization works in Japanese", async () => {
  jest
    .spyOn(Localization, "getLocales")
    .mockReturnValue([{ languageTag: "ja-JA" }]);

  const Stack = createStackNavigator();
  let component;
  await act(async () => {
    component = renderer.create(
      <NavigationContainer>
        <NotificationProvider>
          <SettingsProvider>
            <ThemeProvider>
              <AuthProvider>
                <LocalizationProvider>
                  <Stack.Navigator>
                    <Stack.Screen name="Home" component={HomeScreen} />
                  </Stack.Navigator>
                  <Notification />
                </LocalizationProvider>
              </AuthProvider>
            </ThemeProvider>
            <Toast />
          </SettingsProvider>
        </NotificationProvider>
      </NavigationContainer>
    );
  });

  const startWorkoutButton = component.root.findByProps({
    testID: "start-workout",
  });
  const startButtonText = startWorkoutButton.props.text;
  expect(startButtonText).toEqual("ワークアウトを開始");
  expect(startButtonText).not.toEqual("Start Workout");
  expect(startButtonText).not.toEqual("Aloita treeni");

  const progressButton = component.root.findByProps({ testID: "progress" });
  const progressButtonText = progressButton.props.text;
  expect(progressButtonText).toEqual("進捗");
  expect(progressButtonText).not.toEqual("Progress");
  expect(progressButtonText).not.toEqual("Edistyminen");

  const routinesButton = component.root.findByProps({ testID: "routines" });
  const routinesButtonText = routinesButton.props.text;
  expect(routinesButtonText).toEqual("ルーティン");
  expect(routinesButtonText).not.toEqual("Routines");
  expect(routinesButtonText).not.toEqual("Rutiinit");

  jest.restoreAllMocks();
});
