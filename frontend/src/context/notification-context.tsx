"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Bell, CheckCircle, Info, AlertTriangle } from "lucide-react";

type NotificationType = "success" | "info" | "warning" | "error";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
}

interface NotificationContextType {
    notify: (title: string, message: string, type?: NotificationType) => void;
    requestPermission: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Request permission on mount (non-intrusive, usually needs gesture)
    useEffect(() => {
        if ("Notification" in window && Notification.permission === "default") {
            // We wait for user interaction usually, but here we prepare state
        }
    }, []);

    const requestPermission = async () => {
        if (!("Notification" in window)) return;
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            new Notification("Aegis System", { body: "Notifications enabled." });
        }
    };

    const notify = (title: string, message: string, type: NotificationType = "info") => {
        const id = Math.random().toString(36).substring(7);

        // 1. App-State Notification (Toast)
        setNotifications((prev) => [...prev, { id, title, message, type }]);

        // Auto-dismiss toast
        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 5000);

        // 2. Browser Native Notification
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification(title, { body: message, icon: "/icon-192.png" });
        }
    };

    return (
        <NotificationContext.Provider value={{ notify, requestPermission }}>
            {children}
            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                {notifications.map((n) => (
                    <div
                        key={n.id}
                        className="pointer-events-auto bg-zinc-900 border border-white/10 p-4 rounded-lg shadow-2xl flex items-start gap-3 w-80 animate-in slide-in-from-right fade-in duration-300"
                    >
                        {n.type === "success" && <CheckCircle className="text-emerald-500 w-5 h-5 shrink-0" />}
                        {n.type === "info" && <Info className="text-blue-500 w-5 h-5 shrink-0" />}
                        {n.type === "warning" && <AlertTriangle className="text-yellow-500 w-5 h-5 shrink-0" />}
                        <div>
                            <h4 className="text-sm font-semibold text-white">{n.title}</h4>
                            <p className="text-xs text-zinc-400 mt-1">{n.message}</p>
                        </div>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
}

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
};
