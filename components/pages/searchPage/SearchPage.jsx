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
    const [searchUserResults, setSearchUserResults] = useState([]);
    const [searchState, setSearchState] = useState("innit");
    const debouncedSearchTerm = useDebounce(searchValue, 500);

    const handleClearSearchInput = () => {
        setSearchValue("");
        setSearchResults([]);
        setSearchState("innit");
    };
    const handleChangeInputText = (e) => {
        setSearchValue(e);
        if (e.trim() === "") {
            setSearchResults([]);
            setSearchState("innit");
        }
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
            setSearchState("start");
            const searchKeywords = debouncedSearchTerm.split(" ");
            const keywordsArray = [
                ...searchKeywords.map((keyword) => keyword.toUpperCase()), // Từ khóa có dấu
                ...searchKeywords.map((keyword) => removeVietnameseTones(keyword).toUpperCase()), // Từ khóa không dấu
            ];

            setSearchResults([]);
            setSearchUserResults([]);

            const blogPromise = firestore().collection("blogs").where("post.searchKeywords", "array-contains-any", keywordsArray).get();

            const userPromise = firestore().collection("users").where("searchKeyWord", "array-contains-any", keywordsArray).get();

            Promise.all([blogPromise, userPromise])
                .then(([blogQuerySnapshot, userQuerySnapshot]) => {
                    let resultsBlog = [];
                    let resultsUser = [];

                    if (!blogQuerySnapshot.empty) {
                        blogQuerySnapshot.forEach((doc) => {
                            const data = { id: doc.id, ...doc.data() };
                            resultsBlog.push(data);
                        });
                        setSearchResults(resultsBlog);
                    }

                    if (!userQuerySnapshot.empty) {
                        userQuerySnapshot.forEach((doc) => {
                            const data = { id: doc.id, ...doc.data() };
                            resultsUser.push(data);
                        });
                        setSearchUserResults(resultsUser);
                    }

                    if (resultsBlog.length === 0 && resultsUser.length === 0) {
                        setSearchState("empty");
                    } else {
                        setSearchState("no-empty");
                    }
                })
                .catch((error) => {
                    console.error("Error fetching search results:", error);
                    setSearchState("error");
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
                        // autoFocus
                        onChangeText={handleChangeInputText}
                        value={searchValue}
                        style={{ flex: 1, fontSize: 16, paddingLeft: 4 }}
                        placeholder="Tìm kiếm..."
                    />
                    {searchValue && searchState !== "start" ? (
                        <Button onPress={handleClearSearchInput} type="clear" buttonStyle={{ padding: 0, paddingHorizontal: 4, paddingVertical: 2 }} radius={9999}>
                            <AntDesign name="close" size={18} color="black" />
                        </Button>
                    ) : (
                        searchValue &&
                        searchState === "start" && (
                            <Button type="clear" loading buttonStyle={{ padding: 0, paddingHorizontal: 4, paddingVertical: 2 }} radius={9999}></Button>
                        )
                    )}
                </View>
            </View>

            {searchState === "empty" && (
                <View style={{ width: "100%", justifyContent: "center" }}>
                    <Text style={{ textAlign: "center" }}>Hãy tìm với từ khóa khác !</Text>
                </View>
            )}

            {searchState === "no-empty" && (
                <ScrollView style={{ paddingHorizontal: 8 }}>
                    {searchResults.length > 0 && (
                        <View>
                            {searchResults.map((result, index) => {
                                return <SearchItem data={result} key={index} authUser={authUser} />;
                            })}
                        </View>
                    )}

                    {searchUserResults.length > 0 && (
                        <View>
                            {searchUserResults.map((result, index) => {
                                return <SearchItem key={index} authUser={authUser} userResults={result} />;
                            })}
                        </View>
                    )}
                </ScrollView>
            )}

            {searchState !== "no-empty" && (
                <View style={{ flex: 1, alignItems: "center", marginTop: 20 }}>
                    <FastImage
                        style={{
                            width: 300,
                            height: 300,
                            borderRadius: 9999,
                            marginRight: 6,
                            // elevation: 10,
                        }}
                        source={{
                            uri: "https://i.pinimg.com/originals/f5/27/0a/f5270acbc4b98112fcd520d2eea023de.gif",
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                </View>
            )}
        </View>
    );
};

export default SearchPage;
