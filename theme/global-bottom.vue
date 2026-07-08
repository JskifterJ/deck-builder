<template>
  <footer v-if="$slidev.nav.currentPage > 1" class="deck-footer">
    <span class="tt">{{ $slidev.configs.title }}</span>
    <span class="pg"><b>{{ $slidev.nav.currentPage }}</b> / {{ $slidev.nav.total }}</span>
  </footer>
</template>
