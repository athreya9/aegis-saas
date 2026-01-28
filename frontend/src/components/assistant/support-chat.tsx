"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import knowledgeBase from "@/config/knowledge-base.json";

interface Message {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    isFallback?: boolean;
}

export function SupportChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', sender: 'bot', text: "Aegis Systems Online. Query database loaded. How can I assist with platform configuration?" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [email, setEmail] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // Process Query
        setTimeout(() => {
            const lowerInput = userMsg.text.toLowerCase();
            const match = knowledgeBase.find(kb =>
                kb.keywords.some(k => lowerInput.includes(k))
            );

            if (match) {
                setMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    sender: 'bot',
                    text: match.response
                }]);
            } else {
                setMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    sender: 'bot',
                    text: "Query parameters outside local index. Escalation required. Please provide your email for a senior engineer ticket.",
                    isFallback: true
                }]);
                setShowEmailForm(true);
            }
            setIsTyping(false);
        }, 800);
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Mock backend submission
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            sender: 'bot',
            text: `Ticket #AE-${Math.floor(Math.random() * 10000)} created. Priority: Normal. We will contact ${email} shortly.`
        }]);
        setShowEmailForm(false);
        setEmail("");
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="h-14 w-14 rounded-full bg-zinc-900 border border-zinc-800 shadow-2xl hover:bg-zinc-800 transition-all duration-300"
                >
                    <MessageSquare className="h-6 w-6 text-white" />
                </Button>
            )}

            {isOpen && (
                <Card className="w-[350px] h-[500px] bg-black border-zinc-800 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
                    {/* Header */}
                    <div className="p-4 border-b border-zinc-900 bg-zinc-950 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-black uppercase tracking-widest text-zinc-400">System Assistant</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-500 hover:text-white" onClick={() => setIsOpen(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs" ref={scrollRef}>
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-lg ${msg.sender === 'user'
                                        ? 'bg-zinc-900 text-white'
                                        : 'bg-zinc-950 border border-zinc-900 text-zinc-400'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-zinc-950 border border-zinc-900 p-3 rounded-lg flex gap-1">
                                    <span className="w-1 h-1 bg-zinc-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <span className="w-1 h-1 bg-zinc-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <span className="w-1 h-1 bg-zinc-600 rounded-full animate-bounce" />
                                </div>
                            </div>
                        )}
                        {showEmailForm && (
                            <form onSubmit={handleEmailSubmit} className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800 space-y-2 animate-in fade-in zoom-in-95">
                                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Secure Handler</p>
                                <Input
                                    type="email"
                                    placeholder="engineer@domain.com"
                                    className="h-8 text-xs bg-black border-zinc-800"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Button type="submit" size="sm" className="w-full h-7 text-[10px] uppercase font-bold bg-indigo-600 hover:bg-indigo-700">
                                    Submit Ticket
                                </Button>
                            </form>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-zinc-950 border-t border-zinc-900">
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                            className="flex items-center gap-2"
                        >
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Execute query..."
                                className="bg-black border-zinc-800 text-xs h-9 focus-visible:ring-zinc-800"
                            />
                            <Button type="submit" size="icon" className="h-9 w-9 bg-zinc-900 hover:bg-zinc-800 text-zinc-400">
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                </Card>
            )}
        </div>
    );
}
