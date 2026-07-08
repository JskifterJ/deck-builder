<script setup lang="ts">
defineProps<{ src?: string; caption?: string; source?: string }>()
</script>

<template>
  <div class="fig-body">
    <slot><img v-if="src" :src="src" alt=""></slot>
  </div>
  <div v-if="caption" class="cap">{{ caption }}</div>
  <div v-if="source" class="src">Source: {{ source }}</div>
</template>
