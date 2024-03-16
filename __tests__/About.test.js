import React from "react";
import renderer from "react-test-renderer";
import About from "../pages/About";
import { ThemeProvider } from "../contexts/ThemeContext";
import { act, waitFor } from "@testing-library/react-native";

jest.useFakeTimers();

test("About component renders correctly", async () => {
  let component = null;
  act(() => {
    component = renderer.create(
      <ThemeProvider>
        <About />
      </ThemeProvider>
    );
  });
  waitFor(() => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
}, 20000);
