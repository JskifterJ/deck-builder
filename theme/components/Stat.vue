<script setup lang="ts">
defineProps<{ v?: string; l?: string }>()
</script>

<template>
  <div class="stat">
    <div class="v">{{ v }}</div>
    <div class="l">{{ l }}</div>
  </div>
</template>
