export interface Place {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}
export interface WeatherBlock {
  place: Place;
  currentWeather: Weather | null;
  forecast: Forecast | null;
  isLoading: boolean;
  error: string | null;
}
export interface Forecast {
  some: number;
}

export type Weather = { id: string };
