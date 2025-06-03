import axios from 'axios'
import { useState } from 'react'

export const useDeleteCommunity = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteCommunity = async (churchId: string, communityId: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      await axios.delete(`/api/churches/${churchId}/communities/${communityId}`)
      return true
    } catch (err: any) {
      console.error('공동체 삭제 오류:', err)
      setError(err.response?.data?.message || '삭제에 실패했습니다.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return { deleteCommunity, isLoading, error }
}
