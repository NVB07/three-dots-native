import { View, StyleSheet, Image, Text, ImageBackground, Animated, Easing } from "react-native";
import { useEffect, useRef } from "react";
import { Button } from "@rneui/base";
const Loading = () => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    useEffect(() => {
        const startAnimation = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scaleAnim, {
                        toValue: 1.15, // Phóng to lên 1.2 lần
                        duration: 500, // Thời gian thực hiện animation
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 1, // Thu nhỏ lại về kích thước ban đầu
                        duration: 500,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };

        startAnimation();
    }, [scaleAnim]);
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
                    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                        <Image style={styles.logo} source={require("@/assets/images/logo128.png")} />
                    </Animated.View>
                    <Text style={{ fontSize: 32, fontWeight: "bold", color: "#0d9b00", marginBottom: 50 }}>Three Dots</Text>
                    <Button loadingProps={{ size: 80, color: "#000" }} loading type="clear" />
                    <Text style={{ fontSize: 24, fontWeight: "normal", marginTop: 10 }}>Đang xác thực...</Text>
                </View>
            </View>
        </ImageBackground>
    );
};

export default Loading;
const styles = StyleSheet.create({
    main: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
});
