"use client";

import { motion } from "framer-motion";
import { Leaf, Bug, AlertTriangle, TrendingUp, ThermometerSun, Droplets, Activity } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
    mockCropFields,
    mockHealthTrends,
    mockPestAlerts,
    mockDiseaseAlerts,
    mockHeatmapData,
} from "@/data/mockCrops";
import { cn, getHealthColor, getHealthBgColor, formatRelativeTime } from "@/lib/utils";

// Custom Heatmap Grid Component
function HeatmapGrid({ data }: { data: number[][] }) {
    const getColor = (value: number) => {
        if (value >= 90) return "bg-green-500";
        if (value >= 80) return "bg-green-400";
        if (value >= 70) return "bg-yellow-400";
        if (value >= 60) return "bg-orange-400";
        return "bg-red-500";
    };

    return (
        <div className="grid grid-cols-8 gap-1">
            {data.flat().map((value, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.01 }}
                    className={cn(
                        "aspect-square rounded-sm cursor-pointer transition-transform hover:scale-110",
                        getColor(value)
                    )}
                    title={`Health: ${value}%`}
                />
            ))}
        </div>
    );
}

export default function CropHealthPage() {
    const allAlerts = [...mockPestAlerts, ...mockDiseaseAlerts];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-bold text-[var(--foreground)]">Crop Health</h1>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                        Monitor crop vitality, detect issues, and track health trends
                    </p>
                </div>
                <Button icon={<Activity className="w-4 h-4" />}>
                    Run Full Scan
                </Button>
            </motion.div>

            {/* Field Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {mockCropFields.map((field, i) => (
                    <motion.div
                        key={field.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="h-full">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div
                                        className={cn(
                                            "w-10 h-10 rounded-lg flex items-center justify-center",
                                            getHealthBgColor(field.healthScore)
                                        )}
                                    >
                                        <Leaf className={cn("w-5 h-5", getHealthColor(field.healthScore))} />
                                    </div>
                                    <span
                                        className={cn(
                                            "text-2xl font-bold",
                                            getHealthColor(field.healthScore)
                                        )}
                                    >
                                        {field.healthScore}%
                                    </span>
                                </div>
                                <h3 className="font-semibold text-[var(--foreground)]">{field.name}</h3>
                                <p className="text-xs text-[var(--text-muted)]">{field.crop} · {field.area} ha</p>
                                <div className="mt-3 pt-3 border-t border-[var(--border)] space-y-1.5">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-[var(--text-muted)]">NDVI</span>
                                        <span className="font-medium text-[var(--foreground)]">{field.ndviValue.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-[var(--text-muted)]">Moisture</span>
                                        <span className="font-medium text-[var(--foreground)]">{field.soilMoisture}%</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-[var(--text-muted)]">Stage</span>
                                        <span className="font-medium text-[var(--foreground)]">{field.growthStage}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Heatmap */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Field Health Map</CardTitle>
                        <span className="text-xs text-[var(--text-muted)]">8×8 Grid</span>
                    </CardHeader>
                    <CardContent>
                        <HeatmapGrid data={mockHeatmapData} />
                        <div className="flex items-center justify-between mt-4 text-xs text-[var(--text-muted)]">
                            <span className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-sm bg-red-500" /> Critical
                            </span>
                            <span className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-sm bg-yellow-400" /> Warning
                            </span>
                            <span className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-sm bg-green-500" /> Healthy
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Trend Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Health Trends</CardTitle>
                        <span className="text-xs text-[var(--text-muted)]">Last 14 Days</span>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={mockHealthTrends}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis
                                    dataKey="date"
                                    stroke="var(--text-muted)"
                                    fontSize={12}
                                    tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                />
                                <YAxis stroke="var(--text-muted)" fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        background: "var(--surface)",
                                        border: "1px solid var(--border)",
                                        borderRadius: "8px",
                                    }}
                                    labelStyle={{ color: "var(--foreground)" }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="ndvi"
                                    name="NDVI"
                                    stroke="#22c55e"
                                    strokeWidth={2}
                                    dot={false}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="soilMoisture"
                                    name="Soil Moisture %"
                                    stroke="#0ea5e9"
                                    strokeWidth={2}
                                    dot={false}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="temperature"
                                    name="Temp °C"
                                    stroke="#f59e0b"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Pest & Disease Alerts */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bug className="w-5 h-5 text-orange-500" />
                        Pest & Disease Alerts
                    </CardTitle>
                    <Badge variant="warning" size="sm">
                        {allAlerts.length} Active
                    </Badge>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {allAlerts.map((alert, i) => {
                            const isPest = "pest" in alert;
                            const severityVariant = {
                                low: "info",
                                medium: "warning",
                                high: "error",
                                critical: "error",
                            }[alert.severity] as "info" | "warning" | "error";

                            return (
                                <motion.div
                                    key={alert.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-4 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)]"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={cn(
                                                    "p-2 rounded-lg",
                                                    alert.severity === "critical" || alert.severity === "high"
                                                        ? "bg-red-500/20"
                                                        : "bg-yellow-500/20"
                                                )}
                                            >
                                                {isPest ? (
                                                    <Bug
                                                        className={cn(
                                                            "w-5 h-5",
                                                            alert.severity === "critical" || alert.severity === "high"
                                                                ? "text-red-500"
                                                                : "text-yellow-500"
                                                        )}
                                                    />
                                                ) : (
                                                    <AlertTriangle
                                                        className={cn(
                                                            "w-5 h-5",
                                                            alert.severity === "critical" || alert.severity === "high"
                                                                ? "text-red-500"
                                                                : "text-yellow-500"
                                                        )}
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-[var(--foreground)]">
                                                    {isPest ? (alert as typeof mockPestAlerts[0]).pest : (alert as typeof mockDiseaseAlerts[0]).disease}
                                                </h4>
                                                <p className="text-sm text-[var(--text-muted)]">{alert.fieldName}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={severityVariant} size="sm">
                                                {alert.severity}
                                            </Badge>
                                            <Badge variant={alert.status === "active" ? "warning" : "info"} size="sm">
                                                {alert.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <p className="text-sm text-[var(--text-muted)] mb-3">{alert.recommendation}</p>
                                    <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                                        <span>Affected Area: {alert.affectedArea} ha</span>
                                        <span>Detected: {formatRelativeTime(alert.detectedAt)}</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
