import { firestore } from '@/libs/firebase'
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const datePick = searchParams.get('datePick')
    const churchId = searchParams.get('churchId')
    const communityId = searchParams.get('communityId')

    if (!datePick) {
      return NextResponse.json({ status: 400, message: 'datePick은 필수입니다.' })
    }

    let userSnapshot
    let context: 'grouped' | 'flat' = 'flat'

    if (churchId && communityId) {
      userSnapshot = await getDocs(collection(firestore, 'churches', churchId, 'communities', communityId, 'users'))
      context = 'grouped'
    } else if (churchId && !communityId) {
      userSnapshot = await getDocs(collection(firestore, 'churches', churchId, 'users'))
    } else {
      const usersQuery = query(
        collection(firestore, 'users'),
        where('churchId', '==', null),
        where('communityId', '==', null)
      )
      userSnapshot = await getDocs(usersQuery)
    }

    const userDocs = await Promise.all(
      userSnapshot.docs.map(async (docSnap) => {
        const uid = docSnap.id
        const userInfoSnap = await getDoc(doc(firestore, 'users', uid))
        const name = userInfoSnap.exists() ? userInfoSnap.data().name || 'Unknown' : 'Unknown'

        return {
          uid,
          gradeNum: docSnap.data().gradeNum || null,
          classNum: docSnap.data().classNum || null,
          bibleReadingDates: docSnap.data().bibleReadingDates || [],
          name,
        }
      })
    )

    if (context === 'grouped') {
      const grouped = new Map<string, any>()

      for (const user of userDocs) {
        const key = `${user.gradeNum}-${user.classNum}`
        const group = grouped.get(key) || {
          gradeNum: user.gradeNum,
          classNum: user.classNum,
          total: 0,
          read: 0,
          users: [],
        }

        const read = user.bibleReadingDates?.includes(datePick) ?? false

        group.total++
        if (read) group.read++
        group.users.push({ uid: user.uid, name: user.name, read })

        grouped.set(key, group)
      }

      return NextResponse.json({
        status: 200,
        data: Array.from(grouped.values()),
      })
    }

    const result = {
      total: userDocs.length,
      read: 0,
      users: [] as any[],
    }

    for (const user of userDocs) {
      const read = user.bibleReadingDates?.includes(datePick) ?? false
      if (read) result.read++
      result.users.push({ uid: user.uid, name: user.name, read })
    }

    return NextResponse.json({ status: 200, data: result })
  } catch (error) {
    console.error('읽기 현황 조회 오류:', error)
    return NextResponse.json({ status: 500, message: '서버 오류가 발생했습니다.' })
  }
}