"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Eye, Calendar, Clock, Filter, Search, Grid, List } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockReports, reportCategoryLabels } from "@/data/mockReports";
import { cn, formatDate, formatRelativeTime } from "@/lib/utils";

const typeConfig = {
    pdf: { color: "text-red-500", bg: "bg-red-500/10" },
    html: { color: "text-blue-500", bg: "bg-blue-500/10" },
    csv: { color: "text-green-500", bg: "bg-green-500/10" },
    excel: { color: "text-emerald-500", bg: "bg-emerald-500/10" },
};

const categoryColors: Record<string, string> = {
    compliance: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    financial: "bg-green-500/10 text-green-500 border-green-500/20",
    operations: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "crop-health": "bg-amber-500/10 text-amber-500 border-amber-500/20",
    drone: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
};

export default function ReportsPage() {
    const [view, setView] = useState<"grid" | "list">("grid");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories = Object.keys(reportCategoryLabels);
    const filteredReports = selectedCategory
        ? mockReports.filter((r) => r.category === selectedCategory)
        : mockReports;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-bold text-[var(--foreground)]">Reports</h1>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                        View and download generated farm reports
                    </p>
                </div>
                <Button icon={<FileText className="w-4 h-4" />}>
                    Generate New Report
                </Button>
            </motion.div>

            {/* Filters & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input
                        type="text"
                        placeholder="Search reports..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 text-sm"
                    />
                </div>

                <div className="flex items-center gap-4">
                    {/* Category Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-[var(--text-muted)]" />
                        <div className="flex gap-1">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={cn(
                                    "px-2 py-1 text-xs rounded-full transition-colors",
                                    !selectedCategory
                                        ? "bg-green-500/20 text-green-500"
                                        : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
                                )}
                            >
                                All
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                                    className={cn(
                                        "px-2 py-1 text-xs rounded-full transition-colors capitalize",
                                        selectedCategory === cat
                                            ? categoryColors[cat]
                                            : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
                                    )}
                                >
                                    {reportCategoryLabels[cat]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center border border-[var(--border)] rounded-lg overflow-hidden">
                        <button
                            onClick={() => setView("grid")}
                            className={cn(
                                "p-2 transition-colors",
                                view === "grid" ? "bg-green-500/20 text-green-500" : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
                            )}
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setView("list")}
                            className={cn(
                                "p-2 transition-colors",
                                view === "list" ? "bg-green-500/20 text-green-500" : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
                            )}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Reports Grid/List */}
            {view === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredReports.map((report, i) => {
                        const typeStyle = typeConfig[report.type];

                        return (
                            <motion.div
                                key={report.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Card className="h-full hover:border-green-500/30 transition-colors group cursor-pointer">
                                    <CardContent className="p-5">
                                        {/* Icon & Type */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={cn("p-3 rounded-xl", typeStyle.bg)}>
                                                <FileText className={cn("w-6 h-6", typeStyle.color)} />
                                            </div>
                                            <Badge variant="default" size="sm" className="uppercase">
                                                {report.type}
                                            </Badge>
                                        </div>

                                        {/* Title */}
                                        <h3 className="font-semibold text-[var(--foreground)] mb-2 line-clamp-2 group-hover:text-green-500 transition-colors">
                                            {report.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-sm text-[var(--text-muted)] mb-4 line-clamp-2">
                                            {report.description}
                                        </p>

                                        {/* Meta */}
                                        <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mb-4">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(report.generatedAt)}
                                            </span>
                                            <span>{report.size}</span>
                                        </div>

                                        {/* Category & Status */}
                                        <div className="flex items-center justify-between">
                                            <span className={cn("px-2 py-1 text-xs rounded-full border", categoryColors[report.category])}>
                                                {reportCategoryLabels[report.category]}
                                            </span>
                                            {report.status === "generating" ? (
                                                <Badge variant="warning" size="sm" pulse>
                                                    Generating
                                                </Badge>
                                            ) : (
                                                <Badge variant="success" size="sm">
                                                    Ready
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[var(--border)]">
                                            <Button size="sm" variant="ghost" icon={<Eye className="w-4 h-4" />} className="flex-1">
                                                View
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                icon={<Download className="w-4 h-4" />}
                                                className="flex-1"
                                                disabled={report.status === "generating"}
                                            >
                                                Download
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <Card>
                    <CardContent className="p-0">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[var(--border)]">
                                    <th className="text-left p-4 text-sm font-medium text-[var(--text-muted)]">Report</th>
                                    <th className="text-left p-4 text-sm font-medium text-[var(--text-muted)]">Category</th>
                                    <th className="text-left p-4 text-sm font-medium text-[var(--text-muted)]">Type</th>
                                    <th className="text-left p-4 text-sm font-medium text-[var(--text-muted)]">Generated</th>
                                    <th className="text-left p-4 text-sm font-medium text-[var(--text-muted)]">Size</th>
                                    <th className="text-left p-4 text-sm font-medium text-[var(--text-muted)]">Status</th>
                                    <th className="text-right p-4 text-sm font-medium text-[var(--text-muted)]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReports.map((report, i) => {
                                    const typeStyle = typeConfig[report.type];

                                    return (
                                        <motion.tr
                                            key={report.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.02 }}
                                            className="border-b border-[var(--border)] hover:bg-[var(--surface-hover)] transition-colors"
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn("p-2 rounded-lg", typeStyle.bg)}>
                                                        <FileText className={cn("w-4 h-4", typeStyle.color)} />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-[var(--foreground)]">{report.title}</p>
                                                        <p className="text-xs text-[var(--text-muted)]">{report.generatedBy}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={cn("px-2 py-1 text-xs rounded-full border", categoryColors[report.category])}>
                                                    {reportCategoryLabels[report.category]}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className="uppercase text-sm font-medium text-[var(--text-muted)]">{report.type}</span>
                                            </td>
                                            <td className="p-4 text-sm text-[var(--text-muted)]">{formatRelativeTime(report.generatedAt)}</td>
                                            <td className="p-4 text-sm text-[var(--text-muted)]">{report.size}</td>
                                            <td className="p-4">
                                                {report.status === "generating" ? (
                                                    <Badge variant="warning" size="sm" pulse>
                                                        Generating
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="success" size="sm">
                                                        Ready
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button size="sm" variant="ghost" icon={<Eye className="w-4 h-4" />} />
                                                    <Button size="sm" variant="ghost" icon={<Download className="w-4 h-4" />} disabled={report.status === "generating"} />
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
