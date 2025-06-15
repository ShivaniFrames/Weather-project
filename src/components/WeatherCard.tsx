

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

  return (
    <>
      <BackgroundBubbles />
      <Card className="w-full max-w-sm mx-auto shadow-2xl shadow-purple-500/20 dark:shadow-sky-500/20 animate-fade-in bg-gradient-to-br from-purple-400/[.3] to-pink-500/[.3] dark:from-sky-400/[.3] dark:to-indigo-500/[.3] backdrop-blur-md border border-white/20 relative overflow-hidden font-poppins">
        <Bubbles />
        <CardHeader className="flex flex-col items-center pb-4">
          <span className="text-6xl text-white/90 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">{getWeatherEmoji(weather.weatherMain)}</span>
          <CardTitle className="mt-2 text-2xl text-white">{weather.city}</CardTitle>
          <CardDescription className="text-sm text-white/80 mb-2 capitalize">{weather.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <span className="text-5xl font-bold text-white">{Math.round(weather.temp)}°C</span>
          
          {/* Weather Details Grid */}
          <div className="grid grid-cols-2 gap-4 w-full text-white/90">
            {weather.feelsLike && (
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-2">
                <Thermometer className="w-4 h-4" />
                <div className="text-xs">
                  <div className="opacity-70">Feels like</div>
                  <div className="font-semibold">{Math.round(weather.feelsLike)}°C</div>
                </div>
              </div>
            )}
            
            {weather.humidity && (
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-2">
                <Droplets className="w-4 h-4" />
                <div className="text-xs">
                  <div className="opacity-70">Humidity</div>
                  <div className="font-semibold">{weather.humidity}%</div>
                </div>
              </div>
            )}
            
            {weather.windSpeed && (
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-2">
                <Wind className="w-4 h-4" />
                <div className="text-xs">
                  <div className="opacity-70">Wind</div>
                  <div className="font-semibold">{weather.windSpeed} m/s</div>
                </div>
              </div>
            )}
            
            {weather.visibility && (
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-2">
                <Eye className="w-4 h-4" />
                <div className="text-xs">
                  <div className="opacity-70">Visibility</div>
                  <div className="font-semibold">{Math.round(weather.visibility / 1000)} km</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default WeatherCard;

