import axios from 'axios'

export const updateUserSettings = async ({
  uid,
  bibleType,
  bibleTextSize,
}: {
  uid: string
  bibleType: string
  bibleTextSize: string
}) => {
  return await axios.patch('/api/user/settings', { uid, bibleType, bibleTextSize })
}
