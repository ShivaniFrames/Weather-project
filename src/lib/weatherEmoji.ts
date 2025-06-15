
export function getWeatherEmoji(weatherMain: string): string {
  // Simple mapping for demonstration
  switch (weatherMain.toLowerCase()) {
    case "clouds":
      return "☁️";
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
