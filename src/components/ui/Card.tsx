"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLMotionProps<"div"> {
    variant?: "default" | "glass" | "gradient";
    hover?: boolean;
    children: React.ReactNode;
}

export function Card({
    variant = "default",
    hover = true,
    className,
    children,
    ...props
}: CardProps) {
    const variants = {
        default: "bg-[var(--surface)] border border-[var(--border)]",
        glass: "glass",
        gradient: "bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/20",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={hover ? { y: -2, boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)" } : undefined}
            className={cn(
                "rounded-xl p-6 shadow-[var(--shadow-card)] transition-all duration-300",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export function CardHeader({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <div className={cn("flex items-center justify-between mb-4", className)}>
            {children}
        </div>
    );
}

export function CardTitle({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <h3 className={cn("text-lg font-semibold text-[var(--foreground)]", className)}>
            {children}
        </h3>
    );
}

export function CardContent({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) {
    return <div className={cn("", className)}>{children}</div>;
}

export function CardFooter({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <div className={cn("mt-4 pt-4 border-t border-[var(--border)]", className)}>
            {children}
        </div>
    );
}
