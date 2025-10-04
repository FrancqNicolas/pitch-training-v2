<script setup lang="ts">
import { isBlackKey } from '../utils/noteUtils'

defineProps<{
  availableOctaves: string[]
  selectedOctaves: string[]
  availableNoteNames: string[]
  selectedNoteNames: string[]
}>()

const emit = defineEmits<{
  toggleOctave: [octave: string]
  toggleNoteName: [noteName: string]
  resetScore: []
  resetOptions: []
}>()
</script>

<template>
  <div class="options-section">
    <h3>Select Octaves to Practice:</h3>
    <div class="octave-selector">
      <button
        v-for="octave in availableOctaves"
        :key="octave"
        @click="emit('toggleOctave', octave)"
        :class="['octave-btn', selectedOctaves.includes(octave) ? 'selected' : '']"
      >
        Octave {{ octave }}
      </button>
    </div>

    <h3>Select Notes to Practice:</h3>
    <div class="note-selector">
      <button
        v-for="noteName in availableNoteNames"
        :key="noteName"
        @click="emit('toggleNoteName', noteName)"
        :class="[
          'note-btn',
          isBlackKey(noteName) ? 'black-note' : 'white-note',
          selectedNoteNames.includes(noteName) ? 'selected' : '',
        ]"
      >
        {{ noteName }}
      </button>
    </div>

    <div class="reset-buttons">
      <button @click="emit('resetOptions')" class="reset-btn">Reset Options</button>
      <button @click="emit('resetScore')" class="reset-btn">Reset Score</button>
    </div>
  </div>
</template>

<style scoped>
.options-section {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 20px;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
}

.options-section h3 {
  margin-top: 1rem;
  margin-bottom: 1rem;
  color: white;
  font-size: 1.2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.options-section h3:first-child {
  margin-top: 0;
}

.octave-selector {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 1rem;
}

.octave-btn {
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
  font-weight: 500;
}

.octave-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.octave-btn.selected {
  background: rgba(66, 184, 131, 0.8);
  border-color: rgba(66, 184, 131, 1);
  box-shadow: 0 4px 16px rgba(66, 184, 131, 0.4);
}

.note-selector {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 1rem;
}

.note-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
  font-weight: bold;
  backdrop-filter: blur(10px);
}

.note-btn.white-note {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.note-btn.black-note {
  background: rgba(0, 0, 0, 0.5);
  color: white;
}

.note-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.note-btn.selected {
  border-color: rgba(66, 184, 131, 1);
  border-width: 2px;
  box-shadow: 0 0 20px rgba(66, 184, 131, 0.6);
}

.reset-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.reset-btn {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.reset-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}
</style>
