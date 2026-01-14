"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Info, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorBannerProps {
    type?: "error" | "warning" | "info" | "success";
    title: string;
    message: string;
    onDismiss?: () => void;
    dismissible?: boolean;
    className?: string;
}

const typeConfig = {
    error: {
        icon: AlertCircle,
        bg: "bg-red-500/10",
        border: "border-red-500/20",
        text: "text-red-500",
        iconBg: "bg-red-500/20",
    },
    warning: {
        icon: AlertTriangle,
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/20",
        text: "text-yellow-500",
        iconBg: "bg-yellow-500/20",
    },
    info: {
        icon: Info,
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        text: "text-blue-500",
        iconBg: "bg-blue-500/20",
    },
    success: {
        icon: CheckCircle,
        bg: "bg-green-500/10",
        border: "border-green-500/20",
        text: "text-green-500",
        iconBg: "bg-green-500/20",
    },
};

export function ErrorBanner({
    type = "error",
    title,
    message,
    onDismiss,
    dismissible = true,
    className,
}: ErrorBannerProps) {
    const config = typeConfig[type];
    const Icon = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
                "p-4 rounded-xl border flex items-start gap-4",
                config.bg,
                config.border,
                className
            )}
        >
            <div className={cn("p-2 rounded-lg", config.iconBg)}>
                <Icon className={cn("w-5 h-5", config.text)} />
            </div>
            <div className="flex-1 min-w-0">
                <h4 className={cn("font-semibold", config.text)}>{title}</h4>
                <p className="text-sm text-[var(--text-muted)] mt-1">{message}</p>
            </div>
            {dismissible && onDismiss && (
                <button
                    onClick={onDismiss}
                    className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </motion.div>
    );
}

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description: string;
    action?: React.ReactNode;
    className?: string;
}

export function EmptyState({
    icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
                "flex flex-col items-center justify-center py-16 px-8 text-center",
                className
            )}
        >
            {icon && (
                <div className="w-16 h-16 rounded-2xl bg-[var(--surface-hover)] flex items-center justify-center mb-4 text-[var(--text-muted)]">
                    {icon}
                </div>
            )}
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">{title}</h3>
            <p className="text-sm text-[var(--text-muted)] max-w-sm mb-6">{description}</p>
            {action}
        </motion.div>
    );
}
