"use client";

import { motion } from "framer-motion";
import { Plane, Battery, MapPin, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { mockDrones } from "@/data/mockDrones";
import { cn, formatRelativeTime } from "@/lib/utils";

export function DroneStatus() {
    const activeDrones = mockDrones.filter((d) => d.status === "active").length;

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Plane className="w-5 h-5 text-green-500" />
                    Active Drones
                </CardTitle>
                <Badge variant="success" size="sm">
                    {activeDrones} / {mockDrones.length} Online
                </Badge>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {mockDrones.map((drone, i) => {
                        const statusVariant = {
                            active: "success",
                            idle: "info",
                            charging: "warning",
                            maintenance: "error",
                            offline: "default",
                        }[drone.status] as "success" | "warning" | "error" | "info" | "default";

                        return (
                            <motion.div
                                key={drone.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-3 p-3 rounded-lg bg-[var(--surface-hover)] hover:bg-[var(--border)] transition-colors cursor-pointer"
                            >
                                {/* Icon */}
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-lg flex items-center justify-center",
                                        drone.status === "active"
                                            ? "bg-green-500/20"
                                            : drone.status === "charging"
                                                ? "bg-yellow-500/20"
                                                : "bg-[var(--surface)]"
                                    )}
                                >
                                    <Plane
                                        className={cn(
                                            "w-5 h-5",
                                            drone.status === "active" && "text-green-500 animate-pulse",
                                            drone.status === "charging" && "text-yellow-500",
                                            drone.status === "idle" && "text-blue-500",
                                            drone.status === "maintenance" && "text-red-500",
                                            drone.status === "offline" && "text-[var(--text-muted)]"
                                        )}
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm text-[var(--foreground)] truncate">
                                            {drone.name}
                                        </span>
                                        <Badge variant={statusVariant} size="sm" pulse={drone.status === "active"}>
                                            {drone.status}
                                        </Badge>
                                    </div>
                                    {drone.currentTask && (
                                        <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">
                                            {drone.currentTask}
                                        </p>
                                    )}
                                </div>

                                {/* Battery */}
                                <div className="flex items-center gap-1">
                                    <Battery
                                        className={cn(
                                            "w-4 h-4",
                                            drone.battery > 50 ? "text-green-500" : drone.battery > 20 ? "text-yellow-500" : "text-red-500"
                                        )}
                                    />
                                    <span className="text-sm font-medium tabular-nums text-[var(--foreground)]">
                                        {drone.battery}%
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
