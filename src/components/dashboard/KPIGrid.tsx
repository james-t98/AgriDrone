"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Droplets, Leaf, Sprout, ThermometerSun } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface KPI {
    id: string;
    label: string;
    value: string | number;
    unit?: string;
    trend: "up" | "down" | "stable";
    trendValue: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
}

const mockKPIs: KPI[] = [
    {
        id: "yield",
        label: "Yield Forecast",
        value: "6,420",
        unit: "EUR/ha",
        trend: "up",
        trendValue: "+9%",
        icon: <TrendingUp className="w-5 h-5" />,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
    },
    {
        id: "water",
        label: "Water Usage",
        value: "42",
        unit: "%",
        trend: "down",
        trendValue: "-12%",
        icon: <Droplets className="w-5 h-5" />,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
    },
    {
        id: "soil",
        label: "Soil Health",
        value: "85",
        unit: "/100",
        trend: "up",
        trendValue: "+5%",
        icon: <Sprout className="w-5 h-5" />,
        color: "text-amber-500",
        bgColor: "bg-amber-500/10",
    },
    {
        id: "growth",
        label: "Crop Growth",
        value: "78",
        unit: "%",
        trend: "stable",
        trendValue: "0%",
        icon: <Leaf className="w-5 h-5" />,
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
    },
];

export function KPIGrid() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockKPIs.map((kpi, i) => (
                <motion.div
                    key={kpi.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                >
                    <Card className="relative overflow-hidden">
                        {/* Background decoration */}
                        <div
                            className={cn(
                                "absolute right-0 top-0 w-24 h-24 rounded-full blur-3xl opacity-20",
                                kpi.color.replace("text-", "bg-")
                            )}
                        />

                        <div className="relative">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className={cn("p-2.5 rounded-lg", kpi.bgColor)}>
                                    <span className={kpi.color}>{kpi.icon}</span>
                                </div>
                                <div
                                    className={cn(
                                        "flex items-center gap-1 text-sm font-medium",
                                        kpi.trend === "up"
                                            ? "text-green-500"
                                            : kpi.trend === "down"
                                                ? "text-red-500"
                                                : "text-[var(--text-muted)]"
                                    )}
                                >
                                    {kpi.trend === "up" ? (
                                        <TrendingUp className="w-4 h-4" />
                                    ) : kpi.trend === "down" ? (
                                        <TrendingDown className="w-4 h-4" />
                                    ) : null}
                                    {kpi.trendValue}
                                </div>
                            </div>

                            {/* Value */}
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-[var(--foreground)]">{kpi.value}</span>
                                {kpi.unit && <span className="text-sm text-[var(--text-muted)]">{kpi.unit}</span>}
                            </div>

                            {/* Label */}
                            <p className="text-sm text-[var(--text-muted)] mt-1">{kpi.label}</p>
                        </div>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
