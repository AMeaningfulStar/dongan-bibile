import axios from 'axios'
import useSWR from 'swr'

import { ChurchType } from '@/types'

interface ChurchResponse {
  status: number
  data: ChurchType[]
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
