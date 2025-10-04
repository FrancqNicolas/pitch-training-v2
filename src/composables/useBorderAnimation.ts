import { ref } from 'vue'

export function useBorderAnimation() {
  const showBorders = ref(false)

  const triggerBorders = () => {
    showBorders.value = true
    setTimeout(() => {
      showBorders.value = false
    }, 3000)
  }

  return {
    showBorders,
    triggerBorders,
  }
}
