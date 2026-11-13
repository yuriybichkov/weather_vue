<template>
  <article class="weather-card">
    <template v-if="block.isLoading">
      <p>Завантаження погоди...</p>
    </template>

    <template v-else-if="block.error">
      <p class="error">{{ block.error }}</p>
    </template>

    <template v-else-if="block.currentWeather">
      <header class="weather-card__header">
        <div>
          <h2>{{ block.place.name }}</h2>
          <p>{{ block.place.country }}</p>
        </div>

        <span class="weather-card__date">
          {{ formatDate(block.currentWeather.dt, block.currentWeather.timezone) }}
        </span>
      </header>

      <div class="weather-card__main">
        <img
          :src="`https://openweathermap.org/img/wn/${block.currentWeather.weather[0].icon}@2x.png`"
          :alt="block.currentWeather.weather[0].description" />

        <div>
          <div class="temperature">{{ Math.round(block.currentWeather.main.temp) }}°C</div>

          <p>{{ block.currentWeather.weather[0].description }}</p>

          <p class="feels-like">
            Відчувається як
            {{ Math.round(block.currentWeather.main.feels_like) }}°C
          </p>
        </div>
      </div>

      <div class="weather-card__details">
        <div class="weather-detail">
          <span>Вологість</span>
          <strong>{{ block.currentWeather.main.humidity }}%</strong>
        </div>

        <div class="weather-detail">
          <span>Вітер</span>
          <strong>{{ block.currentWeather.wind.speed }} м/с</strong>
        </div>

        <div class="weather-detail">
          <span>Тиск</span>
          <strong>{{ block.currentWeather.main.pressure }} гПа</strong>
        </div>

        <div class="weather-detail">
          <span>Хмарність</span>
          <strong>{{ block.currentWeather.clouds.all }}%</strong>
        </div>
      </div>
    </template>
  </article>
</template>

<script setup lang="ts">
import type { WeatherBlock } from '@/types/weather';

defineProps<{ block: WeatherBlock }>();

const formatDate = (timestamp: number, timezone: number) => {
  const localDate = new Date((timestamp + timezone) * 1000);

  return new Intl.DateTimeFormat('uk-UA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(localDate);
};
</script>

<style scoped>
.weather-card {
  max-width: 480px;
  padding: 24px;
  border-radius: 16px;
  background: #f3f6fa;
  color: #202b3c;
}

.weather-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.weather-card__header h2 {
  margin: 0;
  font-size: 24px;
}

.weather-card__header p {
  margin: 5px 0;
  color: #667085;
}

.weather-card__date {
  color: #667085;
  font-size: 13px;
  text-align: right;
}

.weather-card__main {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 20px 0;
}

.weather-card__main img {
  width: 110px;
  height: 110px;
}

.temperature {
  font-size: 42px;
  font-weight: 600;
}

.weather-card__main p {
  margin: 4px 0;
  text-transform: capitalize;
}

.feels-like {
  color: #667085;
  font-size: 13px;
}

.weather-card__details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding-top: 20px;
  border-top: 1px solid #dce2e9;
}

.weather-detail {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.weather-detail span {
  color: #667085;
  font-size: 13px;
}

.weather-detail strong {
  font-size: 16px;
}

.error {
  color: #d92d20;
}
</style>
