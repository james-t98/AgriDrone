"use client";

import { motion } from "framer-motion";
import { Bot, Sparkles, MessageSquare, Cpu, Zap, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

// 🔴 PLACEHOLDER: Agent Interaction Page
// The following TSX page will be provided later by the user.
// It is responsible for interacting with the Agentic (CrewAI) backend.
// Do NOT implement API logic here.
// Simply wire it into the routing and layout.

// <<AGENT_INTERACTION_TSX_PAGE_GOES_HERE>>

export default function AgentPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
                        <Bot className="w-7 h-7 text-purple-500" />
                        AI Agent
                    </h1>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                        Interact with your intelligent farming assistant powered by CrewAI
                    </p>
                </div>
            </motion.div>

            {/* Placeholder Content */}
            <Card variant="gradient" className="border-purple-500/20">
                <CardContent className="py-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-md mx-auto"
                    >
                        {/* Animated Bot Icon */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25"
                        >
                            <Bot className="w-12 h-12 text-white" />
                        </motion.div>

                        <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">
                            AgriDrone AI Agent
                        </h2>
                        <p className="text-[var(--text-muted)] mb-6">
                            Your intelligent farming assistant will be connected here. The CrewAI-powered agent
                            will help you analyze data, make decisions, and optimize your farm operations.
                        </p>

                        <div className="flex items-center justify-center gap-2 text-sm text-purple-500 mb-8">
                            <Sparkles className="w-4 h-4" />
                            <span>CrewAI Integration Pending</span>
                        </div>

                        <Button disabled className="bg-purple-500 hover:bg-purple-600">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Start Conversation
                        </Button>
                    </motion.div>
                </CardContent>
            </Card>

            {/* Capabilities Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    {
                        icon: Cpu,
                        title: "Multi-Agent System",
                        description: "Specialized AI agents for different farming tasks working together",
                        color: "purple",
                    },
                    {
                        icon: Zap,
                        title: "Real-time Analysis",
                        description: "Instant insights from drone data, weather, and sensor readings",
                        color: "blue",
                    },
                    {
                        icon: ArrowRight,
                        title: "Actionable Recommendations",
                        description: "Get specific suggestions for irrigation, fertilization, and pest control",
                        color: "green",
                    },
                ].map((feature, i) => {
                    const Icon = feature.icon;
                    const colorClasses = {
                        purple: "bg-purple-500/10 text-purple-500",
                        blue: "bg-blue-500/10 text-blue-500",
                        green: "bg-green-500/10 text-green-500",
                    }[feature.color];

                    return (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                        >
                            <Card className="h-full">
                                <CardContent className="p-5">
                                    <div className={`w-10 h-10 rounded-lg ${colorClasses} flex items-center justify-center mb-4`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-semibold text-[var(--foreground)] mb-2">{feature.title}</h3>
                                    <p className="text-sm text-[var(--text-muted)]">{feature.description}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* Sample Prompts */}
            <Card>
                <CardHeader>
                    <CardTitle>Example Prompts</CardTitle>
                    <span className="text-xs text-[var(--text-muted)]">Try these when connected</span>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                            "Analyze crop health trends for Field A and recommend actions",
                            "What's the optimal irrigation schedule for this week based on weather?",
                            "Identify areas with the highest risk of pest infestation",
                            "Generate a compliance report for the current quarter",
                            "Which fields should be prioritized for drone scanning today?",
                            "Calculate the ROI impact of increasing precision fertilization by 20%",
                        ].map((prompt, i) => (
                            <motion.button
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 + i * 0.05 }}
                                className="p-3 text-left rounded-lg bg-[var(--surface-hover)] hover:bg-[var(--border)] transition-colors text-sm text-[var(--text-muted)] hover:text-[var(--foreground)] cursor-not-allowed opacity-60"
                                disabled
                            >
                                "{prompt}"
                            </motion.button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
