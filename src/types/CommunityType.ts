import { Timestamp } from 'firebase/firestore'

export type CommunityType = {
  id: string
  name: string
  description?: string
  createdAt?: Timestamp
}
