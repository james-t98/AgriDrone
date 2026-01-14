import { type ClassValue, clsx } from "clsx";

// Utility for conditional class names
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Format number with locale
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format percentage
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

// Format date
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Format time
export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Format relative time
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(d);
}

// Clamp value between min and max
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Delay utility for simulating loading
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Get health color based on value
export function getHealthColor(value: number): string {
  if (value >= 80) return "text-green-500";
  if (value >= 60) return "text-yellow-500";
  if (value >= 40) return "text-orange-500";
  return "text-red-500";
}

// Get health background color based on value
export function getHealthBgColor(value: number): string {
  if (value >= 80) return "bg-green-500/10";
  if (value >= 60) return "bg-yellow-500/10";
  if (value >= 40) return "bg-orange-500/10";
  return "bg-red-500/10";
}

// Status badge variant
export function getStatusVariant(status: string): "success" | "warning" | "error" | "info" | "default" {
  switch (status.toLowerCase()) {
    case "active":
    case "healthy":
    case "compliant":
    case "complete":
      return "success";
    case "warning":
    case "pending":
    case "in-progress":
      return "warning";
    case "error":
    case "critical":
    case "offline":
      return "error";
    case "info":
    case "scheduled":
      return "info";
    default:
      return "default";
  }
}
