import { useState } from "react";
import { Pressable, View, Image } from "react-native";

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
                className="bg-white w-64 h-64 rounded-lg z-10 justify-center items-center"
                style={{ bottom: pressed ? -20 : 0 }}
            >
                <Image source={require("@/assets/images/mic.png")} />
            </Pressable>
            <View
                style={{ bottom: -20 }}
                className="bg-slate-400 w-64 h-20 rounded-lg absolute z-0"
            ></View>
        </View>
    );
}
