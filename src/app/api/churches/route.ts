import { firestore } from '@/libs/firebase'
import { addDoc, collection, doc, getDocs, Timestamp, updateDoc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const snapshot = await getDocs(collection(firestore, 'churches'))
    const churches = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as { name: string; createdAt?: any }),
    }))

    return NextResponse.json({ status: 200, data: churches })
  } catch (error) {
    console.error('교회 목록 조회 오류:', error)
    return NextResponse.json({ status: 500, message: '교회 목록을 불러오지 못했습니다.' })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, location } = await req.json()

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ status: 400, message: '이름이 유효하지 않습니다.' })
    }

    const docRef = await addDoc(collection(firestore, 'churches'), {
      name,
      location,
      createdAt: Timestamp.now(),
    })

    return NextResponse.json({ status: 201, message: '교회가 등록되었습니다.', id: docRef.id })
  } catch (error) {
    console.error('교회 등록 오류:', error)
    return NextResponse.json({ status: 500, message: '교회 등록에 실패했습니다.' })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { churchId, name, location } = await req.json()

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ status: 400, message: '이름이 유효하지 않습니다.' })
    }
    const churchRef = doc(firestore, 'churches', churchId)

    await updateDoc(churchRef, { name: name, location })

    return NextResponse.json({ status: 201, message: '교회 정보가 수정되었습니다.' })
  } catch (error) {
    console.error('교회 등록 오류:', error)
    return NextResponse.json({ status: 500, message: '교회 정보 수정을 실패했습니다.' })
  }
}
