<script setup lang="ts">
import GameOptions from './components/GameOptions.vue'
import ScoreBoard from './components/ScoreBoard.vue'
import GameControls from './components/GameControls.vue'
import PianoKeyboard from './components/PianoKeyboard.vue'
import { usePitchGame } from './composables/usePitchGame'
import { useConfetti } from './composables/useConfetti'

const {
  currentNote,
  selectedNote,
  feedback,
  score,
  selectedOctaves,
  selectedNoteNames,
  availableOctaves,
  availableNoteNames,
  octaves,
  scorePercentage,
  startNewRound,
  checkAnswer,
  toggleOctave,
  toggleNoteName,
  resetScore,
} = usePitchGame()

const { triggerConfetti } = useConfetti()

const handleCheckAnswer = (note: string) => {
  checkAnswer(note, triggerConfetti)
}
</script>

<template>
  <div class="container">
    <h1>🎹 Pitch Training Game</h1>

    <GameOptions
      :availableOctaves="availableOctaves"
      :selectedOctaves="selectedOctaves"
      :availableNoteNames="availableNoteNames"
      :selectedNoteNames="selectedNoteNames"
      @toggleOctave="toggleOctave"
      @toggleNoteName="toggleNoteName"
      @resetScore="resetScore"
    />

    <ScoreBoard :correct="score.correct" :total="score.total" :percentage="scorePercentage" />

    <GameControls
      :currentNote="currentNote"
      :feedback="feedback"
      @startNewRound="startNewRound"
    />

    <PianoKeyboard
      v-if="currentNote"
      :octaves="octaves"
      :selectedNote="selectedNote"
      :currentNote="currentNote"
      @checkAnswer="handleCheckAnswer"
    />
  </div>
</template>

<style>
body {
  font-family: sans-serif;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}
</style>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  padding: 2rem;
  text-align: center;
  margin: 0;
}

h1 {
  margin-bottom: 2rem;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  font-size: 2.5rem;
}
</style>
