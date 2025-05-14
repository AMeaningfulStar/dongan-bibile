import axios from 'axios'

interface MarkReadParams {
  uid: string
  datePick: string
  churchId?: string
  communityId?: string
}

export const useMarkBibleRead = () => {
  const markRead = async ({ uid, datePick, churchId, communityId }: MarkReadParams) => {
    const res = await axios.patch('/api/user/read', {
      uid,
      datePick,
      churchId,
      communityId,
    })
    return res.data
  }

  return { markRead }
}
