"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
    variant?: "text" | "circular" | "rectangular";
    width?: string | number;
    height?: string | number;
    lines?: number;
}

export function Skeleton({
    className,
    variant = "rectangular",
    width,
    height,
    lines = 1,
}: SkeletonProps) {
    const baseClasses = "skeleton rounded-md";

    if (variant === "circular") {
        return (
            <div
                className={cn(baseClasses, "rounded-full", className)}
                style={{
                    width: width || 40,
                    height: height || 40,
                }}
            />
        );
    }

    if (variant === "text" && lines > 1) {
        return (
            <div className="space-y-2">
                {Array.from({ length: lines }).map((_, i) => (
                    <div
                        key={i}
                        className={cn(baseClasses, className)}
                        style={{
                            width: i === lines - 1 ? "60%" : width || "100%",
                            height: height || 16,
                        }}
                    />
                ))}
            </div>
        );
    }

    return (
        <div
            className={cn(baseClasses, className)}
            style={{
                width: width || "100%",
                height: height || 20,
            }}
        />
    );
}

export function SkeletonCard({ className }: { className?: string }) {
    return (
        <div className={cn("card p-6 space-y-4", className)}>
            <div className="flex items-center justify-between">
                <Skeleton width={120} height={24} />
                <Skeleton variant="circular" width={32} height={32} />
            </div>
            <Skeleton variant="text" lines={2} />
            <div className="flex gap-4">
                <Skeleton width={80} height={32} />
                <Skeleton width={80} height={32} />
            </div>
        </div>
    );
}

export function SkeletonChart({ className }: { className?: string }) {
    return (
        <div className={cn("card p-6", className)}>
            <Skeleton width={150} height={24} className="mb-4" />
            <div className="flex items-end gap-2 h-48">
                {Array.from({ length: 12 }).map((_, i) => (
                    <Skeleton
                        key={i}
                        width="100%"
                        height={`${Math.random() * 60 + 30}%`}
                        className="flex-1"
                    />
                ))}
            </div>
        </div>
    );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-3">
            <div className="flex gap-4 pb-2 border-b border-[var(--border)]">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} width="25%" height={16} />
                ))}
            </div>
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4 py-2">
                    {Array.from({ length: 4 }).map((_, j) => (
                        <Skeleton key={j} width="25%" height={20} />
                    ))}
                </div>
            ))}
        </div>
    );
}
