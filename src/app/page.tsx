"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { FarmHealthScore } from "@/components/dashboard/FarmHealthScore";
import { WeatherWidget } from "@/components/dashboard/WeatherWidget";
import { DroneStatus } from "@/components/dashboard/DroneStatus";
import { AlertsOverview } from "@/components/dashboard/AlertsOverview";
import { KPIGrid } from "@/components/dashboard/KPIGrid";

export default function DashboardPage() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-shadow"
        >
          View AI Insights
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>

      {/* KPI Grid */}
      <KPIGrid />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Farm Health Score - Takes 1 column */}
        <div className="lg:col-span-1">
          <FarmHealthScore score={87} trend="up" previousScore={82} />
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
            {[
              { label: "Schedule Flight", icon: "✈️", color: "from-blue-500 to-blue-600" },
              { label: "Run Scan", icon: "📡", color: "from-purple-500 to-purple-600" },
              { label: "Generate Report", icon: "📊", color: "from-green-500 to-green-600" },
              { label: "Check Compliance", icon: "✅", color: "from-amber-500 to-orange-500" },
            ].map((action, i) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl bg-gradient-to-br ${action.color} text-white font-medium text-sm shadow-lg hover:shadow-xl transition-shadow flex flex-col items-center gap-2`}
              >
                <span className="text-2xl">{action.icon}</span>
                {action.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
