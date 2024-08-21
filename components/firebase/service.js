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

export async function addComment(blogId, comment, authUser) {
    try {
        const newComment = {
            comment: comment,
            uid: authUser.uid,
            displayName: authUser.displayName,
            photoURL: authUser.photoURL,
            sendTime: firestore.FieldValue.serverTimestamp(),
        };

        await firestore().collection("blogs").doc(blogId).collection("comments").add(newComment);

        console.log("Comment added!");
        return true;
    } catch (error) {
        console.error("Error adding comment: ", error);
        return false;
    }
}
export async function deleteComment(blogId, commentId) {
    try {
        await firestore().collection("blogs").doc(blogId).collection("comments").doc(commentId).delete();
        console.log("comment deleted!");
        return true;
    } catch (error) {
        console.error("Error comment delete: ", error);
        return false;
    }
}
