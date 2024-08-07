import useSWR from 'swr'

interface BibleResponseType {
  status: number
  data: Array<BibleDataType>
}

interface BibleDataType {
  title: string
  chapter: number
  verses: Array<{
    verse: number
    text: string
  }>
}

export function useBibleData(datePick: string, bibleType: string) {
  const fetcher = (url: string) => fetch(url).then((res) => res.json())

  const { data, error, isLoading, mutate } = useSWR<BibleResponseType, Error>(
    datePick && bibleType ? `/api/bible/${datePick}/${bibleType}` : null,
    fetcher,
  )

  return {
    bibleData: data,
    isLoading,
    isError: !!error,
    mutate,
  }
}
