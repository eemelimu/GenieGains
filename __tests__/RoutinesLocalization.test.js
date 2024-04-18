import React from "react";
import renderer from "react-test-renderer";
import { act } from "react-dom/test-utils";
import Routines from "../pages/Routines";
import { createStackNavigator } from "@react-navigation/stack";
import { ThemeProvider } from "../contexts/ThemeContext";
import { AuthProvider } from "../contexts/AuthContext";

import { NavigationContainer } from "@react-navigation/native";
import { NotificationProvider } from "../contexts/NotificationContext";
import { LocalizationProvider } from "../contexts/LocalizationContext";
import Notification from "../components/Notification";
import Toast, { ErrorToast } from "react-native-toast-message";
import * as Localization from "expo-localization";
import { Settings } from "react-native";
import { SettingsProvider } from "../contexts/SettingsContext";


jest.useFakeTimers();

test("Routines localization works in Finnish", async () => {
    jest
        .spyOn(Localization, "getLocales")
        .mockReturnValue([{ languageTag: "fi-FI" }]);
    
    const Stack = createStackNavigator();
    let component;
    await act(async () => {
        component = renderer.create(
            <NavigationContainer>
                <NotificationProvider>
                    <SettingsProvider>
                    <ThemeProvider>
                        <AuthProvider>
                            <LocalizationProvider>
                                <Stack.Navigator>
                                    <Stack.Screen name="Routines" component={Routines} />
                                </Stack.Navigator>
                                <Notification />
                            </LocalizationProvider>
                        </AuthProvider>
                    </ThemeProvider>
                    <Toast />
                    </SettingsProvider>
                </NotificationProvider>
            </NavigationContainer>
        );
    });
    const createRoutineButton = component.root.findByProps({
        testID: "create-routine",
    });
    const createRoutineButtonText = createRoutineButton.props.text;
    expect(createRoutineButtonText).toEqual("Luo rutiini");
    expect(createRoutineButtonText).not.toEqual("Create Routine");
    expect(createRoutineButtonText).not.toEqual("ルーチンを作成する");

    const noTrainingPlansText = component.root.findByProps({
        testID: "no-training-plans",
    });
    const noTrainingPlans = noTrainingPlansText.props.children;
    expect(noTrainingPlans).toEqual("Ei harjoitusohjelmia saatavilla");
    expect(noTrainingPlans).not.toEqual("No training plans");
    expect(noTrainingPlans).not.toEqual("トレーニングプランなし");

    const createRoutineHint = component.root.findByProps({
        testID: "create-routine-hint",
    });
    const createRoutineHintText = createRoutineHint.props.children;
    expect(createRoutineHintText).toEqual("Paina luo rutiini luodaksesi ensimmäisen rutiinisi!");
    expect(createRoutineHintText).not.toEqual("Create new training plan");
    expect(createRoutineHintText).not.toEqual("新しいトレーニングプランを作成する");

    const createMovementButton = component.root.findByProps({
        testID: "create-movement",
    });
    const createMovementButtonText = createMovementButton.props.text;
    expect(createMovementButtonText).toEqual("Luo liike");
    expect(createMovementButtonText).not.toEqual("Create Movement");
    expect(createMovementButtonText).not.toEqual("動きを作成する");


    // const startRoutineButton = component.root.findByProps({
    //     testID: "start",
    // });
    // const startRoutineButtonText = startRoutineButton.props.text;
    // expect(startRoutineButtonText).toEqual("Aloita");
    // expect(startRoutineButtonText).not.toEqual("Start Routine");
    // expect(startRoutineButtonText).not.toEqual("ルーチンを開始する");

    jest.restoreAllMocks();

    });

