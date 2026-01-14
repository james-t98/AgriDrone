// Navigation items
export const NAV_ITEMS = [
    {
        name: "Dashboard",
        href: "/",
        icon: "LayoutDashboard",
        description: "Overview of farm operations",
    },
    {
        name: "Drone Operations",
        href: "/drones",
        icon: "Plane",
        description: "Manage drone fleet",
    },
    {
        name: "Crop Health",
        href: "/crop-health",
        icon: "Leaf",
        description: "Monitor crop conditions",
    },
    {
        name: "Compliance",
        href: "/compliance",
        icon: "Shield",
        description: "EU/NL regulations",
    },
    {
        name: "Financial",
        href: "/financial",
        icon: "TrendingUp",
        description: "ROI & analytics",
    },
    {
        name: "Reports",
        href: "/reports",
        icon: "FileText",
        description: "Generated reports",
    },
    {
        name: "AI Agent",
        href: "/agent",
        icon: "Bot",
        description: "CrewAI interaction",
    },
];

// Farm location (Netherlands)
export const FARM_CENTER = {
    lat: 52.1326,
    lng: 5.2913,
};

// Status variants
export const STATUS_COLORS = {
    success: {
        bg: "bg-green-500/10",
        text: "text-green-500",
        border: "border-green-500/20",
    },
    warning: {
        bg: "bg-yellow-500/10",
        text: "text-yellow-500",
        border: "border-yellow-500/20",
    },
    error: {
        bg: "bg-red-500/10",
        text: "text-red-500",
        border: "border-red-500/20",
    },
    info: {
        bg: "bg-blue-500/10",
        text: "text-blue-500",
        border: "border-blue-500/20",
    },
    default: {
        bg: "bg-slate-500/10",
        text: "text-slate-500",
        border: "border-slate-500/20",
    },
};

// Chart colors palette
export const CHART_COLORS = {
    primary: "#22c55e",
    secondary: "#0ea5e9",
    accent: "#8b5cf6",
    warning: "#f59e0b",
    error: "#ef4444",
    gray: "#64748b",
};

// Crop types
export const CROP_TYPES = [
    { id: "wheat", name: "Wheat", color: "#f59e0b" },
    { id: "corn", name: "Corn", color: "#eab308" },
    { id: "potato", name: "Potato", color: "#84cc16" },
    { id: "sugarbeet", name: "Sugar Beet", color: "#22c55e" },
    { id: "barley", name: "Barley", color: "#a3e635" },
];

// Drone statuses
export const DRONE_STATUSES = {
    active: { label: "Active", color: "success" },
    idle: { label: "Idle", color: "info" },
    charging: { label: "Charging", color: "warning" },
    maintenance: { label: "Maintenance", color: "error" },
    offline: { label: "Offline", color: "default" },
} as const;

// Compliance regulations
export const REGULATIONS = [
    {
        id: "eu-cap",
        name: "EU CAP 2023-2027",
        description: "Common Agricultural Policy requirements",
    },
    {
        id: "nl-nitrogen",
        name: "NL Nitrogen Act",
        description: "Dutch nitrogen reduction targets",
    },
    {
        id: "eu-biodiversity",
        name: "EU Biodiversity",
        description: "Biodiversity protection measures",
    },
    {
        id: "water-framework",
        name: "Water Framework",
        description: "Water quality directives",
    },
];
