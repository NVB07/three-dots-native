import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import firestore from "@react-native-firebase/firestore";
const forge = require("node-forge");
import { RSA } from "react-native-rsa-native";
import * as SecureStore from "expo-secure-store";

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
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const { idToken } = await GoogleSignin.signIn();

    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const result = await auth().signInWithCredential(googleCredential);
    const { additionalUserInfo } = result;

    const user = result.user;
    const userDoc = await firestore().collection("users").doc(user.uid).get();

    if (!userDoc.exists || !userDoc.data()?.publicKey) {
        const rsaKey = await createKeyPair();
        await firestore().collection("users").doc(user.uid).update({ publicKey: rsaKey.publicKey });
        await SecureStore.setItemAsync("privateKey", rsaKey.privateKey);
    }

    if (additionalUserInfo?.isNewUser) {
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

async function createKeyPair() {
    const keys = await RSA.generateKeys(2048);
    const privateKeyAsn1 = forge.pki.privateKeyToAsn1(forge.pki.privateKeyFromPem(keys.private));
    const publicKeyAsn1 = forge.pki.publicKeyToAsn1(forge.pki.publicKeyFromPem(keys.public));

    // const privateKeyBase64 = forge.util.encode64(forge.asn1.toDer(privateKeyAsn1).getBytes());
    // const publicKeyBase64 = forge.util.encode64(forge.asn1.toDer(publicKeyAsn1).getBytes());

    // console.log("Private Key (Base64):", privateKeyBase64);
    // console.log("Public Key (Base64):", publicKeyBase64);
    const privateKeyPem = forge.pki.privateKeyToPem(forge.pki.privateKeyFromAsn1(privateKeyAsn1));
    const publicKeyPem = forge.pki.publicKeyToPem(forge.pki.publicKeyFromAsn1(publicKeyAsn1));

    // Hiển thị khóa PEM
    console.log("Private Key (PEM):", privateKeyPem);
    console.log("Public Key (PEM):", publicKeyPem);

    return { privateKey: privateKeyPem, publicKey: publicKeyPem };
}
