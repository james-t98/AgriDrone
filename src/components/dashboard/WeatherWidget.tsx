"use client";

import { motion } from "framer-motion";
import { Sun, Cloud, CloudSun, CloudRain, CloudLightning, Droplets, Wind, Thermometer } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { mockCurrentWeather, mockWeatherForecast } from "@/data/mockWeather";

const weatherIcons = {
    sunny: Sun,
    cloudy: Cloud,
    "partly-cloudy": CloudSun,
    rainy: CloudRain,
    stormy: CloudLightning,
};

export function WeatherWidget() {
    const Icon = weatherIcons[mockCurrentWeather.condition];

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Weather</CardTitle>
                <span className="text-xs text-[var(--text-muted)]">Utrecht, NL</span>
            </CardHeader>
            <CardContent>
                {/* Current Weather */}
                <div className="flex items-center gap-4 mb-6">
                    <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/25"
                    >
                        <Icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-[var(--foreground)]">
                                {mockCurrentWeather.temperature}
                            </span>
                            <span className="text-xl text-[var(--text-muted)]">°C</span>
                        </div>
                        <p className="text-sm text-[var(--text-muted)] capitalize">
                            {mockCurrentWeather.condition.replace("-", " ")}
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                            <Droplets className="w-4 h-4 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-xs text-[var(--text-muted)]">Humidity</p>
                            <p className="text-sm font-semibold text-[var(--foreground)]">{mockCurrentWeather.humidity}%</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-green-500/10">
                            <Wind className="w-4 h-4 text-green-500" />
                        </div>
                        <div>
                            <p className="text-xs text-[var(--text-muted)]">Wind</p>
                            <p className="text-sm font-semibold text-[var(--foreground)]">{mockCurrentWeather.windSpeed} km/h</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-orange-500/10">
                            <Thermometer className="w-4 h-4 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-xs text-[var(--text-muted)]">UV Index</p>
                            <p className="text-sm font-semibold text-[var(--foreground)]">{mockCurrentWeather.uvIndex}</p>
                        </div>
                    </div>
                </div>

                {/* 5-Day Forecast */}
                <div className="border-t border-[var(--border)] pt-4">
                    <p className="text-xs font-medium text-[var(--text-muted)] mb-3">5-Day Forecast</p>
                    <div className="flex justify-between">
                        {mockWeatherForecast.map((day, i) => {
                            const DayIcon = weatherIcons[day.condition];
                            const date = new Date(day.date);
                            const dayName = i === 0 ? "Today" : date.toLocaleDateString("en-US", { weekday: "short" });

                            return (
                                <motion.div
                                    key={day.date}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex flex-col items-center gap-1"
                                >
                                    <span className="text-xs text-[var(--text-muted)]">{dayName}</span>
                                    <DayIcon className="w-5 h-5 text-[var(--foreground)]" />
                                    <div className="flex items-center gap-1 text-xs">
                                        <span className="font-medium text-[var(--foreground)]">{day.high}°</span>
                                        <span className="text-[var(--text-muted)]">{day.low}°</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
