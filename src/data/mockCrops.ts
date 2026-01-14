// Mock Crop Health Data
export interface CropField {
    id: string;
    name: string;
    crop: string;
    area: number; // hectares
    healthScore: number;
    ndviValue: number;
    soilMoisture: number;
    temperature: number;
    growthStage: string;
    lastScanned: string;
}

export interface HealthTrend {
    date: string;
    ndvi: number;
    soilMoisture: number;
    temperature: number;
}

export interface PestAlert {
    id: string;
    fieldId: string;
    fieldName: string;
    pest: string;
    severity: "low" | "medium" | "high" | "critical";
    affectedArea: number; // hectares
    detectedAt: string;
    status: "active" | "monitoring" | "resolved";
    recommendation: string;
}

export interface DiseaseAlert {
    id: string;
    fieldId: string;
    fieldName: string;
    disease: string;
    severity: "low" | "medium" | "high" | "critical";
    affectedArea: number;
    detectedAt: string;
    status: "active" | "monitoring" | "resolved";
    recommendation: string;
}

export const mockCropFields: CropField[] = [
    {
        id: "field-a",
        name: "Field A",
        crop: "Potato",
        area: 25.5,
        healthScore: 92,
        ndviValue: 0.78,
        soilMoisture: 42,
        temperature: 7.2,
        growthStage: "Tuber Bulking",
        lastScanned: "2026-01-14T10:30:00Z",
    },
    {
        id: "field-b",
        name: "Field B",
        crop: "Wheat",
        area: 38.2,
        healthScore: 87,
        ndviValue: 0.72,
        soilMoisture: 38,
        temperature: 6.8,
        growthStage: "Tillering",
        lastScanned: "2026-01-14T11:15:00Z",
    },
    {
        id: "field-c",
        name: "Field C",
        crop: "Corn",
        area: 30.0,
        healthScore: 78,
        ndviValue: 0.65,
        soilMoisture: 35,
        temperature: 7.5,
        growthStage: "Dormant",
        lastScanned: "2026-01-14T09:45:00Z",
    },
    {
        id: "field-d",
        name: "Field D",
        crop: "Sugar Beet",
        area: 22.8,
        healthScore: 95,
        ndviValue: 0.82,
        soilMoisture: 45,
        temperature: 7.0,
        growthStage: "Harvest Ready",
        lastScanned: "2026-01-14T12:00:00Z",
    },
    {
        id: "field-e",
        name: "Field E",
        crop: "Barley",
        area: 18.5,
        healthScore: 84,
        ndviValue: 0.70,
        soilMoisture: 40,
        temperature: 6.5,
        growthStage: "Seedling",
        lastScanned: "2026-01-14T13:30:00Z",
    },
];

export const mockHealthTrends: HealthTrend[] = [
    { date: "2026-01-01", ndvi: 0.68, soilMoisture: 45, temperature: 4.2 },
    { date: "2026-01-02", ndvi: 0.69, soilMoisture: 44, temperature: 3.8 },
    { date: "2026-01-03", ndvi: 0.70, soilMoisture: 46, temperature: 5.1 },
    { date: "2026-01-04", ndvi: 0.71, soilMoisture: 43, temperature: 6.0 },
    { date: "2026-01-05", ndvi: 0.72, soilMoisture: 42, temperature: 5.5 },
    { date: "2026-01-06", ndvi: 0.73, soilMoisture: 44, temperature: 4.8 },
    { date: "2026-01-07", ndvi: 0.74, soilMoisture: 41, temperature: 6.2 },
    { date: "2026-01-08", ndvi: 0.75, soilMoisture: 40, temperature: 7.0 },
    { date: "2026-01-09", ndvi: 0.76, soilMoisture: 42, temperature: 6.5 },
    { date: "2026-01-10", ndvi: 0.77, soilMoisture: 43, temperature: 5.8 },
    { date: "2026-01-11", ndvi: 0.76, soilMoisture: 41, temperature: 6.8 },
    { date: "2026-01-12", ndvi: 0.77, soilMoisture: 40, temperature: 7.2 },
    { date: "2026-01-13", ndvi: 0.78, soilMoisture: 42, temperature: 7.5 },
    { date: "2026-01-14", ndvi: 0.78, soilMoisture: 42, temperature: 8.0 },
];

export const mockPestAlerts: PestAlert[] = [
    {
        id: "pest-001",
        fieldId: "field-c",
        fieldName: "Field C - Corn",
        pest: "Corn Borer",
        severity: "medium",
        affectedArea: 2.5,
        detectedAt: "2026-01-13T14:20:00Z",
        status: "active",
        recommendation: "Apply targeted insecticide to affected zone. Monitor neighboring areas.",
    },
    {
        id: "pest-002",
        fieldId: "field-b",
        fieldName: "Field B - Wheat",
        pest: "Aphids",
        severity: "low",
        affectedArea: 0.8,
        detectedAt: "2026-01-12T09:15:00Z",
        status: "monitoring",
        recommendation: "Natural predators present. Continue monitoring for population changes.",
    },
];

export const mockDiseaseAlerts: DiseaseAlert[] = [
    {
        id: "disease-001",
        fieldId: "field-a",
        fieldName: "Field A - Potato",
        disease: "Late Blight (Phytophthora)",
        severity: "high",
        affectedArea: 1.2,
        detectedAt: "2026-01-14T08:45:00Z",
        status: "active",
        recommendation: "Urgent: Apply fungicide within 24 hours. Isolate affected zone.",
    },
];

// Heatmap grid data (8x8 grid for visualization)
export const mockHeatmapData = [
    [92, 88, 85, 90, 94, 91, 87, 89],
    [89, 86, 82, 88, 92, 90, 85, 87],
    [85, 78, 75, 82, 88, 86, 80, 83],
    [88, 82, 79, 85, 90, 88, 83, 86],
    [91, 87, 84, 89, 93, 91, 86, 88],
    [94, 90, 87, 92, 95, 93, 89, 91],
    [92, 88, 85, 90, 94, 92, 88, 90],
    [90, 86, 83, 88, 92, 90, 86, 88],
];
