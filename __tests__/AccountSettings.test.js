import React from "react";
import renderer from "react-test-renderer";
import { act } from "react-dom/test-utils";
import AccountSettings from "../pages/AccountSettings";
import { createStackNavigator } from "@react-navigation/stack";
import { ThemeProvider } from "../contexts/ThemeContext";
import { AuthProvider } from "../contexts/AuthContext";
import { SettingsProvider } from "../contexts/SettingsContext";
import { waitFor } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import Login from "../pages/Login";
import { NotificationProvider } from "../contexts/NotificationContext";
import Toast, { ErrorToast } from "react-native-toast-message";
import Notification from "../components/Notification";

jest.useFakeTimers();

test("Account settings component renders correctly and that the theme context applies themes correctly", async () => {
  const Stack = createStackNavigator();
  let component;

  await act(async () => {
    component = renderer.create(
      <NavigationContainer>
        <NotificationProvider>
          <SettingsProvider>
            <ThemeProvider>
              <AuthProvider>
                <Stack.Navigator>
                  <Stack.Screen
                    name="Account Settings"
                    component={AccountSettings}
                  />
                  <Stack.Screen name="Login" component={Login} />
                </Stack.Navigator>
                <Notification />
              </AuthProvider>
            </ThemeProvider>
            <Toast />
          </SettingsProvider>
        </NotificationProvider>
      </NavigationContainer>
    );
  });

  waitFor(async () => {
    let tree;
    act(() => {
      tree = component.toJSON();
    });
    expect(tree).toMatchSnapshot();
  });
});
