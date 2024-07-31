'use client'
import { DashboardLayout } from '@/components/Layout'
import Link from 'next/link'

export default function Admin() {
  // const createBible = () => {
  //   set(ref(database, `bible/${'good'}`), {
  //     ddd: 'ss',
  //   })

  //   return ''
  // }

  // useEffect(() => {
  //   const dbRef = ref(database);
  //   get(child(dbRef, 'bible/')).then((snapshot) => {
  //     if (snapshot.exists()) {
  //       console.log("🚀 ~ get ~ snapshot.exists():", snapshot.exists())
  //       console.log("🚀 ~ get ~ snapshot.val():", snapshot.val());
  //     } else {
  //       console.log("No data available");
  //     }
  //   }).catch((error) => {
  //     console.error(error);
  //   });
  // },[])

  return (
    <DashboardLayout pageName="관리자 페이지">
      <div className="flex flex-col gap-y-6 py-2.5">
        <Link href={'/admin/setbible'} className="flex h-8 w-36 items-center justify-center rounded-lg border border-black bg-white">
          <span className="text-sm font-normal leading-none">성경읽기 관리</span>
        </Link>
        <Link href={'/admin'} className="flex h-8 w-36 items-center justify-center rounded-lg border border-black bg-white">
          <span className="text-sm font-normal leading-none">비밀번호 변경</span>
        </Link>
        <Link href={'/admin'} className="flex h-8 w-36 items-center justify-center rounded-lg border border-black bg-white">
          <span className="text-sm font-normal leading-none">비밀번호 변경</span>
        </Link>
      </div>
    </DashboardLayout>
  )
}
