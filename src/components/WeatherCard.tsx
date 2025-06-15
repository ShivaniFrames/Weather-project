import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getWeatherEmoji } from "@/lib/weatherEmoji";
import { Wind, Droplets, Eye, Thermometer } from "lucide-react";

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

const BackgroundBubbles = () => (
  <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
    <div className="absolute w-64 h-64 bg-white/5 rounded-full -top-32 -left-32 animate-bubble" style={{ animationDuration: '20s' }}></div>
    <div className="absolute w-48 h-48 bg-white/5 rounded-full top-1/4 right-10 animate-bubble" style={{ animationDuration: '25s', animationDelay: '2s' }}></div>
    <div className="absolute w-32 h-32 bg-white/5 rounded-full top-1/2 left-1/4 animate-bubble" style={{ animationDuration: '18s', animationDelay: '4s' }}></div>
    <div className="absolute w-80 h-80 bg-white/5 rounded-full -bottom-40 -right-40 animate-bubble" style={{ animationDuration: '30s', animationDelay: '1s' }}></div>
    <div className="absolute w-36 h-36 bg-white/5 rounded-full bottom-1/4 left-10 animate-bubble" style={{ animationDuration: '22s', animationDelay: '6s' }}></div>
    <div className="absolute w-28 h-28 bg-white/5 rounded-full top-3/4 right-1/3 animate-bubble" style={{ animationDuration: '16s', animationDelay: '3s' }}></div>
  </div>
);

const Bubbles = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute w-40 h-40 bg-white/10 rounded-full -bottom-16 -left-16 animate-bubble" style={{ animationDuration: '25s' }}></div>
    <div className="absolute w-20 h-20 bg-white/10 rounded-full bottom-20 right-10 animate-bubble" style={{ animationDuration: '20s', animationDelay: '3s' }}></div>
    <div className="absolute w-12 h-12 bg-white/10 rounded-full bottom-5 left-1/2 animate-bubble" style={{ animationDuration: '15s', animationDelay: '1s' }}></div>
    <div className="absolute w-32 h-32 bg-white/10 rounded-full -bottom-12 right-0 animate-bubble" style={{ animationDuration: '30s', animationDelay: '5s' }}></div>
    <div className="absolute w-24 h-24 bg-white/10 rounded-full bottom-0 left-10 animate-bubble" style={{ animationDuration: '18s', animationDelay: '7s' }}></div>
  </div>
);

// Cartoonish Cloud SVG
const CartoonCloud = () => (
  <svg width="80" height="44" viewBox="0 0 80 44" fill="none" xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-[0_3px_14px_rgba(70,160,255,0.35)]">
    <ellipse cx="28" cy="32" rx="20" ry="12" fill="#A5D8FF" />
    <ellipse cx="44" cy="22" rx="17" ry="15" fill="#74C0FC" />
    <ellipse cx="58" cy="32" rx="18" ry="12" fill="#4dabf7" />
    <ellipse cx="36" cy="35" rx="12" ry="10" fill="#D0EBFF" />
    <ellipse cx="64" cy="36" rx="9" ry="7" fill="#D0EBFF" />
    <ellipse cx="22" cy="27" rx="8" ry="7" fill="#e7f5ff" />
    {/* Optional: little sparkle for dreamy look */}
    <circle cx="59" cy="17" r="2" fill="#fff7fb" opacity="0.7" />
    <circle cx="35" cy="10" r="1.6" fill="#fff7fb" opacity="0.5" />
    {/* Add a playful outline */}
    <path
      d="M19 33 Q25 21 44 14 Q59 9 66 27 Q73 39 54 41 Q37 43 19 33 Z"
      fill="none"
      stroke="#90caf9"
      strokeWidth="2"
      strokeLinejoin="round"
      opacity="0.7"
    />
  </svg>
);

// Weather-based advice helper
function getWeatherAdvice(weatherMain: string): string {
  switch (weatherMain.toLowerCase()) {
    case "rain":
    case "drizzle":
      return "Don't forget to take an umbrella!";
    case "clear":
      return "It's sunny out—wear sunglasses and sunscreen!";
    case "clouds":
      return "A bit cloudy—consider carrying a light jacket!";
    case "snow":
      return "Dress warmly, it's snowing!";
    case "thunderstorm":
      return "Stormy weather—best to stay indoors!";
    case "mist":
    case "fog":
      return "It's foggy—drive carefully and stay safe!";
    case "spring":
      return "It's springtime—enjoy the blossoms!";
    default:
      return "Have a great day, whatever the weather!";
  }
}

