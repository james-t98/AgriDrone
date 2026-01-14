"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReelCarouselProps {
    children: React.ReactNode[];
    itemWidth?: number;
    gap?: number;
    showArrows?: boolean;
    showDots?: boolean;
    autoPlay?: boolean;
    autoPlayInterval?: number;
    className?: string;
}

export function ReelCarousel({
    children,
    itemWidth = 300,
    gap = 16,
    showArrows = true,
    showDots = true,
    autoPlay = false,
    autoPlayInterval = 5000,
    className,
}: ReelCarouselProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const x = useMotionValue(0);
    const totalItems = children.length;
    const maxDrag = -(totalItems - 1) * (itemWidth + gap);

    // Auto-play effect
    React.useEffect(() => {
        if (!autoPlay) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % totalItems);
        }, autoPlayInterval);
        return () => clearInterval(interval);
    }, [autoPlay, autoPlayInterval, totalItems]);

    // Update position when currentIndex changes
    React.useEffect(() => {
        const targetX = -currentIndex * (itemWidth + gap);
        x.set(targetX);
    }, [currentIndex, itemWidth, gap, x]);

    const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        setIsDragging(false);
        const velocity = info.velocity.x;
        const offset = info.offset.x;

        // Determine direction based on velocity and offset
        if (Math.abs(velocity) > 500 || Math.abs(offset) > itemWidth / 3) {
            if (velocity > 0 || offset > 0) {
                setCurrentIndex(Math.max(0, currentIndex - 1));
            } else {
                setCurrentIndex(Math.min(totalItems - 1, currentIndex + 1));
            }
        } else {
            // Snap back to current index
            x.set(-currentIndex * (itemWidth + gap));
        }
    };

    const goTo = (index: number) => {
        setCurrentIndex(Math.max(0, Math.min(totalItems - 1, index)));
    };

    const goNext = () => goTo(currentIndex + 1);
    const goPrev = () => goTo(currentIndex - 1);

    // Scale transform based on distance from center
    const getItemScale = (index: number) => {
        const distance = Math.abs(index - currentIndex);
        return 1 - distance * 0.05;
    };

    return (
        <div className={cn("relative", className)}>
            {/* Carousel Container */}
            <div ref={containerRef} className="overflow-hidden">
                <motion.div
                    drag="x"
                    dragConstraints={{ left: maxDrag, right: 0 }}
                    dragElastic={0.1}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={handleDragEnd}
                    style={{ x }}
                    className="flex cursor-grab active:cursor-grabbing"
                >
                    {children.map((child, index) => (
                        <motion.div
                            key={index}
                            animate={{
                                scale: isDragging ? 1 : getItemScale(index),
                                opacity: isDragging ? 1 : index === currentIndex ? 1 : 0.7,
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            style={{
                                width: itemWidth,
                                marginRight: index === totalItems - 1 ? 0 : gap,
                                flexShrink: 0,
                            }}
                        >
                            {child}
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Navigation Arrows */}
            {showArrows && totalItems > 1 && (
                <>
                    <button
                        onClick={goPrev}
                        disabled={currentIndex === 0}
                        className={cn(
                            "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10",
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            "bg-[var(--surface)] border border-[var(--border)]",
                            "shadow-lg backdrop-blur-sm transition-all",
                            "hover:scale-110 hover:bg-[var(--surface-hover)]",
                            currentIndex === 0 && "opacity-50 cursor-not-allowed hover:scale-100"
                        )}
                    >
                        <ChevronLeft className="w-5 h-5 text-[var(--foreground)]" />
                    </button>
                    <button
                        onClick={goNext}
                        disabled={currentIndex === totalItems - 1}
                        className={cn(
                            "absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10",
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            "bg-[var(--surface)] border border-[var(--border)]",
                            "shadow-lg backdrop-blur-sm transition-all",
                            "hover:scale-110 hover:bg-[var(--surface-hover)]",
                            currentIndex === totalItems - 1 && "opacity-50 cursor-not-allowed hover:scale-100"
                        )}
                    >
                        <ChevronRight className="w-5 h-5 text-[var(--foreground)]" />
                    </button>
                </>
            )}

            {/* Dot Indicators */}
            {showDots && totalItems > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                    {children.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goTo(index)}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all duration-300",
                                index === currentIndex
                                    ? "bg-green-500 w-6"
                                    : "bg-[var(--border)] hover:bg-[var(--text-muted)]"
                            )}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// Infinite scrolling marquee version
export function InfiniteReel({
    children,
    speed = 50,
    direction = "left",
    pauseOnHover = true,
    className,
}: {
    children: React.ReactNode;
    speed?: number;
    direction?: "left" | "right";
    pauseOnHover?: boolean;
    className?: string;
}) {
    const [isPaused, setIsPaused] = useState(false);

    return (
        <div
            className={cn("overflow-hidden", className)}
            onMouseEnter={() => pauseOnHover && setIsPaused(true)}
            onMouseLeave={() => pauseOnHover && setIsPaused(false)}
        >
            <motion.div
                animate={{
                    x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
                }}
                transition={{
                    duration: speed,
                    repeat: Infinity,
                    ease: "linear",
                }}
                style={{
                    animationPlayState: isPaused ? "paused" : "running",
                }}
                className="flex gap-4"
            >
                {children}
                {children}
            </motion.div>
        </div>
    );
}
