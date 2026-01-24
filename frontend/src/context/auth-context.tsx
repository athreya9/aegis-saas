"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export type UserStatus = "PENDING_PAYMENT" | "PAYMENT_UNDER_REVIEW" | "ACTIVE" | "SUSPENDED";

interface User {
    id: string;
    email: string;
    name: string;
    status: UserStatus;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string) => Promise<void>;
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

    const login = async (email: string) => {
        setIsLoading(true);
        // Mock login delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        let newUser: User;

        // ADMIN APPROVAL LOGIC MOCK
        // Check if admin has "approved" this email (stored in a separate mock DB in localstorage)
        const approvedUsers = JSON.parse(localStorage.getItem("aegis_approved_users") || "[]");
        const isApproved = approvedUsers.includes(email);

        if (email === "demo@aegis.local") {
            // Demo user is always active
            newUser = { id: "demo-user-01", email, name: "SaaS Demo User", status: "ACTIVE" };
        } else if (email === "admin@aegis.local") {
            newUser = { id: "admin-user-01", email, name: "System Administrator", status: "ACTIVE" };
        } else {
            // Regular signup
            // If approved by admin mock, ACTIVE. Else, depends on where they came from. Default PENDING.
            // We can check if they have "paid" (also mock localstorage)
            const paidUsers = JSON.parse(localStorage.getItem("aegis_paid_users") || "[]");

            if (isApproved) {
                newUser = { id: "1", email, name: email.split("@")[0], status: "ACTIVE" };
            } else if (paidUsers.includes(email)) {
                newUser = { id: "1", email, name: email.split("@")[0], status: "PAYMENT_UNDER_REVIEW" };
            } else {
                newUser = { id: "1", email, name: email.split("@")[0], status: "PENDING_PAYMENT" };
            }
        }

        setUser(newUser);
        localStorage.setItem("aegis_user", JSON.stringify(newUser));
        setIsLoading(false);

        // Routing Logic based on Status
        if (newUser.id.includes("admin")) {
            // Admin logic handled in Admin App, but for safety:
            router.push("/dashboard");
        } else {
            console.log("LOGIN REDIRECT Check:", newUser.status);
            if (newUser.status === "ACTIVE") router.push("/dashboard");
            else if (newUser.status === "PAYMENT_UNDER_REVIEW") router.push("/payment-status");
            else if (newUser.status === "PENDING_PAYMENT") router.push("/payment");
            else router.push("/");
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
