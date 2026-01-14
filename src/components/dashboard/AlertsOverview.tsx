"use client";

import { motion } from "framer-motion";
import { AlertTriangle, AlertCircle, Info, CheckCircle, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn, formatRelativeTime } from "@/lib/utils";

interface Alert {
    id: string;
    type: "critical" | "warning" | "info" | "success";
    title: string;
    message: string;
    time: string;
    field?: string;
}

const mockAlerts: Alert[] = [
    {
        id: "1",
        type: "critical",
        title: "Late Blight Detected",
        message: "Phytophthora infection in progress",
        time: "2026-01-14T15:45:00Z",
        field: "Field A - Potato",
    },
    {
        id: "2",
        type: "warning",
        title: "Nitrogen Threshold",
        message: "Approaching 85% of limit",
        time: "2026-01-14T10:00:00Z",
        field: "Field C - Corn",
    },
    {
        id: "3",
        type: "info",
        title: "Drone Mission Complete",
        message: "AgriScout Alpha finished scanning",
        time: "2026-01-14T14:30:00Z",
    },
    {
        id: "4",
        type: "success",
        title: "Compliance Check Passed",
        message: "EU CAP quarterly review approved",
        time: "2026-01-14T09:00:00Z",
    },
];

const typeConfig = {
    critical: {
        icon: AlertCircle,
        badge: "error" as const,
        iconColor: "text-red-500",
        bgColor: "bg-red-500/10",
    },
    warning: {
        icon: AlertTriangle,
        badge: "warning" as const,
        iconColor: "text-yellow-500",
        bgColor: "bg-yellow-500/10",
    },
    info: {
        icon: Info,
        badge: "info" as const,
        iconColor: "text-blue-500",
        bgColor: "bg-blue-500/10",
    },
    success: {
        icon: CheckCircle,
        badge: "success" as const,
        iconColor: "text-green-500",
        bgColor: "bg-green-500/10",
    },
};

export function AlertsOverview() {
    const criticalCount = mockAlerts.filter((a) => a.type === "critical").length;
    const warningCount = mockAlerts.filter((a) => a.type === "warning").length;

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Alerts</CardTitle>
                <div className="flex items-center gap-2">
                    {criticalCount > 0 && (
                        <Badge variant="error" size="sm">
                            {criticalCount} Critical
                        </Badge>
                    )}
                    {warningCount > 0 && (
                        <Badge variant="warning" size="sm">
                            {warningCount} Warning
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {mockAlerts.map((alert, i) => {
                        const config = typeConfig[alert.type];
                        const Icon = config.icon;

                        return (
                            <motion.div
                                key={alert.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-[var(--surface-hover)] transition-colors cursor-pointer group"
                            >
                                <div className={cn("p-2 rounded-lg", config.bgColor)}>
                                    <Icon className={cn("w-4 h-4", config.iconColor)} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm text-[var(--foreground)]">
                                            {alert.title}
                                        </span>
                                    </div>
                                    <p className="text-xs text-[var(--text-muted)] truncate">{alert.message}</p>
                                    {alert.field && (
                                        <p className="text-xs text-[var(--text-muted)] mt-1">{alert.field}</p>
                                    )}
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-xs text-[var(--text-muted)]">
                                        {formatRelativeTime(alert.time)}
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
