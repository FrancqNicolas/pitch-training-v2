<script setup lang="ts">
import { ref, computed } from 'vue'
import piano from '../assets/notes/notes.js'

const allNotes = Object.keys(piano)
const currentNote = ref<string>('')
const selectedNote = ref<string>('')
const feedback = ref<string>('')
const score = ref({ correct: 0, total: 0 })
const selectedOctaves = ref<string[]>([])

const playNote = (note: string) => {
  const audio = new Audio(piano[note])
  audio.play()
}

const availableOctaves = computed(() => {
  const octaveSet = new Set(allNotes.map(note => note.slice(-1)))
  return Array.from(octaveSet).sort((a, b) => Number(a) - Number(b))
})

const filteredNotes = computed(() => {
  if (selectedOctaves.value.length === 0) return allNotes
  return allNotes.filter(note => selectedOctaves.value.includes(note.slice(-1)))
})

const startNewRound = () => {
  const notes = filteredNotes.value
  if (notes.length === 0) {
    feedback.value = 'Please select at least one octave!'
    return
  }
  const randomIndex = Math.floor(Math.random() * notes.length)
  currentNote.value = notes[randomIndex]
  selectedNote.value = ''
  feedback.value = ''
  playNote(currentNote.value)
}

const checkAnswer = (note: string) => {
  selectedNote.value = note
  score.value.total++

  if (note === currentNote.value) {
    feedback.value = 'Correct! 🎉'
    score.value.correct++
  } else {
    feedback.value = `Wrong! The correct note was ${currentNote.value}`
  }
}

const scorePercentage = computed(() => {
  if (score.value.total === 0) return 0
  return Math.round((score.value.correct / score.value.total) * 100)
})

const octaves = computed(() => {
  const notesToDisplay = selectedOctaves.value.length > 0 ? filteredNotes.value : allNotes
  const grouped = notesToDisplay.reduce((acc, note) => {
    const noteName = note.slice(0, -1)
    const octave = note.slice(-1)
    if (!acc[octave]) acc[octave] = []
    acc[octave].push({ name: note, noteName })
    return acc
  }, {} as Record<string, Array<{ name: string; noteName: string }>>)
  return Object.entries(grouped).sort(([a], [b]) => Number(a) - Number(b))
})

const isBlackKey = (noteName: string) => {
  return noteName.includes('#')
}

const toggleOctave = (octave: string) => {
  const index = selectedOctaves.value.indexOf(octave)
  if (index === -1) {
    selectedOctaves.value.push(octave)
  } else {
    selectedOctaves.value.splice(index, 1)
  }
}

const resetScore = () => {
  score.value = { correct: 0, total: 0 }
  currentNote.value = ''
  selectedNote.value = ''
  feedback.value = ''
}
</script>

<template>
  <div class="container">
    <h1>🎹 Pitch Training Game</h1>

    <div class="options-section">
      <h3>Select Octaves to Practice:</h3>
      <div class="octave-selector">
        <button
          v-for="octave in availableOctaves"
          :key="octave"
          @click="toggleOctave(octave)"
          :class="['octave-btn', selectedOctaves.includes(octave) ? 'selected' : '']"
        >
          Octave {{ octave }}
        </button>
      </div>
      <button @click="resetScore" class="reset-btn">Reset Score</button>
    </div>

    <div class="score-board">
      <div class="score">Score: {{ score.correct }}/{{ score.total }} ({{ scorePercentage }}%)</div>
    </div>

    <div class="controls">
      <button @click="startNewRound" class="play-btn">{{ currentNote ? 'Play Again' : 'Start Game' }}</button>
      <div v-if="feedback" :class="['feedback', feedback.includes('Correct') ? 'correct' : 'wrong']">
        {{ feedback }}
      </div>
    </div>

    <div v-if="currentNote" class="piano-container">
      <div class="octave-group" v-for="[octave, octaveNotes] in octaves" :key="octave">
        <div class="octave-label">Octave {{ octave }}</div>
        <div class="piano-keys">
          <button
            v-for="{ name, noteName } in octaveNotes"
            :key="name"
            @click="checkAnswer(name)"
            :class="[
              'piano-key',
              isBlackKey(noteName) ? 'black-key' : 'white-key',
              selectedNote === name ? (name === currentNote ? 'correct-key' : 'wrong-key') : ''
            ]"
            :disabled="!!selectedNote"
          >
            {{ noteName }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

h1 {
  margin-bottom: 2rem;
}

.options-section {
  background: #f5f5f5;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.options-section h3 {
  margin-top: 0;
  margin-bottom: 1rem;
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
  background: white;
  color: #333;
  border: 2px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
}

.octave-btn:hover {
  border-color: #42b883;
}

.octave-btn.selected {
  background: #42b883;
  color: white;
  border-color: #42b883;
}

.reset-btn {
  padding: 0.5rem 1rem;
  background: #666;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}

.reset-btn:hover {
  background: #555;
}

.score-board {
  margin-bottom: 2rem;
}

.score {
  font-size: 1.5rem;
  font-weight: bold;
}

.controls {
  margin-bottom: 2rem;
}

.play-btn {
  font-size: 1.2rem;
  padding: 1rem 2rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.play-btn:hover {
  background: #359268;
}

.feedback {
  margin-top: 1rem;
  font-size: 1.3rem;
  font-weight: bold;
  padding: 1rem;
  border-radius: 8px;
}

.feedback.correct {
  background: #d4edda;
  color: #155724;
}

.feedback.wrong {
  background: #f8d7da;
  color: #721c24;
}

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
}

.octave-label {
  font-weight: bold;
  font-size: 0.9rem;
  color: #666;
}

.piano-keys {
  display: flex;
  gap: 2px;
  flex-wrap: wrap;
  justify-content: center;
}

.piano-key {
  padding: 1rem;
  border: 2px solid #333;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: bold;
  transition: all 0.2s;
  min-width: 60px;
}

.white-key {
  background: white;
  color: black;
}

.black-key {
  background: #333;
  color: white;
}

.piano-key:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.piano-key:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.correct-key {
  background: #28a745 !important;
  color: white !important;
}

.wrong-key {
  background: #dc3545 !important;
  color: white !important;
}
</style>
