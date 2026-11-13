<template>
  <section class="weather">
    <div class="weather-toolbar">
      <h2>Погода</h2>

      <button
        type="button"
        :disabled="!weatherStore.canAddWeatherBlock"
        @click="isSearchOpen = !isSearchOpen">
        + Додати місто
      </button>
    </div>

    <SearchPlace v-if="isSearchOpen" @select="handleSelectPlace" />

    <p v-if="addError" class="error">
      {{ addError }}
    </p>

    <div class="weather-list">
      <WeatherCard
        v-for="block in weatherStore.weatherBlocks"
        :key="`${block.place.lat}-${block.place.lon}`"
        :block="block" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useWeatherStore } from '@/stores/weather';
import type { Place } from '@/types/weather';

import SearchPlace from '@/components/SearchPlace.vue';
import WeatherCard from '@/components/WeatherCard.vue';

const weatherStore = useWeatherStore();

const isSearchOpen = ref(false);
const addError = ref<string | null>(null);

const handleSelectPlace = async (place: Place) => {
  addError.value = null;

  const added = await weatherStore.addWeatherBlock(place);

  if (added) {
    isSearchOpen.value = false;
  } else if (!weatherStore.canAddWeatherBlock) {
    addError.value = 'Досягнуто максимум 5 погодних блоків';
  } else {
    addError.value = 'Це місто вже додано';
  }
};
</script>

<style scoped>
.weather-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.weather-toolbar button {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: white;
  cursor: pointer;
}

.weather-toolbar button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.weather-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.error {
  color: #d92d20;
}
</style>
