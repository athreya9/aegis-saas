"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Send, Bot, User, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const initialMessages = [
    { role: "assistant", content: "Hello. I am the Aegis Assistance Module. I can help with platform navigation, risk parameter definitions, and documentation. I cannot provide financial advice." }
]

export default function AssistantPage() {
    const [messages, setMessages] = useState(initialMessages)
    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)

    const handleSend = async () => {
        if (!input.trim()) return

        const userMsg = { role: "user", content: input }
        setMessages(prev => [...prev, userMsg])
        setInput("")
        setIsTyping(true)

        // Simulate AI response delay
        setTimeout(() => {
            setIsTyping(false)
            const botResponses = [
                "You can adjust risk parameters in Settings > Risk Configuration.",
                "The Margin Utilization Ratio calculates deployed capital vs. total available buying power.",
                "To connect a new broker, navigate to the Connectivity Hub.",
                "System status is currently optimal with 14ms execution latency."
            ]
            const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)]

            setMessages(prev => [...prev, { role: "assistant", content: randomResponse }])
        }, 1500)
    }

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg shadow-white/10">
                    <Sparkles size={20} className="text-black" />
                </div>
                <div>
                    <h1 className="text-2xl font-black italic tracking-tighter text-white">Assistant</h1>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Context-Aware Help Engine</p>
                </div>
            </div>

            <div className="flex-1 vercel-card bg-[#050505] overflow-hidden flex flex-col">
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg, i) => (
                        <div key={i} className={cn("flex gap-4", msg.role === "user" ? "flex-row-reverse" : "")}>
                            <div className={cn(
                                "w-8 h-8 rounded flex items-center justify-center shrink-0",
                                msg.role === "assistant" ? "bg-[#222]" : "bg-white"
                            )}>
                                {msg.role === "assistant" ? <Bot size={14} className="text-white" /> : <User size={14} className="text-black" />}
                            </div>
                            <div className={cn(
                                "max-w-[80%] rounded-2xl px-5 py-3 text-sm font-medium leading-relaxed",
                                msg.role === "assistant" ? "bg-[#111] text-muted-foreground border border-[#222]" : "bg-white text-black"
                            )}>
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded bg-[#222] flex items-center justify-center shrink-0">
                                <Bot size={14} className="text-white" />
                            </div>
                            <div className="bg-[#111] border border-[#222] rounded-2xl px-5 py-3 flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" />
                                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce delay-100" />
                                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce delay-200" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-[#111] bg-[#000]">
                    <div className="relative flex items-center gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Ask about platform features..."
                            className="flex-1 h-12 bg-[#0a0a0a] border border-[#222] rounded-xl px-4 focus:ring-1 focus:ring-white focus:border-white transition-all outline-none text-sm placeholder:text-muted-foreground/50"
                        />
                        <Button
                            onClick={handleSend}
                            variant="linear"
                            className="h-12 w-12 rounded-xl bg-white text-black hover:bg-white/90 p-0"
                        >
                            <Send size={18} />
                        </Button>
                    </div>
                    <p className="text-center mt-3 text-[10px] text-muted-foreground/40 font-medium">
                        AI responses are generated based on documentation. Do not rely on for critical trading decisions.
                    </p>
                </div>
            </div>
        </div>
    )
}
