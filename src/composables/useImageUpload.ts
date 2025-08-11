// src/composables/useImageUpload.ts
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { buildApiUrl } from '@/config/api'


export type ImageKind = 'avatar' | 'banner'

const LIMITS = {
  avatar: 256 * 1024,
  banner: 1024 * 1024,
} as const satisfies Record<ImageKind, number>

const ACCEPTED = ['image/png', 'image/jpeg', 'image/webp', 'image/jpg'] as const

const ENDPOINTS = {
  avatar: '/profile/image',
  banner: '/profile/banner',
} as const satisfies Record<ImageKind, string>

export function useImageUpload(kind: ImageKind) {
  const auth = useAuthStore()

  const error = ref<string | null>(null)
  const loading = ref(false)

  const maxLimit = LIMITS[kind]
  const endpoint = ENDPOINTS[kind]

  const validateFile = (f: File) => {
    if (!ACCEPTED.includes(f.type as any)) {
      return `Format non supporté (${f.type}). Formats acceptés: PNG, JPEG, WEBP.`
    }
    if (f.size > maxLimit) {
      const maxKB = Math.round(maxLimit / 1024)
      const sizeKB = Math.round(f.size / 1024)
      return `Fichier trop lourd (${sizeKB} KB). Limite: ${maxKB} KB.`
    }
    return null
  }

  const fileToDataURL = (f: File) =>
    new Promise<string>((resolve, reject) => {
      const fr = new FileReader()
      fr.onload = () => resolve(String(fr.result))
      fr.onerror = reject
      fr.readAsDataURL(f)
    })

  /** Upload d’un fichier (validation + conversion → PUT) */
  const uploadFile = async (f: File): Promise<boolean> => {
    error.value = null
    const v = validateFile(f)
    if (v) { error.value = v; return false }

    if (!auth.user?.token || !auth.user?.id) {
      error.value = 'Utilisateur non connecté.'
      return false
    }

    loading.value = true
    try {
      const dataUrl = await fileToDataURL(f)

      const res = await fetch(buildApiUrl(endpoint), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.user.token}`,
        },
        body: JSON.stringify({
          image: dataUrl,
          userId: auth.user.id,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || 'Erreur lors de la mise à jour.')
      }
      return true
    } catch (e: any) {
      error.value = e?.message || 'Une erreur est survenue.'
      return false
    } finally {
      loading.value = false
    }
  }

  const onInputChangeUpload = async (e: Event): Promise<boolean> => {
    const target = e.target as HTMLInputElement
    const f = target.files?.[0]
    if (!f) return false
    return uploadFile(f)
  }

  const onDropUpload = async (e: DragEvent): Promise<boolean> => {
    e.preventDefault()
    const f = e.dataTransfer?.files?.[0]
    if (!f) return false
    return uploadFile(f)
  }


  const fetchCurrent = async (): Promise<string | null> => {
    if (!auth.user?.token || !auth.user?.id) {
      error.value = 'Utilisateur non connecté.'
      return null
    }
    try {
      const url = `${buildApiUrl(endpoint)}?userId=${encodeURIComponent(auth.user.id)}`
      const res = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${auth.user.token}` },
      })
      const data = await res.json()
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || 'Impossible de récupérer l’image.')
      }
      const key = kind === 'avatar' ? 'profileImage' : 'bannerImage'
      auth.loadUserFromLocalStorage()
      return data?.data?.[key] ?? null
    } catch (e: any) {
      error.value = e?.message || 'Erreur de récupération.'
      return null
    }
  }

  return {
    kind,
    error,
    loading,
    uploadFile,
    onInputChangeUpload,
    onDropUpload,
    fetchCurrent,
  }
}
