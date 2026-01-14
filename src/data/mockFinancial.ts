// Mock Financial Data
export interface FinancialKPI {
    id: string;
    label: string;
    value: number;
    previousValue: number;
    unit: string;
    trend: "up" | "down" | "stable";
    trendPercent: number;
}

export interface RevenueData {
    month: string;
    revenue: number;
    costs: number;
    profit: number;
}

export interface CostBreakdown {
    category: string;
    amount: number;
    percentage: number;
    color: string;
}

export interface ForecastData {
    quarter: string;
    projected: number;
    actual?: number;
    confidence: number;
}

export interface SavingsItem {
    id: string;
    category: string;
    description: string;
    amount: number;
    period: string;
    aiContribution: number; // percentage attributed to AI optimization
}

export const mockFinancialKPIs: FinancialKPI[] = [
    {
        id: "revenue",
        label: "Annual Revenue",
        value: 847500,
        previousValue: 792000,
        unit: "EUR",
        trend: "up",
        trendPercent: 7.0,
    },
    {
        id: "costs",
        label: "Operating Costs",
        value: 423200,
        previousValue: 456800,
        unit: "EUR",
        trend: "down",
        trendPercent: -7.4,
    },
    {
        id: "roi",
        label: "ROI",
        value: 24.8,
        previousValue: 18.2,
        unit: "%",
        trend: "up",
        trendPercent: 36.3,
    },
    {
        id: "yield",
        label: "Yield Value",
        value: 6420,
        previousValue: 5890,
        unit: "EUR/ha",
        trend: "up",
        trendPercent: 9.0,
    },
];

export const mockRevenueData: RevenueData[] = [
    { month: "Jan", revenue: 45200, costs: 38500, profit: 6700 },
    { month: "Feb", revenue: 42800, costs: 35200, profit: 7600 },
    { month: "Mar", revenue: 58500, costs: 42100, profit: 16400 },
    { month: "Apr", revenue: 72400, costs: 48300, profit: 24100 },
    { month: "May", revenue: 89200, costs: 52400, profit: 36800 },
    { month: "Jun", revenue: 95800, costs: 55200, profit: 40600 },
    { month: "Jul", revenue: 102500, costs: 58900, profit: 43600 },
    { month: "Aug", revenue: 98400, costs: 54200, profit: 44200 },
    { month: "Sep", revenue: 86500, costs: 48600, profit: 37900 },
    { month: "Oct", revenue: 68200, costs: 42800, profit: 25400 },
    { month: "Nov", revenue: 52400, costs: 38200, profit: 14200 },
    { month: "Dec", revenue: 48800, costs: 35800, profit: 13000 },
];

export const mockCostBreakdown: CostBreakdown[] = [
    { category: "Labor", amount: 126960, percentage: 30, color: "#22c55e" },
    { category: "Equipment & Drones", amount: 84640, percentage: 20, color: "#0ea5e9" },
    { category: "Seeds & Materials", amount: 63480, percentage: 15, color: "#8b5cf6" },
    { category: "Fertilizers", amount: 50784, percentage: 12, color: "#f59e0b" },
    { category: "Fuel & Energy", amount: 42320, percentage: 10, color: "#ef4444" },
    { category: "Maintenance", amount: 33856, percentage: 8, color: "#64748b" },
    { category: "Insurance & Misc", amount: 21160, percentage: 5, color: "#94a3b8" },
];

export const mockForecastData: ForecastData[] = [
    { quarter: "Q1 2025", projected: 146500, actual: 148200, confidence: 95 },
    { quarter: "Q2 2025", projected: 257400, actual: 262800, confidence: 95 },
    { quarter: "Q3 2025", projected: 296700, actual: 290100, confidence: 95 },
    { quarter: "Q4 2025", projected: 169400, actual: 172500, confidence: 95 },
    { quarter: "Q1 2026", projected: 158200, confidence: 88 },
    { quarter: "Q2 2026", projected: 275600, confidence: 82 },
    { quarter: "Q3 2026", projected: 312400, confidence: 75 },
    { quarter: "Q4 2026", projected: 185800, confidence: 68 },
];

export const mockSavings: SavingsItem[] = [
    {
        id: "sav-001",
        category: "Water Management",
        description: "AI-optimized irrigation reduced water usage by 28%",
        amount: 18500,
        period: "2025",
        aiContribution: 85,
    },
    {
        id: "sav-002",
        category: "Fertilizer Efficiency",
        description: "Precision application reduced fertilizer waste by 22%",
        amount: 14200,
        period: "2025",
        aiContribution: 92,
    },
    {
        id: "sav-003",
        category: "Pest Management",
        description: "Early detection reduced pesticide costs by 35%",
        amount: 12800,
        period: "2025",
        aiContribution: 78,
    },
    {
        id: "sav-004",
        category: "Labor Optimization",
        description: "Automated scheduling improved labor efficiency by 15%",
        amount: 22400,
        period: "2025",
        aiContribution: 65,
    },
    {
        id: "sav-005",
        category: "Yield Improvement",
        description: "Data-driven decisions increased yield by 12%",
        amount: 45600,
        period: "2025",
        aiContribution: 88,
    },
];