test("Routines localization works in English", async () => {

    jest
        .spyOn(Localization, "getLocales")
        .mockReturnValue([{ languageTag: "en-EN" }]);
    
    const Stack = createStackNavigator();
    let component;
    await act(async () => {
        component = renderer.create(
            <NavigationContainer>
                <NotificationProvider>
                    <SettingsProvider>
                    <ThemeProvider>
                        <AuthProvider>
                            <LocalizationProvider>
                                <Stack.Navigator>
                                    <Stack.Screen name="Routines" component={Routines} />
                                </Stack.Navigator>
                                <Notification />
                            </LocalizationProvider>
                        </AuthProvider>
                    </ThemeProvider>
                    <Toast />
                    </SettingsProvider>
                </NotificationProvider>
            </NavigationContainer>
        );
    });
    const createRoutineButton = component.root.findByProps({
        testID: "create-routine",
    });
    const createRoutineButtonText = createRoutineButton.props.text;
    expect(createRoutineButtonText).toEqual("Create Routine");
    expect(createRoutineButtonText).not.toEqual("Luo rutiini");
    expect(createRoutineButtonText).not.toEqual("ルーチンを作成する");

    const noTrainingPlansText = component.root.findByProps({
        testID: "no-training-plans",
    });
    const noTrainingPlans = noTrainingPlansText.props.children;
    expect(noTrainingPlans).toEqual("No training plans available");
    expect(noTrainingPlans).not.toEqual("Ei harjoitusohjelmia saatavilla");
    expect(noTrainingPlans).not.toEqual("トレーニングプランなし");

    const createRoutineHint = component.root.findByProps({
        testID: "create-routine-hint",
    });
    const createRoutineHintText = createRoutineHint.props.children;
    expect(createRoutineHintText).toEqual("Press create routine to create your first routine!");
    expect(createRoutineHintText).not.toEqual("Paina luo rutiini luodaksesi ensimmäisen rutiinisi!");
    expect(createRoutineHintText).not.toEqual("新しいトレーニングプランを作成する");

    const createMovementButton = component.root.findByProps({
        testID: "create-movement",
    });
    const createMovementButtonText = createMovementButton.props.text;
    expect(createMovementButtonText).toEqual("Create Movement");
    expect(createMovementButtonText).not.toEqual("Luo liike");
    expect(createMovementButtonText).not.toEqual("動きを作成する");

    jest.restoreAllMocks();

    });

test("Routines localization works in Japanese", async () => {
    
        jest
            .spyOn(Localization, "getLocales")
            .mockReturnValue([{ languageTag: "ja-JA" }]);
        
        const Stack = createStackNavigator();
        let component;
        await act(async () => {
            component = renderer.create(
                <NavigationContainer>
                    <NotificationProvider>
                        <SettingsProvider>
                        <ThemeProvider>
                            <AuthProvider>
                                <LocalizationProvider>
                                    <Stack.Navigator>
                                        <Stack.Screen name="Routines" component={Routines} />
                                    </Stack.Navigator>
                                    <Notification />
                                </LocalizationProvider>
                            </AuthProvider>
                        </ThemeProvider>
                        <Toast />
                        </SettingsProvider>
                    </NotificationProvider>
                </NavigationContainer>
            );
        });
        const createRoutineButton = component.root.findByProps({
            testID: "create-routine",
        });
        const createRoutineButtonText = createRoutineButton.props.text;
        expect(createRoutineButtonText).toEqual("ルーチンを作成");
        expect(createRoutineButtonText).not.toEqual("Create Routine");
        expect(createRoutineButtonText).not.toEqual("Luo rutiini");
    
        const noTrainingPlansText = component.root.findByProps({
            testID: "no-training-plans",
        });
        const noTrainingPlans = noTrainingPlansText.props.children;
        expect(noTrainingPlans).toEqual("利用可能なトレーニングプランはありません");
        expect(noTrainingPlans).not.toEqual("Ei harjoitusohjelmia saatavilla");
        expect(noTrainingPlans).not.toEqual("No training plans available");
    
        const createRoutineHint = component.root.findByProps({
            testID: "create-routine-hint",
        });
        const createRoutineHintText = createRoutineHint.props.children;
        expect(createRoutineHintText).toEqual("最初のルーチンを作成するには、ルーチンを作成するを押してください！");
        expect(createRoutineHintText).not.toEqual("Press create routine to create your first routine!");
        expect(createRoutineHintText).not.toEqual("Paina luo rutiini luodaksesi ensimmäisen rutiinisi!");
    
        const createMovementButton = component.root.findByProps({
            testID: "create-movement",
        });
        const createMovementButtonText = createMovementButton.props.text;
        expect(createMovementButtonText).toEqual("ムーブメントを作成");
        expect(createMovementButtonText).not.toEqual("Create Movement");
        expect(createMovementButtonText).not.toEqual("Luo liike");

        jest.restoreAllMocks();

    });