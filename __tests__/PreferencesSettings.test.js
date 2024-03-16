import React from "react";
import renderer from "react-test-renderer";
import { act } from "react-dom/test-utils";
import PreferencesSettings from "../pages/PreferencesSettings";
import { createStackNavigator } from "@react-navigation/stack";
import { ThemeProvider } from "../contexts/ThemeContext";
import { AuthProvider } from "../contexts/AuthContext";
import { waitFor } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import Login from "../pages/Login";
import { NotificationProvider } from "../contexts/NotificationContext";
import Notification from "../components/Notification";
import Toast, { ErrorToast } from "react-native-toast-message";

jest.useFakeTimers();

test("Preferences settings component renders correctly and that the theme context applies themes correctly", async () => {
  const Stack = createStackNavigator();
  let component;

  await act(async () => {
    component = renderer.create(
      <NavigationContainer>
        <NotificationProvider>
          <ThemeProvider>
            <AuthProvider>
              <Stack.Navigator>
                <Stack.Screen
                  name="Preferences Settings"
                  component={PreferencesSettings}
                />
                <Stack.Screen name="Login" component={Login} />
              </Stack.Navigator>
              <Notification />
            </AuthProvider>
          </ThemeProvider>
          <Toast />
        </NotificationProvider>
      </NavigationContainer>
    );
  });

  await waitFor(() => {
    let tree;
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
