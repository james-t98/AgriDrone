// src/lib/api.ts
// API utilities for calling AgriDrone backend endpoints

const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || '';
const FARM_ID = import.meta.env.VITE_FARM_ID || 'NL_Farm_001';

// TypeScript types for API responses
export interface SensorReading {
    sensor_id: string;
    timestamp: number;
    farm_id: string;
    field_zone: string;
    sensor_type: 'soil' | 'weather';
    moisture_percentage: number;
    pH_level: number;
    temperature_celsius: number;
    NPK_values: {
        nitrogen: number;
        phosphorus: number;
        potassium: number;
    };
    battery_level: number;
    status: 'online' | 'offline' | 'calibrating';
    // Optional weather fields
    wind_speed_kmh?: number;
    humidity_percentage?: number;
    precipitation_mm?: number;
    // Optional soil fields
    leaf_wetness_duration_hours?: number;
}

export interface CVResult {
    image_id: string;
    timestamp: number;
    farm_id: string;
    field_zone: string;
    s3_uri: string;
    classification: 'healthy' | 'diseased' | 'pest' | 'weed';
    disease_type?: string | null;
    confidence: number;
    bbox_coords: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    severity_score?: number | null;
    affected_area_percentage?: number | null;
    model_version: string;
    processed_by: string;
}

export interface FlightLog {
    flight_id: string;
    flight_date: string;
    drone_id: string;
    farm_id: string;
    flight_start: number;
    flight_end: number;
    battery_start_percentage: number;
    battery_end_percentage: number;
    battery_cycles: number;
    field_zones_covered: string[];
    coverage_percentage: number;
    images_captured: number;
    coverage_map_s3_uri: string;
    weather_conditions: {
        temperature_c: number;
        wind_speed_kmh: number;
        humidity_percentage: number;
        cloud_cover: string;
    };
    maintenance_alert?: string | null;
    status: 'completed' | 'failed' | 'in_progress';
}

// API Functions

export async function getSensorData(params: {
    sensor_id?: string;
    farm_id?: string;
    start_timestamp?: number;
    end_timestamp?: number;
    limit?: number;
}) {
    const searchParams = new URLSearchParams();

    if (params.sensor_id) searchParams.append('sensor_id', params.sensor_id);
    if (params.farm_id) searchParams.append('farm_id', params.farm_id);
    if (params.start_timestamp) searchParams.append('start_timestamp', params.start_timestamp.toString());
    if (params.end_timestamp) searchParams.append('end_timestamp', params.end_timestamp.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/sensor-data?${searchParams}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data: { items: SensorReading[]; count: number } = await response.json();
    return data;
}

export async function getCVResults(params: {
    farm_id?: string;
    start_date?: number;
    end_date?: number;
    limit?: number;
}) {
    const searchParams = new URLSearchParams();

    searchParams.append('farm_id', params.farm_id || FARM_ID);
    if (params.start_date) searchParams.append('start_date', params.start_date.toString());
    if (params.end_date) searchParams.append('end_date', params.end_date.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/cv-results?${searchParams}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data: { items: CVResult[]; count: number } = await response.json();
    return data;
}

export async function getFlights(params: {
    farm_id?: string;
    drone_id?: string;
    flight_date?: string;
    limit?: number;
}) {
    const searchParams = new URLSearchParams();

    if (params.farm_id) searchParams.append('farm_id', params.farm_id);
    if (params.drone_id) searchParams.append('drone_id', params.drone_id);
    if (params.flight_date) searchParams.append('flight_date', params.flight_date);
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/flights?${searchParams}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data: { items: FlightLog[]; count: number } = await response.json();
    return data;
}

export async function getReport(date: string, format: 'markdown' | 'json' | 'pdf' = 'markdown') {
    const searchParams = new URLSearchParams();
    searchParams.append('farm_id', FARM_ID);
    searchParams.append('format', format);

    const response = await fetch(`${API_BASE_URL}/reports/${date}?${searchParams}`);
    if (!response.ok) {
        if (response.status === 404) {
            return null; // Report not found
        }
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (format === 'markdown') {
        return await response.text();
    } else {
        return await response.json();
    }
}

// Helper function to get latest sensor readings for dashboard
export async function getLatestSensorReadings(limit: number = 10) {
    return getSensorData({
        farm_id: FARM_ID,
        limit
    });
}

// Helper function to get recent CV results for dashboard
export async function getRecentCVResults(limit: number = 20) {
    return getCVResults({
        farm_id: FARM_ID,
        limit
    });
}

// Helper function to get recent flights
export async function getRecentFlights(limit: number = 5) {
    return getFlights({
        farm_id: FARM_ID,
        limit
    });
}

// Helper to format timestamps for display
export function formatTimestamp(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleString();
}

// Helper to get time range for last N days
export function getTimeRange(days: number): { start: number; end: number } {
    const end = Math.floor(Date.now() / 1000);
    const start = end - (days * 24 * 60 * 60);
    return { start, end };
}
