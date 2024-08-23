import { View, StyleSheet, Image, Text, ImageBackground } from "react-native";
import FastImage from "react-native-fast-image";
import GoogleSignIn from "@/components/auth/GoogleSignIn";
const LoginPage = () => {
    return (
        <ImageBackground source={require("@/assets/images/bg-login.jpg")} style={{ width: "100%", flex: 1 }}>
            <View style={styles.main}>
                <View
                    style={{
                        width: "80%",
                        borderRadius: 20,
                        backgroundColor: "rgba(255,255,255,0.7)",
                        borderWidth: 1,
                        borderColor: "#000",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 40,
                    }}
                >
                    <Image style={{}} source={require("@/assets/images/logo128.png")} />
                    <Text style={{ fontSize: 28, fontWeight: "bold", marginTop: 10 }}>Đăng nhập</Text>
                    <Text style={{ fontSize: 32, fontWeight: "bold", color: "#0d9b00", marginBottom: 50 }}>Three Dots</Text>
                    <GoogleSignIn />
                </View>
            </View>
        </ImageBackground>
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
