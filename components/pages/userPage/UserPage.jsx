import { View, ScrollView, Pressable, Text } from "react-native";
import { Button } from "@rneui/base";
import { useNavigation } from "@react-navigation/native";
import FastImage from "react-native-fast-image";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useState, useEffect, useContext } from "react";
import firestore from "@react-native-firebase/firestore";
import Blog from "@/components/blog/Blog";

import { AuthContext } from "@/components/context/AuthProvider";

const UserPage = ({ uid, userTabClick = false }) => {
    const { authUser, setAuthUser } = useContext(AuthContext);
    const myUserPage = uid === authUser.uid;
    const [userData, setUserData] = useState();
    const [userBlog, setUserBlog] = useState([]);
    const navigation = useNavigation();

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
            <View
                style={{ width: "100%", height: 30, position: "relative", paddingHorizontal: 12, flexDirection: "row", alignItems: "center", justifyContent: "center" }}
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
                        onPress={() => navigation.goBack()}
                    />
                )}
                <Text style={{ fontSize: 16, fontWeight: "bold" }}> {userData?.displayName}</Text>
            </View>

            <ScrollView style={{ padding: 12 }}>
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
                <View style={{ width: "100%", borderBottomWidth: 1, borderColor: "#ccc", paddingBottom: 20 }}>
                    {!myUserPage ? <Button radius={"md"}>Nhắn tin</Button> : <Button radius={"md"}>Sửa thông tin</Button>}
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
