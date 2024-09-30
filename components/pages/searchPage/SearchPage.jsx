import { View, ScrollView, Text, TextInput } from "react-native";
import { Button } from "@rneui/base";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useState, useEffect, useContext } from "react";
import useDebounce from "@/hooks/useDebounce";
import firestore from "@react-native-firebase/firestore";
import SearchItem from "./SearchItem";
import FastImage from "react-native-fast-image";

import { AuthContext } from "@/components/context/AuthProvider";

const SearchPage = () => {
    const { authUser } = useContext(AuthContext);
    const [searchValue, setSearchValue] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const debouncedSearchTerm = useDebounce(searchValue, 500);

    const handleClearSearchInput = () => {
        setSearchValue("");
        setSearchResults([]);
    };
    const handleChangeInputText = (e) => {
        setSearchValue(e);
        if (e.trim() === "") setSearchResults([]);
    };

    const removeVietnameseTones = (str) => {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D");
    };

    useEffect(() => {
        if (debouncedSearchTerm) {
            const searchKeywords = debouncedSearchTerm.split(" ");
            const keywordsArray = [
                ...searchKeywords.map((keyword) => keyword.toUpperCase()), // Từ khóa có dấu
                ...searchKeywords.map((keyword) => removeVietnameseTones(keyword).toUpperCase()), // Từ khóa không dấu
            ];

            firestore()
                .collection("blogs")
                // Filter results
                .where("post.searchKeywords", "array-contains-any", keywordsArray)
                .get()
                .then((querySnapshot) => {
                    const results = [];
                    querySnapshot.forEach((doc) => {
                        const data = { id: doc.id, ...doc.data() };
                        results.push(data);
                    });
                    setSearchResults(results);
                });
        }
    }, [debouncedSearchTerm]);
    return (
        <View style={{ flex: 1 }}>
            <View
                style={{
                    width: "100%",
                    height: 40,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottomWidth: 1,
                    borderBottomColor: "#ccc",
                }}
            >
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Tìm kiếm</Text>
            </View>
            <View style={{ paddingHorizontal: 8, marginTop: 8, paddingBottom: 8 }}>
                <View style={{ borderWidth: 1, borderColor: "#ccc", padding: 6, flexDirection: "row", borderRadius: 9999, alignItems: "center" }}>
                    <TextInput
                        autoFocus
                        onChangeText={handleChangeInputText}
                        value={searchValue}
                        style={{ flex: 1, fontSize: 16, paddingLeft: 4 }}
                        placeholder="Tìm kiếm..."
                    />
                    {searchValue && (
                        <Button onPress={handleClearSearchInput} type="clear" buttonStyle={{ padding: 0, paddingHorizontal: 4, paddingVertical: 2 }} radius={9999}>
                            <AntDesign name="close" size={18} color="black" />
                        </Button>
                    )}
                </View>
            </View>
            {searchResults.length !== 0 ? (
                <ScrollView style={{ paddingHorizontal: 8 }}>
                    {searchResults.map((result, index) => {
                        return <SearchItem data={result} key={index} authUser={authUser} />;
                    })}
                </ScrollView>
            ) : (
                <View style={{ flex: 1, alignItems: "center", marginTop: 20 }}>
                    <FastImage
                        style={{ width: 300, height: 300, borderRadius: 9999, marginRight: 6 }}
                        source={{
                            uri: "https://firebasestorage.googleapis.com/v0/b/social-chat-d2b4e.appspot.com/o/appLogo%2Fpending.GIF?alt=media&token=f643806b-d308-4c32-b502-59754de499ad",
                            priority: FastImage.priority.high,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                </View>
            )}
        </View>
    );
};

export default SearchPage;
