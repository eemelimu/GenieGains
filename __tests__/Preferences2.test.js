import React from "react";
import renderer from "react-test-renderer";
import { act } from "react-dom/test-utils";
import Preferences2 from "../components/Preferences2";
import { createStackNavigator } from "@react-navigation/stack";
import { ThemeProvider } from "../components/ThemeContext";
import { AuthProvider } from "../components/AuthContext";
import { waitFor, render, fireEvent } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import Login from "../components/Login";
import { useNavigation } from "@react-navigation/native";
import { NotificationProvider } from "../components/NotificationContext";
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
        <ThemeProvider> <AuthProvider>
            
              <Stack.Navigator>
                <Stack.Screen name="Preferences2" component={Preferences2} />
                <Stack.Screen name="Login" component={Login} />
              </Stack.Navigator>
              <Notification />
            
          </AuthProvider></ThemeProvider>

          <Toast />
        </NotificationProvider>
      </NavigationContainer>
    );
  });

  await waitFor(() => {
    act(() => {
      let tree;
      tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});

test("Next button can be pressed and works as expected", async () => {
  const Stack = createStackNavigator();
  let component;
  component = render(
    <NavigationContainer>
      <NotificationProvider>
      <ThemeProvider><AuthProvider>
          
            <Stack.Navigator>
              <Stack.Screen name="Preferences2" component={Preferences2} />
              <Stack.Screen name="Login" component={Login} />
            </Stack.Navigator>
            <Notification />
            <Toast />
          
        </AuthProvider></ThemeProvider>
      </NotificationProvider>
    </NavigationContainer>
  );

  await waitFor(() => {
    const nextButton = component.getByText("Next");
    fireEvent.press(nextButton);
  });
});
