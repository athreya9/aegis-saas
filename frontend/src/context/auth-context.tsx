"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export type UserStatus = "PENDING_PAYMENT" | "PAYMENT_UNDER_REVIEW" | "ACTIVE" | "SUSPENDED" | "PENDING_APPROVAL";

interface User {
    id: string;
    email: string;
    name: string;
    status: UserStatus;
    role: "SUPER_ADMIN" | "ADMIN" | "TRADER" | "VIEW_ONLY";
    brokerConnected?: boolean;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, passwordInput?: string) => Promise<void>;
    logout: () => void;
    checkStatus: () => void;
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

    const login = async (email: string, passwordInput?: string) => {
        setIsLoading(true);

        // Demo/Admin Mock Bypass for reliability during dev (Frontend-only fallback)
        if (email === "demo@aegis.local" || email === "admin@aegis.local" || email === "demo_pro_user@aegis.local") {
            await new Promise((resolve) => setTimeout(resolve, 500));

            let newUser: User;
            if (email.includes("admin")) {
                newUser = { id: "admin-user-01", email, name: "System Administrator", status: "ACTIVE", role: "ADMIN" };
            } else if (email.includes("pro")) {
                newUser = { id: "demo-pro-01", email, name: "Pro Trader", status: "ACTIVE", role: "TRADER", brokerConnected: true };
            } else {
                newUser = { id: "demo-user-01", email, name: "SaaS Demo User", status: "ACTIVE", role: "VIEW_ONLY", brokerConnected: false };
            }

            setUser(newUser);
            localStorage.setItem("aegis_user", JSON.stringify(newUser));
            setIsLoading(false);
            router.push("/dashboard");
            return;
        }

        try {
            // Real API Call
            const password = passwordInput || "Pass123!@#";

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4100'}/api/v1/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) {
                throw new Error("Invalid credentials");
            }

            const data = await res.json();
            const newUser: User = {
                id: data.data.id,
                email: data.data.email,
                name: data.data.name,
                status: data.data.status as UserStatus,
                role: data.data.role || "VIEW_ONLY",
                brokerConnected: data.data.brokerConnected || false
            };

            setUser(newUser);
            localStorage.setItem("aegis_user", JSON.stringify(newUser));
            setIsLoading(false);

            // Routing Logic
            console.log("LOGIN REDIRECT Check:", newUser.status);
            if (newUser.status === "ACTIVE") router.push("/dashboard");
            else if (newUser.status === "PAYMENT_UNDER_REVIEW" || newUser.status === "PENDING_APPROVAL") router.push("/payment-status");
            else if (newUser.status === "PENDING_PAYMENT") router.push("/payment");
            else router.push("/");

        } catch (e) {
            console.error("Login Error", e);
            alert("Login Failed: Invalid Credentials");
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("aegis_user");
        router.push("/");
    };

    // Helper to refresh status
    const checkStatus = async () => {
        if (!user) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4100'}/api/v1/auth/me`, {
                headers: { 'x-user-id': user.id }
            });

            if (res.ok) {
                const data = await res.json();
                const updatedUser: User = {
                    id: data.data.id,
                    email: data.data.email,
                    name: data.data.name,
                    status: data.data.status,
                    role: data.data.role || "VIEW_ONLY",
                    brokerConnected: data.data.brokerConnected || false
                };
                setUser(updatedUser);
                localStorage.setItem("aegis_user", JSON.stringify(updatedUser));
            }
        } catch (e) {
            console.error("Status Refresh Error", e);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, checkStatus }}>
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
