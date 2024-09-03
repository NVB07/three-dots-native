import React, { useState, useEffect, createContext } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import LoginPage from "@/components/pages/loginPage/LoginPage";
import Loading from "@/components/pages/loading/Loading";
import { Platform } from "react-native";
//   {"displayName": "BINH NV", "email": null, "emailVerified": false, "isAnonymous": false, "metadata": {"creationTime": 1722526645330, "lastSignInTime": 1723785710416}, "multiFactor": {"enrolledFactors": [Array]}, "phoneNumber": null, "photoURL": "https://lh3.googleusercontent.com/a/ACg8ocIC3PX5UsZA7xfHbr8QcDB-p7bnZ6nBA2JTxHZaS2a2TNcZUw=s96-c", "providerData": [[Object]], "providerId": "firebase", "tenantId": null, "uid": "voh2j1G9vAYPKjKpgVFtbE7DTtA2"}
export const AuthContext = createContext();
const AuthProvider = ({ children }) => {
    // Set an initializing state whilst Firebase connects
    const [initializing, setInitializing] = useState(true);
    const [authUser, setAuthUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged((user) => {
            setCurrentUser(user);
        });
        return subscriber; // unsubscribe on unmount
    }, []);

    useEffect(() => {
        if (currentUser) {
            const subscriber = firestore()
                .collection("users")
                .doc(currentUser.uid)
                .onSnapshot((documentSnapshot) => {
                    if (documentSnapshot.exists) {
                        const data = documentSnapshot.data();
                        setAuthUser(data);
                    }
                    setInitializing(false);
                });
            return () => subscriber(); // unsubscribe on unmount
        }
    }, [currentUser]);

    if (initializing) return <Loading />;

    if ((Platform.OS === "android" || Platform.OS === "ios") && !authUser && !initializing) {
        return <LoginPage />;
    }

    return <AuthContext.Provider value={{ authUser, setAuthUser }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
