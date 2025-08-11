import { ref, watchEffect } from 'vue'
import type { Ref } from 'vue'

type Scheme = 'light' | 'dark'

const readScheme = (): Scheme =>
  (localStorage.getItem('scheme') as Scheme) === 'dark' ? 'dark' : 'light'

const readCB = (): boolean => localStorage.getItem('colorblind') === '1'

const scheme: Ref<Scheme> = ref(readScheme())
const colorblind: Ref<boolean> = ref(readCB())

export function useTheme() {
  watchEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', scheme.value === 'dark')
    root.classList.toggle('colorblind', colorblind.value)

    localStorage.setItem('scheme', scheme.value)
    localStorage.setItem('colorblind', colorblind.value ? '1' : '0')
  })

  const toggleTheme = () => {
    scheme.value = scheme.value === 'dark' ? 'light' : 'dark'
  }

  const setColorblind = (enabled: boolean) => {
    colorblind.value = !!enabled
  }

  return { scheme, colorblind, toggleTheme, setColorblind }
}
