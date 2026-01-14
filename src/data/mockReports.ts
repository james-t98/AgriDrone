// Mock Reports Data
export interface Report {
    id: string;
    title: string;
    type: "pdf" | "html" | "csv" | "excel";
    category: "compliance" | "financial" | "operations" | "crop-health" | "drone";
    generatedAt: string;
    generatedBy: string;
    size: string;
    status: "ready" | "generating" | "failed";
    description: string;
    pages?: number;
}

export const mockReports: Report[] = [
    {
        id: "rpt-001",
        title: "Monthly Compliance Report - December 2025",
        type: "pdf",
        category: "compliance",
        generatedAt: "2026-01-02T09:00:00Z",
        generatedBy: "System",
        size: "2.4 MB",
        status: "ready",
        description: "Comprehensive compliance status for all EU and NL regulations",
        pages: 24,
    },
    {
        id: "rpt-002",
        title: "Annual Financial Summary 2025",
        type: "excel",
        category: "financial",
        generatedAt: "2026-01-05T14:30:00Z",
        generatedBy: "Jan de Vries",
        size: "1.8 MB",
        status: "ready",
        description: "Complete financial overview including ROI, costs, and projections",
        pages: 18,
    },
    {
        id: "rpt-003",
        title: "Crop Health Analysis Q4 2025",
        type: "html",
        category: "crop-health",
        generatedAt: "2026-01-08T11:15:00Z",
        generatedBy: "AgriDrone AI",
        size: "5.2 MB",
        status: "ready",
        description: "Interactive visualization of crop health trends and anomalies",
    },
    {
        id: "rpt-004",
        title: "Drone Fleet Performance Report",
        type: "pdf",
        category: "drone",
        generatedAt: "2026-01-10T16:45:00Z",
        generatedBy: "System",
        size: "3.1 MB",
        status: "ready",
        description: "Flight hours, coverage efficiency, and maintenance schedules",
        pages: 12,
    },
    {
        id: "rpt-005",
        title: "Nitrogen Usage Tracking 2025",
        type: "csv",
        category: "compliance",
        generatedAt: "2026-01-12T08:00:00Z",
        generatedBy: "System",
        size: "456 KB",
        status: "ready",
        description: "Detailed nitrogen application records per field",
    },
    {
        id: "rpt-006",
        title: "Pest & Disease Incident Log",
        type: "pdf",
        category: "crop-health",
        generatedAt: "2026-01-13T10:30:00Z",
        generatedBy: "Maria Jansen",
        size: "1.2 MB",
        status: "ready",
        description: "All detected pest and disease incidents with treatment records",
        pages: 8,
    },
    {
        id: "rpt-007",
        title: "Weekly Operations Summary",
        type: "html",
        category: "operations",
        generatedAt: "2026-01-14T06:00:00Z",
        generatedBy: "System",
        size: "890 KB",
        status: "ready",
        description: "Overview of all farm operations for the past week",
    },
    {
        id: "rpt-008",
        title: "Water Usage & Irrigation Report",
        type: "pdf",
        category: "compliance",
        generatedAt: "2026-01-14T12:00:00Z",
        generatedBy: "AgriDrone AI",
        size: "1.5 MB",
        status: "generating",
        description: "Water consumption analysis and irrigation optimization insights",
        pages: 10,
    },
];

// Report type icons mapping
export const reportTypeIcons: Record<string, { icon: string; color: string }> = {
    pdf: { icon: "FileText", color: "text-red-500" },
    html: { icon: "Globe", color: "text-blue-500" },
    csv: { icon: "Table", color: "text-green-500" },
    excel: { icon: "Sheet", color: "text-emerald-500" },
};

// Report category labels
export const reportCategoryLabels: Record<string, string> = {
    compliance: "Compliance",
    financial: "Financial",
    operations: "Operations",
    "crop-health": "Crop Health",
    drone: "Drone",
};
