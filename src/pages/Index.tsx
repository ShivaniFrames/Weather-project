
import React, { useEffect, useState } from "react";
import WeatherCard from "@/components/WeatherCard";
import ChatButton from "@/components/ChatButton";
import ChatbotModal from "@/components/ChatbotModal";

type WeatherInfo = {
  city: string;
  temp: number;
  description: string;
  weatherMain: string;
};

const Index = () => {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    // Try geolocation and fetch weather via open-meteo
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          // Open-Meteo does not include weather main/description, so use OpenWeatherMap (public, demo)
          // NOTE: For a real project, ask user for their API key.
          const API_KEY = "9e2601be4fa003f1fc56fd69519b0bb4";
          try {
            const resp = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
            );
            const data = await resp.json();
            setWeather({
              city: data.name,
              temp: data.main.temp,
              description: data.weather?.[0]?.description ?? "",
              weatherMain: data.weather?.[0]?.main ?? "",
            });
          } catch (e) {
            setWeather(null);
          } finally {
            setLoading(false);
          }
        },
        () => setLoading(false),
        { enableHighAccuracy: true }
      );
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-2 md:px-0">
      <div className="w-full max-w-xs md:max-w-md flex flex-col gap-6 mt-14 md:mt-32">
        <WeatherCard weather={weather} />
      </div>
      <ChatButton onClick={() => setChatOpen(true)} />
      <ChatbotModal
        open={chatOpen}
        onOpenChange={setChatOpen}
        weatherTemp={weather ? weather.temp : null}
      />
      <footer className="absolute bottom-2 left-0 w-full text-center text-xs text-muted-foreground opacity-80">
        Powered by OpenWeather, Gemini &nbsp;| &nbsp;Responsive · {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default Index;
