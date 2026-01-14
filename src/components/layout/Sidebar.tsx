"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Plane,
    Leaf,
    Shield,
    TrendingUp,
    FileText,
    Bot,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";
import { useState } from "react";

const iconMap = {
    LayoutDashboard,
    Plane,
    Leaf,
    Shield,
    TrendingUp,
    FileText,
    Bot,
};

export function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? 80 : 280 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed left-0 top-0 h-screen bg-[var(--surface)] border-r border-[var(--border)] flex flex-col z-40"
        >
            {/* Logo */}
            <div className="h-16 flex items-center px-4 border-b border-[var(--border)]">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/25">
                        <Plane className="w-5 h-5 text-white" />
                    </div>
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col"
                        >
                            <span className="text-lg font-bold text-gradient">AgriDrone</span>
                            <span className="text-xs text-[var(--text-muted)]">AI Platform</span>
                        </motion.div>
                    )}
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-3 overflow-y-auto">
                <ul className="space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const Icon = iconMap[item.icon as keyof typeof iconMap];
                        const isActive = pathname === item.href;

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                                        isActive
                                            ? "bg-green-500/10 text-green-500"
                                            : "text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeNav"
                                            className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-full"
                                        />
                                    )}
                                    <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-green-500")} />
                                    {!collapsed && (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="font-medium"
                                        >
                                            {item.name}
                                        </motion.span>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Collapse Button */}
            <div className="p-3 border-t border-[var(--border)]">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors"
                >
                    {collapsed ? (
                        <ChevronRight className="w-5 h-5" />
                    ) : (
                        <>
                            <ChevronLeft className="w-5 h-5" />
                            <span className="text-sm">Collapse</span>
                        </>
                    )}
                </button>
            </div>

            {/* Status Footer */}
            {!collapsed && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 mx-3 mb-3 rounded-xl bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/20"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-green-500">System Online</span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">
                        4 drones active · All sensors nominal
                    </p>
                </motion.div>
            )}
        </motion.aside>
    );
}
