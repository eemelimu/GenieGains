import React from "react";
import renderer, { act } from "react-test-renderer";
import { waitFor, fireEvent, render } from "@testing-library/react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider } from "../components/ThemeContext";
import { AuthProvider } from "../components/AuthContext";
import { NotificationProvider } from "../components/NotificationContext";
import Preferences2 from "../components/Preferences2";
import Login from "../components/Login";
import Notification from "../components/Notification";
import Toast, { ErrorToast } from "react-native-toast-message";

jest.useFakeTimers();

test("Preferences2 component renders correctly and that the theme context applies themes correctly", async () => {
  const Stack = createStackNavigator();
  let component;

  await act(async () => {
    component = renderer.create(
      <NavigationContainer>
        <NotificationProvider>
          <ThemeProvider>
            <AuthProvider>
              <Stack.Navigator>
                <Stack.Screen name="Preferences2" component={Preferences2} />
                <Stack.Screen name="Login" component={Login} />
              </Stack.Navigator>
              <Toast />
              <Notification />
            </AuthProvider>
          </ThemeProvider>
        </NotificationProvider>
      </NavigationContainer>
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
      <NavigationContainer>
        <NotificationProvider>
          <ThemeProvider>
            <AuthProvider>
              <Stack.Navigator>
                <Stack.Screen name="Preferences2" component={Preferences2} />
                <Stack.Screen name="Login" component={Login} />
              </Stack.Navigator>
              <Toast />
              <Notification />
            </AuthProvider>
          </ThemeProvider>
        </NotificationProvider>
      </NavigationContainer>
    );

  const registerButton = component.getByText("Register");
  fireEvent.press(registerButton);
});
