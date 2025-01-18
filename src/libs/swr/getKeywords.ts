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

export function getKeyWords(datePick: string) {
  const fetcher = (url: string) => fetch(url).then((res) => res.json())

  const { data, error, isLoading, mutate } = useSWR<KeywordsResponse, Error>(
    datePick ? `/api/bible/keywords/${datePick}` : null,
    fetcher,
  )

  return {
    keywords: data,
    isLoading,
    isError: !!error,
    mutate,
  }
}
