import axios from 'axios'
import useSWR from 'swr'

interface Verse {
  text: string
  verse: number
}

interface Bible {
  book: string
  chapter: number
  testament: string
  name: string
  texts: {
    easy_korean: Verse[]
    revised_korean: Verse[]
  }
}

interface BibleResponse {
  status: number
  data: Bible[]
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data)

export function getBible({
  datePick,
  churchId,
  communityId,
}: {
  datePick: string
  churchId: string | null
  communityId: string | null
}) {
  const { data, error, isLoading, mutate } = useSWR<BibleResponse, Error>(
    datePick
      ? `/api/bible?datePick=${datePick}${churchId ? `&churchId=${churchId}` : ''}${communityId ? `&communityId=${communityId}` : ''}`
      : null,
    fetcher,
  )

  return {
    bible: data?.status == 200 ? data.data : null,
    isLoading,
    isError: !!error,
    mutate
  }
}
