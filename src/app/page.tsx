"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowRight, Plane, ScanLine, FileText, ShieldCheck } from "lucide-react";
import { FarmHealthScore } from "@/components/dashboard/FarmHealthScore";
import { WeatherWidget } from "@/components/dashboard/WeatherWidget";
import { DroneStatus } from "@/components/dashboard/DroneStatus";
import { AlertsOverview } from "@/components/dashboard/AlertsOverview";
import { KPIGrid } from "@/components/dashboard/KPIGrid";
import { GlassyButton, GlassyIconButton } from "@/components/ui/GlassyButton";
import { RotatingCard } from "@/components/ui/RotatingCard";
import Link from "next/link";

export default function DashboardPage() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const quickActions = [
    { label: "Schedule Flight", icon: Plane, href: "/drones", variant: "default" as const },
    { label: "Run Scan", icon: ScanLine, href: "/crop-health", variant: "purple" as const },
    { label: "Generate Report", icon: FileText, href: "/reports", variant: "primary" as const },
    { label: "Check Compliance", icon: ShieldCheck, href: "/compliance", variant: "default" as const },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Good afternoon, Jan 👋
          </h1>
          <div className="flex items-center gap-4 mt-1">
            <span className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
              <Calendar className="w-4 h-4" />
              {currentDate}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
              <MapPin className="w-4 h-4" />
              Utrecht Province, Netherlands
            </span>
          </div>
        </div>
        <Link href="/agent">
          <GlassyButton variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
            View AI Insights
          </GlassyButton>
        </Link>
      </motion.div>

      {/* KPI Grid */}
      <KPIGrid />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Farm Health Score - Takes 1 column */}
        <div className="lg:col-span-1">
          <RotatingCard rotationIntensity={5}>
            <FarmHealthScore score={87} trend="up" previousScore={82} />
          </RotatingCard>
        </div>

        {/* Weather Widget - Takes 1 column */}
        <div className="lg:col-span-1">
          <WeatherWidget />
        </div>

        {/* Drone Status - Takes 1 column */}
        <div className="lg:col-span-1">
          <DroneStatus />
        </div>
      </div>

      {/* Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AlertsOverview />

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <Link key={action.label} href={action.href}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    <GlassyButton
                      variant={action.variant}
                      icon={<Icon className="w-5 h-5" />}
                      fullWidth
                      className="h-20 flex-col"
                    >
                      {action.label}
                    </GlassyButton>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
