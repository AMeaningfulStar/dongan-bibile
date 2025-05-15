import axios from 'axios'
import { useState } from 'react'

export interface CreateChurchParams {
  name: string
  location?: string
}

export const useCreateChurch = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createChurch = async ({ name, location }: CreateChurchParams) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.post('/api/churches', {
        name,
        location,
      })
      return response.data
    } catch (err: any) {
      console.error('교회 생성 오류:', err)
      setError(err.response?.data?.message || '오류가 발생했습니다.')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { createChurch, isLoading, error }
}
