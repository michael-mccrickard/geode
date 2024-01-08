import { ref, onMounted, onUnmounted } from 'vue'

export function useArrowKeys() {
  const arrowKey = ref(null)

  function handleArrowKey(event) {
    const key = event.key

    if (key.startsWith('Arrow')) {
      arrowKey.value = key
      const customEvent = new CustomEvent('arrowKey', { detail: key })
      document.dispatchEvent(customEvent)
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleArrowKey)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleArrowKey)
  })

}