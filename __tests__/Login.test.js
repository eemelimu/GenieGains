import React from "react";
import renderer from "react-test-renderer";
import { act } from "react-dom/test-utils";
import { createStackNavigator } from "@react-navigation/stack";
import { ThemeProvider } from "../contexts/ThemeContext";
import { AuthProvider } from "../contexts/AuthContext";
import { waitFor } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import Login from "../pages/Login";
import { NotificationProvider } from "../contexts/NotificationContext";
import Notification from "../components/Notification";
import Toast, { ErrorToast } from "react-native-toast-message";
import FontHandler from "../handlers/FontHandler";

jest.useFakeTimers();

test("Login renders correctly and that the theme context applies themes correctly", async () => {
  const Stack = createStackNavigator();
  let component;

  await act(async () => {
    component = renderer.create(
      <FontHandler>
        <NavigationContainer>
          <NotificationProvider>
            <ThemeProvider>
              <AuthProvider>
                <Stack.Navigator>
                  <Stack.Screen name="Login" component={Login} />
                </Stack.Navigator>
                <Notification />
              </AuthProvider>
            </ThemeProvider>
            <Toast />
          </NotificationProvider>
        </NavigationContainer>
      </FontHandler>
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
