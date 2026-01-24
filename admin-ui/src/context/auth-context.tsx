"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const savedUser = localStorage.getItem("aegis_user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string) => {
        setIsLoading(true);
        // Mock login delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        let newUser: User;
        if (email === "admin@aegis.local") {
            newUser = { id: "admin-user-01", email, name: "System Administrator" };
        } else {
            newUser = { id: "1", email, name: email.split("@")[0] };
        }

        setUser(newUser);
        localStorage.setItem("aegis_user", JSON.stringify(newUser));
        setIsLoading(false);
        router.push("/dashboard");
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("aegis_user");
        router.push("/");
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
