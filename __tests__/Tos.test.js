import React from "react";
import renderer from "react-test-renderer";
import Tos from "../components/Tos";
import { ThemeProvider } from "../components/ThemeContext";
import { waitFor } from "@testing-library/react-native";
import {act} from "@testing-library/react-native";

test("Tos component renders correctly", async () => {
  let component = null;
  await act(async () => {
    component = renderer.create(
      <ThemeProvider>
        <Tos />
      </ThemeProvider>
    );
  });
  await waitFor(() => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
