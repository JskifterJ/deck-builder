<script setup lang="ts">
import bib from '../generated/bib.json'
import cited from '../generated/cited.json'
const props = defineProps<{ all?: boolean; keys?: string[] }>()
const B = bib as Record<string, any>
let ids: string[] = props.keys?.length ? props.keys : (props.all ? Object.keys(B) : (cited as string[]))
if (!ids.length) ids = Object.keys(B)
const items = ids.map((id) => B[id]).filter(Boolean).sort((a, b) => a.sortkey.localeCompare(b.sortkey))
</script>

<template>
  <ul class="refs">
    <li v-for="it in items" :key="it.id" v-html="it.full" />
  </ul>
</template>
