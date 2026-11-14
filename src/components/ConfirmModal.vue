<template>
  <BaseModal :title="title" @close="emit('cancel')">
    <p>{{ text }}</p>
    <template #actions>
      <button type="button" class="btn btn--ghost" @click="emit('cancel')">
        {{ cancelText }}
      </button>
      <button type="button" class="btn btn--danger" @click="emit('confirm')">
        {{ confirmText }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '@/components/BaseModal.vue';

defineProps<{ title: string; text: string; confirmText: string; cancelText: string }>();
const emit = defineEmits<{ confirm: []; cancel: [] }>();
</script>
