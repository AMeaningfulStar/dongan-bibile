import { updateUserSettings } from '@/services/userService'
import { useAuthStore } from '@/stores/useAuthStore'
import { BibleTextSize, BibleType } from '@/types/enums'

export const useUpdateUserSettings = () => {
  const { user, setUser } = useAuthStore()

  const updateSettings = async (params: { bibleType?: string; bibleTextSize?: string }) => {
    if (!user) return

    const newType = params.bibleType ?? user.bible.type
    const newSize = params.bibleTextSize ?? user.bible.textSize

    await updateUserSettings({
      uid: user.uid,
      bibleType: newType,
      bibleTextSize: newSize,
    })

    setUser({
      ...user,
      bible: {
        ...user.bible,
        type: newType as BibleType,
        textSize: newSize as BibleTextSize,
      },
    })
  }

  return { updateSettings }
}
