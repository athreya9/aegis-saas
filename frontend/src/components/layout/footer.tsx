import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-white/5 py-12 bg-black">
            <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2 text-zinc-500 text-sm">
                    <div className="w-4 h-4 bg-white/10 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white/50 rounded-full" />
                    </div>
                    <span>© 2026 Aegis Systems Inc. All rights reserved.</span>
                </div>
                <div className="flex gap-8 text-xs font-medium text-zinc-600 uppercase tracking-wider">
                    <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    <Link href="/docs/broker-integration" className="hover:text-white transition-colors">API Docs</Link>
                </div>
            </div>
        </footer>
    );
}
