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

export function getKeyWords(churchId: string, communityId: string, datePick: string) {
  const fetcher = (url: string) => fetch(url).then((res) => res.json())

  const { data, error, isLoading, mutate } = useSWR<KeywordsResponse, Error>(
    churchId && communityId && datePick ? `/api/bible/keywords/${churchId}/${communityId}/${datePick}` : null,
    fetcher,
  )

  return {
    keywords: data,
    isLoading,
    isError: !!error,
    mutate,
  }
}
