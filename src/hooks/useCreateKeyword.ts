import { createKeyword } from '@/services/keywordService'

export const useCreateKeyword = () => {
  return async (params: Parameters<typeof createKeyword>[0]) => {
    return await createKeyword(params)
  }
}
