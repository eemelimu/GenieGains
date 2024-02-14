import { useCallback } from "react"; 
import { Stack } from "expo-router" ;
import {useFonts} from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

const LoadFonts = () => { const [fontsLoaded] = useFonts({ DMBold: require("../assets/fonts/DMSans-Bold.ttf"), });

const onLoad = useCallback(async() => { if (fontsLoaded) { await SplashScreen.hideAsync(); } }, 

[fontsLoaded]); if (!fontsLoaded) { return null; } 
return <Stack OnLoadFonts={onLoad} />; } 


export default LoadFonts;