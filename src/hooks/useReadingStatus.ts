import axios from 'axios'
import useSWR from 'swr'

interface ReadingUser {
  uid: string
  name: string
  read: boolean
}

export interface GroupReadingStatus {
  gradeNum: number | null
  classNum: number | null
  total: number
  read: number
  users: ReadingUser[]
}

export interface FlatReadingStatus {
  total: number
  read: number
  users: ReadingUser[]
}

export type ReadingStatusResponse = GroupReadingStatus[] | FlatReadingStatus | null

const fetcher = async (url: string) => {
  try {
    const res = await axios.get(url)
    return res.data
  } catch (error) {
    console.error('읽기 현황 가져오기 오류:', error)
    throw error
  }
}

interface Params {
  datePick: string
  churchId?: string
  communityId?: string
}

export const useReadingStatus = ({ datePick, churchId, communityId }: Params) => {
  const query = new URLSearchParams()
  query.append('datePick', datePick)
  if (churchId) query.append('churchId', churchId)
  if (communityId) query.append('communityId', communityId)

  const { data, error, isLoading, mutate } = useSWR<{
    status: number
    data: ReadingStatusResponse
  }>(
    datePick ? `/api/users/reading-status?${query.toString()}` : null,
    fetcher
  )

  let sortedStatus: ReadingStatusResponse = null

  if (Array.isArray(data?.data)) {
    sortedStatus = data.data
      .map(group => ({
        ...group,
        users: [...group.users].sort((a, b) => a.name.localeCompare(b.name, 'ko')),
      }))
      .sort((a, b) => {
        if (a.gradeNum === null || a.classNum === null) return 1
        if (b.gradeNum === null || b.classNum === null) return -1
        if (a.gradeNum === b.gradeNum) return a.classNum - b.classNum
        return a.gradeNum - b.gradeNum
      })
  } else if (data?.data) {
    sortedStatus = {
      ...data.data,
      users: [...data.data.users].sort((a, b) => a.name.localeCompare(b.name, 'ko')),
    }
  }

  return {
    status: sortedStatus,
    count: Array.isArray(data?.data)
      ? data.data.reduce((acc, group) => acc + group.read, 0)
      : data?.data?.read ?? 0,
    isLoading,
    isError: !!error,
    mutate,
  }
} 
