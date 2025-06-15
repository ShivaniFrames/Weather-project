
export function getWeatherEmoji(weatherMain: string): string {
  // Show no emoji for "clouds" so that WeatherCard can use custom SVG
  switch (weatherMain.toLowerCase()) {
    case "clouds":
      return "";
    case "rain":
      return "🌧️";
    case "drizzle":
      return "🌦️";
    case "clear":
      return "☀️";
    case "thunderstorm":
      return "⛈️";
    case "snow":
      return "❄️";
    case "mist":
    case "fog":
      return "🌫️";
    default:
      return "🌈";
  }
}
