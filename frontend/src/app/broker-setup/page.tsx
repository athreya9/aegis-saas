'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function BrokerSetupPage() {
    const router = useRouter();
    const [selectedBroker, setSelectedBroker] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Form State
    const [apiKey, setApiKey] = useState('');
    const [apiSecret, setApiSecret] = useState('');

    const brokers = [
        {
            id: 'ZERODHA',
            name: 'Zerodha Kite',
            logo: '/logos/zerodha.svg', // Placeholder
            status: 'RECOMMENDED',
            color: 'bg-blue-500/10 border-blue-500/50 text-blue-500'
        },
        {
            id: 'ZERODHA_PAPER',
            name: 'Paper Trading',
            logo: '/logos/aegis.svg',
            status: 'SAFE MODE',
            color: 'bg-green-500/10 border-green-500/50 text-green-500'
        },
        {
            id: 'ANGEL_ONE',
            name: 'Angel One',
            logo: '/logos/angel.svg',
            status: 'BETA',
            color: 'bg-orange-500/10 border-orange-500/50 text-orange-500'
        }
    ];

    const handleConnect = async () => {
        setIsLoading(true);
        setError('');

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4100';
            const res = await fetch(`${baseUrl}/api/v1/broker/connect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Mock Auth for now - in real app this comes from context/cookie
                    'x-user-id': localStorage.getItem('aegis_user_id') || 'default_user'
                },
                body: JSON.stringify({
                    brokerName: selectedBroker,
                    credentials: {
                        apiKey,
                        apiSecret
                    }
                })
            });

            const data = await res.json();

            if (res.ok) {
                // Success - Redirect to Dashboard
                router.push('/dashboard');
            } else {
                setError(data.message || 'Failed to connect broker');
            }
        } catch (e) {
            setError('Connection failed. Is the backend running?');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-96 bg-blue-600/10 rounded-full blur-[128px] -translate-y-1/2" />

            <div className="w-full max-w-4xl z-10 grid grid-cols-1 md:grid-cols-2 gap-12">

                {/* Left Side: Info */}
                <div className="flex flex-col justify-center space-y-6">
                    <div className="flex items-center space-x-2 text-blue-400">
                        <Shield className="w-6 h-6" />
                        <span className="text-sm uppercase tracking-widest font-semibold">Secure Integration</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                        Connect Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                            Execution Engine
                        </span>
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Link your brokerage account to enable automated execution.
                        Credentials are encrypted using AES-256-GCM and never exposed.
                    </p>

                    <div className="space-y-4 pt-4">
                        <div className="flex items-start space-x-3">
                            <Lock className="w-5 h-5 text-green-400 mt-1" />
                            <div>
                                <h3 className="text-white font-medium">Bank-Grade Encryption</h3>
                                <p className="text-sm text-gray-500">Your keys are encrypted at rest and in transit.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-blue-400 mt-1" />
                            <div>
                                <h3 className="text-white font-medium">Read-Only Safety</h3>
                                <p className="text-sm text-gray-500">We default to safe modes until you authorize live trades.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Selection Form */}
                <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
                    <h2 className="text-2xl font-semibold mb-6">Select Broker</h2>

                    {/* Broker Grid */}
                    <div className="grid grid-cols-1 gap-3 mb-6">
                        {brokers.map((broker) => (
                            <button
                                key={broker.id}
                                onClick={() => setSelectedBroker(broker.id)}
                                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${selectedBroker === broker.id
                                        ? 'bg-zinc-800 border-blue-500/50 shadow-lg shadow-blue-500/10'
                                        : 'bg-zinc-900/30 border-zinc-800 hover:bg-zinc-800/50 hover:border-zinc-700'
                                    }`}
                            >
                                <span className="font-medium text-lg">{broker.name}</span>
                                <span className={`text-xs px-2 py-1 rounded-full border ${broker.color}`}>
                                    {broker.status}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Inputs */}
                    {selectedBroker && selectedBroker !== 'ZERODHA_PAPER' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                            <div className="space-y-2">
                                <label className="text-xs uppercase text-gray-500 font-semibold tracking-wider">API Key</label>
                                <Input
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    className="bg-zinc-950 border-zinc-800 focus:border-blue-500/50"
                                    placeholder="Enter API Key"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase text-gray-500 font-semibold tracking-wider">API Secret</label>
                                <Input
                                    type="password"
                                    value={apiSecret}
                                    onChange={(e) => setApiSecret(e.target.value)}
                                    className="bg-zinc-950 border-zinc-800 focus:border-blue-500/50"
                                    placeholder="Enter API Secret"
                                />
                            </div>
                        </div>
                    )}

                    {selectedBroker === 'ZERODHA_PAPER' && (
                        <div className="p-4 bg-green-900/10 border border-green-900/30 rounded-lg mb-6">
                            <p className="text-sm text-green-400">
                                Paper trading simulation uses live market data but executes virtually. No real funds are at risk.
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="flex items-center space-x-2 text-red-400 text-sm mt-4 p-3 bg-red-900/10 rounded-lg border border-red-900/20">
                            <AlertTriangle className="w-4 h-4" />
                            <span>{error}</span>
                        </div>
                    )}

                    <Button
                        onClick={handleConnect}
                        disabled={!selectedBroker || (selectedBroker !== 'ZERODHA_PAPER' && (!apiKey || !apiSecret)) || isLoading}
                        className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-medium py-6 rounded-xl transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Connecting...' : 'Connect Broker'}
                        {!isLoading && <ArrowRight className="w-5 h-5 ml-2" />}
                    </Button>
                </Card>
            </div>
        </div>
    );
}
