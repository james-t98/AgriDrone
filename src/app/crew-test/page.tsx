"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Settings, ArrowLeft } from "lucide-react";
import Link from "next/link";
import CrewApiForm from "@/components/crew/CrewApiForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function CrewTestPage() {
    const [baseUrl, setBaseUrl] = useState("https://your-crewai-api.com");
    const [bearerToken, setBearerToken] = useState("");
    const [showConfig, setShowConfig] = useState(true);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
                <div className="flex items-center gap-4">
                    <Link
                        href="/agent"
                        className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
                            <Bot className="w-7 h-7 text-purple-500" />
                            CrewAI Test Page
                        </h1>
                        <p className="text-sm text-[var(--text-muted)] mt-1">
                            Test the CrewAI integration before full deployment
                        </p>
                    </div>
                </div>
                <Button
                    variant="secondary"
                    icon={<Settings className="w-4 h-4" />}
                    onClick={() => setShowConfig(!showConfig)}
                >
                    {showConfig ? "Hide Config" : "Show Config"}
                </Button>
            </motion.div>

            {/* Configuration Panel */}
            {showConfig && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>API Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                                    Base URL
                                </label>
                                <input
                                    type="text"
                                    value={baseUrl}
                                    onChange={(e) => setBaseUrl(e.target.value)}
                                    placeholder="https://your-crewai-api.com"
                                    className="w-full px-4 py-2 rounded-lg bg-[var(--surface-hover)] border border-[var(--border)] focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-[var(--foreground)] placeholder-[var(--text-muted)]"
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
                                    className="w-full px-4 py-2 rounded-lg bg-[var(--surface-hover)] border border-[var(--border)] focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-[var(--foreground)] placeholder-[var(--text-muted)]"
                                />
                            </div>
                            <p className="text-xs text-[var(--text-muted)]">
                                Configure your CrewAI API endpoint and authentication before testing.
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* CrewAI Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bot className="w-5 h-5 text-purple-500" />
                            CrewAI Interaction
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CrewApiForm
                            baseUrl={baseUrl}
                            bearerToken={bearerToken}
                        />
                    </CardContent>
                </Card>
            </motion.div>

            {/* Info Banner */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20"
            >
                <h4 className="font-semibold text-purple-500 mb-2">How to Use</h4>
                <ol className="text-sm text-[var(--text-muted)] space-y-1 list-decimal list-inside">
                    <li>Configure your CrewAI API base URL and bearer token above</li>
                    <li>Enter the current year and a topic for the AI crew to research</li>
                    <li>Click "Start Crew" to initiate the agentic workflow</li>
                    <li>Watch as the agents collaborate and provide step-by-step updates</li>
                    <li>View the final result when the crew completes its task</li>
                </ol>
            </motion.div>
        </div>
    );
}
