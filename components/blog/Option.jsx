/* eslint-disable curly */
import React from "react";
import { StyleSheet } from "react-native";
import { SheetManager } from "react-native-actions-sheet";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { Button } from "@rneui/themed";

const Option = ({ isMyBlog }) => {
    return (
        <Button type="clear" onPress={() => SheetManager.show("SheetOption", { payload: isMyBlog })} radius={9999} style={styles.btn}>
            <SimpleLineIcons name="options" size={16} color="black" />
        </Button>
    );
};

export default Option;

const styles = StyleSheet.create({
    btn: {
        width: 32,
        height: 32,
    },
});
