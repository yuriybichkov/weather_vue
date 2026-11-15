import { ref, reactive, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import WeatherClient from '@/api/weatherClient.ts';
import { i18n } from '@/i18n';
import { placeKey } from '@/utils/weather';
import type { Place, BlockConfig, CityWeather } from '@/types/weather.ts';
import type { UserLocation } from '@/composables/useUserLocation.ts';

export const MAX_WEATHER_BLOCKS = 5;
export const MAX_FAVORITES = 5;
const FAVORITES_KEY = 'weather:favorites';

let blockCounter = 0;
const newBlock = (place: Place | null = null): BlockConfig => ({
  id: `block-${Date.now()}-${blockCounter++}`,
  place,
});

const loadFavorites = (): Place[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.slice(0, MAX_FAVORITES) : [];
  } catch {
    return [];
  }
};

export type FavoriteResult = 'added' | 'removed' | 'limit';

export const useWeatherStore = defineStore('weather', () => {
  const userLocation = ref<Place | null>(null);
  const isLocating = ref(true);
  const blocks = ref<BlockConfig[]>([newBlock()]);

  const favorites = ref<Place[]>(loadFavorites());
  const pendingFavorite = ref<Place | null>(null);
  const cache = reactive<Record<string, CityWeather>>({});
  const requestIds = new Map<string, number>();
  let requestSeq = 0;
  const canAddBlock = computed(() => blocks.value.length < MAX_WEATHER_BLOCKS);
  const canRemoveBlock = computed(() => blocks.value.length > 1);

  watch(
    favorites,
    list => {
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
      } catch {
        /* storage unavailable */
      }
    },
    { deep: true }
  );
  const addBlock = (): boolean => {
    if (!canAddBlock.value) return false;
    blocks.value.push(newBlock());
    return true;
  };
  const removeBlock = (id: string) => {
    if (!canRemoveBlock.value) return;
    blocks.value = blocks.value.filter(b => b.id !== id);
  };

  const setBlockPlace = (id: string, place: Place) => {
    const block = blocks.value.find(b => b.id === id);
    if (block) block.place = place;
  };
  const initialize = async (location: UserLocation | null) => {
    isLocating.value = false;
    if (!location) return;

    const place: Place = {
      name: location.city,
      country: location.country,
      lat: location.latitude,
      lon: location.longitude,
    };
    userLocation.value = place;

    const first = blocks.value[0];
    if (first && !first.place) first.place = place;

    try {
      const { data } = await WeatherClient.reversePlace(place.lat, place.lon);
      const names = data[0]?.local_names;
      if (!names) return;
      userLocation.value = { ...place, local_names: names };
      const block = blocks.value.find(b => b.place && placeKey(b.place) === placeKey(place));
      if (block?.place) block.place = { ...block.place, local_names: names };
    } catch (error) {
      console.error('Error occurred while fetching place details:', error);
    }
  };

  const weatherFor = (place: Place): CityWeather | undefined => cache[placeKey(place)];
  const loadWeather = async (place: Place, force = false) => {
    const key = placeKey(place);
    if (!cache[key]) {
      cache[key] = { place, current: null, forecast: null, isLoading: false, error: null };
    }
    const entry = cache[key];
    if (!entry) return;
    if (!force && (entry.isLoading || (entry.current && entry.forecast))) return;

    const requestId = ++requestSeq;
    requestIds.set(key, requestId);
    entry.isLoading = true;
    entry.error = null;

    try {
      const [current, forecast] = await Promise.all([
        WeatherClient.getCurrentWeather(place.lat, place.lon),
        WeatherClient.getForecast(place.lat, place.lon),
      ]);
      if (requestIds.get(key) !== requestId) return;
      entry.current = current.data;
      entry.forecast = forecast.data;
    } catch {
      if (requestIds.get(key) !== requestId) return;
      entry.error = i18n.global.t('errors.loadWeather');
    } finally {
      if (requestIds.get(key) === requestId) entry.isLoading = false;
    }
  };

  const reloadAll = () =>
    Promise.all(Object.values(cache).map(e => loadWeather(e.place, true)));

  const isFavorite = (place: Place | null) =>
    !!place && favorites.value.some(f => placeKey(f) === placeKey(place));

  const toggleFavorite = (place: Place): FavoriteResult => {
    const key = placeKey(place);
    if (isFavorite(place)) {
      favorites.value = favorites.value.filter(f => placeKey(f) !== key);
      return 'removed';
    }
    if (favorites.value.length >= MAX_FAVORITES) {
      pendingFavorite.value = place;
      return 'limit';
    }
    favorites.value.push(place);
    return 'added';
  };

  const removeFavorite = (place: Place) => {
    favorites.value = favorites.value.filter(f => placeKey(f) !== placeKey(place));
  };
  const replaceFavorite = (old: Place) => {
    const next = pendingFavorite.value;
    if (!next) return;
    favorites.value = favorites.value.filter(f => placeKey(f) !== placeKey(old));
    if (!isFavorite(next)) favorites.value.push(next);
    pendingFavorite.value = null;
  };

  const cancelPendingFavorite = () => {
    pendingFavorite.value = null;
  };

  return {
    userLocation,
    isLocating,
    blocks,
    favorites,
    pendingFavorite,
    canAddBlock,
    canRemoveBlock,
    addBlock,
    removeBlock,
    setBlockPlace,
    initialize,
    weatherFor,
    loadWeather,
    reloadAll,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    replaceFavorite,
    cancelPendingFavorite,
  };
});
