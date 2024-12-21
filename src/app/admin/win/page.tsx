'use client'
import { firestore } from '@/libs/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'

async function getUsersWithLongBibleReading() {
  try {
    // users 컬렉션 참조
    const usersRef = collection(firestore, 'users')

    // bibleReadingDate 배열 크기가 260 이상인 문서 쿼리
    const q = query(
      usersRef,
      where('bibleReadingDates', '!=', null), // null이 아닌 배열만 선택
    )

    const querySnapshot = await getDocs(q)
    const users: { id: string; name: any; counts: any }[] = []

    // 각 문서를 순회하면서 배열 크기 체크
    querySnapshot.forEach((doc) => {
      const data = doc.data()

      users.push({
        id: doc.id,
        name: data.name,
        counts: data.bibleReadingDates.length,
      })
    })

    return users
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

export default function Win() {
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await getUsersWithLongBibleReading()
        setUsers(result)
      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div>
      <h1>성경 260일 이상 읽은 사용자</h1>
      <div>
        {users.map((user) => (
          <div key={user.id} className='flex gap-4'>
            <div className=''>{user.name}</div>
            <div className='font-bold'>{user.counts}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
