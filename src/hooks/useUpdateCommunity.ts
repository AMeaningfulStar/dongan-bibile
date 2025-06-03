import { CommunityType } from '@/types'
import axios from 'axios'
import { useState } from 'react'

export const useUpdateCommunity = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateCommunity = async (churchId: string, community: Pick<CommunityType, 'id' | 'name' | 'description'>) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.patch(`/api/churches/${churchId}/communities/${community.id}`, {
        name: community.name,
        description: community.description,
      })
      return response.data
    } catch (err: any) {
      console.error('공동체 수정 오류:', err)
      setError(err.response?.data?.message || '수정에 실패했습니다.')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { updateCommunity, isLoading, error }
}
