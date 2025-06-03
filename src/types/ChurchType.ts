import { Timestamp } from 'firebase/firestore'

export type ChurchType = {
  id: string
  name: string
  location?: string
  createdAt?: Timestamp
}
