import React from "react";
import renderer from "react-test-renderer";
import { act } from "react-dom/test-utils";
import Routines from "../components/Routines";
import { createStackNavigator } from "@react-navigation/stack";
import { ThemeProvider } from "../components/ThemeContext";
import { AuthProvider } from "../components/AuthContext";
import { waitFor } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import { NotificationProvider } from "../components/NotificationContext";
import Notification from "../components/Notification";
import Toast, { ErrorToast } from "react-native-toast-message";

jest.useFakeTimers();

test("Routine renders correctly and that the theme context applies themes correctly", async () => {
  const Stack = createStackNavigator();
  let component;
    act(() => {
    component = renderer.create(
      <NavigationContainer>
        <NotificationProvider>
          <ThemeProvider>
            <AuthProvider>
              <Stack.Navigator>
                <Stack.Screen name="Routines" component={Routines} />
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
    act(() => {
      tree = component.toJSON();
    });
    expect(tree).toMatchSnapshot();
  });
});
