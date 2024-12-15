import { Text, SafeAreaView } from "react-native";

export default function StatusServer({ status }: { status: string }) {
    let statusStyle;

    if (status === "Online") {
        statusStyle = { color: "green" };
    } else if (status === "Offline") {
        statusStyle = { color: "red" };
    } else {
        statusStyle = { color: "orange" };
    }

    return (
        <SafeAreaView className="absolute top-20 border-solid border-2 border-white py-5 px-10 rounded-full">
            <Text className="color-white text-center font-bold text-xl">
                Server Status:
                <Text style={statusStyle}> {status}</Text>
            </Text>
        </SafeAreaView>
    );
}
