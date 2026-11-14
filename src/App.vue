<template>
  <div class="container app">
    <header class="app__header">
      <h1>{{ t('app.title') }}</h1>

      <nav class="app__tabs" role="tablist">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          role="tab"
          class="app__tab"
          :class="{ 'is-active': activeTab === tab.id }"
          :aria-selected="activeTab === tab.id"
          @click="activeTab = tab.id">
          {{ tab.label }}
          <span v-if="tab.id === 'favorites'" class="app__badge">{{ store.favorites.length }}</span>
        </button>
      </nav>

      <SegmentedControl
        class="app__lang"
        :model-value="locale as AppLocale"
        :options="languages"
        :label="t('language')"
        @update:model-value="changeLocale" />
    </header>

    <main>
      <!-- v-show keeps the blocks (and their state) alive when switching tabs -->
      <WeatherComponent v-show="activeTab === 'weather'" />
      <FavoritesView v-if="activeTab === 'favorites'" />
    </main>

    <FavoritesLimitModal />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import FavoritesLimitModal from '@/components/FavoritesLimitModal.vue';
import FavoritesView from '@/components/FavoritesView.vue';
import SegmentedControl from '@/components/SegmentedControl.vue';
import WeatherComponent from '@/components/WeatherComponent.vue';
import { useUserLocation } from '@/composables/useUserLocation';
import { setLocale, type AppLocale } from '@/i18n';
import { useWeatherStore } from '@/stores/weather';

const store = useWeatherStore();
const { t, locale } = useI18n();
const { detectLocation } = useUserLocation();

const activeTab = ref<'weather' | 'favorites'>('weather');
const tabs = computed(() => [
  { id: 'weather' as const, label: t('tabs.weather') },
  { id: 'favorites' as const, label: t('tabs.favorites') },
]);

const languages = [
  { value: 'en' as const, label: 'EN' },
  { value: 'uk' as const, label: 'UK' },
];

const changeLocale = (next: AppLocale) => {
  setLocale(next);
  // The API answers (descriptions) are language dependent, so refresh them.
  store.reloadAll();
};

onMounted(async () => {
  document.documentElement.lang = locale.value;
  // Default city comes from the user's IP; the first block stays empty if it fails.
  store.initialize(await detectLocation());
});
</script>

<style scoped>
.app {
  padding-top: 20px;
  padding-bottom: 40px;
}

.app__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 20px;
  margin-bottom: 20px;
}

.app__header h1 {
  font-size: 28px;
}

.app__tabs {
  display: flex;
  gap: 6px;
  margin-right: auto;
}

.app__tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface);
  color: var(--muted);
}

.app__tab.is-active {
  border-color: var(--accent);
  background: var(--accent);
  color: var(--accent-contrast);
}

.app__badge {
  min-width: 20px;
  padding: 0 6px;
  border-radius: 999px;
  background: rgb(127 127 127 / 22%);
  font-size: 12px;
  text-align: center;
}
</style>
