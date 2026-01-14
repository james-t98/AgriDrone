// Mock Drone Data
export interface Drone {
    id: string;
    name: string;
    model: string;
    status: "active" | "idle" | "charging" | "maintenance" | "offline";
    battery: number;
    lastFlight: string;
    totalFlightHours: number;
    coordinates: {
        lat: number;
        lng: number;
    };
    currentTask?: string;
    coverage: number; // hectares covered today
}

export const mockDrones: Drone[] = [
    {
        id: "drone-001",
        name: "AgriScout Alpha",
        model: "DJI Agras T40",
        status: "active",
        battery: 78,
        lastFlight: "2026-01-14T14:30:00Z",
        totalFlightHours: 234.5,
        coordinates: { lat: 52.1345, lng: 5.2923 },
        currentTask: "Scanning Field B - Wheat",
        coverage: 45.2,
    },
    {
        id: "drone-002",
        name: "AgriScout Beta",
        model: "DJI Agras T40",
        status: "charging",
        battery: 42,
        lastFlight: "2026-01-14T12:15:00Z",
        totalFlightHours: 189.3,
        coordinates: { lat: 52.1326, lng: 5.2913 },
        coverage: 32.8,
    },
    {
        id: "drone-003",
        name: "CropHawk One",
        model: "Wingtra One GEN II",
        status: "idle",
        battery: 100,
        lastFlight: "2026-01-14T10:00:00Z",
        totalFlightHours: 312.7,
        coordinates: { lat: 52.1356, lng: 5.2943 },
        coverage: 28.5,
    },
    {
        id: "drone-004",
        name: "CropHawk Two",
        model: "Wingtra One GEN II",
        status: "maintenance",
        battery: 0,
        lastFlight: "2026-01-12T16:45:00Z",
        totalFlightHours: 156.2,
        coordinates: { lat: 52.1326, lng: 5.2913 },
        coverage: 0,
    },
];

export interface FlightSchedule {
    id: string;
    droneId: string;
    droneName: string;
    mission: string;
    field: string;
    scheduledStart: string;
    estimatedDuration: number; // minutes
    status: "scheduled" | "in-progress" | "complete" | "cancelled";
    priority: "high" | "medium" | "low";
}

export const mockFlightSchedule: FlightSchedule[] = [
    {
        id: "fs-001",
        droneId: "drone-001",
        droneName: "AgriScout Alpha",
        mission: "Multispectral Imaging",
        field: "Field A - Potato",
        scheduledStart: "2026-01-14T16:00:00Z",
        estimatedDuration: 45,
        status: "scheduled",
        priority: "high",
    },
    {
        id: "fs-002",
        droneId: "drone-003",
        droneName: "CropHawk One",
        mission: "Pest Detection Scan",
        field: "Field B - Wheat",
        scheduledStart: "2026-01-14T17:30:00Z",
        estimatedDuration: 60,
        status: "scheduled",
        priority: "medium",
    },
    {
        id: "fs-003",
        droneId: "drone-002",
        droneName: "AgriScout Beta",
        mission: "Irrigation Analysis",
        field: "Field C - Corn",
        scheduledStart: "2026-01-15T08:00:00Z",
        estimatedDuration: 90,
        status: "scheduled",
        priority: "low",
    },
    {
        id: "fs-004",
        droneId: "drone-001",
        droneName: "AgriScout Alpha",
        mission: "Nitrogen Mapping",
        field: "Field D - Sugar Beet",
        scheduledStart: "2026-01-15T10:00:00Z",
        estimatedDuration: 55,
        status: "scheduled",
        priority: "high",
    },
];

// Farm boundary GeoJSON (mocked Netherlands farm)
export const farmBoundaryGeoJSON = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            properties: { name: "Field A - Potato", crop: "potato", health: 92 },
            geometry: {
                type: "Polygon",
                coordinates: [
                    [
                        [5.285, 52.128],
                        [5.290, 52.128],
                        [5.290, 52.132],
                        [5.285, 52.132],
                        [5.285, 52.128],
                    ],
                ],
            },
        },
        {
            type: "Feature",
            properties: { name: "Field B - Wheat", crop: "wheat", health: 87 },
            geometry: {
                type: "Polygon",
                coordinates: [
                    [
                        [5.290, 52.128],
                        [5.297, 52.128],
                        [5.297, 52.134],
                        [5.290, 52.134],
                        [5.290, 52.128],
                    ],
                ],
            },
        },
        {
            type: "Feature",
            properties: { name: "Field C - Corn", crop: "corn", health: 78 },
            geometry: {
                type: "Polygon",
                coordinates: [
                    [
                        [5.285, 52.133],
                        [5.292, 52.133],
                        [5.292, 52.138],
                        [5.285, 52.138],
                        [5.285, 52.133],
                    ],
                ],
            },
        },
        {
            type: "Feature",
            properties: { name: "Field D - Sugar Beet", crop: "sugarbeet", health: 95 },
            geometry: {
                type: "Polygon",
                coordinates: [
                    [
                        [5.293, 52.133],
                        [5.300, 52.133],
                        [5.300, 52.138],
                        [5.293, 52.138],
                        [5.293, 52.133],
                    ],
                ],
            },
        },
    ],
};
