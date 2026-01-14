"use client";

import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "warning" | "error" | "info" | "default";

interface BadgeProps {
    variant?: BadgeVariant;
    size?: "sm" | "md" | "lg";
    pulse?: boolean;
    children: React.ReactNode;
    className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
    success: "bg-green-500/10 text-green-500 border-green-500/20",
    warning: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    error: "bg-red-500/10 text-red-500 border-red-500/20",
    info: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    default: "bg-slate-500/10 text-slate-500 border-slate-500/20",
};

const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
};

export function Badge({
    variant = "default",
    size = "md",
    pulse = false,
    children,
    className,
}: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 font-medium rounded-full border",
                variantStyles[variant],
                sizeStyles[size],
                className
            )}
        >
            {pulse && (
                <span className="relative flex h-2 w-2">
                    <span
                        className={cn(
                            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                            variant === "success" && "bg-green-500",
                            variant === "warning" && "bg-yellow-500",
                            variant === "error" && "bg-red-500",
                            variant === "info" && "bg-blue-500",
                            variant === "default" && "bg-slate-500"
                        )}
                    />
                    <span
                        className={cn(
                            "relative inline-flex rounded-full h-2 w-2",
                            variant === "success" && "bg-green-500",
                            variant === "warning" && "bg-yellow-500",
                            variant === "error" && "bg-red-500",
                            variant === "info" && "bg-blue-500",
                            variant === "default" && "bg-slate-500"
                        )}
                    />
                </span>
            )}
            {children}
        </span>
    );
}
