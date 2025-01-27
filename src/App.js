import React, { useState, useEffect } from "react";
import "./styles.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem("weatherHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [unit, setUnit] = useState("C"); // Add state for temperature unit, default is Celsius

  const fetchWeather = async () => {
    const API_KEY = "5128004a92b0428a873101238252701"; 
    const endpoint = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`;

    try {
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error("City not found");
      const data = await response.json();
      setWeather(data);

      // Update history with the new city
      const updatedHistory = [city, ...history].slice(0, 5);
      setHistory(updatedHistory);
      localStorage.setItem("weatherHistory", JSON.stringify(updatedHistory));
    } catch (error) {
      alert(error.message);
    }
  };

  const handleHistoryClick = (city) => {
    setCity(city);
    fetchWeather();
  };

  const handleUnitToggle = () => {
    setUnit(unit === "C" ? "F" : "C"); // Toggle between Celsius and Fahrenheit
  };

  const getBackgroundImage = () => {
    if (!weather) return "clear-day.jpg"; // Default background if no weather data
    switch (weather.current.condition.text.toLowerCase()) {
      case "sunny":
      case "clear":
        return "clear-day.jpg";
      case "rain":
      case "thunderstorm":
        return "rainy.jpg";
      case "cloudy":
        return "cloudy.jpg";
      case "fog":
        return "foggy.jpg";
      default:
        return "clear-day.jpg"; // Default fallback
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        padding: "20px",
        backgroundImage: `url(/images/${getBackgroundImage()})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <h1>Weather App</h1>
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={fetchWeather}>Get Weather</button>

      {weather && (
        <div>
          <h2>{weather.location.name}, {weather.location.country}</h2>
          <div>
            {/* Weather Icon */}
            <img 
              src={`http:${weather.current.condition.icon}`} 
              alt={weather.current.condition.text} 
              style={{ width: '100px', height: '100px' }} 
            />
          </div>
          <p>
            Temperature: {unit === "C" ? weather.current.temp_c : weather.current.temp_f}°{unit}
          </p>
          <p>Condition: {weather.current.condition.text}</p>
        </div>
      )}

      {/* Temperature unit toggle */}
      <div>
        <button onClick={handleUnitToggle}>
          Switch to °{unit === "C" ? "F" : "C"}
        </button>
      </div>

      {history.length > 0 && (
        <div>
          <h3>Search History</h3>
          <ul>
            {history.map((city, index) => (
              <li key={index} style={{ cursor: "pointer" }} onClick={() => handleHistoryClick(city)}>
                {city}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
