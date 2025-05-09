import { BibleTextSize, BibleType } from './enums'

export type UserType = {
  uid: string
  name: string
  phone: string
  role: 'admin' | 'department_admin' | 'viewer' | 'user'

  bible: {
    type: BibleType
    textSize: BibleTextSize
    readingDates: string[]
  }

  church?: {
    id: string
  }

  community?: {
    id: string
    gradeNum?: number
    classNum?: number
  }
}
