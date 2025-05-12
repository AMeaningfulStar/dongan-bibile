import axios from 'axios'
import useSWR from 'swr'

export interface ProgressResponse {
  status: number
  data: {
    yearProgress: number // 연간 진행률 (0 ~ 1)
    readDatesInYear: number // 올해 읽은 날짜 수
    totalPlannedDays: number // 올해 전체 날짜 수

    seasonProgress: number | null // 시즌 진행률 (0 ~ 1) — 시즌 없으면 null
    readDatesInSeason: string[] // 시즌 안에서 읽은 날짜 배열
    totalSeasonDays: number // 시즌 전체 날짜 수
  }
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data)

export function getProgress({
  uid,
  churchId,
  communityId,
  seasonId,
}: {
  uid: string
  churchId: string | null
  communityId: string | null
  seasonId: string | null
}) {
  const { data, error, isLoading, mutate } = useSWR<ProgressResponse, Error>(
    uid
      ? `/api/progress?uid=${uid}${churchId ? `&churchId=${churchId}` : ''}${communityId ? `&communityId=${communityId}` : ''}${seasonId ? `&seasonId=${seasonId}` : ''}`
      : null,
    fetcher,
  )

  return {
    progress: data?.status == 200 ? data.data : null,
    isLoading,
    isError: !!error,
    mutate,
  }
}
