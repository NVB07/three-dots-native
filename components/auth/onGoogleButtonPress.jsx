import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import firestore from "@react-native-firebase/firestore";

GoogleSignin.configure({
    webClientId: "315301649530-bkbqj75ri9sura9qpvkl725uebf51ktr.apps.googleusercontent.com", // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
    scopes: ["https://www.googleapis.com/auth/drive.readonly"], // what API you want to access on behalf of the user, default is email and profile
    offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    hostedDomain: "", // specifies a hosted domain restriction
    forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
    accountName: "", // [Android] specifies an account name on the device that should be used
    iosClientId: "", // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    googleServicePlistPath: "", // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
    openIdRealm: "", // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
    profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
});
export default async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const result = await auth().signInWithCredential(googleCredential);
    // Sign-in the user with the credential
    const { additionalUserInfo } = result;

    if (additionalUserInfo?.isNewUser) {
        // Người dùng mới, thực hiện hành động thêm document vào collection 'users'
        const user = result.user;
        await addUserToFirestore(user);
    }

    return result;
}

async function addUserToFirestore(user) {
    const searchKeywords = user.displayName
        .trim()
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/Đ/g, "D")
        .split(/[ \n]+/);
    const userData = {
        displayName: user.displayName || "",
        email: user.email || "",
        threads: "",
        facebook: "",
        instagram: "",
        tiktok: "",
        x: "",
        photoURL: user.photoURL || "",
        uid: user.uid,
        providerId: user.providerData[0]?.providerId,
        searchKeyWord: searchKeywords,
    };

    // Thêm document vào collection 'users' với user.uid làm ID
    await firestore().collection("users").doc(user.uid).set(userData);
}
