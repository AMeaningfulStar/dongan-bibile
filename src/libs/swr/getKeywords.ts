import axios from 'axios'
import useSWR from 'swr'

interface KeywordsResponse {
  status: number
  data: Array<Keywords>
}

interface Keywords {
  id: string
  createdBy: string
  likes: Array<string>
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data)

export function getKeyWords({
  datePick,
  churchId,
  communityId,
}: {
  datePick: string
  churchId: string | null
  communityId: string | null
}) {
  const { data, error, isLoading, mutate } = useSWR<KeywordsResponse, Error>(
    datePick
      ? `/api/keywords?datePick=${datePick}${churchId ? `&churchId=${churchId}` : ''}${communityId ? `&communityId=${communityId}` : ''}`
      : null,
    fetcher,
  )

  return {
    keywords: data?.status == 200 ? data.data : null,
    isLoading,
    isError: !!error,
    mutate,
  }
}
