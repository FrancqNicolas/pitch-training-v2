<script setup lang="ts">
import { isBlackKey } from '../utils/noteUtils'

defineProps<{
  octaves: Array<[string, Array<{ name: string; noteName: string }>]>
  selectedNote: string
  currentNote: string
}>()

const emit = defineEmits<{
  checkAnswer: [note: string]
}>()
</script>

<template>
  <div class="piano-container">
    <div class="octave-group" v-for="[octave, octaveNotes] in octaves" :key="octave">
      <div class="octave-label">Octave {{ octave }}</div>
      <div class="piano-keys">
        <button
          v-for="{ name, noteName } in octaveNotes"
          :key="name"
          @click="emit('checkAnswer', name)"
          :class="[
            'piano-key',
            isBlackKey(noteName) ? 'black-key' : 'white-key',
            selectedNote === name ? (name === currentNote ? 'correct-key' : 'wrong-key') : '',
          ]"
          :disabled="!!selectedNote"
        >
          {{ noteName }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.piano-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 2rem;
}

.octave-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
}

.octave-label {
  font-weight: bold;
  font-size: 1rem;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.piano-keys {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  justify-content: center;
}

.piano-key {
  padding: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: bold;
  transition: all 0.2s;
  min-width: 60px;
  border-radius: 12px;
  backdrop-filter:blur(10px);
}

.white-key {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.black-key {
  background: rgba(0, 0, 0, 0.6);
  color: white;
}

.piano-key:hover:not(:disabled) {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.piano-key:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.correct-key {
  background: rgba(40, 167, 69, 0.9) !important;
  color: white !important;
  box-shadow: 0 0 20px rgba(40, 167, 69, 0.6) !important;
}

.wrong-key {
  background: rgba(220, 53, 69, 0.9) !important;
  color: white !important;
  box-shadow: 0 0 20px rgba(220, 53, 69, 0.6) !important;
}
</style>
