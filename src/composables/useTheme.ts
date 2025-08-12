// src/composables/useTheme.ts
import { ref, watch } from 'vue'
import type { Ref } from 'vue'

export type Scheme = 'light' | 'dark'
export type CBMode = 'none' | 'protan' | 'deutan' | 'tritan'

const readScheme = (): Scheme =>
  (localStorage.getItem('scheme') as Scheme) === 'dark' ? 'dark' : 'light'
const readCBEnabled = (): boolean => localStorage.getItem('colorblind') === '1'
const readCBMode = (): CBMode => {
  const v = localStorage.getItem('cbMode') as CBMode | null
  return v === 'protan' || v === 'deutan' || v === 'tritan' ? v : 'none'
}

const scheme: Ref<Scheme> = ref(readScheme())
const colorblind: Ref<boolean> = ref(readCBEnabled())
const colorblindMode: Ref<CBMode> = ref(readCBMode())

function applyTheme() {
  const root = document.documentElement

  // dark / light
  root.classList.toggle('dark', scheme.value === 'dark')

  // ✅ la checkbox pilote toujours la classe "colorblind"
  root.classList.toggle('colorblind', colorblind.value)

  // variantes cb-*
  root.classList.remove('cb-protan', 'cb-deutan', 'cb-tritan')
  if (colorblind.value && colorblindMode.value !== 'none') {
    root.classList.add(`cb-${colorblindMode.value}`)
  }

  // persist
  localStorage.setItem('scheme', scheme.value)
  localStorage.setItem('colorblind', colorblind.value ? '1' : '0')
  localStorage.setItem('cbMode', colorblindMode.value)
}

export function useTheme() {
  watch([scheme, colorblind, colorblindMode], applyTheme, { immediate: true })

  const toggleTheme = () => {
    scheme.value = scheme.value === 'dark' ? 'light' : 'dark'
  }
  const setScheme = (s: Scheme) => { scheme.value = s }

  const setColorblind = (enabled: boolean) => {
    colorblind.value = !!enabled
    if (!enabled) colorblindMode.value = 'none'
  }

  const setColorblindMode = (mode: CBMode) => {
    colorblindMode.value = mode
    // ✅ sélectionner un mode active la checkbox
    colorblind.value = mode !== 'none'
  }

  return { scheme, colorblind, colorblindMode, toggleTheme, setScheme, setColorblind, setColorblindMode }
}
