import { firestore } from '@/libs/firebase'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

interface Params {
  params: {
    churchId: string
    communityId: string
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { churchId, communityId } = params
    const { name, description } = await req.json()

    if (!name) {
      return NextResponse.json({ status: 400, message: '이름은 필수입니다.' })
    }

    const ref = doc(firestore, 'churches', churchId, 'communities', communityId)
    await updateDoc(ref, {
      name,
      description: description || null,
    })

    return NextResponse.json({ status: 200, message: '공동체 정보가 수정되었습니다.' })
  } catch (error) {
    console.error('공동체 수정 오류:', error)
    return NextResponse.json({ status: 500, message: '공동체 수정에 실패했습니다.' })
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const { churchId, communityId } = params

    if (!churchId || !communityId) {
      return NextResponse.json({ status: 400, message: '필수 정보가 누락되었습니다.' })
    }

    await deleteDoc(doc(firestore, 'churches', churchId, 'communities', communityId))

    return NextResponse.json({ status: 200, message: '공동체가 삭제되었습니다.' })
  } catch (error) {
    console.error('공동체 삭제 오류:', error)
    return NextResponse.json({ status: 500, message: '공동체 삭제에 실패했습니다.' })
  }
}
