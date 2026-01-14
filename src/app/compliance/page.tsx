"use client";

import { motion } from "framer-motion";
import { Shield, CheckCircle, AlertTriangle, Clock, FileCheck, Activity } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
    mockComplianceItems,
    mockNitrogenUsage,
    mockAuditLog,
} from "@/data/mockCompliance";
import { cn, formatDate, formatTime, formatRelativeTime } from "@/lib/utils";

// Gauge Chart Component
function NitrogenGauge({ current, limit }: { current: number; limit: number }) {
    const percentage = (current / limit) * 100;
    const circumference = 2 * Math.PI * 60;
    const offset = circumference - (circumference * percentage) / 100;

    const getColor = () => {
        if (percentage >= 90) return { stroke: "#ef4444", text: "text-red-500" };
        if (percentage >= 75) return { stroke: "#f59e0b", text: "text-yellow-500" };
        return { stroke: "#22c55e", text: "text-green-500" };
    };

    const colors = getColor();

    return (
        <div className="relative w-40 h-40 mx-auto">
            <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="60" fill="none" stroke="var(--border)" strokeWidth="10" />
                <motion.circle
                    cx="80"
                    cy="80"
                    r="60"
                    fill="none"
                    stroke={colors.stroke}
                    strokeWidth="10"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={cn("text-3xl font-bold", colors.text)}>{current}</span>
                <span className="text-sm text-[var(--text-muted)]">of {limit} kg N/ha</span>
            </div>
        </div>
    );
}

export default function CompliancePage() {
    const compliantCount = mockComplianceItems.filter((c) => c.status === "compliant").length;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-bold text-[var(--foreground)]">Compliance</h1>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                        EU and Netherlands agricultural regulation compliance status
                    </p>
                </div>
                <Button icon={<FileCheck className="w-4 h-4" />}>
                    Generate Report
                </Button>
            </motion.div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card variant="gradient" className="text-center py-6">
                        <div className="text-3xl font-bold text-green-500">{compliantCount}/{mockComplianceItems.length}</div>
                        <p className="text-sm text-[var(--text-muted)] mt-1">Regulations Compliant</p>
                    </Card>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card className="text-center py-6">
                        <div className="text-3xl font-bold text-[var(--foreground)]">86%</div>
                        <p className="text-sm text-[var(--text-muted)] mt-1">Overall Score</p>
                    </Card>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="text-center py-6">
                        <div className="text-3xl font-bold text-yellow-500">1</div>
                        <p className="text-sm text-[var(--text-muted)] mt-1">Warnings</p>
                    </Card>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Card className="text-center py-6">
                        <div className="text-3xl font-bold text-[var(--foreground)]">42 days</div>
                        <p className="text-sm text-[var(--text-muted)] mt-1">Next Audit</p>
                    </Card>
                </motion.div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Compliance Cards */}
                <div className="lg:col-span-2 space-y-4">
                    {mockComplianceItems.map((item, i) => {
                        const statusConfig = {
                            compliant: { variant: "success" as const, icon: CheckCircle, color: "text-green-500" },
                            warning: { variant: "warning" as const, icon: AlertTriangle, color: "text-yellow-500" },
                            "non-compliant": { variant: "error" as const, icon: AlertTriangle, color: "text-red-500" },
                            pending: { variant: "info" as const, icon: Clock, color: "text-blue-500" },
                        }[item.status];

                        const Icon = statusConfig.icon;

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className="hover:border-green-500/30 transition-colors">
                                    <CardContent className="p-5">
                                        <div className="flex items-start gap-4">
                                            <div
                                                className={cn(
                                                    "p-3 rounded-xl",
                                                    item.status === "compliant"
                                                        ? "bg-green-500/10"
                                                        : item.status === "warning"
                                                            ? "bg-yellow-500/10"
                                                            : item.status === "pending"
                                                                ? "bg-blue-500/10"
                                                                : "bg-red-500/10"
                                                )}
                                            >
                                                <Icon className={cn("w-6 h-6", statusConfig.color)} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <h3 className="font-semibold text-[var(--foreground)]">{item.regulation}</h3>
                                                        <p className="text-sm text-[var(--text-muted)]">{item.description}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant={statusConfig.variant} size="sm">
                                                            {item.status}
                                                        </Badge>
                                                        <span className={cn("text-2xl font-bold", statusConfig.color)}>
                                                            {item.score}%
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {item.requirements.slice(0, 3).map((req, j) => (
                                                        <span
                                                            key={j}
                                                            className="px-2 py-1 text-xs rounded-full bg-[var(--surface-hover)] text-[var(--text-muted)]"
                                                        >
                                                            {req}
                                                        </span>
                                                    ))}
                                                    {item.requirements.length > 3 && (
                                                        <span className="px-2 py-1 text-xs rounded-full bg-[var(--surface-hover)] text-[var(--text-muted)]">
                                                            +{item.requirements.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 mt-4 text-xs text-[var(--text-muted)]">
                                                    <span>Last Audit: {formatDate(item.lastAudit)}</span>
                                                    <span>Next Audit: {formatDate(item.nextAudit)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Nitrogen Usage */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Nitrogen Usage</CardTitle>
                            <Badge
                                variant={
                                    mockNitrogenUsage.current / mockNitrogenUsage.limit >= 0.9
                                        ? "error"
                                        : mockNitrogenUsage.current / mockNitrogenUsage.limit >= 0.75
                                            ? "warning"
                                            : "success"
                                }
                                size="sm"
                            >
                                {mockNitrogenUsage.trend}
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <NitrogenGauge current={mockNitrogenUsage.current} limit={mockNitrogenUsage.limit} />
                            <p className="text-center text-sm text-[var(--text-muted)] mt-4">
                                {((mockNitrogenUsage.current / mockNitrogenUsage.limit) * 100).toFixed(0)}% of annual limit used
                            </p>
                        </CardContent>
                    </Card>

                    {/* Audit Log */}
                    <Card className="max-h-96 overflow-hidden flex flex-col">
                        <CardHeader>
                            <CardTitle>Audit Log</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto space-y-2">
                            {mockAuditLog.map((entry, i) => {
                                const statusConfig = {
                                    success: "bg-green-500",
                                    warning: "bg-yellow-500",
                                    error: "bg-red-500",
                                }[entry.status];

                                return (
                                    <motion.div
                                        key={entry.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="p-3 rounded-lg bg-[var(--surface-hover)] text-sm"
                                    >
                                        <div className="flex items-start gap-2">
                                            <div className={cn("w-2 h-2 rounded-full mt-1.5 flex-shrink-0", statusConfig)} />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-[var(--foreground)] truncate">{entry.action}</p>
                                                <p className="text-xs text-[var(--text-muted)] truncate">{entry.details}</p>
                                                <div className="flex items-center gap-2 mt-1 text-xs text-[var(--text-muted)]">
                                                    <span>{entry.user}</span>
                                                    <span>·</span>
                                                    <span>{formatRelativeTime(entry.timestamp)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
