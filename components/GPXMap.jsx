"use client";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from "recharts";

// Dynamic imports for Leaflet components to handle missing dependencies gracefully
let MapContainer, TileLayer, Polyline, Marker, Popup, L;
try {
  const leaflet = require("leaflet");
  const reactLeaflet = require("react-leaflet");
  MapContainer = reactLeaflet.MapContainer;
  TileLayer = reactLeaflet.TileLayer;
  Polyline = reactLeaflet.Polyline;
  Marker = reactLeaflet.Marker;
  Popup = reactLeaflet.Popup;
  L = leaflet;

  // Fix for default markers in react-leaflet
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });

  // Import CSS
  if (typeof window !== 'undefined') {
    require("leaflet/dist/leaflet.css");
  }
} catch (e) {
  // Leaflet not available
  console.warn("Leaflet dependencies not installed. GPX map functionality will be limited.");
}

function parseGPX(gpxText) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(gpxText, "text/xml");
  const trackPoints = xmlDoc.getElementsByTagName("trkpt");

  const points = [];
  const elevationData = [];

  for (let i = 0; i < trackPoints.length; i++) {
    const point = trackPoints[i];
    const lat = parseFloat(point.getAttribute("lat"));
    const lon = parseFloat(point.getAttribute("lon"));
    const ele = point.getElementsByTagName("ele")[0]?.textContent;
    const time = point.getElementsByTagName("time")[0]?.textContent;

    if (lat && lon) {
      points.push([lat, lon]);

      if (ele) {
        elevationData.push({
          distance: i * 0.01, // Rough distance calculation (km)
          elevation: parseFloat(ele),
          time: time ? new Date(time).getTime() : i,
        });
      }
    }
  }

  return { points, elevationData };
}

function calculatePacingZones(elevationData, athlete) {
  if (!elevationData.length || !athlete) return [];

  const ftp = athlete.ftp || 181;
  const thresholdPace = athlete.threshold_pace || 310; // seconds per km

  return elevationData.map((point, index) => {
    // Calculate gradient
    const prevPoint = elevationData[Math.max(0, index - 10)];
    const nextPoint = elevationData[Math.min(elevationData.length - 1, index + 10)];
    const distance = (nextPoint.distance - prevPoint.distance) || 0.1;
    const elevationChange = nextPoint.elevation - prevPoint.elevation;
    const gradient = (elevationChange / (distance * 1000)) * 100; // percentage

    // Adjust pace based on gradient
    let adjustedPace = thresholdPace;
    if (gradient > 0) {
      // Uphill - slower pace
      adjustedPace = thresholdPace * (1 + gradient / 50);
    } else if (gradient < 0) {
      // Downhill - faster pace
      adjustedPace = thresholdPace * (1 + gradient / 100);
    }

    // Convert to pace zones
    const pacePerKm = adjustedPace;
    let zone = "threshold";
    let zoneColor = "#fbbf24"; // yellow

    if (pacePerKm < thresholdPace * 0.9) {
      zone = "fast";
      zoneColor = "#ef4444"; // red
    } else if (pacePerKm < thresholdPace * 0.95) {
      zone = "tempo";
      zoneColor = "#f97316"; // orange
    } else if (pacePerKm > thresholdPace * 1.1) {
      zone = "easy";
      zoneColor = "#22c55e"; // green
    }

    return {
      ...point,
      gradient,
      adjustedPace: pacePerKm,
      zone,
      zoneColor,
    };
  });
}

