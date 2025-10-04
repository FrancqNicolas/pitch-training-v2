<script setup lang="ts">
defineProps<{
  currentNote: string
  feedback: string
}>()

const emit = defineEmits<{
  startNewRound: []
}>()
</script>

<template>
  <div class="controls">
    <button @click="emit('startNewRound')" class="play-btn">
      {{ currentNote ? 'Play Again' : 'Start Game' }}
    </button>
  </div>
</template>

<style scoped>
.controls {
  margin-bottom: 2rem;
}

.play-btn {
  font-size: 1.2rem;
  padding: 1rem 2rem;
  background: rgba(66, 184, 131, 0.8);
  color: white;
  border: 1px solid rgba(66, 184, 131, 1);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
  box-shadow: 0 8px 24px rgba(66, 184, 131, 0.3);
}

.play-btn:hover {
  background: rgba(66, 184, 131, 1);
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(66, 184, 131, 0.4);
}

.feedback {
  margin-top: 1rem;
  font-size: 1.3rem;
  font-weight: bold;
  padding: 1rem;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.feedback.correct {
  background: rgba(40, 167, 69, 0.3);
  color: white;
  box-shadow: 0 4px 16px rgba(40, 167, 69, 0.3);
}

.feedback.wrong {
  background: rgba(220, 53, 69, 0.3);
  color: white;
  box-shadow: 0 4px 16px rgba(220, 53, 69, 0.3);
}
</style>
