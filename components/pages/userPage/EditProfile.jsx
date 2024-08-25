import { Button, BottomSheet } from "@rneui/base";
import { useState } from "react";
import { View, TextInput, Text, Link, ScrollView } from "react-native";
const EditProfile = ({ authUser, setAuthUser }) => {
    const [isVisible, setIsVisible] = useState(false);
    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Edit</Text>
            </ScrollView>
        </View>
    );
};

export default EditProfile;
