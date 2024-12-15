import React, { useEffect, useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

export default function ButtonRecord({
    buttonState,
}: {
    buttonState: (arg: boolean) => void;
}) {
    const [pressed, setPressed] = useState<boolean>(false);

    const handlePress = () => {
        setPressed(!pressed);
        buttonState(!pressed);
    };

    return (
        <View>
            <Pressable
                onPress={handlePress}
                className="bg-white w-64 h-64 rounded-lg z-10"
                style={{ bottom: pressed ? -20 : 0 }}
            ></Pressable>
            <View
                style={{ bottom: -20 }}
                className="bg-slate-400 w-64 h-20 rounded-lg absolute z-0"
            ></View>
        </View>
    );
}
