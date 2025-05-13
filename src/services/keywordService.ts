import axios from 'axios'

interface KeywordParams {
  datePick: string
  uid: string
  churchId?: string
  communityId?: string
}

export const createKeyword = async (params: KeywordParams & { keyword: string }) => {
  const res = await axios.post('/api/keywords', params)
  return res.data
}

export const fetchKeywords = async (params: KeywordParams) => {
  const query = new URLSearchParams({ datePick: params.datePick, uid: params.uid })
  if (params.churchId) query.append('churchId', params.churchId)
  if (params.communityId) query.append('communityId', params.communityId)

  const res = await axios.get(`/api/keywords?${query.toString()}`)
  return res.data
}

export const deleteKeyword = async (keyword: string, params: KeywordParams & { role: string }) => {
  const query = new URLSearchParams({ datePick: params.datePick, uid: params.uid, role: params.role })
  if (params.churchId) query.append('churchId', params.churchId)
  if (params.communityId) query.append('communityId', params.communityId)

  const res = await axios.delete(`/api/keywords/${keyword}?${query.toString()}`)
  return res.data
}

export const toggleKeywordLike = async (keyword: string, params: KeywordParams) => {
  const query = new URLSearchParams({ datePick: params.datePick, uid: params.uid })
  if (params.churchId) query.append('churchId', params.churchId)
  if (params.communityId) query.append('communityId', params.communityId)

  const res = await axios.patch(`/api/keywords/${keyword}/like?${query.toString()}`)
  return res.data
}
