import React from "react";
import renderer from "react-test-renderer";
import { act } from "react-dom/test-utils";
import Preferences from "../components/Preferences";
import { createStackNavigator } from "@react-navigation/stack";
import { ThemeProvider } from "../components/ThemeContext";
import { AuthProvider } from "../components/AuthContext";
import { waitFor } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import Login from "../components/Login";

jest.useFakeTimers();

test("Preferences component renders correctly and that the theme context applies themes correctly", async () => {
  const Stack = createStackNavigator();
  let component;

  await act(async () => {
    component = renderer.create(
      <NavigationContainer>
        <AuthProvider>
          <ThemeProvider>
            <Stack.Navigator>
              <Stack.Screen name="Preferences" component={Preferences} />
              <Stack.Screen name="Login" component={Login} />
            </Stack.Navigator>
          </ThemeProvider>
        </AuthProvider>
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
