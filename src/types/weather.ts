export interface Place {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

/** Day / night display mode. */
export type Period = 'day' | 'night';
/** Single day (hourly chart) or 5 days (daily averages). */
export type Range = 'day' | 'week';

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface MainBlock {
  temp: number;
  feels_like: number;
  humidity: number;
  pressure: number;
}

export interface CurrentWeather {
  dt: number;
  /** Shift from UTC in seconds. */
  timezone: number;
  weather: WeatherCondition[];
  main: MainBlock;
  wind: { speed: number };
  clouds: { all: number };
  sys: { sunrise: number; sunset: number };
}

export interface ForecastItem {
  dt: number;
  main: MainBlock;
  weather: WeatherCondition[];
  clouds: { all: number };
  wind: { speed: number };
  /** `d` - day, `n` - night. */
  sys: { pod: 'd' | 'n' };
}

export interface ForecastResponse {
  list: ForecastItem[];
  city: { timezone: number };
}

export interface CityWeather {
  place: Place;
  current: CurrentWeather | null;
  forecast: ForecastResponse | null;
  isLoading: boolean;
  error: string | null;
}

export interface BlockConfig {
  id: string;
  place: Place | null;
}

export interface Snapshot {
  temp: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  wind: number;
  clouds: number;
  icon: string;
  description: string;
}

export interface ChartPoint {
  label: string;
  temp: number;
}

export interface DayView {
  /** Unix time used to print the date of the view. */
  dt: number;
  timezone: number;
  isToday: boolean;
  snapshot: Snapshot;
  points: ChartPoint[];
}

export interface DaySummary {
  key: string;
  dt: number;
  avg: number;
  min: number;
  max: number;
  icon: string;
  description: string;
}

export interface WeekView {
  timezone: number;
  days: DaySummary[];
}
