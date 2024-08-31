import { View, ScrollView, Pressable, Text, Alert, TextInput, RefreshControl } from "react-native";
import { Button } from "@rneui/base";
import { useNavigation } from "@react-navigation/native";
import FastImage from "react-native-fast-image";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useState, useEffect, useContext, useCallback } from "react";
import firestore from "@react-native-firebase/firestore";
import Blog from "@/components/blog/Blog";
import Feather from "@expo/vector-icons/Feather";
import auth from "@react-native-firebase/auth";
import { useRouter } from "expo-router";

import { AuthContext } from "@/components/context/AuthProvider";

const UserPage = ({ uid, userTabClick = false }) => {
    const { authUser, setAuthUser } = useContext(AuthContext);
    const myUserPage = uid === authUser.uid;
    const [userData, setUserData] = useState();
    const [userBlog, setUserBlog] = useState([]);
    const navigation = useNavigation();
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        firestore()
            .collection("users")
            .doc(uid)
            .get()
            .then((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    const data = documentSnapshot.data();
                    setUserData(data);
                }
            });

        firestore()
            .collection("blogs")
            .where("author.uid", "==", uid)
            .orderBy("createAt", "desc")
            .get()
            .then((querySnapshot) => {
                let blogTempArray = [];
                querySnapshot.forEach((documentSnapshot) => {
                    blogTempArray.push(documentSnapshot.id);
                });
                setUserBlog(blogTempArray);
            })
            .finally(() => setRefreshing(false));
    }, [uid]);

    const alertSignOut = () => {
        Alert.alert(
            "Đăng xuất", // Tiêu đề của alert
            "Bạn có muốn đăng xuất tài khoản ?",
            [
                {
                    text: "Hủy",
                    onPress: () => console.log("Hủy bỏ"),
                    style: "cancel",
                },
                {
                    text: "Đăng xuất",
                    style: "destructive",
                    onPress: () =>
                        auth()
                            .signOut()
                            .then(() => console.log("User signed out!")),
                },
            ],
            { cancelable: false }
        );
    };

    useEffect(() => {
        const subscriberUser = firestore()
            .collection("users")
            .doc(uid)

            .onSnapshot((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    const data = documentSnapshot.data();
                    setUserData(data);
                }
            });
        const subscriberBlog = firestore()
            .collection("blogs")
            .where("author.uid", "==", uid)
            .orderBy("createAt", "desc")
            .onSnapshot((querySnapshot) => {
                let blogTempArray = [];
                querySnapshot.forEach((documentSnapshot) => {
                    blogTempArray.push(documentSnapshot.id);
                });
                setUserBlog(blogTempArray);
            });
        return () => {
            subscriberUser();
            subscriberBlog();
            setUserData();
            setUserBlog([]);
        };
    }, [uid]);

    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <View style={{ paddingBottom: 30 }}>
            <View
                style={{
                    width: "100%",
                    height: 30,
                    position: "relative",
                    paddingHorizontal: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottomWidth: 1,
                    borderBottomColor: "#ccc",
                    paddingBottom: 8,
                }}
            >
                {!userTabClick && (
                    <Button
                        type="clear"
                        radius={"lg"}
                        iconPosition={"left"}
                        titleStyle={{ paddingLeft: 0 }}
                        buttonStyle={{ paddingLeft: 0, marginLeft: 0, justifyContent: "flex-start" }}
                        size="sm"
                        containerStyle={{
                            width: 50,
                            paddingLeft: 0,
                            position: "absolute",
                            left: 12,
                        }}
                        icon={<AntDesign name="arrowleft" size={24} color="black" />}
                        onPress={handleGoBack}
                    />
                )}
                <Text style={{ fontSize: 16, fontWeight: "bold" }}> {userData?.displayName}</Text>
            </View>

            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} style={{ padding: 12 }}>
                <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 20 }}>
                    <View style={{ width: "70%" }}>
                        <Text style={{ fontSize: 18, fontWeight: "bold" }}>{userData?.displayName}</Text>
                        <View style={{ width: "100%", backgroundColor: "gray", height: 30 }}></View>
                    </View>
                    <View style={{ width: "30%", alignItems: "flex-end" }}>
                        <FastImage
                            style={{ width: 64, height: 64, borderRadius: 9999 }}
                            source={{
                                uri: userData?.photoURL,
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                    </View>
                </View>
                <View style={{ width: "100%", borderBottomWidth: 1, borderColor: "#ccc", paddingBottom: 20, marginBottom: 20 }}>
                    {!myUserPage ? (
                        <Button radius={"md"}>Nhắn tin</Button>
                    ) : (
                        <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
                            <Button
                                onPress={() => router.push(`/userid/edit`)}
                                titleStyle={{ color: "#000" }}
                                buttonStyle={{ backgroundColor: "#C0C0C0FF" }}
                                containerStyle={{ width: "80%" }}
                                radius={"md"}
                            >
                                Sửa thông tin
                            </Button>
                            <Button onPress={alertSignOut} type="clear" buttonStyle={{ height: 40 }} containerStyle={{ width: "17%", height: 40 }} radius={"md"}>
                                <Feather name="log-out" size={24} color="red" />
                            </Button>
                        </View>
                    )}
                </View>

                <View style={{ width: "100%" }}>
                    {userBlog.map((item, index) => {
                        return <Blog blogId={item} key={index} authUser={authUser} inMyUserPage={userTabClick} />;
                    })}
                </View>
            </ScrollView>
        </View>
    );
};

export default UserPage;
