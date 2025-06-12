import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { WiDaySunny, WiRain, WiCloudy, WiSnow } from "react-icons/wi";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const getWeatherIcon = (condition) => {
    const iconMap = {
      sunny: WiDaySunny,
      clear: WiDaySunny,
      rain: WiRain,
      drizzle: WiRain,
      snow: WiSnow,
      cloud: WiCloudy,
      overcast: WiCloudy,
    };
    
    const lowerCondition = condition.toLowerCase();
    const IconComponent = Object.entries(iconMap).find(([key]) => 
      lowerCondition.includes(key)
    )?.[1] || WiCloudy;
    
    return <IconComponent size={64} />;
  };

  const fetchWeather = async () => {
    if (!city.trim()) return;
    
    setError("");
    const apiKey="11641fa1eeee4bff872154406251006";
    
    try {
      const response=await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
      );
      const data = await response.json();
      
      if (response.ok) {
        setWeather({
          name: data.location.name,
          temp: data.current.temp_c,
          condition: data.current.condition.text,
        });
      } else {
        setError(data.error?.message || "City not found");
        setWeather(null);
      }
    } catch (err) {
      setError("Error");
      setWeather(null);
    }
  };

  return (
    <div className="container mt-5 text-center">
      <h2 className="mb-4">Weather App</h2>
      
      <div className="mb-4">
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchWeather()}
        />
        <button className="btn btn-primary" onClick={fetchWeather}>
          Get Weather
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {weather && (
        <div className="card p-4">
          <h4>{weather.name}</h4>
          <div className="d-flex justify-content-center my-3">
            {getWeatherIcon(weather.condition)}
          </div>
          <h3>{weather.temp}°C</h3>
          <p className="text-capitalize">{weather.condition}</p>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
