import axios from 'axios'
import { useState } from 'react'

export const useDeleteChurch = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteChurchById = async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await axios.delete(`/api/churches/${id}`)
      return true
    } catch (err: any) {
      console.error('교회 삭제 오류:', err)
      setError(err.response?.data?.message || '삭제에 실패했습니다.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return { deleteChurchById, isLoading, error }
}
