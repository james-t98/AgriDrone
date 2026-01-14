"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassyButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    icon?: React.ReactNode;
    variant?: "default" | "primary" | "purple" | "danger";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    className?: string;
    fullWidth?: boolean;
}

const variantStyles = {
    default: {
        bg: "bg-white/10 dark:bg-white/5",
        border: "border-white/20 dark:border-white/10",
        glow: "group-hover:shadow-white/20",
        text: "text-[var(--foreground)]",
    },
    primary: {
        bg: "bg-green-500/10",
        border: "border-green-500/30",
        glow: "group-hover:shadow-green-500/30",
        text: "text-green-500",
    },
    purple: {
        bg: "bg-purple-500/10",
        border: "border-purple-500/30",
        glow: "group-hover:shadow-purple-500/30",
        text: "text-purple-500",
    },
    danger: {
        bg: "bg-red-500/10",
        border: "border-red-500/30",
        glow: "group-hover:shadow-red-500/30",
        text: "text-red-500",
    },
};

const sizeStyles = {
    sm: "px-4 py-2 text-sm gap-2",
    md: "px-5 py-2.5 text-base gap-2.5",
    lg: "px-6 py-3 text-lg gap-3",
};

export function GlassyButton({
    children,
    onClick,
    icon,
    variant = "default",
    size = "md",
    disabled = false,
    className,
    fullWidth = false,
}: GlassyButtonProps) {
    const styles = variantStyles[variant];

    return (
        <motion.button
            onClick={onClick}
            disabled={disabled}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            className={cn(
                "group relative inline-flex items-center justify-center font-medium rounded-xl",
                "backdrop-blur-md border transition-all duration-300",
                styles.bg,
                styles.border,
                styles.text,
                sizeStyles[size],
                "shadow-lg shadow-black/5",
                `hover:shadow-xl ${styles.glow}`,
                disabled && "opacity-50 cursor-not-allowed",
                fullWidth && "w-full",
                className
            )}
        >
            {/* Shine overlay */}
            <span
                className={cn(
                    "absolute inset-0 rounded-xl overflow-hidden",
                    "before:absolute before:inset-0",
                    "before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-transparent",
                    "before:opacity-0 before:transition-opacity before:duration-300",
                    "group-hover:before:opacity-100"
                )}
            />

            {/* Inner glow */}
            <span
                className={cn(
                    "absolute inset-[1px] rounded-[10px]",
                    "bg-gradient-to-b from-white/10 to-transparent",
                    "opacity-50"
                )}
            />

            {/* Content */}
            <span className="relative z-10 flex items-center gap-2">
                {icon}
                {children}
            </span>
        </motion.button>
    );
}

// Icon-only variant for compact buttons
export function GlassyIconButton({
    icon,
    onClick,
    variant = "default",
    size = "md",
    disabled = false,
    className,
    tooltip,
}: Omit<GlassyButtonProps, "children" | "fullWidth"> & { tooltip?: string }) {
    const styles = variantStyles[variant];
    const iconSizes = { sm: "p-2", md: "p-2.5", lg: "p-3" };

    return (
        <motion.button
            onClick={onClick}
            disabled={disabled}
            whileHover={{ scale: disabled ? 1 : 1.1, rotate: 5 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            title={tooltip}
            className={cn(
                "group relative inline-flex items-center justify-center rounded-xl",
                "backdrop-blur-md border transition-all duration-300",
                styles.bg,
                styles.border,
                styles.text,
                iconSizes[size],
                "shadow-lg shadow-black/5",
                `hover:shadow-xl ${styles.glow}`,
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
        >
            {/* Shine overlay */}
            <span
                className={cn(
                    "absolute inset-0 rounded-xl overflow-hidden",
                    "before:absolute before:inset-0",
                    "before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-transparent",
                    "before:opacity-0 before:transition-opacity before:duration-300",
                    "group-hover:before:opacity-100"
                )}
            />

            <span className="relative z-10">{icon}</span>
        </motion.button>
    );
}
