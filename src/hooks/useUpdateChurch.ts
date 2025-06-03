import axios from 'axios'
import { useState } from 'react'

export const useUpdateChurch = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateChurch = async (churchId: string, data: { name: string; location?: string }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.patch(`/api/churches/${churchId}`, data)
      return response.data
    } catch (err: any) {
      console.error('교회 수정 오류:', err)
      setError(err.response?.data?.message || '수정에 실패했습니다.')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { updateChurch, isLoading, error }
}
