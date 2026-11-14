import { ref } from 'vue';

export interface UserLocation {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

/** Free IP geolocation services, tried in order until one answers. */
const providers: Array<() => Promise<UserLocation>> = [
  async () => {
    const res = await fetch('https://ipapi.co/json/');
    if (!res.ok) throw new Error('ipapi.co failed');
    const d = await res.json();
    if (!d.latitude || !d.longitude || !d.city) throw new Error('ipapi.co: no data');
    return { city: d.city, country: d.country_name, latitude: d.latitude, longitude: d.longitude };
  },
  async () => {
    const res = await fetch('https://ipwho.is/');
    if (!res.ok) throw new Error('ipwho.is failed');
    const d = await res.json();
    if (!d.success || !d.latitude || !d.longitude) throw new Error('ipwho.is: no data');
    return { city: d.city, country: d.country, latitude: d.latitude, longitude: d.longitude };
  },
];

export function useUserLocation() {
  const location = ref<UserLocation | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function detectLocation() {
    isLoading.value = true;
    error.value = null;

    for (const provider of providers) {
      try {
        location.value = await provider();
        isLoading.value = false;
        return location.value;
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Location detection failed';
      }
    }

    isLoading.value = false;
    return null;
  }

  return { location, isLoading, error, detectLocation };
}
