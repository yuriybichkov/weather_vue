import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import WeatherClient from '@/api/weatherClient.ts';
import type { Place, WeatherBlock } from '@/types/weather.ts';
import type { UserLocation } from '@/composables/useUserLocation.ts';

export const useWeatherStore = defineStore('weather', () => {
  const userLocation = ref<Place | null>(null);

  const favorites = ref<Place[]>([]);

  const weatherBlocks = ref<WeatherBlock[]>([]);

  const isLoading = ref(false);

  const error = ref<string | null>(null);

  const MAX_WEATHER_BLOCKS = 5;
  const canAddWeatherBlock = computed(() => weatherBlocks.value.length < MAX_WEATHER_BLOCKS);
  const setUserLocation = (location: UserLocation) => {
    userLocation.value = {
      name: location.city,
      country: location.country,
      lat: location.latitude,
      lon: location.longitude,
    };
  };
  const addWeatherBlock = async (place: Place): Promise<boolean> => {
    if (!canAddWeatherBlock.value) return false;

    const block: WeatherBlock = {
      place,
      currentWeather: null,
      forecast: null,
      isLoading: false,
      error: null,
    };

    weatherBlocks.value.push(block);

    await loadWeather(weatherBlocks.value[weatherBlocks.value.length - 1]);

    return true;
  };
  const addFavorite = () => {}; //Добавить город в избранное
  const removeFavorite = () => {}; //Удалить город из избранного
  const initialize = async (place: UserLocation) => {
    setUserLocation(place);

    if (weatherBlocks.value.length === 0) {
      await addWeatherBlock(userLocation.value!);
    }
  };
  const loadWeather = async (block: WeatherBlock) => {
    block.isLoading = true;
    block.error = null;

    try {
      const { lat, lon } = block.place;

      const [currentResponse, forecastResponse] = await Promise.all([
        WeatherClient.getCurrentWeather(lat, lon),
        WeatherClient.getForecast(lat, lon),
      ]);

      block.currentWeather = currentResponse.data;
      block.forecast = forecastResponse.data;
    } catch (err) {
      block.error = err instanceof Error ? err.message : 'Не удалось загрузить погоду';
    } finally {
      block.isLoading = false;
    }
  };

  return {
    userLocation,
    favorites,
    weatherBlocks,
    isLoading,
    error,
    MAX_WEATHER_BLOCKS,
    canAddWeatherBlock,
    setUserLocation,
    addWeatherBlock,
    addFavorite,
    removeFavorite,
    initialize,
    loadWeather,
  };
});
