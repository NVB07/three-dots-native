import React, { useState, useEffect, createContext } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import LoginPage from "@/components/pages/loginPage/LoginPage";
import Loading from "@/components/pages/loading/Loading";
import { OneSignal } from "react-native-onesignal";
export const AuthContext = createContext();
const AuthProvider = ({ children }) => {
    // Set an initializing state whilst Firebase connects
    const [initializing, setInitializing] = useState(true);
    const [authUser, setAuthUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(1);

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged((user) => {
            setCurrentUser(user);
        });
        return subscriber; // unsubscribe on unmount
    }, []);

    useEffect(() => {
        if (currentUser !== 1 && currentUser?.uid) {
            const subscriber = firestore()
                .collection("users")
                .doc(currentUser.uid)
                .onSnapshot(
                    (documentSnapshot) => {
                        if (documentSnapshot.exists) {
                            const data = documentSnapshot.data();
                            setAuthUser(data);
                            OneSignal.login(data?.uid);
                        }
                        setInitializing(false);
                        console.log("loged");
                    },
                    (error) => {
                        console.error("Error fetching user data: ", error);
                        setInitializing(false); // Dừng loading nếu có lỗi
                    }
                );
            return () => subscriber(); // unsubscribe on unmount
        } else if (currentUser == null) {
            setInitializing(false);

            setAuthUser(null); // Nếu không có currentUser, dừng loading
        }
    }, [currentUser]);

    if (initializing) return <Loading />;

    if (!authUser && !initializing) {
        return <LoginPage />;
    }

    return <AuthContext.Provider value={{ authUser, setAuthUser }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
