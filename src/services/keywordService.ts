import axios from 'axios'

export const createKeyword = async ({
  datePick,
  keyword,
  uid,
  churchId,
  communityId,
}: {
  datePick: string
  keyword: string
  uid: string
  churchId?: string
  communityId?: string
}) => {
  const response = await axios.post('/api/keywords', {
    datePick,
    keyword,
    uid,
    churchId,
    communityId,
  })

  return response.data
}
