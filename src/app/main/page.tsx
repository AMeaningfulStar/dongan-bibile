'use client'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { auth, firestore } from '@/libs/firebase'
import useFirebaseStore from '@/stores/FirebaseStore'

import { DashboardLayout } from '@/components/Layout'

export default function Main() {
  const { firebaseInfo, setFirebaseUid, setFirebaseInfo, initFirebaseInfo } = useFirebaseStore()
  const route = useRouter()

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        initFirebaseInfo()
        route.push('/', { scroll: false })
      })
      .catch((error) => {
        console.error('Error checking for duplicate email:', error)
      })
  }

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(firestore, 'users', user.uid)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setFirebaseUid(user.uid)
          setFirebaseInfo(docSnap.data())
        } else {
          // docSnap.data() will be undefined in this case
          console.log('No such document!')
        }
      }
    })
  }, [])

  const printFirebaseInfo = () => {
    console.log('🚀 ~ Main ~ firebaseInfo:', firebaseInfo)
  }
  return (
    <DashboardLayout pageName="홈">
      {/* 청신호 연속 읽은 날짜 텍스트 */}
      <div className="w-full px-4 py-2.5">
        <div className="rounded-full bg-[#E8EEFF] py-2.5 pl-5">
          <div className="text-lg font-light leading-none">
            청신호 연속 <span className="font-medium text-[#0276F9]">000</span> 일째
          </div>
        </div>
      </div>
      {/* 캘린더 */}
      <div className="mb-10 flex w-full flex-col items-center px-4">
        <div className="w-full py-5 text-lg font-light leading-none">나의 말씀 읽기</div>
        <div className="h-96 w-full bg-slate-500"></div>
      </div>
      {/* 청신호 진행률 */}
      <div className="mb-3 flex w-full flex-col gap-y-3 px-4">
        <div className="pt-5 text-lg font-light leading-none">청신호 진행률</div>
        <div className="flex items-center gap-x-2">
          <div className="h-2 flex-grow bg-[#E8EEFF]"></div>
          <div>000 %</div>
        </div>
      </div>
      {/* 나의 진행률 */}
      <div className="mb-16 flex w-full flex-col gap-y-3 px-4">
        <div className="pt-5 text-lg font-light leading-none">나의 진행률</div>
        <div className="flex items-center gap-x-2">
          <div className="h-2 flex-grow bg-[#E8EEFF]"></div>
          <div>000 %</div>
        </div>
      </div>
      {/* 버전 */}
      <p className="mb-6 text-base font-normal leading-none">버전: 1.0</p>
      {/* 버튼 4개 */}
      <div className="mb-6 flex flex-col gap-y-4">
        <div className="flex gap-x-4">
          <button className="h-8 w-32 rounded-lg border border-black bg-white" onClick={() => printFirebaseInfo()}>
            <span className="text-sm font-normal leading-none">비밀번호 변경</span>
          </button>
          <button className="h-8 w-32 rounded-lg border border-black bg-white" onClick={() => handleSignOut()}>
            <span className="text-sm font-normal leading-none">로그아웃</span>
          </button>
        </div>
        <div className="flex gap-x-4">
          <button className="h-8 w-32 rounded-lg border border-black bg-white">
            <span className="text-sm font-normal leading-none">이용 가이드</span>
          </button>
          <button className="h-8 w-32 rounded-lg border border-black bg-white">
            <span className="text-sm font-normal leading-none">문의하기</span>
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
