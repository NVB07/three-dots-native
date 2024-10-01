import ActionSheet, { useSheetPayload } from "react-native-actions-sheet";
import { View, Text, TextInput, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import useDebounce from "@/hooks/useDebounce";
import { Button } from "@rneui/base";
import AntDesign from "@expo/vector-icons/AntDesign";
import FastImage from "react-native-fast-image";
import SearchFriend from "./SearchFriend";

const SearchFriendSheet = () => {
    const data = useSheetPayload("SearchFriendSheet");

    const [searchValue, setSearchValue] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchState, setSearchState] = useState("innit");
    const debouncedSearchTerm = useDebounce(searchValue, 0);

    const removeVietnameseTones = (str) => {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D");
    };

    const handleClearSearchInput = () => {
        setSearchValue("");
        setSearchResults([]);
        setSearchState("innit");
    };

    useEffect(() => {
        if (debouncedSearchTerm) {
            setSearchState("start");
            const searchKeywords = debouncedSearchTerm.split(" ");
            const keywordsArray = [
                ...searchKeywords.map((keyword) => removeVietnameseTones(keyword).toUpperCase()), // Từ khóa không dấu
            ];
            const filteredData = data?.friendID.filter((item) =>
                keywordsArray.some((keyword) => item.userData.searchKeyWord.some((userKeyword) => userKeyword.includes(keyword)))
            );
            setSearchResults(filteredData);

            if (filteredData.length === 0) setSearchState("empty");
            else setSearchState("no-empty");
        }
    }, [debouncedSearchTerm]);

    const handleChangeInputText = (e) => {
        setSearchValue(e);
        if (e.trim() === "") {
            setSearchResults([]);
            setSearchState("innit");
            return;
        }
    };
    return (
        <ActionSheet
            keyboardHandlerEnabled={false}
            gestureEnabled={true}
            indicatorStyle={{
                width: 100,
            }}
        >
            <View style={{ height: "95%" }}>
                <View style={{ paddingHorizontal: 8 }}>
                    <View style={{ borderWidth: 1, borderColor: "#ccc", padding: 6, flexDirection: "row", borderRadius: 9999, alignItems: "center" }}>
                        <TextInput
                            autoFocus
                            onChangeText={handleChangeInputText}
                            value={searchValue}
                            style={{ fontSize: 16, paddingHorizontal: 12, borderRadius: 9999, flex: 1 }}
                            placeholder="Tìm kiếm..."
                        />
                        {searchValue ? (
                            <Button onPress={handleClearSearchInput} type="clear" buttonStyle={{ padding: 0, paddingHorizontal: 4, paddingVertical: 2 }} radius={9999}>
                                <AntDesign name="close" size={18} color="black" />
                            </Button>
                        ) : (
                            searchValue && <Button type="clear" loading buttonStyle={{ padding: 0, paddingHorizontal: 4, paddingVertical: 2 }} radius={9999}></Button>
                        )}
                    </View>
                </View>
                <View style={{ flex: 1, alignItems: "flex-start", width: "100%" }}>
                    {searchResults.length > 0 && (
                        <ScrollView style={{ width: "100%" }}>
                            {searchResults.map((item, index) => {
                                return (
                                    <SearchFriend authUser={data?.authUser} chatId={item.chatId} friendData={item.userData} lastMessage={item.lastMessage} key={index} />
                                );
                            })}
                        </ScrollView>
                    )}
                    {searchState === "empty" && <Text style={{ textAlign: "center", width: "100%", marginTop: 5 }}>Tìm kiếm với từ khóa khác !</Text>}
                    {searchState !== "no-empty" && (
                        <View style={{ flex: 1, alignItems: "center", marginTop: 20, width: "100%" }}>
                            <FastImage
                                style={{
                                    width: 300,
                                    height: 300,
                                    borderRadius: 9999,
                                    marginRight: 6,
                                    // elevation: 10,
                                }}
                                source={{
                                    uri: "https://i.pinimg.com/originals/c0/c9/c2/c0c9c2a6b0a99053b87b14114c876000.gif",
                                    priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        </View>
                    )}
                </View>
            </View>
        </ActionSheet>
    );
};

export default SearchFriendSheet;
