"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StatusPage() {
    const router = useRouter();
    useEffect(() => {
        // Redirect to home as this page is internal/admin only now
        router.replace("/");
    }, [router]);

    return null;
}
