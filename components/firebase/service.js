import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
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

export const uploadImageToStorage = async (imageUri, folderName = "imagePostBlogs") => {
    const fileName = imageUri.split("/").pop(); // Lấy tên file từ URI
    const reference = storage().ref(`${folderName}/${fileName}`);

    try {
        await reference.putFile(imageUri);
        const url = await reference.getDownloadURL();
        return url;
    } catch (error) {
        console.error("Error uploading image:", error);
        return null;
    }
};
export async function deleteFirebaseImage(imagePath) {
    try {
        // Tạo một tham chiếu đến file ảnh trên Firebase Storage
        const fileRef = storage().ref(imagePath);

        // Xóa file ảnh
        await fileRef.delete();
        console.log("Ảnh đã được xóa thành công!");
    } catch (error) {
        console.error("Lỗi khi xóa ảnh:", error);
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
export async function deleteBlog(blogId, imagePath) {
    try {
        await firestore().collection("blogs").doc(blogId).delete();
        if (imagePath) await deleteFirebaseImage(imagePath);
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
export async function sendMessageValue(id, value) {
    try {
        await firestore().collection("roomsChat").doc(id).collection("chat").add(value);
        await firestore().collection("roomsChat").doc(id).update({ createAt: firestore.FieldValue.serverTimestamp(), lastMessage: value });
        console.log("sended message!");
        return true;
    } catch (error) {
        console.error("Error send message: ", error);
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
export async function updateUserInformation(userId, oldImagePath, imageUpdate, dataUpdate) {
    try {
        if (imageUpdate) {
            const newAvatar = await uploadImageToStorage(imageUpdate, "photoUsers");
            await firestore().collection("users").doc(userId).update({ photoURL: newAvatar });
            if (oldImagePath) await deleteFirebaseImage(oldImagePath);
        }
        await firestore().collection("users").doc(userId).update(dataUpdate);
        console.log("user update!");
        return true;
    } catch (error) {
        console.error("Error user update: ", error);
        return false;
    }
}
