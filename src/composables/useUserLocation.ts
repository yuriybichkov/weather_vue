import { ref } from 'vue';

export interface UserLocation {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface IpApiResponse {
  city: string;
  country_name: string;
  latitude: number;
  longitude: number;
}

export function useUserLocation() {
  const location = ref<UserLocation | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function detectLocation() {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch('https://ipapi.co/json/');

      if (!response.ok) {
        throw new Error('Не вдалося визначити місцезнаходження');
      }

      const data: IpApiResponse = await response.json();

      if (!data.latitude || !data.longitude) {
        throw new Error('Не отримано координати користувача');
      }

      location.value = {
        city: data.city,
        country: data.country_name,
        latitude: data.latitude,
        longitude: data.longitude,
      };

      return location.value;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Помилка визначення місцезнаходження';

      return null;
    } finally {
      isLoading.value = false;
    }
  }

  return { location, isLoading, error, detectLocation };
}
