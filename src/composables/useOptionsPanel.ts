import { ref } from 'vue'

export function useOptionsPanel() {
  const showOptions = ref(true)

  const toggleOptions = () => {
    showOptions.value = !showOptions.value
  }

  const hideOptions = () => {
    showOptions.value = false
  }

  const showOptionsPanel = () => {
    showOptions.value = true
  }

  return {
    showOptions,
    toggleOptions,
    hideOptions,
    showOptionsPanel,
  }
}
