import React from "react";
import { View, ImageBackground, Text, Pressable, TextInput, Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import { Button } from "@rneui/themed";
import ActionSheet, { ScrollView, useSheetPayload, SheetManager } from "react-native-actions-sheet";
import FastImage from "react-native-fast-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import CountReact from "./CountReact";
import { useEffect, useState } from "react";

import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

const CommentItem = ({ comment }) => {
    console.log(comment);
    const handleConvertDate = (timestamp) => {
        if (timestamp) {
            const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);

            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const hours = date.getHours();
            const minutes = date.getMinutes();

            const time = `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes} | ${day < 10 ? "0" + day : day}/${
                month < 10 ? "0" + month : month
            }/${year}`;

            return time;
        }
        return "00:00";
    };
    return (
        <View style={{ marginVertical: 8 }}>
            <View style={{ flexDirection: "row" }}>
                <View style={{ height: "100%" }}>
                    <FastImage
                        style={{ width: 36, height: 36, borderRadius: 9999 }}
                        source={{
                            uri: comment.photoURL,
                            priority: FastImage.priority.low,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                </View>
                <View style={{ marginLeft: 4, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: "#f2f2f3", borderRadius: 15, width: "90%" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: "500" }}>{comment.displayName}</Text>
                            <Text style={{ fontSize: 13, color: "#999" }}>{handleConvertDate(comment?.sendTime)}</Text>
                        </View>
                        <View>
                            <Button type="clear" radius={9999} buttonStyle={{ width: 34, height: 34 }}>
                                <SimpleLineIcons name="options" size={14} color="black" />
                            </Button>
                        </View>
                    </View>
                    <Text>{comment.comment}</Text>
                </View>
            </View>
        </View>
    );
};

export default CommentItem;
