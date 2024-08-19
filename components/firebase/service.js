import firestore from "@react-native-firebase/firestore";
import { serverTimestamp } from "@react-native-firebase/firestore";

export async function addBlog(data) {
    try {
        await firestore()
            .collection("blogs")
            .add({
                ...data,
                createAt: firestore.FieldValue.serverTimestamp(),
            });
        console.log("blog added!");
        return true;
    } catch (error) {
        console.error("Error adding blog: ", error);
        return false;
    }
}

export async function updateBlog(blogId, dataUpdate) {
    try {
        await firestore().collection("blogs").doc(blogId).update(dataUpdate);
        console.log("blog update!");
        return true;
    } catch (error) {
        console.error("Error blog update: ", error);
        return false;
    }
}
export async function deleteBlog(blogId) {
    try {
        await firestore().collection("blogs").doc(blogId).delete();
        console.log("blog deleted!");
        return true;
    } catch (error) {
        console.error("Error blog delete: ", error);
        return false;
    }
}
