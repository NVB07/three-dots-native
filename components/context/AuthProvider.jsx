import React, { useState, useEffect, createContext } from "react";
import auth from "@react-native-firebase/auth";
import LoginPage from "@/components/pages/loginPage/LoginPage";
import { Platform } from "react-native";
//   {"displayName": "BINH NV", "email": null, "emailVerified": false, "isAnonymous": false, "metadata": {"creationTime": 1722526645330, "lastSignInTime": 1723785710416}, "multiFactor": {"enrolledFactors": [Array]}, "phoneNumber": null, "photoURL": "https://lh3.googleusercontent.com/a/ACg8ocIC3PX5UsZA7xfHbr8QcDB-p7bnZ6nBA2JTxHZaS2a2TNcZUw=s96-c", "providerData": [[Object]], "providerId": "firebase", "tenantId": null, "uid": "voh2j1G9vAYPKjKpgVFtbE7DTtA2"}
export const AuthContext = createContext();
const AuthProvider = ({ children }) => {
    // Set an initializing state whilst Firebase connects
    const [initializing, setInitializing] = useState(true);
    const [authUser, setAuthUser] = useState();

    // Handle user state changes
    function onAuthStateChanged(authUser) {
        setAuthUser(authUser);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    if (initializing) return null;

    if ((Platform.OS === "android" || Platform.OS === "ios") && !authUser) {
        return <LoginPage />;
    }

    return <AuthContext.Provider value={{ authUser, setAuthUser }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
