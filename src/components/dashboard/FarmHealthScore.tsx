"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface FarmHealthScoreProps {
    score: number;
    trend: "up" | "down" | "stable";
    previousScore: number;
}

export function FarmHealthScore({ score, trend, previousScore }: FarmHealthScoreProps) {
    const circumference = 2 * Math.PI * 45;
    const progress = (score / 100) * circumference;
    const offset = circumference - progress;

    const getScoreColor = (value: number) => {
        if (value >= 80) return { stroke: "#22c55e", text: "text-green-500" };
        if (value >= 60) return { stroke: "#eab308", text: "text-yellow-500" };
        if (value >= 40) return { stroke: "#f97316", text: "text-orange-500" };
        return { stroke: "#ef4444", text: "text-red-500" };
    };

    const colors = getScoreColor(score);
    const changePct = ((score - previousScore) / previousScore * 100).toFixed(1);

    return (
        <Card className="h-full" variant="gradient">
            <CardHeader>
                <CardTitle>Farm Health Score</CardTitle>
                <div className={cn(
                    "flex items-center gap-1 text-sm font-medium",
                    trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-[var(--text-muted)]"
                )}>
                    {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {changePct}%
                </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
                {/* Circular Progress */}
                <div className="relative w-36 h-36 mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                        {/* Background circle */}
                        <circle
                            cx="72"
                            cy="72"
                            r="45"
                            fill="none"
                            stroke="var(--border)"
                            strokeWidth="8"
                        />
                        {/* Progress circle */}
                        <motion.circle
                            cx="72"
                            cy="72"
                            r="45"
                            fill="none"
                            stroke={colors.stroke}
                            strokeWidth="8"
                            strokeLinecap="round"
                            initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: offset }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                    </svg>
                    {/* Score text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className={cn("text-4xl font-bold", colors.text)}
                        >
                            {score}
                        </motion.span>
                        <span className="text-xs text-[var(--text-muted)]">out of 100</span>
                    </div>
                </div>

                {/* Breakdown */}
                <div className="w-full space-y-3">
                    {[
                        { label: "Crop Vitality", value: 92, color: "bg-green-500" },
                        { label: "Soil Health", value: 85, color: "bg-blue-500" },
                        { label: "Water Efficiency", value: 78, color: "bg-cyan-500" },
                        { label: "Pest Status", value: 88, color: "bg-purple-500" },
                    ].map((item, i) => (
                        <div key={item.label} className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <span className="text-[var(--text-muted)]">{item.label}</span>
                                <span className="font-medium text-[var(--foreground)]">{item.value}%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-[var(--surface-hover)] overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.value}%` }}
                                    transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                                    className={cn("h-full rounded-full", item.color)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
