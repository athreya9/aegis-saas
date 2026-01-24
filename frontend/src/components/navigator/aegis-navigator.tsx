"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HelpCircle, X, Search, ChevronRight, MessageSquare, Send, ArrowLeft, Book, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import knowledgeBase from "./knowledge-base.json"

interface NavigatorState {
    view: "home" | "category" | "detail" | "contact" | "success"
    categoryIndex?: number
    questionIndex?: number
    searchQuery: string
}

export function AegisNavigator() {
    const [isOpen, setIsOpen] = useState(false)
    const [state, setState] = useState<NavigatorState>({ view: "home", searchQuery: "" })
    const [email, setEmail] = useState("")
    const [query, setQuery] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Reset state when closed
    useEffect(() => {
        if (!isOpen) {
            const timer = setTimeout(() => {
                setState({ view: "home", searchQuery: "" })
                setEmail("")
                setQuery("")
            }, 300)
            return () => clearTimeout(timer)
        }
    }, [isOpen])

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Mock Backend Call
        console.log("Routing support request to info@virtusol.com", { email, query })

        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1500))

        setState({ ...state, view: "success" })
        setIsSubmitting(false)
    }

    const filteredQuestions = state.searchQuery
        ? knowledgeBase.flatMap((cat, catIdx) =>
            cat.questions
                .map((q, qIdx) => ({ ...q, catIdx, qIdx, catName: cat.category }))
                .filter(q => q.question.toLowerCase().includes(state.searchQuery.toLowerCase()) || q.answer.toLowerCase().includes(state.searchQuery.toLowerCase()))
        )
        : []

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 right-6 z-50 w-[380px] h-[550px] bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/5"
                    >
                        {/* Header */}
                        <div className="h-16 border-b border-white/5 bg-[#111] flex items-center justify-between px-6 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                                    <Book className="w-4 h-4 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-white">Aegis Navigator</h3>
                                    <p className="text-[10px] text-zinc-400">Platform Guide</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white" onClick={() => setIsOpen(false)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 flex flex-col overflow-hidden bg-[#0A0A0A]">

                            {/* HOME VIEW */}
                            {state.view === "home" && !state.searchQuery && (
                                <ScrollArea className="flex-1 p-6">
                                    <div className="space-y-6">
                                        <div className="p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                                            <p className="text-sm text-zinc-300 leading-relaxed">
                                                I can help you understand how Aegis works, how to connect your broker, or where to find specific settings.
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Help Topics</h4>
                                            {knowledgeBase.map((cat, idx) => (
                                                <button
                                                    key={idx}
                                                    className="w-full flex items-center justify-between p-4 rounded-xl bg-[#111] border border-white/5 hover:bg-[#161616] hover:border-white/10 transition-all text-left group"
                                                    onClick={() => setState({ ...state, view: "category", categoryIndex: idx })}
                                                >
                                                    <span className="text-sm font-medium text-zinc-200 group-hover:text-white">{cat.category}</span>
                                                    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400" />
                                                </button>
                                            ))}
                                        </div>

                                        <div className="pt-4 border-t border-white/5">
                                            <button
                                                className="w-full flex items-center gap-3 p-4 rounded-xl bg-transparent border border-dashed border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all text-left group"
                                                onClick={() => setState({ ...state, view: "contact" })}
                                            >
                                                <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center">
                                                    <MessageSquare className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300">Still need help?</div>
                                                    <div className="text-xs text-zinc-600">Contact our support team</div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </ScrollArea>
                            )}

                            {/* SEARCH RESULTS */}
                            {state.searchQuery && (
                                <ScrollArea className="flex-1 p-4">
                                    {filteredQuestions.length > 0 ? (
                                        <div className="space-y-2">
                                            {filteredQuestions.map((item, i) => (
                                                <button
                                                    key={i}
                                                    className="w-full text-left p-4 rounded-lg bg-[#111] hover:bg-[#161616] border border-white/5 transition-colors"
                                                    onClick={() => setState({ ...state, view: "detail", categoryIndex: item.catIdx, questionIndex: item.qIdx, searchQuery: "" })}
                                                >
                                                    <div className="text-xs text-indigo-400 mb-1">{item.catName}</div>
                                                    <div className="text-sm text-zinc-200">{item.question}</div>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="w-12 h-12 rounded-full bg-zinc-900 mx-auto flex items-center justify-center mb-4">
                                                <Search className="w-5 h-5 text-zinc-600" />
                                            </div>
                                            <p className="text-sm text-zinc-400">No matching topics found.</p>
                                            <Button
                                                variant="link"
                                                className="text-indigo-400 mt-2"
                                                onClick={() => setState({ ...state, view: "contact", searchQuery: "" })}
                                            >
                                                Contact Support
                                            </Button>
                                        </div>
                                    )}
                                </ScrollArea>
                            )}

                            {/* CATEGORY VIEW */}
                            {state.view === "category" && typeof state.categoryIndex === "number" && (
                                <div className="flex-1 flex flex-col">
                                    <div className="p-4 border-b border-white/5 flex items-center gap-2">
                                        <Button variant="ghost" size="icon" className="h-6 w-6 -ml-2" onClick={() => setState({ ...state, view: "home" })}>
                                            <ArrowLeft className="w-4 h-4" />
                                        </Button>
                                        <span className="text-sm font-medium text-white">{knowledgeBase[state.categoryIndex].category}</span>
                                    </div>
                                    <ScrollArea className="flex-1 p-4">
                                        <div className="space-y-2">
                                            {knowledgeBase[state.categoryIndex].questions.map((q, idx) => (
                                                <button
                                                    key={idx}
                                                    className="w-full text-left p-4 rounded-lg bg-[#111] hover:bg-[#161616] border border-white/5 transition-colors"
                                                    onClick={() => setState({ ...state, view: "detail", questionIndex: idx })}
                                                >
                                                    <div className="text-sm text-zinc-200">{q.question}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </div>
                            )}

                            {/* DETAIL VIEW */}
                            {state.view === "detail" && typeof state.categoryIndex === "number" && typeof state.questionIndex === "number" && (
                                <div className="flex-1 flex flex-col">
                                    <div className="p-4 border-b border-white/5 flex items-center gap-2">
                                        <Button variant="ghost" size="icon" className="h-6 w-6 -ml-2" onClick={() => setState({ ...state, view: "category" })}>
                                            <ArrowLeft className="w-4 h-4" />
                                        </Button>
                                        <span className="text-sm font-medium text-zinc-400">Back to topics</span>
                                    </div>
                                    <ScrollArea className="flex-1 p-6">
                                        <div className="space-y-6">
                                            <h3 className="text-lg font-medium text-white">
                                                {knowledgeBase[state.categoryIndex].questions[state.questionIndex].question}
                                            </h3>
                                            <div className="prose prose-invert prose-sm text-zinc-300">
                                                <p className="whitespace-pre-line leading-relaxed">
                                                    {knowledgeBase[state.categoryIndex].questions[state.questionIndex].answer}
                                                </p>
                                            </div>

                                            {/* External Link if exists */}
                                            {(knowledgeBase[state.categoryIndex].questions[state.questionIndex] as any).link && (
                                                <a
                                                    href={(knowledgeBase[state.categoryIndex].questions[state.questionIndex] as any).link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors group"
                                                >
                                                    <ExternalLink className="w-4 h-4 text-indigo-400" />
                                                    <span className="text-sm font-medium text-indigo-300 group-hover:text-indigo-200">
                                                        {(knowledgeBase[state.categoryIndex].questions[state.questionIndex] as any).link.text}
                                                    </span>
                                                </a>
                                            )}
                                        </div>
                                    </ScrollArea>
                                </div>
                            )}

                            {/* CONTACT VIEW */}
                            {state.view === "contact" && (
                                <div className="flex-1 flex flex-col">
                                    <div className="p-4 border-b border-white/5 flex items-center gap-2">
                                        <Button variant="ghost" size="icon" className="h-6 w-6 -ml-2" onClick={() => setState({ ...state, view: "home" })}>
                                            <ArrowLeft className="w-4 h-4" />
                                        </Button>
                                        <span className="text-sm font-medium text-white">Support Request</span>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-sm text-zinc-400 mb-6">
                                            For specific account inquiries or issues not covered in the guide, please provide details below. Our team reviews all requests manually.
                                        </p>
                                        <form onSubmit={handleContactSubmit} className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-zinc-500 uppercase">Your Email</label>
                                                <Input
                                                    type="email"
                                                    required
                                                    placeholder="name@company.com"
                                                    className="bg-[#111] border-white/10 text-white focus:border-indigo-500"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-zinc-500 uppercase">How can we help?</label>
                                                <textarea
                                                    required
                                                    className="w-full h-32 rounded-md bg-[#111] border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none placeholder:text-zinc-600"
                                                    placeholder="Describe your issue or question..."
                                                    value={query}
                                                    onChange={(e) => setQuery(e.target.value)}
                                                />
                                            </div>
                                            <Button
                                                type="submit"
                                                className="w-full bg-white text-black hover:bg-zinc-200 font-medium"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? "Sending..." : "Submit Request"}
                                            </Button>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* SUCCESS VIEW */}
                            {state.view === "success" && (
                                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20">
                                        <Send className="w-8 h-8 text-emerald-500" />
                                    </div>
                                    <h3 className="text-lg font-medium text-white mb-2">Request Sent</h3>
                                    <p className="text-sm text-zinc-400 max-w-[260px] leading-relaxed mb-8">
                                        Your request has been forwarded to our support team. We generally respond within 24 hours.
                                    </p>
                                    <Button
                                        variant="outline"
                                        className="border-white/10 hover:bg-white hover:text-black transition-colors"
                                        onClick={() => setState({ ...state, view: "home" })}
                                    >
                                        Return to Guide
                                    </Button>
                                </div>
                            )}

                            {/* Footer / Search Bar (Visible on Home and Search) */}
                            {(state.view === "home" || state.searchQuery) && !state.view.match(/category|detail|contact|success/) && (
                                <div className="p-4 bg-[#111] border-t border-white/5">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                        <Input
                                            placeholder="Search for answers..."
                                            className="pl-9 bg-[#0A0A0A] border-white/10 focus:border-indigo-500 text-sm h-10 ring-0 focus-visible:ring-0"
                                            value={state.searchQuery}
                                            onChange={(e) => setState({ ...state, searchQuery: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Trigger Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-colors border border-white/10 ${isOpen ? 'bg-[#1a1a1a]' : 'bg-white hover:bg-zinc-200'}`}
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-white" />
                ) : (
                    <HelpCircle className="w-7 h-7 text-black" />
                )}
            </motion.button>
        </>
    )
}
