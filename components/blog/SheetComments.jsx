import React from "react";
import { View, ImageBackground, Text, Pressable, TextInput } from "react-native";
import { Button } from "@rneui/themed";
import ActionSheet, { ScrollView, useSheetPayload, SheetManager } from "react-native-actions-sheet";
import FastImage from "react-native-fast-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import CountReact from "./CountReact";

function SheetComments() {
    const sheetData = useSheetPayload("SheetComments");
    console.log(sheetData);

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
        <ActionSheet
            gestureEnabled={true}
            indicatorStyle={{
                width: 100,
            }}
        >
            <View style={{ paddingHorizontal: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>Bài viết của {sheetData?.authorData.displayName}</Text>
                <View style={{ width: 60 }}>
                    <Button buttonStyle={{ padding: 0 }} type="clear" onPress={() => SheetManager.hide("SheetComments")} radius={"lg"} titleStyle={{ color: "red" }}>
                        Đóng
                    </Button>
                </View>
            </View>
            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: 12,
                    paddingTop: 0,
                }}
            >
                <View style={{ paddingTop: 4 }}>
                    <View style={{ flexDirection: "row" }}>
                        <FastImage
                            style={{ width: 36, height: 36, borderRadius: 9999 }}
                            source={{
                                uri: sheetData?.authorData.photoURL,
                                priority: FastImage.priority.low,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                        <View style={{ marginLeft: 4 }}>
                            <Text style={{ fontSize: 16, fontWeight: "500" }}>{sheetData?.authorData.displayName}</Text>
                            <Text style={{ fontSize: 13, color: "#999" }}>{handleConvertDate(sheetData?.blogData.createAt)}</Text>
                        </View>
                    </View>
                    {sheetData?.blogData.post.content && <Text style={{ fontSize: 16, marginBottom: 2 }}>{sheetData?.blogData.post.normalText}</Text>}
                    {sheetData?.blogData.post.imageURL && (
                        <View style={{ width: "100%", height: 350, marginBottom: 10 }}>
                            <ImageBackground source={require("@/assets/images/background.jpg")} style={{ width: "100%", height: 350 }}>
                                <FastImage
                                    style={{ width: "100%", height: "100%", padding: 0, maxHeight: 350 }}
                                    overflow="hidden"
                                    source={{
                                        uri: sheetData?.blogData.post.imageURL,
                                        priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.contain}
                                />
                            </ImageBackground>
                        </View>
                    )}
                    <CountReact showSheet authUser={sheetData.authUser} blogId={sheetData.blogId} />
                    <Text style={{ fontSize: 16 }}>
                        Một buổi sáng chủ nhật, em được bố mẹ dẫn đi chơi ở phố đi bộ Hồ Gươm trong thủ đô Hà Nội. Đó chính là một trong những nơi em yêu thích và có
                        những trải nghiệm đẹp nhất. Phố đi bộ ngày mới sáng sớm đã đông đúc người qua lại, vì hôm nay là cuối tuần. Điều thú vị ở đây đó chính là không có
                        khói bụi, ô nhiễm, không có tiếng còi xe inh ỏi. Ở đây có những thanh chắn ngăn cho các phương tiện giao thông vào. Bạn muốn vào, chỉ có thể đi bộ
                        bằng chính đôi chân của mình. Có nhiều con đường để đi vào trung tâm của con phố. Ở đó, có một đài phun nước rất đẹp. Nước chảy ra từ những chiếc
                        vòi, phun lên trên thật đẹp và thú vị. Xung quanh đây có những quán cà phê, các điểm tụ tập và ăn uống rất phù hợp. Nhưng điểm làm nên điều thú vị
                        ở đây chính là con người. Phố đi bộ là hoạt động dành cho những người tham gia. Mặc dù mới là buổi sáng nhưng không vì thế mà mất đi sự náo nhiệt
                        và sôi động của nó. Không khí buổi sáng mùa thu thật dễ chịu với những tia nắng nhẹ nhàng và làn gió mơn man, sẽ lạnh. Những con đường đi đều đông
                        đúc người. Mọi người, ai cũng đi với những người khác. Em thấy có nhiều gia đình giống em, có những anh chị đi cùng nhau. Tất cả mọi người đều nói
                        chuyện và cười đùa rất vui vẻ. Hẳn rồi, vì đây chính là nơi vui chơi giải trí mà. Các bạn nhỏ đang cười rất tươi, tay cảm que kem, háo hức tham
                        gia các trò chơi. Những trò chơi ở đây rất thú vị mà ở khi ở nhà, những bạn thành phố không biết đến. Những trò ô ăn quan với những viên sỏi, trò
                        kéo co thu hút rất nhiều bạn. Những con tò he đủ sắc màu và hình dáng không chỉ làm cho chúng em mà cả bố mẹ cũng thấy rất thần kì. Những người
                        lớn cũng chơi với trẻ con rất vui vẻ và hạnh phúc. Bên cạnh những tiếng cười vui vẻ, có những người đến đây đơn giản là để đi bộ. Những người lớn
                        tuổi thong thả những bài tập buổi sáng, những bước chân thong dong bước đi. Có những anh, chị chọn cho mình một nơi có bóng xanh mát, yên bình để
                        đọc sách hay mở vở để làm bài tập. Mỗi người một mục đích và hành động khác nhau nhưng em thấy ai cũng rất vui vẻ, gương mặt rạng rỡ và yên bình,
                        khác hẳn với tiếng còi xe, tiếng mọi người lộn xộn nói chuyện ở những con phố ngoài kia. Một buổi sáng diễn ra trên đường phố Hồ Gươm thật là vui
                        vẻ và thanh bình. Ở đây, em và mọi người đều tìm thấy hạnh phúc của mình. Và đó sẽ là một khởi đầu tốt để bắt đầu một ngày mới tốt đẹp. Các bạn
                        cũng nên tới đây một lần nhé! Một buổi sáng chủ nhật, em được bố mẹ dẫn đi chơi ở phố đi bộ Hồ Gươm trong thủ đô Hà Nội. Đó chính là một trong
                        những nơi em yêu thích và có những trải nghiệm đẹp nhất. Phố đi bộ ngày mới sáng sớm đã đông đúc người qua lại, vì hôm nay là cuối tuần. Điều thú
                        vị ở đây đó chính là không có khói bụi, ô nhiễm, không có tiếng còi xe inh ỏi. Ở đây có những thanh chắn ngăn cho các phương tiện giao thông vào.
                        Bạn muốn vào, chỉ có thể đi bộ bằng chính đôi chân của mình. Có nhiều con đường để đi vào trung tâm của con phố. Ở đó, có một đài phun nước rất
                        đẹp. Nước chảy ra từ những chiếc vòi, phun lên trên thật đẹp và thú vị. Xung quanh đây có những quán cà phê, các điểm tụ tập và ăn uống rất phù
                        hợp. Nhưng điểm làm nên điều thú vị ở đây chính là con người. Phố đi bộ là hoạt động dành cho những người tham gia. Mặc dù mới là buổi sáng nhưng
                        không vì thế mà mất đi sự náo nhiệt và sôi động của nó. Không khí buổi sáng mùa thu thật dễ chịu với những tia nắng nhẹ nhàng và làn gió mơn man,
                        sẽ lạnh. Những con đường đi đều đông đúc người. Mọi người, ai cũng đi với những người khác. Em thấy có nhiều gia đình giống em, có những anh chị
                        đi cùng nhau. Tất cả mọi người đều nói chuyện và cười đùa rất vui vẻ. Hẳn rồi, vì đây chính là nơi vui chơi giải trí mà. Các bạn nhỏ đang cười rất
                        tươi, tay cảm que kem, háo hức tham gia các trò chơi. Những trò chơi ở đây rất thú vị mà ở khi ở nhà, những bạn thành phố không biết đến. Những
                        trò ô ăn quan với những viên sỏi, trò kéo co thu hút rất nhiều bạn. Những con tò he đủ sắc màu và hình dáng không chỉ làm cho chúng em mà cả bố mẹ
                        cũng thấy rất thần kì. Những người lớn cũng chơi với trẻ con rất vui vẻ và hạnh phúc. Bên cạnh những tiếng cười vui vẻ, có những người đến đây đơn
                        giản là để đi bộ. Những người lớn tuổi thong thả những bài tập buổi sáng, những bước chân thong dong bước đi. Có những anh, chị chọn cho mình một
                        nơi có bóng xanh mát, yên bình để đọc sách hay mở vở để làm bài tập. Mỗi người một mục đích và hành động khác nhau nhưng em thấy ai cũng rất vui
                        vẻ, gương mặt rạng rỡ và yên bình, khác hẳn với tiếng còi xe, tiếng mọi người lộn xộn nói chuyện ở những con phố ngoài kia. Một buổi sáng diễn ra
                        trên đường phố Hồ Gươm thật là vui vẻ và thanh bình. Ở đây, em và mọi người đều tìm thấy hạnh phúc của mình. Và đó sẽ là một khởi đầu tốt để bắt
                        đầu một ngày mới tốt đẹp. Các bạn cũng nên tới đây một lần nhé! Một buổi sáng chủ nhật, em được bố mẹ dẫn đi chơi ở phố đi bộ Hồ Gươm trong thủ đô
                        Hà Nội. Đó chính là một trong những nơi em yêu thích và có những trải nghiệm đẹp nhất. Phố đi bộ ngày mới sáng sớm đã đông đúc người qua lại, vì
                        hôm nay là cuối tuần. Điều thú vị ở đây đó chính là không có khói bụi, ô nhiễm, không có tiếng còi xe inh ỏi. Ở đây có những thanh chắn ngăn cho
                        các phương tiện giao thông vào. Bạn muốn vào, chỉ có thể đi bộ bằng chính đôi chân của mình. Có nhiều con đường để đi vào trung tâm của con phố. Ở
                        đó, có một đài phun nước rất đẹp. Nước chảy ra từ những chiếc vòi, phun lên trên thật đẹp và thú vị. Xung quanh đây có những quán cà phê, các điểm
                        tụ tập và ăn uống rất phù hợp. Nhưng điểm làm nên điều thú vị ở đây chính là con người. Phố đi bộ là hoạt động dành cho những người tham gia. Mặc
                        dù mới là buổi sáng nhưng không vì thế mà mất đi sự náo nhiệt và sôi động của nó. Không khí buổi sáng mùa thu thật dễ chịu với những tia nắng nhẹ
                        nhàng và làn gió mơn man, sẽ lạnh. Những con đường đi đều đông đúc người. Mọi người, ai cũng đi với những người khác. Em thấy có nhiều gia đình
                        giống em, có những anh chị đi cùng nhau. Tất cả mọi người đều nói chuyện và cười đùa rất vui vẻ. Hẳn rồi, vì đây chính là nơi vui chơi giải trí
                        mà. Các bạn nhỏ đang cười rất tươi, tay cảm que kem, háo hức tham gia các trò chơi. Những trò chơi ở đây rất thú vị mà ở khi ở nhà, những bạn
                        thành phố không biết đến. Những trò ô ăn quan với những viên sỏi, trò kéo co thu hút rất nhiều bạn. Những con tò he đủ sắc màu và hình dáng không
                        chỉ làm cho chúng em mà cả bố mẹ cũng thấy rất thần kì. Những người lớn cũng chơi với trẻ con rất vui vẻ và hạnh phúc. Bên cạnh những tiếng cười
                        vui vẻ, có những người đến đây đơn giản là để đi bộ. Những người lớn tuổi thong thả những bài tập buổi sáng, những bước chân thong dong bước đi.
                        Có những anh, chị chọn cho mình một nơi có bóng xanh mát, yên bình để đọc sách hay mở vở để làm bài tập. Mỗi người một mục đích và hành động khác
                        nhau nhưng em thấy ai cũng rất vui vẻ, gương mặt rạng rỡ và yên bình, khác hẳn với tiếng còi xe, tiếng mọi người lộn xộn nói chuyện ở những con
                        phố ngoài kia. Một buổi sáng diễn ra trên đường phố Hồ Gươm thật là vui vẻ và thanh bình. Ở đây, em và mọi người đều tìm thấy hạnh phúc của mình.
                        Và đó sẽ là một khởi đầu tốt để bắt đầu một ngày mới tốt đẹp. Các bạn cũng nên tới đây một lần nhé!
                    </Text>
                </View>
            </ScrollView>
            <View style={{ width: "100%", paddingHorizontal: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: "#ccc",
                        borderRadius: 99999,
                        flexDirection: "row",
                        alignItems: "center",
                        width: "87%",
                        justifyContent: "space-between",
                    }}
                >
                    <TextInput
                        textAlignVertical="top"
                        multiline={false}
                        autoFocus
                        placeholder="Bình luận"
                        style={{ height: 35, flex: 1, paddingVertical: 8, paddingHorizontal: 8 }}
                    />
                </View>
                <View>
                    <Button type="clear" radius={9999} buttonStyle={{ width: 38, height: 38 }}>
                        {">>"}
                    </Button>
                </View>
            </View>
        </ActionSheet>
    );
}

export default SheetComments;
