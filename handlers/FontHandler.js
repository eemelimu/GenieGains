import { useFonts } from "expo-font";

const FontHandler = ({ children }) => {
  let [fontsLoaded] = useFonts({
    DMBold: require("../assets/fonts/DMSans-Bold.ttf"),
    DMRegular: require("../assets/fonts/DMSans-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return children;
};

export default FontHandler;
