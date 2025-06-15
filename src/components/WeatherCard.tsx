
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getWeatherEmoji } from "@/lib/weatherEmoji";

type WeatherInfo = {
  city: string;
  temp: number;
  description: string;
  weatherMain: string;
};

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
    <Card className="animate-pulse w-full max-w-xs mx-auto mt-8 bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
      <CardHeader>
        <CardTitle>Loading...</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-8 w-full bg-muted rounded" />
        <div className="mt-2 h-4 w-1/2 bg-muted rounded" />
      </CardContent>
    </Card>
  );

  return (
    <Card className="w-full max-w-xs mx-auto shadow-2xl shadow-sky-500/20 dark:shadow-sky-900/40 animate-fade-in bg-gradient-to-br from-sky-400/[.3] to-indigo-500/[.3] backdrop-blur-md border border-white/20 relative overflow-hidden">
      <Bubbles />
      <CardHeader className="flex flex-col items-center">
        <span className="text-6xl text-white/90 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">{getWeatherEmoji(weather.weatherMain)}</span>
        <CardTitle className="mt-2 text-2xl">{weather.city}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-2 capitalize">{weather.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <span className="text-5xl font-bold">{Math.round(weather.temp)}°C</span>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