export default function GPXMap({ raceId, athlete }) {
  const [gpxData, setGpxData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aidStations, setAidStations] = useState([]);

  useEffect(() => {
    async function loadGPX() {
      try {
        const res = await fetch(`/api/gpx?raceId=${raceId}`);
        const data = await res.json();

        if (!data.exists) {
          setLoading(false);
          return;
        }

        // Fetch and parse GPX
        const gpxRes = await fetch(data.publicUrl);
        const gpxText = await gpxRes.text();
        const parsed = parseGPX(gpxText);

        if (parsed.points.length > 0) {
          setGpxData(parsed);
        }
      } catch (err) {
        console.error("GPX load error:", err);
        setError("Failed to load GPX data");
      }
      setLoading(false);
    }

    if (raceId) {
      loadGPX();
    }
  }, [raceId]);

  if (loading) {
    return (
      <div className="bg-surface-850 border border-white/5 rounded-xl p-6 h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-sm mb-2">Loading course map...</div>
          <div className="flex justify-center gap-1">
            <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !gpxData) {
    return (
      <div className="bg-surface-850 border border-white/5 rounded-xl p-6 h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-sm mb-2">
            {error || "No course map available"}
          </div>
          <div className="text-gray-600 text-xs">
            Upload a GPX file in Settings to view the interactive course map
          </div>
        </div>
      </div>
    );
  }

  // Check if leaflet is available
  if (!MapContainer || !L) {
    return (
      <div className="bg-surface-850 border border-white/5 rounded-xl p-6 h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-sm mb-2">Interactive Map Unavailable</div>
          <div className="text-gray-600 text-xs mb-4">
            Leaflet mapping library not installed. Install dependencies to view course maps.
          </div>
          <div className="text-xs text-gray-500">
            Run: <code className="bg-surface-900 px-2 py-1 rounded">pnpm install leaflet react-leaflet leaflet-gpx</code>
          </div>
        </div>
      </div>
    );
  }

  const pacingData = calculatePacingZones(gpxData.elevationData, athlete);
  const bounds = L.latLngBounds(gpxData.points);

  return (
    <div className="space-y-4">
      {/* Map */}
      <div className="bg-surface-850 border border-white/5 rounded-xl overflow-hidden">
        <div className="h-64">
          <MapContainer
            bounds={bounds}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
            className="leaflet-container"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Polyline
              positions={gpxData.points}
              color="#3b82f6"
              weight={3}
              opacity={0.8}
            />
            {/* Aid stations would be added here */}
            {aidStations.map((station, i) => (
              <Marker key={i} position={[station.lat, station.lng]}>
                <Popup>
                  <div className="text-xs">
                    <div className="font-medium">{station.name}</div>
                    <div className="text-gray-600">Aid Station {i + 1}</div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Elevation Profile */}
      <div className="bg-surface-850 border border-white/5 rounded-xl p-4">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Elevation Profile & Pacing Zones</h4>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={pacingData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <XAxis
              dataKey="distance"
              tick={{ fill: "#6b7280", fontSize: 9 }}
              tickLine={false}
              label={{ value: "Distance (km)", position: "insideBottom", offset: -5, style: { textAnchor: "middle", fill: "#6b7280", fontSize: 10 } }}
            />
            <YAxis
              tick={{ fill: "#6b7280", fontSize: 9 }}
              tickLine={false}
              label={{ value: "Elevation (m)", angle: -90, position: "insideLeft", style: { textAnchor: "middle", fill: "#6b7280", fontSize: 10 } }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const data = payload[0].payload;
                return (
                  <div className="bg-surface-900 border border-white/10 rounded-lg px-3 py-2 text-xs shadow-lg">
                    <div className="text-gray-400 mb-1">{label.toFixed(1)}km</div>
                    <div className="text-white">{data.elevation.toFixed(0)}m elevation</div>
                    <div style={{ color: data.zoneColor }}>{data.zone} pace zone</div>
                    <div className="text-gray-400">{data.gradient.toFixed(1)}% gradient</div>
                  </div>
                );
              }}
            />
            <Line
              type="monotone"
              dataKey="elevation"
              stroke="#6b7280"
              strokeWidth={2}
              dot={false}
            />
            <ReferenceLine y={0} stroke="#374151" strokeDasharray="2 2" />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-1 bg-green-500 rounded"></div>
            <span className="text-gray-400">Easy</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-1 bg-yellow-500 rounded"></div>
            <span className="text-gray-400">Threshold</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-1 bg-orange-500 rounded"></div>
            <span className="text-gray-400">Tempo</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-1 bg-red-500 rounded"></div>
            <span className="text-gray-400">Fast</span>
          </div>
        </div>
      </div>
    </div>
  );
}