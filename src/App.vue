<script setup lang="ts">
import GameOptions from './components/GameOptions.vue'
import ScoreBoard from './components/ScoreBoard.vue'
import GameControls from './components/GameControls.vue'
import PianoKeyboard from './components/PianoKeyboard.vue'
import { usePitchGame } from './composables/usePitchGame'
import { useConfetti } from './composables/useConfetti'
import { useBorderAnimation } from './composables/useBorderAnimation'
import { useOptionsPanel } from './composables/useOptionsPanel'

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
const { showBorders, triggerBorders } = useBorderAnimation()
const { showOptions, toggleOptions, hideOptions } = useOptionsPanel()

const handleCheckAnswer = (note: string) => {
  checkAnswer(note, () => {
    triggerBorders()
    triggerConfetti()
  })
}

const resetOptions = () => {
  selectedOctaves.value = []
  selectedNoteNames.value = []
}

const handleStartNewRound = () => {
  startNewRound()
  hideOptions()
}
</script>

<template>
  <div class="container">
    <h1>🎹 Pitch Training Game</h1>

    <div class="options-wrapper">
      <button @click="toggleOptions" class="toggle-icon-btn">
        {{ showOptions ? '−' : '+' }}
      </button>

      <GameOptions
        v-if="showOptions"
        :availableOctaves="availableOctaves"
        :selectedOctaves="selectedOctaves"
        :availableNoteNames="availableNoteNames"
        :selectedNoteNames="selectedNoteNames"
        @toggleOctave="toggleOctave"
        @toggleNoteName="toggleNoteName"
        @resetScore="resetScore"
        @resetOptions="resetOptions"
      />
    </div>

    <ScoreBoard :correct="score.correct" :total="score.total" :percentage="scorePercentage" />

    <GameControls
      :currentNote="currentNote"
      :feedback="feedback"
      @startNewRound="handleStartNewRound"
    />

    <PianoKeyboard
      v-if="currentNote"
      :octaves="octaves"
      :selectedNote="selectedNote"
      :currentNote="currentNote"
      @checkAnswer="handleCheckAnswer"
    />

    <div v-if="showBorders" class="border-top"></div>
    <div v-if="showBorders" class="border-right"></div>
    <div v-if="showBorders" class="border-bottom"></div>
    <div v-if="showBorders" class="border-left"></div>
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
  box-sizing: border-box;
}

h1 {
  margin-bottom: 2rem;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  font-size: 2.5rem;
}

.options-wrapper {
  position: relative;
  margin-bottom: 2rem;
}

.toggle-icon-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1.5rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.toggle-icon-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.border-top,
.border-right,
.border-bottom,
.border-left {
  position: fixed;
  animation: colorShift 0.2s ease infinite;
  z-index: 1000;
}

.border-top {
  top: 0;
  left: 0;
  right: 0;
  height: 8px;
}

.border-right {
  top: 0;
  right: 0;
  bottom: 0;
  width: 8px;
}

.border-bottom {
  bottom: 0;
  left: 0;
  right: 0;
  height: 8px;
}

.border-left {
  top: 0;
  left: 0;
  bottom: 0;
  width: 8px;
}

@keyframes colorShift {
  0% {
    background: #ff0080;
  }
  16.66% {
    background: #7928ca;
  }
  33.33% {
    background: #0070f3;
  }
  50% {
    background: #00d4ff;
  }
  66.66% {
    background: #00ff88;
  }
  83.33% {
    background: #ffdd00;
  }
  100% {
    background: #ff0080;
  }
}
</style>
