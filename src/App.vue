<template>
  <WeatherComponent />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserLocation } from '@/composables/useUserLocation';
import WeatherComponent from '@/components/WeatherComponent.vue';
import { useWeatherStore } from '@/stores/weather.ts';

const weatherStore = useWeatherStore();
const { location, detectLocation } = useUserLocation();

onMounted(async () => {
  await detectLocation();
  if (location.value) {
    await weatherStore.initialize(location.value);
  }
});
</script>

<style scoped></style>
