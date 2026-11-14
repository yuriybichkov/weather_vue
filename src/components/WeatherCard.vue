<template>
  <article
    class="card"
    :class="{ 'is-favorite': favorite, 'is-night': period === 'night' }"
    :aria-label="place ? cityName : t('card.emptyTitle')">
    <header class="card__head">
      <SearchPlace v-if="!readonly" class="card__search" @select="emit('select', $event)" />

      <div v-if="place || removable" class="card__actions">
        <button
          v-if="place"
          type="button"
          class="icon-btn icon-btn--star"
          :class="{ 'is-active': favorite }"
          :aria-pressed="favorite"
          :title="favorite ? t('favorites.remove') : t('favorites.add')"
          :aria-label="favorite ? t('favorites.remove') : t('favorites.add')"
          @click="onToggleFavorite">
          {{ favorite ? '★' : '☆' }}
        </button>
        <button
          v-if="removable"
          type="button"
          class="icon-btn"
          :disabled="!store.canRemoveBlock"
          :title="store.canRemoveBlock ? t('remove.title_btn') : t('remove.lastBlock')"
          :aria-label="t('remove.title_btn')"
          @click="emit('remove')">
          ✕
        </button>
      </div>
    </header>

    <!-- No city chosen yet -->
    <div v-if="!place" class="card__empty">
      <AppSpinner v-if="store.isLocating" :label="t('card.locating')" />
      <template v-else>
        <h2>{{ t('card.emptyTitle') }}</h2>
        <p>{{ t('card.emptyHint') }}</p>
      </template>
    </div>

    <template v-else>
      <div class="card__title">
        <h2>{{ cityName }}</h2>
        <span class="card__country">{{ place.state ? `${place.state}, ` : '' }}{{ place.country }}</span>
      </div>

      <div class="card__controls">
        <SegmentedControl v-model="range" :options="rangeOptions" :label="t('range.label')" />
        <SegmentedControl v-model="period" :options="periodOptions" :label="t('period.label')" />
      </div>

      <div v-if="data?.error && !data.current" class="card__state">
        <p class="card__error">{{ data.error }}</p>
        <button type="button" class="btn" @click="store.loadWeather(place, true)">
          {{ t('card.retry') }}
        </button>
      </div>

      <div v-else-if="!data || (data.isLoading && !data.current)" class="card__state">
        <AppSpinner />
      </div>

      <div v-else-if="data.current && data.forecast" class="card__content">
        <!-- Overlay preloader while data is refreshed (e.g. language switch) -->
        <div v-if="data.isLoading" class="card__overlay"><AppSpinner size="sm" /></div>

        <template v-if="range === 'day' && dayView">
          <p class="card__date">
            {{ formatDate(dayView.dt, dayView.timezone, locale, dateOptions) }}
          </p>

          <div class="card__main">
            <img
              :src="iconUrl(dayView.snapshot.icon)"
              :alt="dayView.snapshot.description"
              width="110"
              height="110" />
            <div>
              <div class="temperature">{{ Math.round(dayView.snapshot.temp) }}°C</div>
              <p class="card__description">{{ dayView.snapshot.description }}</p>
              <p class="card__muted">
                {{ t('card.feelsLike', { temp: `${Math.round(dayView.snapshot.feelsLike)}°C` }) }}
              </p>
            </div>
          </div>

          <dl class="card__details">
            <div>
              <dt>{{ t('card.humidity') }}</dt>
              <dd>{{ dayView.snapshot.humidity }}%</dd>
            </div>
            <div>
              <dt>{{ t('card.wind') }}</dt>
              <dd>{{ dayView.snapshot.wind }} {{ t('card.windUnit') }}</dd>
            </div>
            <div>
              <dt>{{ t('card.pressure') }}</dt>
              <dd>{{ dayView.snapshot.pressure }} {{ t('card.pressureUnit') }}</dd>
            </div>
            <div>
              <dt>{{ t('card.clouds') }}</dt>
              <dd>{{ dayView.snapshot.clouds }}%</dd>
            </div>
          </dl>

          <p class="card__note">{{ t('card.hourlyNote') }}</p>
          <TemperatureChart
            :labels="dayChart.labels"
            :values="dayChart.values"
            :title="t('chart.temperature')"
            :night="period === 'night'" />
        </template>

        <template v-else-if="range === 'week' && weekView">
          <ul class="days">
            <li v-for="day in weekView.days" :key="day.key" class="day">
              <span class="day__name">
                {{ formatDate(day.dt, weekView.timezone, locale, shortDay) }}
              </span>
              <img :src="iconUrl(day.icon)" :alt="day.description" width="48" height="48" />
              <strong>{{ day.avg }}°C</strong>
              <span class="card__muted">{{ day.min }}° / {{ day.max }}°</span>
            </li>
          </ul>

          <p class="card__note">{{ t('card.averageNote') }}</p>
          <TemperatureChart
            :labels="weekChart.labels"
            :values="weekChart.values"
            :title="t('chart.temperature')"
            :night="period === 'night'" />
        </template>
      </div>
    </template>
  </article>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppSpinner from '@/components/AppSpinner.vue';
