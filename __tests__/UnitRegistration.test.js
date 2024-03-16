import React from "react";
import renderer, { act } from "react-test-renderer";
import { waitFor, fireEvent, render } from "@testing-library/react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider } from "../contexts/ThemeContext";
import { AuthProvider } from "../contexts/AuthContext";
import { NotificationProvider } from "../contexts/NotificationContext";
import UnitRegistration from "../pages/UnitRegistration";
import Login from "../pages/Login";
import Notification from "../components/Notification";
import FontHandler from "../handlers/FontHandler";
import Toast, { ErrorToast } from "react-native-toast-message";

jest.useFakeTimers();

test("Unit registration component renders correctly and that the theme context applies themes correctly", async () => {
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
                <Stack.Screen
                  name="Preferences2"
                  component={UnitRegistration}
                />
                <Stack.Screen name="Login" component={Login} />
              </Stack.Navigator>
              <Toast />
              <Notification />
            </AuthProvider>
          </ThemeProvider>
        </NotificationProvider>
      </NavigationContainer></FontHandler>
    );
  });

  await waitFor(() => {
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

test("Register button can be pressed and works as expected", async () => {
  const Stack = createStackNavigator();
  let component;

  component = render(
    <FontHandler>
    <NavigationContainer>
      <NotificationProvider>
        <ThemeProvider>
          <AuthProvider>
            <Stack.Navigator>
              <Stack.Screen name="Preferences2" component={UnitRegistration} />
              <Stack.Screen name="Login" component={Login} />
            </Stack.Navigator>
            <Toast />
            <Notification />
          </AuthProvider>
        </ThemeProvider>
      </NotificationProvider>
    </NavigationContainer></FontHandler>
  );

  const registerButton = component.getByText("Register");
  fireEvent.press(registerButton);
});
