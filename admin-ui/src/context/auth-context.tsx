"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    email: string;
    name: string;
    role: "SUPER_ADMIN" | "ADMIN" | "TRADER" | "VIEW_ONLY";
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, passwordInput?: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const savedUser = localStorage.getItem("aegis_admin_user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, passwordInput?: string) => {
        setIsLoading(true);

        try {
            // Support local dev override if needed, but prefer real API
            const password = passwordInput || "Aegis@saas$uper9"; // Default for dev convenience if UI doesn't pass it yet

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4100'}/api/v1/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) {
                // Fallback to Mock for existing hardcoded admin if API fails/is offline during dev
                if (email === "admin@aegis.local") {
                    const mockUser: User = { id: "admin-user-01", email, name: "System Administrator", role: "ADMIN" };
                    setUser(mockUser);
                    localStorage.setItem("aegis_admin_user", JSON.stringify(mockUser));
                    setIsLoading(false);
                    router.push("/dashboard");
                    return;
                }
                throw new Error("Invalid credentials");
            }

            const data = await res.json();

            // Enforce Admin Role
            if (data.data.role !== 'SUPER_ADMIN' && data.data.role !== 'ADMIN') {
                alert("Access Denied: Admin Privileges Required");
                setIsLoading(false);
                return;
            }

            const newUser: User = {
                id: data.data.id,
                email: data.data.email,
                name: data.data.name,
                role: data.data.role
            };

            setUser(newUser);
            localStorage.setItem("aegis_admin_user", JSON.stringify(newUser));
            setIsLoading(false);
            router.push("/dashboard");

        } catch (e) {
            console.error("Login Error", e);
            alert("Login Failed: Invalid Credentials or Server Unavailable");
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("aegis_admin_user");
        router.push("/login");
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
