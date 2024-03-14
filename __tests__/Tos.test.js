import React from "react";
import renderer from "react-test-renderer";
import Tos from "../components/Tos";
import { ThemeProvider } from "../components/ThemeContext";
import { waitFor } from "@testing-library/react-native";
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
