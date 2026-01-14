"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface RotatingCardProps {
    children: React.ReactNode;
    className?: string;
    glareColor?: string;
    rotationIntensity?: number;
}

export function RotatingCard({
    children,
    className,
    glareColor = "rgba(255, 255, 255, 0.3)",
    rotationIntensity = 10,
}: RotatingCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Motion values for mouse position
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Spring configs for smooth animation
    const springConfig = { stiffness: 150, damping: 20 };
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [rotationIntensity, -rotationIntensity]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-rotationIntensity, rotationIntensity]), springConfig);

    // Glare position
    const glareX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), springConfig);
    const glareY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
                perspective: 1000,
            }}
            className={cn("relative cursor-pointer", className)}
        >
            {/* Card content */}
            <div className="relative z-10">{children}</div>

            {/* Glare effect */}
            <motion.div
                className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden"
                style={{
                    opacity: isHovered ? 1 : 0,
                    background: useTransform(
                        [glareX, glareY],
                        ([x, y]) =>
                            `radial-gradient(circle at ${x}% ${y}%, ${glareColor}, transparent 50%)`
                    ),
                }}
                transition={{ opacity: { duration: 0.2 } }}
            />

            {/* 3D shadow */}
            <motion.div
                className="absolute -inset-4 -z-10 rounded-2xl blur-xl"
                style={{
                    opacity: isHovered ? 0.3 : 0,
                    background: "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))",
                    transform: "translateZ(-50px)",
                }}
                transition={{ opacity: { duration: 0.3 } }}
            />
        </motion.div>
    );
}

// Simple rotating element (like a logo or icon)
export function RotatingElement({
    children,
    duration = 20,
    direction = "clockwise",
    pauseOnHover = true,
    className,
}: {
    children: React.ReactNode;
    duration?: number;
    direction?: "clockwise" | "counterclockwise";
    pauseOnHover?: boolean;
    className?: string;
}) {
    const [isPaused, setIsPaused] = useState(false);

    return (
        <motion.div
            onMouseEnter={() => pauseOnHover && setIsPaused(true)}
            onMouseLeave={() => pauseOnHover && setIsPaused(false)}
            animate={{
                rotate: direction === "clockwise" ? 360 : -360,
            }}
            transition={{
                duration,
                repeat: Infinity,
                ease: "linear",
            }}
            style={{
                animationPlayState: isPaused ? "paused" : "running",
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Floating animation for elements
export function FloatingElement({
    children,
    amplitude = 10,
    duration = 3,
    delay = 0,
    className,
}: {
    children: React.ReactNode;
    amplitude?: number;
    duration?: number;
    delay?: number;
    className?: string;
}) {
    return (
        <motion.div
            animate={{
                y: [-amplitude, amplitude, -amplitude],
            }}
            transition={{
                duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay,
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
