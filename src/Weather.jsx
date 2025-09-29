import React, { useState } from "react";

function Weather() {
  const [weather, setWeather] = useState(null);
  const [soilData, setSoilData] = useState(null);
  const [bhuvanData, setBhuvanData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch Weather from Open-Meteo (works directly)
  const fetchWeather = async (lat, lon) => {
    const resp = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );
    const data = await resp.json();
    return data.current_weather;
  };

  // 🔹 Mock SoilGrids response (no backend needed)
  const fetchSoilGrids = async (lat, lon) => {
    return {
      properties: {
        layers: [
          { name: "phh2o", depths: [{ values: { mean: 6.5 } }] },
          { name: "nitrogen", depths: [{ values: { mean: 1.2 } }] },
          { name: "phosphorus", depths: [{ values: { mean: 22 } }] },
          { name: "potassium", depths: [{ values: { mean: 40 } }] },
        ],
      },
    };
  };

  // 🔹 Mock Bhuvan data
  const fetchBhuvan = async (lat, lon) => {
    return {
      texture: "Clay Loam",
      depth: "0–30 cm",
      carbon: "High (1.1%)",
    };
  };

  // Get all data by location
  const getAllData = async () => {
    if (!navigator.geolocation) {
      alert("❌ Geolocation not supported");
      return;
    }
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        try {
          const [w, s, b] = await Promise.all([
            fetchWeather(lat, lon),
            fetchSoilGrids(lat, lon),
            fetchBhuvan(lat, lon),
          ]);
          setWeather(w);
          setSoilData(s);
          setBhuvanData(b);
        } catch (err) {
          console.error("Error fetching data:", err);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        alert("⚠️ Location access denied or unavailable.");
        setLoading(false);
      }
    );
  };

  // Helper to read soil values
  const getSoilValue = (data, property) => {
    try {
      const layer = data.properties.layers.find((l) => l.name === property);
      return layer.depths[0].values.mean;
    } catch {
      return "--";
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* ---------- Top Row Cards ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-500 text-white rounded-xl shadow p-4 text-center">
          <h2 className="text-lg font-semibold">Temperature</h2>
          <p className="text-2xl font-bold">
            {weather ? `${weather.temperature}°C` : "--"}
          </p>
        </div>

        <div className="bg-yellow-400 text-black rounded-xl shadow p-4 text-center">
          <h2 className="text-lg font-semibold">Soil pH</h2>
          <p className="text-2xl font-bold">
            {soilData ? getSoilValue(soilData, "phh2o") : "--"}
          </p>
        </div>

        <div className="bg-green-600 text-white rounded-xl shadow p-4 text-center">
          <h2 className="text-lg font-semibold">Nitrogen (N)</h2>
          <p className="text-2xl font-bold">
            {soilData ? getSoilValue(soilData, "nitrogen") : "--"}
          </p>
        </div>

        <div className="bg-purple-500 text-white rounded-xl shadow p-4 text-center">
          <h2 className="text-lg font-semibold">Active Fields</h2>
          <p className="text-2xl font-bold">3</p>
        </div>
      </div>

      {/* ---------- Bottom Row (2 Cards) ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Soil Analysis Card */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">🌱 Soil Analysis</h2>

          <div className="mb-3">
            <p className="flex justify-between text-sm">
              <span>Phosphorus (P)</span>{" "}
              <span>{soilData ? getSoilValue(soilData, "phosphorus") : "--"}</span>
            </p>
            <div className="w-full bg-gray-200 rounded h-3">
              <div
                className="bg-green-500 h-3 rounded"
                style={{
                  width: `${soilData ? getSoilValue(soilData, "phosphorus") : 0}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="mb-3">
            <p className="flex justify-between text-sm">
              <span>Potassium (K)</span>{" "}
              <span>{soilData ? getSoilValue(soilData, "potassium") : "--"}</span>
            </p>
            <div className="w-full bg-gray-200 rounded h-3">
              <div
                className="bg-green-700 h-3 rounded"
                style={{
                  width: `${soilData ? getSoilValue(soilData, "potassium") : 0}%`,
                }}
              ></div>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-2">Last updated: just now</p>
        </div>

        {/* Weather Forecast + Bhuvan Data */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">☀️ Weather & Soil Info</h2>

          {weather && (
            <ul className="space-y-2 text-sm mb-4">
              <li className="flex justify-between">
                <span>Temperature</span>
                <span>{weather.temperature}°C</span>
              </li>
              <li className="flex justify-between">
                <span>Wind Speed</span>
                <span>{weather.windspeed} km/h</span>
              </li>
              <li className="flex justify-between">
                <span>Direction</span>
                <span>{weather.winddirection}°</span>
              </li>
            </ul>
          )}

          {bhuvanData && (
            <div className="bg-gray-100 rounded p-3 text-sm">
              <p>
                <strong>Texture:</strong> {bhuvanData.texture}
              </p>
              <p>
                <strong>Depth:</strong> {bhuvanData.depth}
              </p>
              <p>
                <strong>Carbon:</strong> {bhuvanData.carbon}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ---------- Fetch Button ---------- */}
      <div className="text-center mt-6">
        <button
          onClick={getAllData}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow"
        >
          📍 Fetch My Field Data
        </button>
        {loading && <p className="mt-3 text-gray-600">⏳ Fetching data...</p>}
      </div>
    </div>
  );
}

export default Weather;
