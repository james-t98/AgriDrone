"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Sparkles, Cpu, Zap, ArrowRight, Settings, ChevronDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { GlassyButton } from "@/components/ui/GlassyButton";
import { RotatingCard, FloatingElement } from "@/components/ui/RotatingCard";
import CrewApiForm from "@/components/crew/CrewApiForm";

export default function AgentPage() {
    const [baseUrl, setBaseUrl] = useState("https://your-crewai-api.com");
    const [bearerToken, setBearerToken] = useState("");
    const [showConfig, setShowConfig] = useState(true);

    const capabilities = [
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
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
                <div className="flex items-center gap-4">
                    <FloatingElement amplitude={5} duration={2}>
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                            <Bot className="w-7 h-7 text-white" />
                        </div>
                    </FloatingElement>
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
                            AI Agent
                            <Sparkles className="w-5 h-5 text-purple-500" />
                        </h1>
                        <p className="text-sm text-[var(--text-muted)] mt-1">
                            Interact with your intelligent farming assistant powered by CrewAI
                        </p>
                    </div>
                </div>
                <GlassyButton
                    variant="default"
                    icon={<Settings className="w-4 h-4" />}
                    onClick={() => setShowConfig(!showConfig)}
                >
                    {showConfig ? "Hide Config" : "Show Config"}
                    <ChevronDown className={`w-4 h-4 transition-transform ${showConfig ? "rotate-180" : ""}`} />
                </GlassyButton>
            </motion.div>

            {/* API Configuration Panel */}
            <motion.div
                initial={false}
                animate={{
                    height: showConfig ? "auto" : 0,
                    opacity: showConfig ? 1 : 0,
                }}
                className="overflow-hidden"
            >
                <Card className="border-purple-500/20">
                    <CardHeader>
                        <CardTitle className="text-sm">API Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                                    Base URL
                                </label>
                                <input
                                    type="text"
                                    value={baseUrl}
                                    onChange={(e) => setBaseUrl(e.target.value)}
                                    placeholder="https://your-crewai-api.com"
                                    className="w-full px-4 py-2.5 rounded-lg bg-[var(--surface-hover)] border border-[var(--border)] focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-[var(--foreground)] placeholder-[var(--text-muted)]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                                    Bearer Token
                                </label>
                                <input
                                    type="password"
                                    value={bearerToken}
                                    onChange={(e) => setBearerToken(e.target.value)}
                                    placeholder="Enter your API bearer token"
                                    className="w-full px-4 py-2.5 rounded-lg bg-[var(--surface-hover)] border border-[var(--border)] focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-[var(--foreground)] placeholder-[var(--text-muted)]"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Main Interaction Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* CrewAI Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2"
                >
                    <Card className="h-full border-purple-500/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bot className="w-5 h-5 text-purple-500" />
                                Agent Interaction
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CrewApiForm baseUrl={baseUrl} bearerToken={bearerToken} />
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Capabilities Panel */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                >
                    <h3 className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider">
                        Capabilities
                    </h3>
                    {capabilities.map((feature, i) => {
                        const Icon = feature.icon;
                        const colorClasses = {
                            purple: "bg-purple-500/10 text-purple-500 group-hover:shadow-purple-500/20",
                            blue: "bg-blue-500/10 text-blue-500 group-hover:shadow-blue-500/20",
                            green: "bg-green-500/10 text-green-500 group-hover:shadow-green-500/20",
                        }[feature.color];

                        return (
                            <RotatingCard key={feature.title} rotationIntensity={5}>
                                <motion.div
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                    className="group p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-purple-500/30 transition-all"
                                >
                                    <div className={`w-10 h-10 rounded-lg ${colorClasses} flex items-center justify-center mb-3 shadow-lg transition-shadow`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <h4 className="font-semibold text-[var(--foreground)] mb-1">{feature.title}</h4>
                                    <p className="text-sm text-[var(--text-muted)]">{feature.description}</p>
                                </motion.div>
                            </RotatingCard>
                        );
                    })}
                </motion.div>
            </div>

            {/* Example Prompts */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Example Prompts</CardTitle>
                        <span className="text-xs text-[var(--text-muted)]">Click to use</span>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {[
                                "Analyze crop health trends for Field A and recommend actions",
                                "What's the optimal irrigation schedule for this week?",
                                "Identify areas with the highest pest infestation risk",
                                "Generate a compliance report for the current quarter",
                                "Which fields should be prioritized for drone scanning?",
                                "Calculate the ROI impact of precision fertilization",
                            ].map((prompt, i) => (
                                <GlassyButton
                                    key={i}
                                    variant="default"
                                    size="sm"
                                    onClick={() => {
                                        // Could auto-fill the form here
                                    }}
                                    className="justify-start text-left"
                                >
                                    <span className="truncate">{prompt}</span>
                                </GlassyButton>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
