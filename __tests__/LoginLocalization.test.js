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

test("Login localization works in Finnish", async () => {
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
                    <Stack.Screen name="Login" component={Login} />
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
  const loginButton = component.root.findByProps({
    testID: "login",
  });
  const registerButton = component.root.findByProps({
    testID: "register",
  });
  const loginButtonText = loginButton.props.text;
  expect(loginButtonText).toEqual("Kirjaudu sisään");
  expect(loginButtonText).not.toEqual("Login");
  expect(loginButtonText).not.toEqual("ログイン");

  const registerButtonText = registerButton.props.text;
  expect(registerButtonText).toEqual("Rekisteröidy");
  expect(registerButtonText).not.toEqual("Register");
  expect(registerButtonText).not.toEqual("登録");

  jest.restoreAllMocks();
});

test("Login localization works in English", async () => {
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
                    <Stack.Screen name="Login" component={Login} />
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
  const loginButton = component.root.findByProps({
    testID: "login",
  });
  const registerButton = component.root.findByProps({
    testID: "register",
  });
  const loginButtonText = loginButton.props.text;
  expect(loginButtonText).toEqual("Login");
  expect(loginButtonText).not.toEqual("Kirjaudu sisään");
  expect(loginButtonText).not.toEqual("ログイン");

  const registerButtonText = registerButton.props.text;
  expect(registerButtonText).toEqual("Register");
  expect(registerButtonText).not.toEqual("Rekisteröidy");
  expect(registerButtonText).not.toEqual("登録");

  jest.restoreAllMocks();
});

test("Login localization works in Japanese", async () => {
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
                    <Stack.Screen name="Login" component={Login} />
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
  const loginButton = component.root.findByProps({
    testID: "login",
  });
  const registerButton = component.root.findByProps({
    testID: "register",
  });
  const loginButtonText = loginButton.props.text;
  expect(loginButtonText).toEqual("ログイン");
  expect(loginButtonText).not.toEqual("Login");
  expect(loginButtonText).not.toEqual("Kirjaudu sisään");

  const registerButtonText = registerButton.props.text;
  expect(registerButtonText).toEqual("登録");
  expect(registerButtonText).not.toEqual("Register");
  expect(registerButtonText).not.toEqual("Rekisteröidy");

  jest.restoreAllMocks();
});
