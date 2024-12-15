import { Stack } from "expo-router";
import "@/src/style/global.css";
import React from "react";
import { StatusBar } from "react-native";

export default function RootLayout() {
    return (
        <>
            <StatusBar backgroundColor="transparent" translucent={true} />
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            />
        </>
    );
}
