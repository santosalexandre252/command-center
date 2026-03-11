"use client";
import { useEffect, useState, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from "recharts";

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
          distance: i * 0.01,
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
  const thresholdPace = athlete.threshold_pace || 310;

  return elevationData.map((point, index) => {
    const prevPoint = elevationData[Math.max(0, index - 10)];
    const nextPoint = elevationData[Math.min(elevationData.length - 1, index + 10)];
    const distance = (nextPoint.distance - prevPoint.distance) || 0.1;
    const elevationChange = nextPoint.elevation - prevPoint.elevation;
    const gradient = (elevationChange / (distance * 1000)) * 100;

    let adjustedPace = thresholdPace;
    if (gradient > 0) adjustedPace = thresholdPace * (1 + gradient / 50);
    else if (gradient < 0) adjustedPace = thresholdPace * (1 + gradient / 100);

    const pacePerKm = adjustedPace;
    let zone = "threshold";
    let zoneColor = "#fbbf24";

    if (pacePerKm < thresholdPace * 0.9) { zone = "fast"; zoneColor = "#ef4444"; }
    else if (pacePerKm < thresholdPace * 0.95) { zone = "tempo"; zoneColor = "#f97316"; }
    else if (pacePerKm > thresholdPace * 1.1) { zone = "easy"; zoneColor = "#22c55e"; }

    return { ...point, gradient, adjustedPace: pacePerKm, zone, zoneColor };
  });
}

export default function GPXMap({ raceId, athlete }) {
  const [gpxData, setGpxData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 💡 NEW: Direct DOM references instead of react-leaflet wrappers
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // 1. Fetch the Data
  useEffect(() => {
    async function loadGPX() {
      try {
        const res = await fetch(`/api/gpx?raceId=${raceId}`);
        if (!res.ok) throw new Error("Failed to fetch GPX metadata");
        
        const data = await res.json();
        if (res.status === 503 || !data.exists) {
          setLoading(false);
          return;
        }

        const gpxRes = await fetch(data.publicUrl);
        if (!gpxRes.ok) throw new Error("Failed to download GPX file");

        const gpxText = await gpxRes.text();
        const parsed = parseGPX(gpxText);

        if (parsed.points.length > 0) {
          setGpxData(parsed);
        }
      } catch (err) {
        console.error("GPX load error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (raceId) loadGPX();
  }, [raceId]);

  // 2. Render the Map with Vanilla Leaflet
  useEffect(() => {
    // Only run when we have data and the container is ready
    if (!gpxData || !mapContainerRef.current) return;

    let isMounted = true;

    import("leaflet").then((L) => {
      if (!isMounted) return;

      import("leaflet/dist/leaflet.css");
      
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });

      const container = mapContainerRef.current;

      // 💡 THE ULTIMATE HMR FIX:
      // A. Gracefully remove the old map instance if it exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // B. Brutally scrub the DOM node of any leftover Leaflet internal IDs
      if (container) {
        container._leaflet_id = null;
        container.innerHTML = '';
      }

      // Initialize the pure Leaflet map directly onto the div
      const map = L.map(container, {
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      L.polyline(gpxData.points, {
        color: "#3b82f6",
        weight: 3,
        opacity: 0.8
      }).addTo(map);

      map.fitBounds(L.latLngBounds(gpxData.points));
      mapInstanceRef.current = map;

    }).catch(err => console.error("Error loading Leaflet:", err));

    // Cleanup function runs on unmount or hot-reload
    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [gpxData]);

  if (loading) return (
    <div className="bg-surface-850 border border-white/5 rounded-xl p-6 h-96 flex items-center justify-center text-gray-500 text-sm">
      Loading course map...
    </div>
  );

  if (error || !gpxData) return (
    <div className="bg-surface-850 border border-white/5 rounded-xl p-6 h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-sm mb-2">{error || "No course map available"}</div>
          <div className="text-gray-600 text-xs">Upload a GPX file in Settings to view the interactive course map</div>
        </div>
    </div>
  );

  const pacingData = calculatePacingZones(gpxData.elevationData, athlete);

  return (
    <div className="space-y-4">
      {/* Map */}
      <div className="bg-surface-850 border border-white/5 rounded-xl overflow-hidden relative z-0">
        {/* We attach the ref directly to the empty div */}
        <div ref={mapContainerRef} className="h-64 w-full"></div>
      </div>

      {/* Elevation Profile */}
      <div className="bg-surface-850 border border-white/5 rounded-xl p-4">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Elevation Profile & Pacing Zones</h4>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={pacingData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <XAxis dataKey="distance" tick={{ fill: "#6b7280", fontSize: 9 }} tickLine={false} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 9 }} tickLine={false} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const data = payload[0].payload;
                return (
                  <div className="bg-surface-900 border border-white/10 rounded-lg px-3 py-2 text-xs shadow-lg">
                    <div className="text-white">{data.elevation.toFixed(0)}m elevation</div>
                    <div style={{ color: data.zoneColor }}>{data.zone} pace zone</div>
                  </div>
                );
              }}
            />
            <Line type="monotone" dataKey="elevation" stroke="#6b7280" strokeWidth={2} dot={false} />
            <ReferenceLine y={0} stroke="#374151" strokeDasharray="2 2" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}