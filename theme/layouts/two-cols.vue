<template>
  <div class="slidev-layout deck-twocols">
    <div class="tc-grid">
      <div class="tc-col"><slot /></div>
      <div class="tc-col"><slot name="right" /></div>
    </div>
  </div>
</template>
