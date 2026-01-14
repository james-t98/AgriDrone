"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Plane, Battery, Clock, MapPin, Calendar, ChevronRight, Play } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockDrones, mockFlightSchedule } from "@/data/mockDrones";
import { cn, formatRelativeTime, formatDate, formatTime } from "@/lib/utils";

// Dynamically import the map component to avoid SSR issues with Leaflet
const CoverageMap = dynamic(
    () => import("@/components/drones/CoverageMap").then((mod) => mod.CoverageMap),
    { ssr: false, loading: () => <div className="h-96 skeleton rounded-xl" /> }
);

export default function DronesPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-bold text-[var(--foreground)]">Drone Operations</h1>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                        Manage your drone fleet and monitor flight operations
                    </p>
                </div>
                <Button icon={<Play className="w-4 h-4" />}>
                    Schedule New Flight
                </Button>
            </motion.div>

            {/* Drone Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="h-full">
                                <CardContent className="p-5">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={cn(
                                                    "w-12 h-12 rounded-xl flex items-center justify-center",
                                                    drone.status === "active"
                                                        ? "bg-green-500/20"
                                                        : drone.status === "charging"
                                                            ? "bg-yellow-500/20"
                                                            : "bg-[var(--surface-hover)]"
                                                )}
                                            >
                                                <Plane
                                                    className={cn(
                                                        "w-6 h-6",
                                                        drone.status === "active" && "text-green-500",
                                                        drone.status === "charging" && "text-yellow-500",
                                                        drone.status === "idle" && "text-blue-500",
                                                        drone.status === "maintenance" && "text-red-500",
                                                        drone.status === "offline" && "text-[var(--text-muted)]"
                                                    )}
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-[var(--foreground)]">{drone.name}</h3>
                                                <p className="text-xs text-[var(--text-muted)]">{drone.model}</p>
                                            </div>
                                        </div>
                                        <Badge variant={statusVariant} size="sm" pulse={drone.status === "active"}>
                                            {drone.status}
                                        </Badge>
                                    </div>

                                    {/* Stats */}
                                    <div className="space-y-3">
                                        {/* Battery */}
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
                                                <Battery className="w-4 h-4" />
                                                Battery
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-20 h-2 rounded-full bg-[var(--surface-hover)] overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${drone.battery}%` }}
                                                        transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                                                        className={cn(
                                                            "h-full rounded-full",
                                                            drone.battery > 50 ? "bg-green-500" : drone.battery > 20 ? "bg-yellow-500" : "bg-red-500"
                                                        )}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium text-[var(--foreground)] tabular-nums w-8">
                                                    {drone.battery}%
                                                </span>
                                            </div>
                                        </div>

                                        {/* Last Flight */}
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
                                                <Clock className="w-4 h-4" />
                                                Last Flight
                                            </span>
                                            <span className="text-sm font-medium text-[var(--foreground)]">
                                                {formatRelativeTime(drone.lastFlight)}
                                            </span>
                                        </div>

                                        {/* Flight Hours */}
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
                                                <Plane className="w-4 h-4" />
                                                Total Hours
                                            </span>
                                            <span className="text-sm font-medium text-[var(--foreground)]">
                                                {drone.totalFlightHours}h
                                            </span>
                                        </div>

                                        {/* Coverage Today */}
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
                                                <MapPin className="w-4 h-4" />
                                                Covered Today
                                            </span>
                                            <span className="text-sm font-medium text-[var(--foreground)]">
                                                {drone.coverage} ha
                                            </span>
                                        </div>
                                    </div>

                                    {/* Current Task */}
                                    {drone.currentTask && (
                                        <div className="mt-4 pt-4 border-t border-[var(--border)]">
                                            <p className="text-xs text-[var(--text-muted)]">Current Task</p>
                                            <p className="text-sm font-medium text-green-500 mt-1">{drone.currentTask}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* Map & Schedule Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Coverage Map */}
                <div className="lg:col-span-2">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Coverage Map</CardTitle>
                            <Badge variant="info" size="sm">Live</Badge>
                        </CardHeader>
                        <CardContent className="p-0 overflow-hidden rounded-b-xl">
                            <CoverageMap />
                        </CardContent>
                    </Card>
                </div>

                {/* Flight Schedule */}
                <div className="lg:col-span-1">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Flight Schedule</CardTitle>
                            <span className="text-xs text-[var(--text-muted)]">Upcoming</span>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {mockFlightSchedule.map((flight, i) => (
                                <motion.div
                                    key={flight.id}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-3 rounded-lg bg-[var(--surface-hover)] hover:bg-[var(--border)] transition-colors cursor-pointer group"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <p className="font-medium text-sm text-[var(--foreground)]">{flight.mission}</p>
                                            <p className="text-xs text-[var(--text-muted)]">{flight.droneName}</p>
                                        </div>
                                        <Badge
                                            variant={flight.priority === "high" ? "error" : flight.priority === "medium" ? "warning" : "default"}
                                            size="sm"
                                        >
                                            {flight.priority}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(flight.scheduledStart)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatTime(flight.scheduledStart)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-[var(--text-muted)] mt-2">{flight.field}</p>
                                </motion.div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
