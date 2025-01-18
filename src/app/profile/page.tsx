// 'use client'

// import { DashboardLayout } from '@/components/Layout'
// import useFirebaseStore from '@/stores/FirebaseStore'

// export default function Profile() {
//   const { firebaseInfo } = useFirebaseStore()
//   return (
//     <DashboardLayout pageName="나의 프로필">
//       <div className="w-full p-4">
//         <div className="flex flex-col gap-y-2 rounded-xl bg-[#EEE] p-4">
//           <div className="flex items-center gap-x-2">
//             <span className="w-14 text-center text-base font-light">아이디</span>
//             <div className="flex-grow rounded-lg bg-white p-2">{firebaseInfo.useEmail}</div>
//           </div>
//           <div className="flex items-center gap-x-2">
//             <span className="w-14 text-center text-base font-light">비밀번호</span>
//             <div className="h-[30px] flex-grow rounded-lg bg-white p-2"></div>
//           </div>
//           <div className="flex items-center gap-x-2">
//             <span className="w-14 text-center text-base font-light">이름</span>
//             <div className="flex-grow rounded-lg bg-white p-2">{firebaseInfo.useName}</div>
//           </div>
//           <div className="flex items-center gap-x-2">
//             <span className="w-14 text-center text-base font-light">직책</span>
//             <div className="flex-grow rounded-lg bg-white p-2">{firebaseInfo.usePosition}</div>
//           </div>
//           <div className="flex items-center gap-x-2">
//             <span className="w-14 text-center text-base font-light">학년 / 반</span>
//             <div className="flex-grow rounded-lg bg-white p-2">
//               {firebaseInfo.useGrade} 학년 {firebaseInfo.useClass} 반
//             </div>
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   )
// }
