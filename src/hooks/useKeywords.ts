import { fetchKeywords } from '@/services/keywordService'
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

export const useKeywords = (params: Parameters<typeof fetchKeywords>[0]) => {
  const { data, error, isLoading, mutate } = useSWR<KeywordsResponse, Error>(
    params.datePick ? ['/api/keywords', params] : null,
    () => fetchKeywords(params),
  )

  return {
    keywords: data?.data ?? [],
    isLoading,
    isError: !!error,
    mutate,
  }
}
