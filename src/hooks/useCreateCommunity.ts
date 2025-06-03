import axios from 'axios'
import { useState } from 'react'

export const useCreateCommunity = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createCommunity = async (churchId: string, data: { name: string; description?: string }): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      await axios.post(`/api/churches/${churchId}/communities`, data)
      return true
    } catch (err: any) {
      console.error('공동체 등록 오류:', err)
      setError(err.response?.data?.message || '등록에 실패했습니다.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return { createCommunity, isLoading, error }
}
