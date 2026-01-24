import { Navbar } from "@/components/layout/navbar";

export default function RiskDisclosure() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
            <Navbar />
            <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
                <div className="bg-[#0a0a0a] border border-[#222] rounded-xl p-8 md:p-12">
                    <h1 className="text-3xl font-bold mb-8 text-white tracking-tight">Risk Disclosure</h1>

                    <div className="space-y-6 text-zinc-400 leading-relaxed text-sm text-justify">
                        <p className="font-medium text-white">
                            Trading in financial markets, including equities, derivatives, and commodities, involves a high degree of risk and is not suitable for all investors.
                        </p>

                        <p>
                            <strong>Aegis is strictly a technology platform</strong> providing automation tools. We use algorithmic logic to execute trades based on predefined parameters.
                            We do not provide financial advice, imply any guarantee of profit, or promise protection against loss.
                        </p>

                        <p>
                            By using Aegis, you acknowledge that you are solely responsible for your capital and that Aegis and its developers bear no liability for any financial losses,
                            technical failures, latency issues, or system errors. System uptime, broker connectivity, and market conditions are outside our control.
                        </p>

                        <p>
                            Past performance of any trading system or methodology is not necessarily indicative of future results. Automatic trading software does not eliminate the risk of loss.
                            Users should be aware that automated execution may result in rapid losses in volatile market conditions.
                        </p>

                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs font-mono mt-8">
                            NOTICE: NO REFUNDS. ALL PAYMENTS ARE FINAL. YOU ASSUME ALL EXECUTION RISKS.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
