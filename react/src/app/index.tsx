import { View } from "react-native";
import ButtonRecord from "../components/button-record";
import { useEffect, useState } from "react";
import { Audio } from "expo-av";
import { Recording } from "expo-av/build/Audio";
import * as FileSystem from "expo-file-system";
import React from "react";
import StatusServer from "../components/status-server";

export default function Index() {
    const [statusServer, setStatusServer] = useState<string>("");
    const [buttonState, setButtonState] = useState<boolean | null>(null);

    const reciveState = (arg: boolean) => {
        setButtonState(arg);
    };

    const [recording, setRecording] = useState<Recording | null>(null);

    const ws = new WebSocket("ws://192.168.15.232:8080/audio");

    ws.onopen = () => {
        setStatusServer("Online");
    };

    ws.onmessage = async (e) => {
        var base64audio = "data:audio/m4a;base64," + e.data;

        const { sound } = await Audio.Sound.createAsync({ uri: base64audio });

        await sound.playAsync();
    };

    ws.onerror = (e) => {
        setStatusServer("Offline");
    };

    async function startRecording() {
        try {
            // Asks for permission
            const { status } = await Audio.requestPermissionsAsync();
            if (status !== "granted") {
                alert("Permissão para acessar o microfone é necessária.");
                return;
            }

            // Set audio mode
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            // Start recording
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY,
            );

            setRecording(recording);

            console.log("Gravação iniciada");
        } catch (err) {
            console.error("Erro ao iniciar gravação:", err);
        }
    }

    async function stopRecording() {
        try {
            if (!recording) return;

            console.log("Parando gravação...");
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setRecording(null);
            console.log("Gravação salva em:", uri);

            if (uri) {
                const audioBase64 = await FileSystem.readAsStringAsync(uri, {
                    encoding: FileSystem.EncodingType.Base64,
                });

                ws.send(audioBase64);
            }
        } catch (error) {
            console.error("Erro ao parar gravação:", error);
        }
    }

    useEffect(() => {
        if (buttonState === true) {
            startRecording();
            console.log("Gravação iniciada");
        } else if (buttonState === false) {
            stopRecording();
            console.log("Gravação finalizada");
        }
    }, [buttonState]);

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
            className="bg-black"
        >
            <StatusServer status={statusServer} />
            <ButtonRecord buttonState={reciveState} />
        </View>
    );
}
