
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getWeatherEmoji } from "@/lib/weatherEmoji";

type WeatherInfo = {
  city: string;
  temp: number;
  description: string;
  weatherMain: string;
};

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
    <Card className="w-full max-w-xs mx-auto shadow-lg animate-fade-in bg-white/20 backdrop-blur-md border border-white/30">
      <CardHeader className="flex flex-col items-center">
        <span className="text-6xl">{getWeatherEmoji(weather.weatherMain)}</span>
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
