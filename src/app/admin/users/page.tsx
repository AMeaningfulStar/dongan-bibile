'use client'

import { collection, doc, getDoc, getDocs, query, Timestamp, where } from 'firebase/firestore'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { firestore } from '@/libs/firebase'

import { userInfoStore } from '@/stores'
import { useAuthStore } from '@/stores/useAuthStore'

import { UserInfo } from '@/utils/type'

interface Church {
  id: string
  name: string
  location?: string
  createdAt?: Timestamp
}

interface Community {
  id: string
  name: string
  description?: string
  churchId: string
  createdAt?: Timestamp
}

export default function Admin_User() {
  const { userInfo } = userInfoStore()
  const { user } = useAuthStore()
  const [churches, setChurches] = useState<Church[]>([])
  const [communities, setCommunities] = useState<Community[]>([])
  const [churchId, setChurchId] = useState<string>('')
  const [communityId, setCommunityId] = useState<string>('')
  const [churchName, setChurchName] = useState<string>('')
  const [communitiyName, setCommunityName] = useState<string>('')
  const [users, setUsers] = useState<UserInfo[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (user?.role == 'admin') {
      fetchChurches()
    } else if (user?.role == 'department_admin' || user?.role == 'read_only') {
      fetchUserAffiliation()
    }
  }, [user])

  useEffect(() => {
    if (churchId) {
      fetchCommunities()
    } else {
      setCommunities([])
    }
  }, [churchId])

  const fetchChurches = async () => {
    const querySnapshot = await getDocs(collection(firestore, 'churches'))
    const churchList: Church[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Church, 'id'>),
    }))
    setChurches(churchList)
  }

  const fetchUserAffiliation = async () => {
    if (!user) {
      return
    }

    try {
      if (!user.church?.id) {
        console.warn('⚠️ 교회 ID가 없습니다.')
        return
      }

      const churchRef = doc(firestore, 'churches', user.church.id)
      const churchSnap = await getDoc(churchRef)
      if (!churchSnap.exists()) {
        console.warn('⚠️ 해당 교회 정보가 Firestore에 존재하지 않습니다.')
        return
      }
      setChurchName(churchSnap.data()?.name || '이름 없음')
      setChurchId(user.church.id)

      if (!user.community?.id) {
        console.warn('⚠️ 부서 ID가 없습니다.')
        return
      }

      const departmentRef = doc(firestore, 'churches', user.church.id, 'communities', user.community.id)
      const departmentSnap = await getDoc(departmentRef)
      if (!departmentSnap.exists()) {
        console.warn('⚠️ 해당 부서 정보가 Firestore에 존재하지 않습니다.')
        return
      }
      setCommunityName(departmentSnap.data()?.name || '이름 없음')
      setCommunityId(user.community.id)
    } catch (error) {
      console.error('🚨 사용자 교회 및 부서 정보를 불러오는 중 오류 발생:', error)
    }
  }

  const fetchCommunities = async () => {
    const querySnapshot = await getDocs(collection(firestore, 'churches', churchId as string, 'communities'))
    const communityList: Community[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Community, 'id'>),
    }))
    setCommunities(communityList)
  }

  const fetchUsers = async () => {
    if (!churchId || !communityId) return
    setLoading(true)
    try {
      const usersRef = collection(firestore, 'users')
      const q = query(usersRef, where('churchId', '==', churchId), where('communityId', '==', communityId))

      const snapshot = await getDocs(q)
      const userList: UserInfo[] = snapshot.docs
        .map((doc) => ({
          uid: doc.id,
          ...(doc.data() as Omit<UserInfo, 'uid'>),
        }))
        .sort((a, b) => {
          return a.name.localeCompare(b.name, 'ko')
        })

      setUsers(userList)
    } catch (error) {
      console.error('사용자 목록을 불러오는 중 오류 발생:', error)
    } finally {
      setLoading(false)
    }
  }

  const userRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return <span className="text-caption-14-l text-gl-red-base">전체관리자</span>
      case 'department_admin':
        return <span className="text-caption-14-l text-gl-blue-base">일반관리자</span>
      default:
        return <span className="text-caption-14-l text-gl-grayscale-200">사용자</span>
    }
  }

  return (
    <div className="flex flex-grow flex-col items-center">
      <div className="w-full max-w-xl px-4 py-8">
        <div className="mb-6 flex w-full items-center justify-between">
          <h2 className="text-caption-24-b">🙍‍♂️🙍‍♀️ 사용자 관리</h2>
          <Link
            href={'/admin'}
            className="flex items-center justify-center rounded bg-gl-grayscale-200 px-4 py-2 text-caption-13-l text-gl-white-base"
          >
            뒤로
          </Link>
        </div>

        <div className="mb-2 rounded-xl border border-gl-grayscale-200 px-3 py-4">
          {userInfo && userInfo.role === 'admin' && (
            <>
              <div className="mb-4">
                <label className="mb-2 block text-caption-16-sb">소속 교회</label>
                <div className="w-full rounded border px-2">
                  <select
                    value={churchId}
                    onChange={(e) => setChurchId(e.target.value)}
                    className="w-full py-2 outline-none"
                  >
                    <option value="">교회를 선택하세요</option>
                    {churches.map((church) => (
                      <option key={church.id} value={church.id}>
                        {church.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="mb-2 block text-caption-16-sb">소속 부서</label>
                <div className="w-full rounded border px-2">
                  <select
                    value={communityId}
                    onChange={(e) => setCommunityId(e.target.value)}
                    className="w-full py-2 outline-none"
                  >
                    <option value="">부서를 선택하세요</option>
                    {communities.map((community) => (
                      <option key={community.id} value={community.id}>
                        {community.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
          {userInfo && userInfo.role !== 'admin' && (
            <>
              <div className="mb-4">
                <label className="mb-2 block text-caption-16-sb">소속 교회</label>
                <div className="w-full rounded border p-3">{churchName}</div>
              </div>
              <div className="mb-4">
                <label className="mb-2 block text-caption-16-sb">소속 부서</label>
                <div className="w-full rounded border p-3">{communitiyName}</div>
              </div>
            </>
          )}
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="mb-5 w-full rounded-lg bg-gl-green-opacity-50 py-3 text-caption-15-l text-gl-white-base"
        >
          {loading ? '로딩 중...' : '사용자 목록 불러오기'}
        </button>
        <div className="mb-5 text-caption-16-b">📋 사용자 목록</div>
        {/* 사용자 목록 UI */}
        {users.map((user) => (
          <div key={user.uid} className="mb-1 flex flex-col gap-y-4 rounded border p-2">
            <div className="flex w-full justify-between">
              <span className="text-caption-15-b">{user.name}</span>
              {userRoleText(user.role)}
            </div>
            <button className="rounded bg-gl-green-opacity-30 py-2 text-caption-14-b text-gl-green-base">
              {userInfo && userInfo.role == 'read_only' ? '정보보기' : '수정 / 삭제'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
