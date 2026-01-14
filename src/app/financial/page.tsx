"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, PieChart, BarChart3, Sparkles, Download } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
    mockFinancialKPIs,
    mockRevenueData,
    mockCostBreakdown,
    mockForecastData,
    mockSavings,
} from "@/data/mockFinancial";
import { cn, formatCurrency } from "@/lib/utils";

export default function FinancialPage() {
    const totalSavings = mockSavings.reduce((acc, item) => acc + item.amount, 0);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-bold text-[var(--foreground)]">Financial Overview</h1>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                        Track ROI, costs, and AI-driven savings
                    </p>
                </div>
                <Button icon={<Download className="w-4 h-4" />}>
                    Export Report
                </Button>
            </motion.div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {mockFinancialKPIs.map((kpi, i) => (
                    <motion.div
                        key={kpi.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="relative overflow-hidden">
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-[var(--text-muted)]">{kpi.label}</span>
                                    <div
                                        className={cn(
                                            "flex items-center gap-1 text-sm font-medium",
                                            kpi.trend === "up" && kpi.id !== "costs" ? "text-green-500" :
                                                kpi.trend === "down" && kpi.id === "costs" ? "text-green-500" :
                                                    kpi.trend === "up" && kpi.id === "costs" ? "text-red-500" :
                                                        kpi.trend === "down" && kpi.id !== "costs" ? "text-red-500" :
                                                            "text-[var(--text-muted)]"
                                        )}
                                    >
                                        {kpi.trend === "up" ? (
                                            <TrendingUp className="w-4 h-4" />
                                        ) : kpi.trend === "down" ? (
                                            <TrendingDown className="w-4 h-4" />
                                        ) : null}
                                        {kpi.trendPercent > 0 ? "+" : ""}{kpi.trendPercent}%
                                    </div>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold text-[var(--foreground)]">
                                        {kpi.unit === "EUR" ? formatCurrency(kpi.value) : kpi.value}
                                    </span>
                                    {kpi.unit !== "EUR" && <span className="text-lg text-[var(--text-muted)]">{kpi.unit}</span>}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue vs Costs Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue vs Costs</CardTitle>
                        <Badge variant="success" size="sm">2025</Badge>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={mockRevenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorCosts" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                                <YAxis stroke="var(--text-muted)" fontSize={12} tickFormatter={(value) => `€${value / 1000}k`} />
                                <Tooltip
                                    contentStyle={{
                                        background: "var(--surface)",
                                        border: "1px solid var(--border)",
                                        borderRadius: "8px",
                                    }}
                                    formatter={(value) => formatCurrency(value as number)}
                                />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    name="Revenue"
                                    stroke="#22c55e"
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                    strokeWidth={2}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="costs"
                                    name="Costs"
                                    stroke="#ef4444"
                                    fillOpacity={1}
                                    fill="url(#colorCosts)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Cost Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Cost Breakdown</CardTitle>
                        <span className="text-sm text-[var(--text-muted)]">{formatCurrency(423200)} total</span>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-8">
                            <ResponsiveContainer width="50%" height={250}>
                                <RechartsPieChart>
                                    <Pie
                                        data={mockCostBreakdown as unknown as Record<string, unknown>[]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        dataKey="amount"
                                        nameKey="category"
                                        paddingAngle={2}
                                    >
                                        {mockCostBreakdown.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            background: "var(--surface)",
                                            border: "1px solid var(--border)",
                                            borderRadius: "8px",
                                        }}
                                        formatter={(value) => formatCurrency(value as number)}
                                    />
                                </RechartsPieChart>
                            </ResponsiveContainer>
                            <div className="flex-1 space-y-2">
                                {mockCostBreakdown.map((item, i) => (
                                    <motion.div
                                        key={item.category}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex items-center gap-3"
                                    >
                                        <div
                                            className="w-3 h-3 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <div className="flex-1 flex items-center justify-between">
                                            <span className="text-sm text-[var(--text-muted)]">{item.category}</span>
                                            <span className="text-sm font-medium text-[var(--foreground)]">{item.percentage}%</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Forecast & Savings */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Forecast Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Revenue Forecast</CardTitle>
                        <Badge variant="info" size="sm">AI Projected</Badge>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={mockForecastData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis dataKey="quarter" stroke="var(--text-muted)" fontSize={12} />
                                <YAxis stroke="var(--text-muted)" fontSize={12} tickFormatter={(value) => `€${value / 1000}k`} />
                                <Tooltip
                                    contentStyle={{
                                        background: "var(--surface)",
                                        border: "1px solid var(--border)",
                                        borderRadius: "8px",
                                    }}
                                    formatter={(value) => formatCurrency(value as number)}
                                />
                                <Legend />
                                <Bar dataKey="actual" name="Actual" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="projected" name="Projected" fill="#0ea5e9" radius={[4, 4, 0, 0]} opacity={0.7} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* AI Savings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-purple-500" />
                            AI-Driven Savings
                        </CardTitle>
                        <Badge variant="success" size="sm">{formatCurrency(totalSavings)}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {mockSavings.map((item, i) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-3 rounded-lg bg-[var(--surface-hover)]"
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-[var(--foreground)]">{item.category}</span>
                                    <span className="text-sm font-bold text-green-500">{formatCurrency(item.amount)}</span>
                                </div>
                                <p className="text-xs text-[var(--text-muted)]">{item.description}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="flex-1 h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.aiContribution}%` }}
                                            transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                                            className="h-full rounded-full bg-purple-500"
                                        />
                                    </div>
                                    <span className="text-xs text-[var(--text-muted)]">{item.aiContribution}% AI</span>
                                </div>
                            </motion.div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
