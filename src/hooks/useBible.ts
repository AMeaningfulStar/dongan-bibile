import axios from 'axios'
import useSWR from 'swr'

interface BibleVerse {
  verse: number
  text: string
}

interface BibleText {
  book: string
  chapter: number
  name: string
  testament: string
  texts: {
    easy_korean: BibleVerse[]
    revised_korean: BibleVerse[]
  }
}

interface BibleResponse {
  status: number
  data: BibleText[]
}

interface UseBibleParams {
  datePick: string
  churchId?: string
  communityId?: string
}

const fetcher = (url: string) => axios.get<BibleResponse>(url).then((res) => res.data)

export const useBible = ({ datePick, churchId, communityId }: UseBibleParams) => {
  const query = new URLSearchParams({ datePick })
  if (churchId) query.append('churchId', churchId)
  if (communityId) query.append('communityId', communityId)

  const { data, error, isLoading, mutate } = useSWR<BibleResponse, Error>(
    datePick ? `/api/bible?${query.toString()}` : null,
    fetcher,
  )

  return {
    bible: data?.status === 200 ? data.data : null,
    isLoading,
    isError: !!error,
    mutate,
  }
}
