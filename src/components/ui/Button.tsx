"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ButtonProps {
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
    disabled?: boolean;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
}

const variantStyles = {
    primary:
        "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/25",
    secondary:
        "bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--surface-hover)]",
    ghost:
        "bg-transparent text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]",
    danger:
        "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25",
};

const sizeStyles = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2 text-base gap-2",
    lg: "px-6 py-3 text-lg gap-2.5",
};

export function Button({
    variant = "primary",
    size = "md",
    loading = false,
    icon,
    children,
    className,
    disabled,
    onClick,
    type = "button",
}: ButtonProps) {
    const isDisabled = disabled || loading;

    return (
        <motion.button
            whileHover={{ scale: isDisabled ? 1 : 1.02 }}
            whileTap={{ scale: isDisabled ? 1 : 0.98 }}
            className={cn(
                "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200",
                variantStyles[variant],
                sizeStyles[size],
                isDisabled && "opacity-50 cursor-not-allowed",
                className
            )}
            disabled={isDisabled}
            onClick={onClick}
            type={type}
        >
            {loading ? (
                <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                </svg>
            ) : (
                icon
            )}
            {children}
        </motion.button>
    );
}
