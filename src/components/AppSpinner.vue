<template>
  <span class="spinner" :class="`spinner--${size}`" role="status" aria-live="polite">
    <span class="spinner__ring" />
    <span v-if="label" class="spinner__label">{{ label }}</span>
  </span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ label?: string; size?: 'sm' | 'md' }>(), { size: 'md' });
</script>

<style scoped>
.spinner {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--muted);
  font-size: 14px;
}

.spinner__ring {
  width: 28px;
  height: 28px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.spinner--sm .spinner__ring {
  width: 16px;
  height: 16px;
  border-width: 2px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .spinner__ring {
    animation-duration: 2.4s;
  }
}
</style>
