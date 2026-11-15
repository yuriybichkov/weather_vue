<template>
  <Teleport to="body">
    <div class="modal-overlay" @mousedown.self="emit('close')">
      <div
        ref="dialog"
        class="modal"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        tabindex="-1"
        @keydown.esc="emit('close')">
        <h2 :id="titleId" class="modal__title">{{ title }}</h2>
        <div class="modal__body"><slot /></div>
        <footer class="modal__footer"><slot name="actions" /></footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';

defineProps<{ title: string }>();
const emit = defineEmits<{ close: [] }>();

const dialog = ref<HTMLElement | null>(null);
const titleId = `modal-title-${Math.random().toString(36).slice(2, 8)}`;
let previouslyFocused: Element | null = null;

onMounted(() => {
  previouslyFocused = document.activeElement;
  document.body.style.overflow = 'hidden';
  dialog.value?.focus();
});

onBeforeUnmount(() => {
  document.body.style.overflow = '';
  if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgb(16 24 40 / 55%);
}

.modal {
  width: 100%;
  max-width: 440px;
  max-height: 100%;
  overflow: auto;
  padding: 24px;
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: 0 20px 40px rgb(16 24 40 / 25%);
}

.modal:focus {
  outline: none;
}

.modal__title {
  margin-bottom: 12px;
  font-size: 20px;
}

.modal__body {
  color: var(--muted);
}

.modal__footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style>
