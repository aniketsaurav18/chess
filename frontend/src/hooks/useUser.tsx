import { useState, useEffect } from "react";

interface User{
    userId: string, 
    email: string,
    token: string,
    type: "guest" | "user"
}

const useUser = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        const email = localStorage.getItem("email");
        const token = localStorage.getItem("token");
        const type= "user";
        if(userId && email && token){
            setUser({userId, email, token, type});
        }else{
            setUser({userId: "", email: "", token: "", type: "guest"});
        }
    }, [])
    return user;
}

export default useUser;