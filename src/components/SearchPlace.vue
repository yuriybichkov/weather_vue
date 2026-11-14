<template>
  <div ref="root" class="city-search">
    <input
      v-model="query"
      type="text"
      :placeholder="t('search.placeholder')"
      :aria-label="t('search.placeholder')"
      autocomplete="off"
      @focus="showResults = true"
      @keydown.esc="showResults = false" />

    <AppSpinner v-if="isLoading" size="sm" :label="t('search.searching')" class="search-status" />

    <ul v-else-if="showResults && places.length" class="autocomplete-list">
      <li v-for="place in places" :key="`${place.lat}-${place.lon}`">
        <button type="button" @click="selectPlace(place)">
          <span class="place-name">{{ placeName(place, locale) }}</span>
          <span class="place-details">
            {{ place.state ? `${place.state}, ` : '' }}{{ place.country }}
          </span>
        </button>
      </li>
    </ul>

    <p v-else-if="showResults && query.trim().length >= 2 && !error" class="search-status">
      {{ t('search.notFound') }}
    </p>

    <p v-if="error" class="search-error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import weatherClient from '@/api/weatherClient';
import AppSpinner from '@/components/AppSpinner.vue';
import { placeName } from '@/utils/weather';
import type { Place } from '@/types/weather';

const emit = defineEmits<{ select: [place: Place] }>();
const { t, locale } = useI18n();

const root = ref<HTMLElement | null>(null);
const query = ref('');
const places = ref<Place[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const showResults = ref(false);
/** True after a city was picked, so clearing the query does not reopen the list. */
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

  debounceTimer = setTimeout(() => searchPlaces(searchQuery), 400);
});

const searchPlaces = async (searchQuery: string) => {
  isLoading.value = true;
  error.value = null;

  try {
    const response = await weatherClient.searchPlace(searchQuery);

    // Ignore stale answers: the user has typed something else meanwhile.
    if (query.value.trim() !== searchQuery) return;

    places.value = response.data;
    showResults.value = true;
  } catch {
    if (query.value.trim() === searchQuery) error.value = t('search.error');
  } finally {
    if (query.value.trim() === searchQuery) isLoading.value = false;
  }
};

const selectPlace = (place: Place) => {
  emit('select', place);

  clearTimeout(debounceTimer);
  query.value = '';
  places.value = [];
  showResults.value = false;
};

const onOutsideClick = (event: MouseEvent) => {
  if (root.value && !root.value.contains(event.target as Node)) showResults.value = false;
};

onMounted(() => document.addEventListener('mousedown', onOutsideClick));
onUnmounted(() => {
  clearTimeout(debounceTimer);
  document.removeEventListener('mousedown', onOutsideClick);
});
</script>

<style scoped>
.city-search {
  position: relative;
  width: 100%;
}

.city-search input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text);
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
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: var(--shadow);
  overflow: hidden;
}

.autocomplete-list button {
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  background: transparent;
  color: var(--text);
  text-align: left;
}

.autocomplete-list button:hover,
.autocomplete-list button:focus-visible {
  background: var(--surface-alt);
}

.place-name {
  font-weight: 600;
}

.place-details,
.search-status {
  color: var(--muted);
  font-size: 13px;
}

.search-status,
.search-error {
  padding: 8px 0 0;
}

.search-error {
  color: var(--danger);
  font-size: 13px;
}
</style>
