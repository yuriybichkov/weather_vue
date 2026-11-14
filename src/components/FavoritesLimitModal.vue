<template>
  <BaseModal v-if="store.pendingFavorite" :title="t('favorites.limitTitle')" @close="store.cancelPendingFavorite()">
    <p>
      {{
        t('favorites.limitText', {
          city: placeName(store.pendingFavorite, locale),
          max: MAX_FAVORITES,
        })
      }}
    </p>

    <ul class="limit-list">
      <li v-for="place in store.favorites" :key="placeKey(place)">
        <button type="button" class="limit-list__btn" @click="store.replaceFavorite(place)">
          <span>{{ placeName(place, locale) }}</span>
          <span class="limit-list__country">{{ place.country }}</span>
          <span aria-hidden="true">✕</span>
        </button>
      </li>
    </ul>

    <template #actions>
      <button type="button" class="btn btn--ghost" @click="store.cancelPendingFavorite()">
        {{ t('favorites.cancel') }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import BaseModal from '@/components/BaseModal.vue';
import { MAX_FAVORITES, useWeatherStore } from '@/stores/weather';
import { placeKey, placeName } from '@/utils/weather';

const store = useWeatherStore();
const { t, locale } = useI18n();
</script>

<style scoped>
.limit-list {
  display: grid;
  gap: 8px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}

.limit-list__btn {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface-alt);
  color: var(--text);
  text-align: left;
}

.limit-list__btn span:first-child {
  flex: 1;
  font-weight: 600;
}

.limit-list__country {
  color: var(--muted);
  font-size: 13px;
}

.limit-list__btn:hover {
  border-color: var(--danger);
  color: var(--danger);
}
</style>
