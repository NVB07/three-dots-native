import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import BlogPage from "../../../components/pages/blogPage/BlogPage";
const BlogScreen = () => {
    const { blogid, data, author, comments, imageSize, authUser } = useLocalSearchParams();
    const blogData = JSON.parse(data);
    const authorData = JSON.parse(author);
    const currentUser = JSON.parse(authUser);
    const commentData = JSON.parse(comments);
    const sizeImage = JSON.parse(imageSize);

    return (
        <View style={{ paddingTop: 40, flex: 1 }}>
            <BlogPage blogid={blogid} author={authorData} blogData={blogData} comment={commentData} imageSize={sizeImage} authUser={currentUser} />
        </View>
    );
};

export default BlogScreen;
