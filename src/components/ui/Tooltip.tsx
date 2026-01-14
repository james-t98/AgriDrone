"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    position?: "top" | "bottom" | "left" | "right";
    className?: string;
}

export function Tooltip({
    content,
    children,
    position = "top",
    className,
}: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);

    const positionStyles = {
        top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
        left: "right-full top-1/2 -translate-y-1/2 mr-2",
        right: "left-full top-1/2 -translate-y-1/2 ml-2",
    };

    const arrowStyles = {
        top: "top-full left-1/2 -translate-x-1/2 border-t-slate-800 dark:border-t-slate-700 border-x-transparent border-b-transparent",
        bottom:
            "bottom-full left-1/2 -translate-x-1/2 border-b-slate-800 dark:border-b-slate-700 border-x-transparent border-t-transparent",
        left: "left-full top-1/2 -translate-y-1/2 border-l-slate-800 dark:border-l-slate-700 border-y-transparent border-r-transparent",
        right:
            "right-full top-1/2 -translate-y-1/2 border-r-slate-800 dark:border-r-slate-700 border-y-transparent border-l-transparent",
    };

    return (
        <div
            className={cn("relative inline-flex", className)}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                            "absolute z-50 px-3 py-1.5 text-sm text-white bg-slate-800 dark:bg-slate-700 rounded-lg whitespace-nowrap shadow-lg",
                            positionStyles[position]
                        )}
                    >
                        {content}
                        <span
                            className={cn(
                                "absolute w-0 h-0 border-4",
                                arrowStyles[position]
                            )}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
