import useSWR from 'swr'

interface KeywordListResponse {
  status: number
  data: Array<KeywordListType>
}

interface KeywordListType {
  text: string
  likeCount: number
}

export function useKeywordList(datePick: string) {
  const fetcher = (url: string) => fetch(url).then((res) => res.json())

  const { data, error, isLoading, mutate } = useSWR<KeywordListResponse, Error>(
    datePick ? `/api/keyword-list/${datePick}` : null,
    fetcher,
  )

  return {
    keywordList: data,
    isLoading,
    isError: !!error,
    mutate,
  }
}
