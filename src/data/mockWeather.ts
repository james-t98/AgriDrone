// Mock Weather Data
export interface WeatherCurrent {
    temperature: number;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    condition: "sunny" | "cloudy" | "partly-cloudy" | "rainy" | "stormy";
    uvIndex: number;
    precipitation: number;
    pressure: number;
    visibility: number;
}

export interface WeatherForecast {
    date: string;
    high: number;
    low: number;
    condition: "sunny" | "cloudy" | "partly-cloudy" | "rainy" | "stormy";
    precipitation: number;
    humidity: number;
}

export interface WeatherAlert {
    id: string;
    type: "frost" | "heat" | "rain" | "wind" | "storm";
    severity: "low" | "medium" | "high";
    message: string;
    validFrom: string;
    validTo: string;
}

export const mockCurrentWeather: WeatherCurrent = {
    temperature: 8,
    humidity: 72,
    windSpeed: 14,
    windDirection: "NW",
    condition: "partly-cloudy",
    uvIndex: 2,
    precipitation: 0,
    pressure: 1013,
    visibility: 10,
};

export const mockWeatherForecast: WeatherForecast[] = [
    {
        date: "2026-01-14",
        high: 9,
        low: 3,
        condition: "partly-cloudy",
        precipitation: 10,
        humidity: 72,
    },
    {
        date: "2026-01-15",
        high: 7,
        low: 2,
        condition: "cloudy",
        precipitation: 30,
        humidity: 78,
    },
    {
        date: "2026-01-16",
        high: 6,
        low: 1,
        condition: "rainy",
        precipitation: 65,
        humidity: 85,
    },
    {
        date: "2026-01-17",
        high: 8,
        low: 4,
        condition: "cloudy",
        precipitation: 20,
        humidity: 70,
    },
    {
        date: "2026-01-18",
        high: 10,
        low: 5,
        condition: "sunny",
        precipitation: 5,
        humidity: 65,
    },
];

export const mockWeatherAlerts: WeatherAlert[] = [
    {
        id: "wa-001",
        type: "frost",
        severity: "medium",
        message: "Ground frost expected overnight. Consider protective measures for sensitive crops.",
        validFrom: "2026-01-15T22:00:00Z",
        validTo: "2026-01-16T08:00:00Z",
    },
];

// Weather icons mapping
export const weatherIcons: Record<string, string> = {
    sunny: "Sun",
    cloudy: "Cloud",
    "partly-cloudy": "CloudSun",
    rainy: "CloudRain",
    stormy: "CloudLightning",
};
