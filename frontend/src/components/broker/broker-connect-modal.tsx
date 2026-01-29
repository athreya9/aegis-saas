"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldAlert, CheckCircle, Loader2 } from "lucide-react";

interface BrokerConnectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConnect: (brokerId: string, credentials: Record<string, string>) => void;
    executionMode?: 'SANDBOX' | 'REQUESTED' | 'LIVE';
}

const SUPPORTED_BROKERS = [
    { id: 'ZERODHA', name: 'Zerodha Kite', fields: ['apiKey', 'accessToken'], help: 'Generate API Key in Zerodha MyAPI portal. Requires active Kite Connect subscription.' },
    { id: 'ZERODHA_PAPER', name: 'Zerodha (Paper Trading)', fields: ['apiKey'], help: 'Sandbox mode for SaaS testing. Accepts any key.' },
    { id: 'ANGEL_ONE', name: 'Angel One', fields: ['apiKey', 'userId', 'password', 'totp'], help: 'API Key from SmartAPI. TOTP from Authenticator App.' },
    { id: 'FYERS', name: 'Fyers', fields: ['appId', 'accessToken'], help: 'Generate App ID in Fyers API Dashboard.' }
];

export function BrokerConnectModal({ isOpen, onClose, onConnect, executionMode = 'SANDBOX' }: BrokerConnectModalProps) {
    const [selectedBroker, setSelectedBroker] = useState(SUPPORTED_BROKERS[0]);
    const [credentials, setCredentials] = useState<Record<string, string>>({});
    const [status, setStatus] = useState<'IDLE' | 'CONNECTING' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [requestLiveStatus, setRequestLiveStatus] = useState<'IDLE' | 'REQUESTING' | 'SUCCESS'>('IDLE');

    const loading = status === 'CONNECTING';
    const error = status === 'ERROR' ? "Failed to connect to broker. Please check credentials." : null;

    const handleConnect = async () => {
        setStatus('CONNECTING');
        try {
            await onConnect(selectedBroker.id, credentials);
            setStatus('SUCCESS');
            // Don't close immediately to show connection success state
        } catch (e) {
            setStatus('ERROR');
        }
    };

    const handleRequestLive = async () => {
        setRequestLiveStatus('REQUESTING');
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4100';
            await fetch(`${baseUrl}/api/v1/execution-mode/request-live`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-user-id': 'default_user' }
            });
            setRequestLiveStatus('SUCCESS');
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-zinc-950 border-zinc-900 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                        Broker Integration (READ-ONLY)
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500">
                        Link your broker for signal validation. No trades will be executed.
                    </DialogDescription>
                </DialogHeader>

                <Alert className={`${executionMode === 'LIVE' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'} py-3`}>
                    <ShieldAlert className="h-4 w-4" />
                    <AlertDescription className="text-[10px] uppercase font-black tracking-[0.2em] flex items-center justify-between w-full">
                        <span>{executionMode === 'LIVE' ? 'LIVE EXECUTION ENABLED' : 'ABSOLUTE READ-ONLY ISOLATION'}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] ${executionMode === 'LIVE' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-black'}`}>
                            {executionMode}
                        </span>
                    </AlertDescription>
                </Alert>

                {status === 'SUCCESS' && executionMode === 'SANDBOX' && (
                    <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800 text-center space-y-3">
                        <p className="text-xs text-zinc-400">Broker connected successfully in Sandbox mode.</p>
                        {requestLiveStatus === 'SUCCESS' ? (
                            <div className="text-amber-500 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                                <CheckCircle className="w-4 h-4" /> Request Pending Admin Review
                            </div>
                        ) : (
                            <Button
                                onClick={handleRequestLive}
                                disabled={requestLiveStatus === 'REQUESTING'}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest"
                            >
                                {requestLiveStatus === 'REQUESTING' ? 'Requesting...' : 'Request Live Access'}
                            </Button>
                        )}
                    </div>
                )}

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Select Broker</Label>
                        <select
                            className="w-full bg-zinc-900 border-zinc-800 rounded-md p-2 text-sm text-white"
                            onChange={(e) => {
                                const b = SUPPORTED_BROKERS.find(x => x.id === e.target.value)!;
                                setSelectedBroker(b);
                                setCredentials({});
                            }}
                        >
                            {SUPPORTED_BROKERS.map(b => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>
                        <p className="text-[10px] text-zinc-500 font-medium italic mt-1 leading-relaxed">
                            {selectedBroker.help}
                        </p>
                    </div>

                    {selectedBroker.fields.map(field => (
                        <div key={field} className="space-y-2">
                            <Label className="capitalize">{field.replace(/([A-Z])/g, ' $1')}</Label>
                            <Input
                                type="password"
                                className="bg-zinc-900 border-zinc-800"
                                onChange={(e) => setCredentials({ ...credentials, [field]: e.target.value })}
                            />
                        </div>
                    ))}

                    {error && (
                        <p className="text-xs text-rose-500 font-medium">{error}</p>
                    )}
                </div>

                <div className="flex justify-end gap-3">
                    <Button variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
                    <Button
                        className="bg-emerald-600 hover:bg-emerald-700"
                        onClick={handleConnect}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Validate Connection'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
