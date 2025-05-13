import { toggleKeywordLike } from '@/services/keywordService'

export const useLikeKeyword = () => {
  return async (keyword: string, params: Parameters<typeof toggleKeywordLike>[1]) => {
    return await toggleKeywordLike(keyword, params)
  }
}
