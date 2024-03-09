import React from "react";
import renderer from "react-test-renderer";
import { act } from "react-dom/test-utils";
import { createStackNavigator } from "@react-navigation/stack";
import { ThemeProvider } from "../components/ThemeContext";
import { AuthProvider } from "../components/AuthContext";
import { waitFor } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import Login from "../components/Login";
import { NotificationProvider } from "../components/NotificationContext";
import Notification from "../components/Notification";
import Toast, { ErrorToast } from "react-native-toast-message";
import CreateMovement from "../components/CreateMovement";

jest.useFakeTimers();

test("Create Movement component renders correctly", async () => {
  const Stack = createStackNavigator();
  let component;

  await act(async () => {
    component = renderer.create(
      <NavigationContainer>
        <NotificationProvider>
          <AuthProvider>
            <ThemeProvider>
              <Stack.Navigator>
                <Stack.Screen
                  name="Create Movement"
                  component={CreateMovement}
                />
                <Stack.Screen name="Login" component={Login} />
              </Stack.Navigator>
              <Notification />
            </ThemeProvider>
          </AuthProvider>

          <Toast />
        </NotificationProvider>
      </NavigationContainer>
    );
  });

  await waitFor(() => {
    let tree;
    act(() => {
      tree = component.toJSON();
    });
    expect(tree).toMatchSnapshot();
  });
});
