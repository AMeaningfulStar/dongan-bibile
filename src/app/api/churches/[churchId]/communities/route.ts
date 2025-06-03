import { firestore } from '@/libs/firebase'
import { addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

interface Params {
  params: {
    churchId: string
  }
}

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { churchId } = params
    const snapshot = await getDocs(collection(firestore, 'churches', churchId, 'communities'))

    const communities = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as { name: string; createdAt?: any }),
    }))

    return NextResponse.json({ status: 200, data: communities })
  } catch (error) {
    console.error('공동체 목록 조회 오류:', error)
    return NextResponse.json({ status: 500, message: '공동체 목록을 불러오지 못했습니다.' })
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { churchId } = params
    const { name, description } = await req.json()

    if (!name) {
      return NextResponse.json({ status: 400, message: '이름은 필수입니다.' })
    }

    await addDoc(collection(firestore, 'churches', churchId, 'communities'), {
      name,
      description: description || null,
      churchId,
      createdAt: serverTimestamp(),
    })

    return NextResponse.json({ status: 201, message: '공동체가 등록되었습니다.' })
  } catch (error) {
    console.error('공동체 등록 오류:', error)
    return NextResponse.json({ status: 500, message: '공동체 등록에 실패했습니다.' })
  }
}
