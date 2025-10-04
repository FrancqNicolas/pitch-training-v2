<script setup lang="ts">
defineProps<{
  correct: number
  total: number
  percentage: number
}>()
</script>

<template>
  <div class="score-board">
    <div class="score">Score: {{ correct }}/{{ total }}</div>
  </div>
</template>

<style scoped>
.score-board {
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 0.5rem 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.3);
  z-index: 100;
}

.score {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}
</style>
