import firestore from "@react-native-firebase/firestore";
import { serverTimestamp } from "@react-native-firebase/firestore";

export async function addBlog(data) {
    firestore()
        .collection("blogs")
        .add({
            ...data,
            createAt: serverTimestamp(),
        })
        .then(() => {
            console.log("User added!");
        });
}
