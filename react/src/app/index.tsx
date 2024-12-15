import { View } from "react-native";
import ButtonRecord from "../components/button-record";
import { useEffect, useState } from "react";
import { Audio } from "expo-av";
import { Recording } from "expo-av/build/Audio";
import * as FileSystem from "expo-file-system";

export default function Index() {
    const [buttonState, setButtonState] = useState<boolean | null>(null);

    const reciveState = (arg: boolean) => {
        setButtonState(arg);
    };

    const [recording, setRecording] = useState<Recording | null>(null);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [audioUri, setAudioUri] = useState<string | null>("");

    const ws = new WebSocket("ws://192.168.18.122:8080/audio");

    ws.onerror = (e) => {
        console.log(e);
    };

    async function startRecording() {
        try {
            // Solicitar permissão
            const { status } = await Audio.requestPermissionsAsync();
            if (status !== "granted") {
                alert("Permissão para acessar o microfone é necessária.");
                return;
            }

            // Configurar o áudio
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            // Iniciar gravação
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
            setAudioUri(uri);
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
            <ButtonRecord buttonState={reciveState} />
        </View>
    );
}
