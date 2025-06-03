import axios from 'axios'
import useSWR from 'swr'

export interface Community {
  id: string
  name: string
  description: string
  createdAt?: string
}

interface CommunityResponse {
  status: number
  data: Community[]
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data)

export const useCommunities = (id?: string) => {
  const shouldFetch = Boolean(id)
  const { data, error, isLoading, mutate } = useSWR<CommunityResponse>(
    shouldFetch ? `/api/churches/${id}/communities` : null,
    fetcher,
  )

  return {
    communities: data?.data || [],
    isLoading,
    isError: !!error,
    mutate,
  }
}
