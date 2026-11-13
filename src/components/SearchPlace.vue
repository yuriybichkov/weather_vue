<template>
  <div class="city-search">
    <input
      v-model="query"
      type="text"
      placeholder="Введіть назву міста..."
      autocomplete="off"
      @focus="showResults = true" />

    <div v-if="isLoading" class="search-status">Пошук...</div>

    <ul v-else-if="showResults && places.length" class="autocomplete-list">
      <li
        v-for="place in places"
        :key="`${place.lat}-${place.lon}`"
        @click="selectPlace(place)">
        <span class="place-name">{{ place.name }}</span>
        <span class="place-details">
          {{ place.state ? `${place.state}, ` : '' }}{{ place.country }}
        </span>
      </li>
    </ul>

    <p v-else-if="showResults && query.trim().length >= 2 && !isLoading" class="search-status">
      Місто не знайдено
    </p>

    <p v-if="error" class="search-error">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import weatherClient from '@/api/weatherClient';
import type { Place } from '@/types/weather';

const emit = defineEmits<{ select: [place: Place] }>();

const query = ref('');
const places = ref<Place[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const showResults = ref(false);

let debounceTimer: ReturnType<typeof setTimeout> | undefined;

watch(query, value => {
  clearTimeout(debounceTimer);

  places.value = [];
  error.value = null;

  const searchQuery = value.trim();

  if (searchQuery.length < 2) {
    isLoading.value = false;
    return;
  }

  debounceTimer = setTimeout(() => {
    searchPlaces(searchQuery);
  }, 400);
});

const searchPlaces = async (searchQuery: string) => {
  isLoading.value = true;
  error.value = null;

  try {
    const response = await weatherClient.searchPlace(searchQuery);

    // Защита от отображения устаревших результатов
    if (query.value.trim() !== searchQuery) return;

    places.value = response.data;
    showResults.value = true;
  } catch {
    error.value = 'Помилка пошуку міста';
  } finally {
    if (query.value.trim() === searchQuery) {
      isLoading.value = false;
    }
  }
};

const selectPlace = (place: Place) => {
  emit('select', place);

  query.value = '';
  places.value = [];
  showResults.value = false;
};

onUnmounted(() => {
  clearTimeout(debounceTimer);
});
</script>

<style scoped>
.city-search {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.city-search input {
  width: 100%;
  padding: 12px;
  box-sizing: border-box;
}

.autocomplete-list {
  position: absolute;
  z-index: 10;
  top: 100%;
  left: 0;
  right: 0;
  margin: 4px 0 0;
  padding: 0;
  list-style: none;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgb(0 0 0 / 10%);
}

.autocomplete-list li {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  cursor: pointer;
}

.autocomplete-list li:hover {
  background: #f2f2f2;
}

.place-name {
  font-weight: 600;
}

.place-details,
.search-status {
  color: #777;
  font-size: 13px;
}

.search-status,
.search-error {
  padding: 8px 0;
}

.search-error {
  color: #d33;
}
</style>
