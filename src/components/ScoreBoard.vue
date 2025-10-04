<script setup lang="ts">
defineProps<{
  correct: number
  total: number
  percentage: number
}>()
</script>

<template>
  <div class="score-board">
    <div class="score">Score: {{ correct }}/{{ total }} ({{ percentage }}%)</div>
  </div>
</template>

<style scoped>
.score-board {
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
}

.score {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