// Helper to get card color classes based on weather
function getCardBg(weatherMain: string): string {
  switch (weatherMain.toLowerCase()) {
    case "rain":
    case "drizzle":
    case "thunderstorm":
      // Lighter blue gradient
      return "bg-gradient-to-br from-blue-300/80 via-blue-200/60 to-blue-100/60";
    case "clear":
      return "bg-gradient-to-br from-yellow-300/90 via-yellow-200/70 to-yellow-100/80"; // yellow
    case "clouds":
      return "bg-gradient-to-br from-slate-600/90 to-slate-800/80"; // grayish
    case "snow":
      return "bg-gradient-to-br from-blue-200/80 to-blue-100/80"; // cool white-blue
    case "spring":
      return "bg-gradient-to-br from-orange-300/80 via-orange-200/70 to-yellow-100/80"; // orange/yellow
    default:
      return "bg-gradient-to-br from-blue-300/80 via-blue-200/60 to-blue-100/60"; // fallback to lighter blue
  }
}

const WeatherCard = ({ weather }: { weather: WeatherInfo | null }) => {
  if (!weather) return (
    <>
      <BackgroundBubbles />
      <Card className="animate-pulse w-full max-w-xs mx-auto mt-8 bg-white/20 backdrop-blur-md border border-white/30 shadow-lg font-poppins">
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-8 w-full bg-muted rounded" />
          <div className="mt-2 h-4 w-1/2 bg-muted rounded" />
        </CardContent>
      </Card>
    </>
  );

  const showCartoonCloud = weather.weatherMain?.toLowerCase() === "clouds";
  const advice = getWeatherAdvice(weather.weatherMain);
  const cardBg = getCardBg(weather.weatherMain);

  return (
    <>
      <BackgroundBubbles />
      <Card className={`w-full max-w-sm mx-auto shadow-2xl shadow-sky-500/20 animate-fade-in ${cardBg} backdrop-blur-[7px] border border-white/10 relative overflow-hidden font-poppins`}>
        <Bubbles />
        <CardHeader className="flex flex-col items-center pb-4">
          <span className="mt-2">
            {showCartoonCloud ? (
              <CartoonCloud />
            ) : (
              <span className="text-6xl text-sky-200 drop-shadow-[0_0_10px_rgba(100,200,255,0.4)]">
                {getWeatherEmoji(weather.weatherMain)}
              </span>
            )}
          </span>
          <CardTitle className="mt-2 text-2xl text-white">{weather.city}</CardTitle>
          <CardDescription className="text-sm text-white/80 mb-2 capitalize">{weather.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <span className="text-5xl font-bold text-white">{Math.round(weather.temp)}°C</span>
          {/* Weather Details Grid */}
          <div className="grid grid-cols-2 gap-4 w-full text-white/90">
            {weather.feelsLike != null && (
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg py-3 px-4"> {/* more padding */}
                <span className="p-2 rounded-full bg-blue-300/30"><Thermometer className="w-5 h-5" /></span>
                <div className="text-xs">
                  <div className="opacity-70">Feels like</div>
                  <div className="font-semibold">{Math.round(weather.feelsLike)}°C</div>
                </div>
              </div>
            )}

            {weather.humidity != null && (
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg py-3 px-4">
                <span className="p-2 rounded-full bg-blue-200/30"><Droplets className="w-5 h-5" /></span>
                <div className="text-xs">
                  <div className="opacity-70">Humidity</div>
                  <div className="font-semibold">{weather.humidity}%</div>
                </div>
              </div>
            )}

            {weather.windSpeed != null && (
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg py-3 px-4">
                <span className="p-2 rounded-full bg-blue-400/30"><Wind className="w-5 h-5" /></span>
                <div className="text-xs">
                  <div className="opacity-70">Wind</div>
                  <div className="font-semibold">{weather.windSpeed} m/s</div>
                </div>
              </div>
            )}

            {weather.visibility != null && (
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg py-3 px-4">
                <span className="p-2 rounded-full bg-blue-200/20"><Eye className="w-5 h-5" /></span>
                <div className="text-xs">
                  <div className="opacity-70">Visibility</div>
                  <div className="font-semibold">{Math.round(weather.visibility / 1000)} km</div>
                </div>
              </div>
            )}
          </div>
          {/* Weather advice */}
          <div className="mt-8 mb-3 text-center text-base text-blue-200 bg-white/5 rounded-lg px-4 py-2 font-medium shadow">
            {advice}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default WeatherCard;
