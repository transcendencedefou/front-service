import { ref, watchEffect } from 'vue'
import type { Ref } from 'vue'

const theme: Ref<'light' | 'dark'> = ref(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
)

export function useTheme() {
  watchEffect(() => {
    const root = document.documentElement

    if (theme.value === 'dark') {
      root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  
  localStorage.setItem('theme', theme.value)
})

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

return { theme, toggleTheme }
}