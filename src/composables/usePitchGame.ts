import { ref, computed } from 'vue'
import piano from '../../assets/notes/notes.js'

export function usePitchGame() {
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
    const octaveSet = new Set(allNotes.map((note) => note.slice(-1)))
    return Array.from(octaveSet).sort((a, b) => Number(a) - Number(b))
  })

  const availableNoteNames = computed(() => {
    const noteSet = new Set(allNotes.map((note) => note.slice(0, -1)))
    const noteOrder = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    return Array.from(noteSet).sort((a, b) => noteOrder.indexOf(a) - noteOrder.indexOf(b))
  })

  const filteredNotes = computed(() => {
    let notes = allNotes

    if (selectedOctaves.value.length > 0) {
      notes = notes.filter((note) => selectedOctaves.value.includes(note.slice(-1)))
    }

    if (selectedNoteNames.value.length > 0) {
      notes = notes.filter((note) => selectedNoteNames.value.includes(note.slice(0, -1)))
    }

    return notes
  })

  const octaves = computed(() => {
    const notesToDisplay =
      selectedOctaves.value.length > 0 || selectedNoteNames.value.length > 0
        ? filteredNotes.value
        : allNotes
    const grouped = notesToDisplay.reduce(
      (acc, note) => {
        const noteName = note.slice(0, -1)
        const octave = note.slice(-1)
        if (!acc[octave]) acc[octave] = []
        acc[octave].push({ name: note, noteName })
        return acc
      },
      {} as Record<string, Array<{ name: string; noteName: string }>>,
    )
    return Object.entries(grouped).sort(([a], [b]) => Number(a) - Number(b))
  })

  const scorePercentage = computed(() => {
    if (score.value.total === 0) return 0
    return Math.round((score.value.correct / score.value.total) * 100)
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

  const checkAnswer = (note: string, onCorrect: () => void) => {
    selectedNote.value = note
    score.value.total++

    if (note === currentNote.value) {
      feedback.value = 'Correct! 🎉'
      score.value.correct++
      onCorrect()
    } else {
      feedback.value = `Wrong! The correct note was ${currentNote.value}`
    }
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

  return {
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
  }
}
