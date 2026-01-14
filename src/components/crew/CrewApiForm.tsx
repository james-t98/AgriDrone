"use client";

import React, { useState, FormEvent } from "react";
import { cn } from "@/lib/utils";

interface CrewApiFormProps {
    baseUrl: string;
    bearerToken: string;
    className?: string;
}

interface LastStep {
    thought: string;
    action: string;
    actionInput: string;
    actionResult: string;
    result?: string;
}

const CrewApiForm: React.FC<CrewApiFormProps> = ({ baseUrl, bearerToken, className }) => {
    const [currentYear, setCurrentYear] = useState("");
    const [topic, setTopic] = useState("");
    const [taskId, setTaskId] = useState<string>("");
    const [state, setState] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [lastStep, setLastStep] = useState<LastStep | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        setResult(null);
        setLastStep(null);

        try {
            const kickoffResponse = await fetch(`${baseUrl}/kickoff`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${bearerToken}`,
                },
                body: JSON.stringify({
                    inputs: {
                        current_year: currentYear,
                        topic: topic,
                    },
                }),
            });

            if (!kickoffResponse.ok) {
                throw new Error(`HTTP error! status: ${kickoffResponse.status}`);
            }

            const kickoffData = await kickoffResponse.json();
            setTaskId(kickoffData.kickoff_id);
            pollStatus(kickoffData.kickoff_id);
        } catch (err) {
            console.error("Error starting crew:", err);
            setError(err instanceof Error ? err.message : "Failed to start crew");
            setIsLoading(false);
        }
    };

    const parseLastStep = (lastStepData: Record<string, unknown>): LastStep => {
        // Handle different possible structures of last_step
        const actionText = typeof lastStepData.action === "string" ? lastStepData.action : "";
        const resultText = typeof lastStepData.result === "string" ? lastStepData.result : "";

        // If action is empty, try to use other fields that might contain the data
        const textToParse = actionText ||
            (typeof lastStepData.thought === "string" ? lastStepData.thought : "") ||
            (typeof lastStepData.output === "string" ? lastStepData.output : "");

        // Parse the action text for structured data
        let thought = "";
        let action = "";
        let actionInput = "";
        let actionResult = "";

        if (textToParse) {
            const thoughtMatch = textToParse.match(/Thought:\s*([\s\S]*?)(?=Action:|$)/);
            const actionMatch = textToParse.match(/Action:\s*([\s\S]*?)(?=Action Input:|$)/);
            const actionInputMatch = textToParse.match(/Action Input:\s*([\s\S]*)/);
            const resultInputMatch = textToParse.match(/Result:\s*([\s\S]*)/);

            thought = thoughtMatch ? thoughtMatch[1].trim() : "";
            action = actionMatch ? actionMatch[1].trim() : "";
            actionInput = actionInputMatch ? actionInputMatch[1].trim() : "";
            actionResult = resultInputMatch ? resultInputMatch[1].trim() : "";
        }

        // If no structured data found, use the raw text as thought
        if (!thought && !action && textToParse) {
            thought = textToParse;
        }

        // Also check for direct properties on the response
        if (!thought && typeof lastStepData.thought === "string") {
            thought = lastStepData.thought;
        }
        if (!action && typeof lastStepData.tool === "string") {
            action = lastStepData.tool;
        }
        if (!actionInput && typeof lastStepData.tool_input === "string") {
            actionInput = lastStepData.tool_input;
        }

        return { thought, action, actionInput, actionResult, result: resultText };
    };

    const pollStatus = async (id: string) => {
        try {
            const statusResponse = await fetch(`${baseUrl}/status/${id}`, {
                headers: {
                    Authorization: `Bearer ${bearerToken}`,
                },
            });

            if (!statusResponse.ok) {
                throw new Error(`HTTP error! status: ${statusResponse.status}`);
            }

            const statusData = await statusResponse.json();
            console.log("Status response:", statusData); // Debug log to see the structure

            setState(statusData.state || "");
            setStatus(statusData.status || "");

            // Safely parse last_step if it exists and is an object
            if (statusData.last_step && typeof statusData.last_step === "object") {
                setLastStep(parseLastStep(statusData.last_step));
            } else {
                setLastStep(null);
            }

            setResult(statusData.result || null);

            if (statusData.state === "SUCCESS" || statusData.state === "FAILED") {
                setIsLoading(false);
            } else {
                setTimeout(() => pollStatus(id), 10000);
            }
        } catch (err) {
            console.error("Error fetching status:", err);
            setTimeout(() => pollStatus(id), 10000);
        }
    };

    return (
        <div className={cn("space-y-4", className)}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                        Current Year
                    </label>
                    <input
                        type="text"
                        value={currentYear}
                        onChange={(e) => setCurrentYear(e.target.value)}
                        placeholder="e.g., 2026"
                        className="w-full px-4 py-2.5 rounded-lg bg-[var(--surface-hover)] border border-[var(--border)] focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-[var(--foreground)] placeholder-[var(--text-muted)] transition-colors"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                        Topic
                    </label>
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., Smart Farming AI Trends"
                        className="w-full px-4 py-2.5 rounded-lg bg-[var(--surface-hover)] border border-[var(--border)] focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-[var(--foreground)] placeholder-[var(--text-muted)] transition-colors"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading || !baseUrl || !bearerToken}
                    className={cn(
                        "w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200",
                        "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700",
                        "shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40",
                        "flex items-center justify-center gap-2",
                        (isLoading || !baseUrl || !bearerToken) && "opacity-50 cursor-not-allowed"
                    )}
                >
                    {isLoading ? (
                        <>
                            <svg
                                className="animate-spin h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.963 7.963 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            Processing...
                        </>
                    ) : (
                        "Start Crew"
                    )}
                </button>
            </form>

            {/* Error Message */}
            {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-sm text-red-500 font-medium">Error</p>
                    <p className="text-sm text-red-400 mt-1">{error}</p>
                </div>
            )}

            {/* Task Status */}
            {taskId && state !== "SUCCESS" && !error && (
                <div className="p-4 rounded-lg bg-[var(--surface-hover)] border border-[var(--border)]">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                        <span className="text-sm font-medium text-[var(--foreground)]">Task Running</span>
                    </div>
                    <div className="space-y-2 text-sm">
                        <p className="text-[var(--text-muted)]">
                            <span className="text-[var(--foreground)] font-medium">Task ID:</span> {taskId}
                        </p>
                        <p className="text-[var(--text-muted)]">
                            <span className="text-[var(--foreground)] font-medium">State:</span> {state}
                        </p>
                        <p className="text-[var(--text-muted)]">
                            <span className="text-[var(--foreground)] font-medium">Status:</span> {status}
                        </p>
                    </div>
                </div>
            )}

            {/* Last Step Details */}
            {status && status !== "SUCCESS" && lastStep && (
                <div className="p-4 rounded-lg bg-[var(--surface-hover)] border border-[var(--border)] space-y-4">
                    <h4 className="font-medium text-[var(--foreground)] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        Last Step Details
                    </h4>

                    {lastStep.thought && (
                        <div>
                            <p className="text-xs font-medium text-purple-500 uppercase tracking-wide mb-1">
                                Thought
                            </p>
                            <pre className="text-sm text-[var(--text-muted)] whitespace-pre-wrap bg-[var(--surface)] p-3 rounded-lg overflow-x-auto">
                                {lastStep.thought}
                            </pre>
                        </div>
                    )}

                    {lastStep.action && (
                        <div>
                            <p className="text-xs font-medium text-blue-500 uppercase tracking-wide mb-1">
                                Action
                            </p>
                            <pre className="text-sm text-[var(--text-muted)] whitespace-pre-wrap bg-[var(--surface)] p-3 rounded-lg overflow-x-auto">
                                {lastStep.action}
                            </pre>
                        </div>
                    )}

                    {lastStep.actionInput && (
                        <div>
                            <p className="text-xs font-medium text-green-500 uppercase tracking-wide mb-1">
                                Action Input
                            </p>
                            <pre className="text-sm text-[var(--text-muted)] whitespace-pre-wrap bg-[var(--surface)] p-3 rounded-lg overflow-x-auto">
                                {lastStep.actionInput}
                            </pre>
                        </div>
                    )}

                    {lastStep.result && (
                        <div>
                            <p className="text-xs font-medium text-amber-500 uppercase tracking-wide mb-1">
                                Action Result
                            </p>
                            <pre className="text-sm text-[var(--text-muted)] whitespace-pre-wrap bg-[var(--surface)] p-3 rounded-lg overflow-x-auto">
                                {lastStep.result}
                            </pre>
                        </div>
                    )}
                </div>
            )}

            {/* Final Result */}
            {result && (
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="font-medium text-green-500">Final Result</span>
                    </div>
                    <div className="text-sm text-[var(--foreground)] whitespace-pre-wrap break-words">
                        {result}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CrewApiForm;
