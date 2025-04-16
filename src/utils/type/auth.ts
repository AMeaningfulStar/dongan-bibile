import { BibleTextSize, BibleType } from '../enum'

export type UserInfo = {
  uid: string
  name: string
  phone: string
  churchId?: string
  communityId?: string
  role: string
  bibleType: BibleType
  bibleTextSize: BibleTextSize
}

export type Role = 'admin' | 'department_admin' | 'read_only' | 'user'
