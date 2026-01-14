"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Bell,
    Sun,
    Moon,
    User,
    Settings,
    LogOut,
    ChevronDown,
} from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { cn } from "@/lib/utils";

export function Header() {
    const { isDark, toggle } = useThemeStore();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const notifications = [
        {
            id: 1,
            type: "alert",
            title: "Late Blight Detected",
            message: "Field A - Potato requires attention",
            time: "5 min ago",
            read: false,
        },
        {
            id: 2,
            type: "info",
            title: "Drone Alpha Mission Complete",
            message: "Scanned 45.2 ha successfully",
            time: "1 hour ago",
            read: false,
        },
        {
            id: 3,
            type: "success",
            title: "Compliance Report Ready",
            message: "December 2025 report generated",
            time: "3 hours ago",
            read: true,
        },
    ];

    return (
        <header className="h-16 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between px-6 sticky top-0 z-30">
            {/* Search */}
            <div className="flex items-center gap-4 flex-1 max-w-md">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input
                        type="text"
                        placeholder="Search fields, drones, reports..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--surface-hover)] border border-transparent focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)] transition-all"
                    />
                    <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs text-[var(--text-muted)] bg-[var(--surface)] rounded border border-[var(--border)]">
                        ⌘K
                    </kbd>
                </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
                {/* Theme Toggle */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggle}
                    className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors"
                    aria-label="Toggle theme"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isDark ? "dark" : "light"}
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </motion.div>
                    </AnimatePresence>
                </motion.button>

                {/* Notifications */}
                <div className="relative">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setShowNotifications(!showNotifications);
                            setShowProfile(false);
                        }}
                        className="relative p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors"
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    </motion.button>

                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute right-0 top-full mt-2 w-80 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-xl overflow-hidden"
                            >
                                <div className="p-4 border-b border-[var(--border)]">
                                    <h3 className="font-semibold text-[var(--foreground)]">Notifications</h3>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            className={cn(
                                                "p-4 border-b border-[var(--border)] hover:bg-[var(--surface-hover)] cursor-pointer transition-colors",
                                                !notif.read && "bg-green-500/5"
                                            )}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className={cn(
                                                        "w-2 h-2 mt-2 rounded-full flex-shrink-0",
                                                        notif.type === "alert" && "bg-red-500",
                                                        notif.type === "info" && "bg-blue-500",
                                                        notif.type === "success" && "bg-green-500"
                                                    )}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm text-[var(--foreground)]">
                                                        {notif.title}
                                                    </p>
                                                    <p className="text-xs text-[var(--text-muted)] truncate">
                                                        {notif.message}
                                                    </p>
                                                    <p className="text-xs text-[var(--text-muted)] mt-1">
                                                        {notif.time}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-3 border-t border-[var(--border)]">
                                    <button className="w-full text-center text-sm text-green-500 hover:text-green-400 font-medium">
                                        View all notifications
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Divider */}
                <div className="w-px h-8 bg-[var(--border)]" />

                {/* Profile */}
                <div className="relative">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        onClick={() => {
                            setShowProfile(!showProfile);
                            setShowNotifications(false);
                        }}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm">
                            JV
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-medium text-[var(--foreground)]">Jan de Vries</p>
                            <p className="text-xs text-[var(--text-muted)]">Farm Manager</p>
                        </div>
                        <ChevronDown className="w-4 h-4 text-[var(--text-muted)] hidden md:block" />
                    </motion.button>

                    <AnimatePresence>
                        {showProfile && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute right-0 top-full mt-2 w-56 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-xl overflow-hidden"
                            >
                                <div className="p-4 border-b border-[var(--border)]">
                                    <p className="font-semibold text-[var(--foreground)]">Jan de Vries</p>
                                    <p className="text-sm text-[var(--text-muted)]">jan@agridrone.nl</p>
                                </div>
                                <div className="p-2">
                                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors">
                                        <User className="w-4 h-4" />
                                        <span className="text-sm">Profile</span>
                                    </button>
                                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors">
                                        <Settings className="w-4 h-4" />
                                        <span className="text-sm">Settings</span>
                                    </button>
                                    <div className="my-2 border-t border-[var(--border)]" />
                                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors">
                                        <LogOut className="w-4 h-4" />
                                        <span className="text-sm">Sign out</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}
