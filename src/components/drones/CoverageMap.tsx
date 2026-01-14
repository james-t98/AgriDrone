"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { farmBoundaryGeoJSON, mockDrones } from "@/data/mockDrones";

// Fix Leaflet icon issue
const fixLeafletIcons = () => {
    delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });
};

export function CoverageMap() {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        fixLeafletIcons();

        // Initialize map
        const map = L.map(mapRef.current, {
            center: [52.1326, 5.2913],
            zoom: 14,
            zoomControl: true,
        });

        mapInstanceRef.current = map;

        // Add tile layer
        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
        }).addTo(map);

        // Function to get color based on health score
        const getHealthColor = (health: number) => {
            if (health >= 90) return "#22c55e";
            if (health >= 80) return "#84cc16";
            if (health >= 70) return "#eab308";
            if (health >= 60) return "#f97316";
            return "#ef4444";
        };

        // Add farm boundary GeoJSON
        L.geoJSON(farmBoundaryGeoJSON as GeoJSON.GeoJsonObject, {
            style: (feature) => ({
                color: getHealthColor(feature?.properties?.health || 70),
                weight: 2,
                opacity: 0.8,
                fillColor: getHealthColor(feature?.properties?.health || 70),
                fillOpacity: 0.3,
            }),
            onEachFeature: (feature, layer) => {
                if (feature.properties) {
                    layer.bindPopup(`
            <div style="font-family: system-ui; padding: 8px;">
              <h4 style="margin: 0 0 8px 0; font-weight: 600;">${feature.properties.name}</h4>
              <p style="margin: 0; color: #666;">Crop: ${feature.properties.crop}</p>
              <p style="margin: 4px 0 0 0; color: ${getHealthColor(feature.properties.health)}; font-weight: 500;">
                Health: ${feature.properties.health}%
              </p>
            </div>
          `);
                }
            },
        }).addTo(map);

        // Add drone markers for active drones
        const droneIcon = L.divIcon({
            html: `
        <div style="
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
          animation: pulse 2s infinite;
        ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
          </svg>
        </div>
      `,
            className: "drone-marker",
            iconSize: [32, 32],
            iconAnchor: [16, 16],
        });

        mockDrones
            .filter((drone) => drone.status === "active" || drone.status === "idle")
            .forEach((drone) => {
                L.marker([drone.coordinates.lat, drone.coordinates.lng], { icon: droneIcon })
                    .addTo(map)
                    .bindPopup(`
            <div style="font-family: system-ui; padding: 8px;">
              <h4 style="margin: 0 0 8px 0; font-weight: 600;">${drone.name}</h4>
              <p style="margin: 0; color: #22c55e; font-weight: 500;">Status: ${drone.status}</p>
              <p style="margin: 4px 0 0 0; color: #666;">Battery: ${drone.battery}%</p>
              ${drone.currentTask ? `<p style="margin: 4px 0 0 0; color: #666;">Task: ${drone.currentTask}</p>` : ""}
            </div>
          `);
            });

        // Add CSS animation for drone markers
        const style = document.createElement("style");
        style.textContent = `
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
    `;
        document.head.appendChild(style);

        return () => {
            map.remove();
            mapInstanceRef.current = null;
            style.remove();
        };
    }, []);

    return <div ref={mapRef} className="h-96 w-full" />;
}
