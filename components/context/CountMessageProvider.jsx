import { useState, createContext, useEffect, useContext } from "react";
import firestore from "@react-native-firebase/firestore";

export const CountMessageContext = createContext();

import { AuthContext } from "@/components/context/AuthProvider";
const CountMessageProvider = ({ children }) => {
    const { authUser } = useContext(AuthContext);

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (authUser.uid) {
            const subscriber = firestore()
                .collection("roomsChat")

                .orderBy("createAt", "desc")
                .onSnapshot((querySnapshot) => {
                    if (querySnapshot) {
                        const docsWithUserUid = [];
                        querySnapshot.forEach((doc) => {
                            const data = doc.data();

                            if (data.user && data.user.includes(authUser.uid)) {
                                docsWithUserUid.push({
                                    id: doc.id,
                                    data: data,
                                });
                            }
                        });
                        setMessages(docsWithUserUid);
                    }
                });

            return () => subscriber();
        }
    }, []);

    return <CountMessageContext.Provider value={{ messages, setMessages }}>{children}</CountMessageContext.Provider>;
};

export default CountMessageProvider;
