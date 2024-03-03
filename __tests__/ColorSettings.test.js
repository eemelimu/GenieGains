import React from "react";
import renderer from "react-test-renderer";
import ColorSettings from "../components/ColorSettings";
import { ThemeProvider } from "../components/ThemeContext";
import { waitFor } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
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
