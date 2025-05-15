import axios from 'axios'
import useSWR from 'swr'

export interface Church {
  id: string
  name: string
  createdAt?: string
}

interface ChurchResponse {
  status: number
  data: Church[]
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data)

export const useChurches = () => {
  const { data, error, isLoading, mutate } = useSWR<ChurchResponse>('/api/churches', fetcher)

  return {
    churches: data?.data || [],
    isLoading,
    isError: !!error,
    mutate,
  }
}
