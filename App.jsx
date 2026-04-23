import { useState } from "react";
import "./App.css";

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getWeather = async () => {
    try {
      setLoading(true);
      setError("");
      setWeather(null);

      const apiKey = "4ef706af135c926794695d5e891808d0"; // 👈 ONLY CHANGE THIS

      if (!city.trim()) {
        setError("Please enter a city name");
        setLoading(false);
        return;
      }

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city.trim()
      )}&units=metric&appid=${apiKey}`;

      const res = await fetch(url);
      const data = await res.json();

      console.log("API RESPONSE:", data);

      // ❗ REAL ERROR HANDLING
      if (res.status === 401) {
        setError("Invalid API key ❌ (check OpenWeather key)");
        setLoading(false);
        return;
      }

      if (res.status === 404) {
        setError("City not found ❌ (check spelling)");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError("Something went wrong ❌");
        setLoading(false);
        return;
      }

      setWeather(data);
      setLoading(false);
    } catch (err) {
      setError("Network error ❌");
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>🌦️ Weather App</h1>
<div className="search-box">
      <input
        type="text"
        placeholder="Enter city (e.g London)"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <button onClick={getWeather}>Search</button>
</div>
      {/* LOADING */}
      {loading && <p>Loading... ⏳</p>}

      {/* ERROR */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* WEATHER DATA */}
      {weather && (
        <div className="card">
          <h2>
            {weather.name}, {weather.sys.country}
          </h2>

          <h1>{weather.main.temp}°C</h1>

          <p>🌡 Feels like: {weather.main.feels_like}°C</p>
          <p>💧 Humidity: {weather.main.humidity}%</p>
          <p>🌬 Wind: {weather.wind.speed} m/s</p>
          <p>🌥 Condition: {weather.weather[0].main}</p>
        </div>
      )}
    </div>
  );
}
