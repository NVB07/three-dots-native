import { View, StyleSheet, Button } from "react-native";
import HomePage from "@/components/pages/homePage/HomePage";
export default function HomeScreen() {
    return (
        <View style={styles.main}>
            <HomePage />
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        paddingTop: 40,
        flex: 1,
    },
});
