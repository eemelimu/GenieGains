import React from "react";
import renderer from "react-test-renderer";
import { act } from "react-dom/test-utils";
import AccountSettings from "../components/AccountSettings";
import { createStackNavigator } from "@react-navigation/stack";
import { ThemeProvider } from "../components/ThemeContext";
import { AuthProvider } from "../components/AuthContext";
import { SettingsProvider } from "../components/SettingsContext";
import { waitFor } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import Login from "../components/Login";
import { NotificationProvider } from "../components/NotificationContext";
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

  await waitFor(async () => {
    let tree;
    act(() => {
      tree = component.toJSON();
    });
    await expect(tree).toMatchSnapshot();
  });
});
