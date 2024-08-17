import { View, StyleSheet } from "react-native";
import GoogleSignIn from "@/components/auth/GoogleSignIn";
const LoginPage = () => {
    return (
        <View style={styles.main}>
            <GoogleSignIn />
        </View>
    );
};

export default LoginPage;
const styles = StyleSheet.create({
    main: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
});
