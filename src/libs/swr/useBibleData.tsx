import useSWR from 'swr'

interface BibleResponseType {
  status: number
  data: Array<BibleDataType>
}

interface BibleDataType {
  book: string
  chapter: number
  testament: string
  name: string
  texts: {
    easy_korean: Array<{
      text: string
      verse: number
    }>
    revised_korean: Array<{
      text: string
      verse: number
    }>
  }
}

export function useBibleData(churchId: string, communityId: string, datePick: string) {
  const fetcher = (url: string) => fetch(url).then((res) => res.json())

  const { data, error, isLoading, mutate } = useSWR<BibleResponseType, Error>(
    churchId && communityId && datePick ? `/api/bible/${churchId}/${communityId}/${datePick}` : null,
    fetcher,
  )

  return {
    bibleData: data,
    isLoading,
    isError: !!error,
    mutate,
  }
}
