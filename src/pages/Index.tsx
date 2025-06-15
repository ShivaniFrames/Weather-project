
import React, { useEffect, useState } from "react";
import WeatherCard from "@/components/WeatherCard";
import ChatButton from "@/components/ChatButton";
import ChatbotModal from "@/components/ChatbotModal";
// Removed: import { ThemeToggle } from "@/components/ThemeToggle";

type WeatherInfo = {
  city: string;
  temp: number;
  description: string;
  weatherMain: string;
  humidity?: number;
  windSpeed?: number;
  visibility?: number;
  feelsLike?: number;
};

const Index = () => {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const fetchWeather = async (url: string, errorMessage: string) => {
    try {
      const resp = await fetch(url);
      if (!resp.ok) {
        throw new Error(errorMessage);
      }
      const data = await resp.json();
      setWeather({
        city: data.name,
        temp: data.main.temp,
        description: data.weather?.[0]?.description ?? "",
        weatherMain: data.weather?.[0]?.main ?? "",
        humidity: data.main.humidity,
        windSpeed: data.wind?.speed,
        visibility: data.visibility,
        feelsLike: data.main.feels_like,
      });
      if (!url.includes('q=')) { // Clear error only if it's not a fallback search
        setError(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unknown error occurred.");
      setWeather(null);
    }
  };

  useEffect(() => {
    const API_KEY = "b643407bd97e38a967ff11edd8da2343";

    const handleGeolocationSuccess = (position: GeolocationPosition) => {
      const { latitude: lat, longitude: lon } = position.coords;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
      fetchWeather(url, "Could not fetch weather data.");
    };

    const handleGeolocationError = () => {
      setError("Location access denied. Showing weather for London.");
      const url = `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${API_KEY}&units=metric`;
      fetchWeather(url, "Could not fetch weather for London.");
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleGeolocationSuccess, handleGeolocationError);
    } else {
      handleGeolocationError();
    }
  }, []);

  return (
    <div className="min-h-screen bg-transparent flex flex-col justify-center items-center px-2 md:px-0 relative font-poppins">
      {/* Removed ThemeToggle */}
      <div className="w-full max-w-xs md:max-w-md flex flex-col gap-6 mt-14 md:mt-32 animate-fade-in mb-16">
        {/* Added mb-16 for more space above footer */}
        <WeatherCard weather={weather} />
        {error && <p className="text-center text-sm text-destructive mt-2">{error}</p>}
      </div>
      <ChatButton onClick={() => setChatOpen(true)} />
      <ChatbotModal
        open={chatOpen}
        onOpenChange={setChatOpen}
        weatherTemp={weather ? weather.temp : null}
      />
      <footer className="absolute bottom-2 left-0 w-full text-center text-xs text-muted-foreground opacity-80 mt-16">
        Powered by OpenWeather, Gemini &nbsp;|&nbsp; Responsive · {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default Index;
