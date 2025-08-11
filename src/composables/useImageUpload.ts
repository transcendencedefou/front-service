export type ImageKind = 'avatar' | 'banner'

const LIMITS = {
  avatar: 256 * 1024,
  banner: 1024 * 1024
}

const ACCEPTED = ['image/png', 'image/jpeg', 'image/webp', 'image/jpg']

export function useImageUpload() {
  const fileToDataURL = (file :File) =>
    new Promise<string>((resolve, reject) => {
      const fr = new FileReader()
      fr.onload = () => resolve(String(fr.result))
      fr.onerror = reject
      fr.readAsDataURL(file)
    })

    // 
}