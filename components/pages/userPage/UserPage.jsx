import { View, ScrollView, Pressable, Text, Alert, RefreshControl } from "react-native";
import { Button } from "@rneui/base";
import FastImage from "react-native-fast-image";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useState, useEffect, useContext, useCallback } from "react";
import firestore from "@react-native-firebase/firestore";
import Blog from "@/components/blog/Blog";
import Feather from "@expo/vector-icons/Feather";
import auth from "@react-native-firebase/auth";
import HeaderBack from "@/components/headerBack/HeaderBack";
import { useRouter } from "expo-router";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import SocialLink from "./SocialLink";

import { AuthContext } from "@/components/context/AuthProvider";

const UserPage = ({ uid, userTabClick = false }) => {
    const { authUser, setAuthUser } = useContext(AuthContext);
    const myUserPage = uid === authUser.uid;
    const [userData, setUserData] = useState();
    const [userBlog, setUserBlog] = useState([]);
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

    const signOut = async () => {
        try {
            await GoogleSignin.signOut();
            await auth().signOut();
            setAuthUser(null);
            console.log("signOut");
        } catch (e) {
            console.log(e);
        }
    };

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
                    onPress: async () => await signOut(),
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

    return (
        <View style={{ paddingBottom: 30 }}>
            <HeaderBack title={userData?.displayName} />
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} style={{ padding: 12 }}>
                <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 20 }}>
                    <View style={{ width: "70%" }}>
                        <Text style={{ fontSize: 18, fontWeight: "bold" }}>{userData?.displayName}</Text>
                        <View style={{ width: "100%", height: 30 }}>
                            <SocialLink userData={userData} />
                        </View>
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
                                type="outline"
                                onPress={() => router.push(`/userid/edit`)}
                                // titleStyle={{ color: "#000" }}
                                // buttonStyle={{ backgroundColor: "#C0C0C0FF" }}
                                containerStyle={{ width: "80%" }}
                                radius={"md"}
                            >
                                Sửa thông tin
                            </Button>
                            <Button onPress={alertSignOut} type="outline" buttonStyle={{ height: 40 }} containerStyle={{ width: "17%", height: 40 }} radius={"md"}>
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
                <View style={{ width: "100%", height: 20 }}></View>
            </ScrollView>
        </View>
    );
};

export default UserPage;
