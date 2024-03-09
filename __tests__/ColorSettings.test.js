import React from "react";
import renderer from "react-test-renderer";
import ColorSettings from "../components/ColorSettings";
import { waitFor, render, fireEvent } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import { getData } from "../assets/utils/utils";
import { ThemeProvider } from "../components/ThemeContext";
import { ThemeColors } from "../assets/ThemeColors";
import { NotificationProvider } from "../components/NotificationContext";
import Notification from "../components/Notification";
import Toast, { ErrorToast } from "react-native-toast-message";
import { createStackNavigator } from "@react-navigation/stack";
import { act } from "react-dom/test-utils";

jest.useFakeTimers();

test("Color settings component renders correctly", async () => {
  let component;
  await act(async () => {
    const Stack = createStackNavigator();
    // Render the component
    component = renderer.create(
      <NavigationContainer>
        <NotificationProvider>
          <ThemeProvider>
            <Stack.Screen name="Color Settings" component={ColorSettings} />
            <Notification />
          </ThemeProvider>
          <Toast />
        </NotificationProvider>
      </NavigationContainer>
    );
  });
  await waitFor(() => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

test("Color resets correctly", async () => {
  const { getByText } = render(
    <NavigationContainer>
      <NotificationProvider>
        <ThemeProvider>
          <ColorSettings />
          <Notification />
        </ThemeProvider>

        <Toast />
      </NotificationProvider>
    </NavigationContainer>
  );
  await waitFor(async () => {
    fireEvent.press(getByText("Reset to default"));
    console.log(await getData("theme"));
    expect(await getData("theme")).toStrictEqual(ThemeColors);
  });
});
