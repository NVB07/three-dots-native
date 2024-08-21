import { View, ScrollView, Pressable, Text } from "react-native";
import FastImage from "react-native-fast-image";

const UserPage = ({ uid }) => {
    console.log(uid);

    return (
        <View>
            <ScrollView>
                <View>
                    <Text>{uid}</Text>
                </View>

                {/* {blogs.map((blogId, index) => {
                    return <Blog blogId={blogId} key={index} authUser={authUser} />;
                })} */}
            </ScrollView>
        </View>
    );
};

export default UserPage;
