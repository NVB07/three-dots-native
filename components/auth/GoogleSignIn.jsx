import React from "react";
import { Button } from "react-native";
import onGoogleButtonPress from "./onGoogleButtonPress";
export default function GoogleSignIn() {
    return <Button title="Google Sign-In" onPress={() => onGoogleButtonPress().then(() => console.log("Signed in with Google!"))} />;
}
