import type {
  ChartPoint,
  CurrentWeather,
  DaySummary,
  DayView,
  ForecastItem,
  ForecastResponse,
  Period,
  Place,
  Snapshot,
  WeekView,
} from '@/types/weather';

const DAY_SECONDS = 86400;
const pad = (n: number) => String(n).padStart(2, '0');
const avg = (values: number[]) => values.reduce((sum, v) => sum + v, 0) / values.length;

/** Date object whose UTC fields show the local time of the city. */
export const toLocal = (dt: number, timezone: number) => new Date((dt + timezone) * 1000);

const dateKey = (dt: number, timezone: number) => toLocal(dt, timezone).toISOString().slice(0, 10);

export const hourLabel = (dt: number, timezone: number) =>
  `${pad(toLocal(dt, timezone).getUTCHours())}:00`;

export const placeKey = (place: Place) => `${place.lat.toFixed(2)},${place.lon.toFixed(2)}`;

export const currentPeriod = (current: CurrentWeather): Period =>
  current.dt >= current.sys.sunrise && current.dt < current.sys.sunset ? 'day' : 'night';

const podOf = (period: Period) => (period === 'day' ? 'd' : 'n');

/**
 * Groups slots into "days". A night belongs to the evening it started on,
 * so 21:00, 00:00 and 03:00 form one night instead of two partial ones.
 */
const groupKey = (dt: number, timezone: number, period: Period) => {
  const hour = toLocal(dt, timezone).getUTCHours();
  const shift = period === 'night' && hour < 12 ? DAY_SECONDS : 0;
  return dateKey(dt - shift, timezone);
};

const snapshotOf = (item: ForecastItem, temp = item.main.temp): Snapshot => ({
  temp,
  feelsLike: item.main.feels_like,
  humidity: item.main.humidity,
  pressure: item.main.pressure,
  wind: item.wind.speed,
  clouds: item.clouds.all,
  icon: item.weather[0]?.icon ?? '01d',
  description: item.weather[0]?.description ?? '',
});

const currentSnapshot = (c: CurrentWeather): Snapshot => ({
  temp: c.main.temp,
  feelsLike: c.main.feels_like,
  humidity: c.main.humidity,
  pressure: c.main.pressure,
  wind: c.wind.speed,
  clouds: c.clouds.all,
  icon: c.weather[0]?.icon ?? '01d',
  description: c.weather[0]?.description ?? '',
});

const slotsOf = (forecast: ForecastResponse, period: Period) =>
  forecast.list.filter(item => item.sys.pod === podOf(period));

/**
 * Current day: hourly (3h step) temperatures for the chosen part of the day.
 * When no slots of that part are left today, the nearest upcoming one is used.
 */
export function buildDayView(
  current: CurrentWeather,
  forecast: ForecastResponse,
  period: Period,
): DayView | null {
  const tz = forecast.city.timezone;
  const slots = slotsOf(forecast, period);
  const todayKey = groupKey(current.dt, tz, currentPeriod(current));

  const keys = [...new Set(slots.map(s => groupKey(s.dt, tz, period)))].sort();
  const key = keys.find(k => k >= todayKey) ?? keys[0];
  if (!key) return null;

  const daySlots = slots.filter(s => groupKey(s.dt, tz, period) === key);
  const isToday = key === todayKey;
  const useCurrent = isToday && currentPeriod(current) === period;
  const first = daySlots[0];
  const middle = daySlots[Math.floor(daySlots.length / 2)];
  if (!first || !middle) return null;

  // Late in the day only a couple of slots are left: continue with the next day
  // so the chart stays readable (such labels carry the date, e.g. "14.11 06:00").
  const nextKey = keys[keys.indexOf(key) + 1];
  const extra =
    daySlots.length + (useCurrent ? 1 : 0) < 3 && nextKey
      ? slots.filter(s => groupKey(s.dt, tz, period) === nextKey)
      : [];
  const baseDate = dateKey(first.dt, tz);

  const points: ChartPoint[] = [...daySlots, ...extra].map(s => ({
    label:
      dateKey(s.dt, tz) === baseDate
        ? hourLabel(s.dt, tz)
        : `${pad(toLocal(s.dt, tz).getUTCDate())}.${pad(toLocal(s.dt, tz).getUTCMonth() + 1)} ${hourLabel(s.dt, tz)}`,
    temp: Math.round(s.main.temp),
  }));

  if (useCurrent) {
    points.unshift({ label: hourLabel(current.dt, tz), temp: Math.round(current.main.temp) });
  }

  return {
    dt: useCurrent ? current.dt : first.dt,
    timezone: tz,
    isToday,
    snapshot: useCurrent
      ? currentSnapshot(current)
      : snapshotOf(middle, avg(daySlots.map(s => s.main.temp))),
    points,
  };
}

/** 5 days: each day is the mean of the hourly temperatures of the chosen part of the day. */
export function buildWeekView(forecast: ForecastResponse, period: Period): WeekView {
  const tz = forecast.city.timezone;
  const groups = new Map<string, ForecastItem[]>();

  for (const item of slotsOf(forecast, period)) {
    const key = groupKey(item.dt, tz, period);
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }

  const days: DaySummary[] = [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, 5)
    .flatMap(([key, items]) => {
      const middle = items[Math.floor(items.length / 2)];
      if (!middle) return [];
      const temps = items.map(i => i.main.temp);
      return [
        {
          key,
          dt: middle.dt,
          avg: Math.round(avg(temps)),
          min: Math.round(Math.min(...temps)),
          max: Math.round(Math.max(...temps)),
          icon: middle.weather[0]?.icon ?? '01d',
          description: middle.weather[0]?.description ?? '',
        },
      ];
    });

  return { timezone: tz, days };
}

export const formatDate = (
  dt: number,
  timezone: number,
  locale: string,
  options: Intl.DateTimeFormatOptions,
) =>
  new Intl.DateTimeFormat(locale === 'uk' ? 'uk-UA' : 'en-GB', {
    ...options,
    timeZone: 'UTC',
  }).format(toLocal(dt, timezone));

export const placeName = (place: Place, locale: string) => place.local_names?.[locale] ?? place.name;
