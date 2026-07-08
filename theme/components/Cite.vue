<script setup lang="ts">
import bib from '../generated/bib.json'
const props = defineProps<{ id: string; loc?: string }>()
const e = (bib as Record<string, any>)[props.id]
</script>

<template>
  <span class="cite">
    <template v-if="e">
      <a v-if="e.url" :href="e.url" target="_blank" rel="noopener">({{ e.inline }}<template v-if="loc">, {{ loc }}</template>)</a>
      <span v-else>({{ e.inline }}<template v-if="loc">, {{ loc }}</template>)</span>
    </template>
    <span v-else class="unknown">[?{{ id }}]</span>
  </span>
</template>
