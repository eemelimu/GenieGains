import React from "react";
import renderer from "react-test-renderer";
import { act } from "react-dom/test-utils";
import HomeScreen from "../pages/HomeScreen";
import { SettingsProvider } from "../contexts/SettingsContext";
import { createStackNavigator } from "@react-navigation/stack";
import { ThemeProvider } from "../contexts/ThemeContext";
import { AuthProvider } from "../contexts/AuthContext";
import { waitFor } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import Login from "../pages/Login";
import { NotificationProvider } from "../contexts/NotificationContext";
import { LocalizationProvider } from "../contexts/LocalizationContext";
import Notification from "../components/Notification";
import Toast, { ErrorToast } from "react-native-toast-message";
import * as Localization from "expo-localization";

jest.useFakeTimers();

test("Home screen component renders correctly and that the theme context applies themes correctly", async () => {
  jest
    .spyOn(Localization, "getLocales")
    .mockReturnValue([{languageTag:"en-US"}, {languageTag:"fi-FI"}, {languageTag:"ja-JA"}]);

  const Stack = createStackNavigator();
  let component;
  component = renderer.create(
    <NavigationContainer>
      <NotificationProvider>
        <SettingsProvider>
          <ThemeProvider>
            <AuthProvider>
              <LocalizationProvider>
                <Stack.Navigator>
                  <Stack.Screen name="Home" component={HomeScreen} />
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

  let tree;
  await act(async () => {
    jest.runAllTimers();
    tree = component.toJSON();
  });

  expect(tree).toMatchSnapshot();

  jest.restoreAllMocks();
});
