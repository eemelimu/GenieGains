import React from "react";
import renderer from "react-test-renderer";
import Tos from "../pages/Tos";
import { ThemeProvider } from "../contexts/ThemeContext";
import { act } from "@testing-library/react-native";

jest.useFakeTimers();

test("Tos component renders correctly", async () => {
  let component = null;
  act(() => {
    component = renderer.create(
      <ThemeProvider>
        <Tos />
      </ThemeProvider>
    );
  });
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
}, 20000);
