import React from "react";
import renderer from "react-test-renderer";
import AccountSettings from "../components/AccountSettings";
import { ThemeProvider } from "../components/ThemeContext";
import { AuthProvider } from "../components/AuthContext";
import { waitFor } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";

test("Account settings component renders correctly", async () => {
  // Render the component
  const component = renderer.create(
    <NavigationContainer>
      <AuthProvider>
        <ThemeProvider>
          <AccountSettings />
        </ThemeProvider>
      </AuthProvider>
    </NavigationContainer>
  );
  await waitFor(() => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
