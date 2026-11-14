<template>
  <div class="segmented" role="group" :aria-label="label">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="segmented__btn"
      :class="{ 'is-active': option.value === modelValue }"
      :aria-pressed="option.value === modelValue"
      @click="emit('update:modelValue', option.value)">
      {{ option.label }}
    </button>
  </div>
</template>

<script setup lang="ts" generic="T extends string">
defineProps<{
  modelValue: T;
  options: Array<{ value: T; label: string }>;
  label?: string;
}>();

const emit = defineEmits<{ 'update:modelValue': [value: T] }>();
</script>

<style scoped>
.segmented {
  display: inline-flex;
  padding: 3px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface-alt);
}

.segmented__btn {
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--muted);
  font-size: 14px;
  white-space: nowrap;
}

.segmented__btn.is-active {
  background: var(--accent);
  color: var(--accent-contrast);
}
</style>
