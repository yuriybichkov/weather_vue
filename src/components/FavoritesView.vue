<template>
  <section class="favorites">
    <div v-if="!store.favorites.length" class="favorites__empty">
      <h2>{{ t('favorites.emptyTitle') }}</h2>
      <p>{{ t('favorites.emptyText') }}</p>
    </div>

    <div v-else class="favorites__list">
      <!-- readonly: no city search here, only the day / 5 days switch -->
      <WeatherCard v-for="place in store.favorites" :key="placeKey(place)" :place="place" readonly />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import WeatherCard from '@/components/WeatherCard.vue';
import { useWeatherStore } from '@/stores/weather';
import { placeKey } from '@/utils/weather';

const store = useWeatherStore();
const { t } = useI18n();
</script>

<style scoped>
.favorites__list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 520px), 1fr));
  align-items: start;
  gap: 20px;
}

.favorites__empty {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 48px 16px;
  border: 2px dashed var(--border);
  border-radius: var(--radius);
  color: var(--muted);
  text-align: center;
}

.favorites__empty h2 {
  color: var(--text);
  font-size: 20px;
}
</style>
