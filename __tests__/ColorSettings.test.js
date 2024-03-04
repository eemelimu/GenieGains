import React from "react";
import renderer from "react-test-renderer";
import ColorSettings from "../components/ColorSettings";
import { waitFor, render, fireEvent } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import { getData } from "../assets/utils/utils";
import { ThemeProvider } from "../components/ThemeContext";
import { ThemeColors } from "../assets/ThemeColors";
jest.useFakeTimers();

test("Color settings component renders correctly", async () => {
  // Render the component
  const component = renderer.create(
    <NavigationContainer>
      <ThemeProvider>
        <ColorSettings />
      </ThemeProvider>
    </NavigationContainer>
  );
  await waitFor(() => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

test("Color resets correctly", async () => {
  const { getByText } = render(
    <NavigationContainer>
      <ThemeProvider>
        <ColorSettings />
      </ThemeProvider>
    </NavigationContainer>
  );
  await waitFor(async () => {
    fireEvent.press(getByText("Reset to default"));
    console.log(await getData("theme"));
    expect(await getData("theme")).toStrictEqual(ThemeColors);
  });
});