import SearchPlace from '@/components/SearchPlace.vue';
import SegmentedControl from '@/components/SegmentedControl.vue';
import TemperatureChart from '@/components/TemperatureChart.vue';
import { useWeatherStore } from '@/stores/weather';
import { buildDayView, buildWeekView, currentPeriod, formatDate, placeName } from '@/utils/weather';
import type { Period, Place, Range } from '@/types/weather';

const props = defineProps<{
  place: Place | null;
  /** Favorites tab: the city cannot be changed. */
  readonly?: boolean;
  removable?: boolean;
}>();

const emit = defineEmits<{ select: [place: Place]; remove: [] }>();

const store = useWeatherStore();
const { t, locale } = useI18n();

const range = ref<Range>('day');
const period = ref<Period>('day');

const data = computed(() => (props.place ? store.weatherFor(props.place) : undefined));
const favorite = computed(() => store.isFavorite(props.place));
const cityName = computed(() => (props.place ? placeName(props.place, locale.value) : ''));

const rangeOptions = computed(() => [
  { value: 'day' as const, label: t('range.day') },
  { value: 'week' as const, label: t('range.week') },
]);
const periodOptions = computed(() => [
  { value: 'day' as const, label: `☀ ${t('period.day')}` },
  { value: 'night' as const, label: `☾ ${t('period.night')}` },
]);

const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
const shortDay: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric' };

const dayView = computed(() =>
  data.value?.current && data.value.forecast
    ? buildDayView(data.value.current, data.value.forecast, period.value)
    : null,
);
const weekView = computed(() =>
  data.value?.forecast ? buildWeekView(data.value.forecast, period.value) : null,
);

const dayChart = computed(() => ({
  labels: dayView.value?.points.map(p => p.label) ?? [],
  values: dayView.value?.points.map(p => p.temp) ?? [],
}));
const weekChart = computed(() => {
  const view = weekView.value;
  return {
    labels: view?.days.map(d => formatDate(d.dt, view.timezone, locale.value, shortDay)) ?? [],
    values: view?.days.map(d => d.avg) ?? [],
  };
});

const iconUrl = (icon: string) => `https://openweathermap.org/img/wn/${icon}@2x.png`;

// Load the data as soon as a city is set (also covers the favorites tab).
watch(
  () => props.place,
  place => {
    if (place) store.loadWeather(place);
  },
  { immediate: true },
);

// Start in the part of the day that matches the city's current time, once.
let periodSynced = false;
watch(
  () => data.value?.current,
  current => {
    if (!current || periodSynced) return;
    periodSynced = true;
    period.value = currentPeriod(current);
  },
  { immediate: true },
);

const onToggleFavorite = () => {
  if (props.place) store.toggleFavorite(props.place);
};
</script>

<style scoped>
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
  padding: 20px;
  border: 2px solid transparent;
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow);
  transition:
    background 0.3s,
    color 0.3s,
    border-color 0.2s;
}

/* Night mode of the card */
.card.is-night {
  --surface: #17233a;
  --surface-alt: #1f2e4a;
  --text: #e6ecf7;
  --muted: #9fb0cc;
  --border: #2d3f61;
  background: #17233a;
  color: var(--text);
}

/* The favorite city is marked by a frame and a filled star. */
.card.is-favorite {
  border-color: var(--favorite);
}

.card__head {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.card__search {
  flex: 1;
  min-width: 0;
}

.card__actions {
  display: flex;
  gap: 6px;
  margin-left: auto;
}

.icon-btn {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface-alt);
  color: var(--muted);
  font-size: 18px;
  line-height: 1;
}

.icon-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.icon-btn:hover:not(:disabled) {
  color: var(--text);
}

.icon-btn--star.is-active {
  color: var(--favorite);
  border-color: var(--favorite);
}

.card__title {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 10px;
}

.card__title h2 {
  font-size: 24px;
  overflow-wrap: anywhere;
}

.card__country,
.card__muted,
.card__note,
.card__date {
  color: var(--muted);
  font-size: 13px;
}

.card__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.card__empty,
.card__state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 160px;
  color: var(--muted);
  text-align: center;
}

.card__empty h2 {
  color: var(--text);
  font-size: 20px;
}

.card__error {
  color: var(--danger);
}

.card__content {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.card__overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: color-mix(in srgb, var(--surface) 70%, transparent);
}

.card__main {
  display: flex;
  align-items: center;
  gap: 16px;
}

.card__main img {
  flex: none;
  width: 110px;
  height: 110px;
}

.temperature {
  font-size: 42px;
  font-weight: 600;
  line-height: 1.1;
}

.card__description {
  text-transform: capitalize;
}

.card__details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin: 0;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.card__details dt {
  color: var(--muted);
  font-size: 13px;
}

.card__details dd {
  margin: 4px 0 0;
  font-size: 16px;
  font-weight: 600;
}

.days {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 10px 4px;
  border-radius: 12px;
  background: var(--surface-alt);
  text-align: center;
}

.day__name {
  font-size: 13px;
  font-weight: 600;
  text-transform: capitalize;
}

@media (max-width: 480px) {
  .card {
    padding: 16px;
  }

  .card__main img {
    width: 80px;
    height: 80px;
  }

  .temperature {
    font-size: 34px;
  }
}
</style>
