"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export type UserStatus = "PENDING_PAYMENT" | "PAYMENT_UNDER_REVIEW" | "ACTIVE" | "SUSPENDED" | "PENDING_APPROVAL";

interface User {
    id: string;
    email: string;
    name: string;
    status: UserStatus;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, passwordInput?: string) => Promise<void>;
    logout: () => void;
    checkStatus: () => void; // Force refresh status
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
        if (email === "demo@aegis.local" || email === "admin@aegis.local") {
            await new Promise((resolve) => setTimeout(resolve, 500));
            const newUser: User = email.includes("admin")
                ? { id: "admin-user-01", email, name: "System Administrator", status: "ACTIVE" }
                : { id: "demo-user-01", email, name: "SaaS Demo User", status: "ACTIVE" };

            setUser(newUser);
            localStorage.setItem("aegis_user", JSON.stringify(newUser));
            setIsLoading(false);
            router.push(email.includes("admin") ? "/dashboard" : "/dashboard");
            return;
        }

        try {
            // Real API Call
            // Use provided password or a default if coming from a flow that didn't capture it (less secure but handles legacy flows)
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
                status: data.data.status as UserStatus // Cast to enum
            };

            setUser(newUser);
            localStorage.setItem("aegis_user", JSON.stringify(newUser));
            setIsLoading(false);

            // Routing Logic
            console.log("LOGIN REDIRECT Check:", newUser.status);
            if (newUser.status === "ACTIVE") router.push("/dashboard");
            else if (newUser.status === "PAYMENT_UNDER_REVIEW" || newUser.status === "PENDING_APPROVAL") router.push("/payment-status"); // Map PENDING_APPROVAL
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

    // Helper to refresh status (called by payment page)
    const checkStatus = () => {
        const savedUser = localStorage.getItem("aegis_user");
        if (savedUser) {
            const parsed = JSON.parse(savedUser);
            // Re-run logic (simplified for immediate mock update)
            const paidUsers = JSON.parse(localStorage.getItem("aegis_paid_users") || "[]");
            const approvedUsers = JSON.parse(localStorage.getItem("aegis_approved_users") || "[]");

            if (approvedUsers.includes(parsed.email)) {
                parsed.status = "ACTIVE";
            } else if (paidUsers.includes(parsed.email)) {
                parsed.status = "PAYMENT_UNDER_REVIEW";
            }

            setUser(parsed);
            localStorage.setItem("aegis_user", JSON.stringify(parsed));
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
