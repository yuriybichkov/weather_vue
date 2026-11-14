<template>
  <section class="weather">
    <div class="weather-list">
      <WeatherCard
        v-for="block in store.blocks"
        :key="block.id"
        :place="block.place"
        removable
        @select="store.setBlockPlace(block.id, $event)"
        @remove="blockToRemove = block" />
    </div>

    <div class="weather-add">
      <button
        type="button"
        class="btn add-btn"
        :disabled="!store.canAddBlock"
        :title="store.canAddBlock ? t('addBlock') : t('maxBlocks', { max: MAX_WEATHER_BLOCKS })"
        :aria-label="t('addBlock')"
        @click="store.addBlock()">
        <span aria-hidden="true">+</span>
      </button>
      <span class="weather-add__hint">{{ store.blocks.length }} / {{ MAX_WEATHER_BLOCKS }}</span>
    </div>

    <ConfirmModal
      v-if="blockToRemove"
      :title="t('remove.title')"
      :text="
        blockToRemove.place
          ? t('remove.text', { city: placeName(blockToRemove.place, locale) })
          : t('remove.textEmpty')
      "
      :confirm-text="t('remove.confirm')"
      :cancel-text="t('remove.cancel')"
      @confirm="confirmRemove"
      @cancel="blockToRemove = null" />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ConfirmModal from '@/components/ConfirmModal.vue';
import WeatherCard from '@/components/WeatherCard.vue';
import { MAX_WEATHER_BLOCKS, useWeatherStore } from '@/stores/weather';
import { placeName } from '@/utils/weather';
import type { BlockConfig } from '@/types/weather';

const store = useWeatherStore();
const { t, locale } = useI18n();

const blockToRemove = ref<BlockConfig | null>(null);

const confirmRemove = () => {
  if (blockToRemove.value) store.removeBlock(blockToRemove.value.id);
  blockToRemove.value = null;
};
</script>

<style scoped>
.weather-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 520px), 1fr));
  align-items: start;
  gap: 20px;
}

.weather-add {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
}

.add-btn {
  width: 48px;
  height: 48px;
  padding: 0;
  border-radius: 50%;
  font-size: 28px;
  line-height: 1;
}

.weather-add__hint {
  color: var(--muted);
  font-size: 14px;
}
</style>
