// Mock Compliance Data
export interface ComplianceItem {
    id: string;
    regulation: string;
    category: string;
    status: "compliant" | "warning" | "non-compliant" | "pending";
    score: number;
    lastAudit: string;
    nextAudit: string;
    description: string;
    requirements: string[];
}

export interface NitrogenUsage {
    current: number;
    limit: number;
    unit: string;
    trend: "increasing" | "stable" | "decreasing";
    lastUpdated: string;
}

export interface AuditLogEntry {
    id: string;
    timestamp: string;
    action: string;
    category: string;
    user: string;
    details: string;
    status: "success" | "warning" | "error";
}

export const mockComplianceItems: ComplianceItem[] = [
    {
        id: "comp-001",
        regulation: "EU CAP 2023-2027",
        category: "Agricultural Policy",
        status: "compliant",
        score: 94,
        lastAudit: "2025-12-15",
        nextAudit: "2026-06-15",
        description: "Common Agricultural Policy requirements for sustainable farming practices",
        requirements: [
            "Crop rotation implemented",
            "Minimum 4% non-productive area",
            "Soil cover during winter",
            "Precision farming adoption"
        ],
    },
    {
        id: "comp-002",
        regulation: "NL Nitrogen Act",
        category: "Environmental",
        status: "warning",
        score: 78,
        lastAudit: "2025-11-20",
        nextAudit: "2026-05-20",
        description: "Dutch nitrogen reduction targets and emission limits",
        requirements: [
            "Nitrogen emission monitoring",
            "Maximum 170 kg N/ha from manure",
            "Precision fertilization",
            "Buffer zones maintained"
        ],
    },
    {
        id: "comp-003",
        regulation: "EU Biodiversity Strategy",
        category: "Environmental",
        status: "compliant",
        score: 88,
        lastAudit: "2025-10-10",
        nextAudit: "2026-04-10",
        description: "Biodiversity protection and enhancement measures",
        requirements: [
            "Habitat zones preserved",
            "Pollinator-friendly areas",
            "Reduced pesticide use",
            "Native species promotion"
        ],
    },
    {
        id: "comp-004",
        regulation: "Water Framework Directive",
        category: "Environmental",
        status: "compliant",
        score: 91,
        lastAudit: "2025-09-05",
        nextAudit: "2026-03-05",
        description: "Water quality and management standards",
        requirements: [
            "Buffer strips along waterways",
            "Runoff management",
            "Water quality monitoring",
            "Efficient irrigation"
        ],
    },
    {
        id: "comp-005",
        regulation: "Farm to Fork Strategy",
        category: "Sustainability",
        status: "pending",
        score: 72,
        lastAudit: "2025-08-22",
        nextAudit: "2026-02-22",
        description: "Sustainable food production and reduced environmental impact",
        requirements: [
            "25% organic farming target",
            "50% pesticide reduction",
            "20% fertilizer reduction",
            "Carbon neutral operations"
        ],
    },
];

export const mockNitrogenUsage: NitrogenUsage = {
    current: 142,
    limit: 170,
    unit: "kg N/ha",
    trend: "decreasing",
    lastUpdated: "2026-01-14T08:00:00Z",
};

export const mockAuditLog: AuditLogEntry[] = [
    {
        id: "log-001",
        timestamp: "2026-01-14T14:30:00Z",
        action: "Fertilizer Application Logged",
        category: "Nitrogen",
        user: "System (Drone Alpha)",
        details: "Applied 15 kg N/ha to Field B using precision spreader",
        status: "success",
    },
    {
        id: "log-002",
        timestamp: "2026-01-14T12:15:00Z",
        action: "Compliance Report Generated",
        category: "Audit",
        user: "Jan de Vries",
        details: "Monthly compliance report for December 2025 exported",
        status: "success",
    },
    {
        id: "log-003",
        timestamp: "2026-01-14T10:00:00Z",
        action: "Nitrogen Threshold Warning",
        category: "Nitrogen",
        user: "System",
        details: "Field C approaching 85% of nitrogen limit",
        status: "warning",
    },
    {
        id: "log-004",
        timestamp: "2026-01-13T16:45:00Z",
        action: "Buffer Zone Inspection",
        category: "Water",
        user: "Maria Jansen",
        details: "Quarterly inspection of waterway buffer zones completed",
        status: "success",
    },
    {
        id: "log-005",
        timestamp: "2026-01-13T11:20:00Z",
        action: "Pesticide Application Denied",
        category: "Environmental",
        user: "System",
        details: "Application blocked: exceeds weekly limit for target zone",
        status: "error",
    },
    {
        id: "log-006",
        timestamp: "2026-01-12T09:30:00Z",
        action: "Biodiversity Audit Completed",
        category: "Environmental",
        user: "External Auditor",
        details: "Annual biodiversity assessment passed with score 88/100",
        status: "success",
    },
];
