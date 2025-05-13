import { deleteKeyword } from '@/services/keywordService'

export const useDeleteKeyword = () => {
  return async (keyword: string, params: Parameters<typeof deleteKeyword>[1]) => {
    return await deleteKeyword(keyword, params)
  }
}
