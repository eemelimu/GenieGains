import React from "react";
import renderer from "react-test-renderer";
import About from "../components/About";
import { ThemeProvider } from "../components/ThemeContext";
import { waitFor } from "@testing-library/react-native";

test("About component renders correctly", async () => {
  // Render the component
  const component = renderer.create(
    <ThemeProvider>
      <About />
    </ThemeProvider>
  );
  await waitFor(() => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
