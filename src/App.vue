<script setup lang="ts">
import { ref, computed } from 'vue'
import piano from '../assets/notes/notes.js'

const allNotes = Object.keys(piano)
const currentNote = ref<string>('')
const selectedNote = ref<string>('')
const feedback = ref<string>('')
const score = ref({ correct: 0, total: 0 })
const selectedOctaves = ref<string[]>([])
const selectedNoteNames = ref<string[]>([])

const playNote = (note: string) => {
  const audio = new Audio(piano[note])
  audio.play()
}

const availableOctaves = computed(() => {
  const octaveSet = new Set(allNotes.map(note => note.slice(-1)))
  return Array.from(octaveSet).sort((a, b) => Number(a) - Number(b))
})

const availableNoteNames = computed(() => {
  const noteSet = new Set(allNotes.map(note => note.slice(0, -1)))
  const noteOrder = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  return Array.from(noteSet).sort((a, b) => noteOrder.indexOf(a) - noteOrder.indexOf(b))
})

const filteredNotes = computed(() => {
  let notes = allNotes

  if (selectedOctaves.value.length > 0) {
    notes = notes.filter(note => selectedOctaves.value.includes(note.slice(-1)))
  }

  if (selectedNoteNames.value.length > 0) {
    notes = notes.filter(note => selectedNoteNames.value.includes(note.slice(0, -1)))
  }

  return notes
})

const startNewRound = () => {
  const notes = filteredNotes.value
  if (notes.length === 0) {
    feedback.value = 'Please select at least one octave and/or note!'
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
  const notesToDisplay = (selectedOctaves.value.length > 0 || selectedNoteNames.value.length > 0) ? filteredNotes.value : allNotes
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

const toggleNoteName = (noteName: string) => {
  const index = selectedNoteNames.value.indexOf(noteName)
  if (index === -1) {
    selectedNoteNames.value.push(noteName)
  } else {
    selectedNoteNames.value.splice(index, 1)
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

      <h3>Select Notes to Practice:</h3>
      <div class="note-selector">
        <button
          v-for="noteName in availableNoteNames"
          :key="noteName"
          @click="toggleNoteName(noteName)"
          :class="['note-btn', isBlackKey(noteName) ? 'black-note' : 'white-note', selectedNoteNames.includes(noteName) ? 'selected' : '']"
        >
          {{ noteName }}
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
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  text-align: center;
}

h1 {
  margin-bottom: 2rem;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  font-size: 2.5rem;
}

.options-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1.5rem;
  border-radius: 20px;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
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
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
  font-weight: 500;
}

.octave-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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
  background: rgba(255, 255, 255, 0.25);
  color: white;
}

.note-btn.black-note {
  background: rgba(0, 0, 0, 0.4);
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

.reset-btn {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.reset-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.score-board {
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}

.score {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.controls {
  margin-bottom: 2rem;
}

.play-btn {
  font-size: 1.2rem;
  padding: 1rem 2rem;
  background: rgba(66, 184, 131, 0.8);
  backdrop-filter: blur(10px);
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
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1.5rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
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
  border: 2px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: bold;
  transition: all 0.2s;
  min-width: 60px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.white-key {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
}

.black-key {
  background: rgba(0, 0, 0, 0.7);
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
