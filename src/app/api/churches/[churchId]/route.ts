import { firestore } from '@/libs/firebase'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

interface Params {
  params: {
    churchId: string
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const { churchId } = params

    if (!churchId) {
      return NextResponse.json({ status: 400, message: '교회 ID가 필요합니다.' })
    }

    await deleteDoc(doc(firestore, 'churches', churchId))

    return NextResponse.json({ status: 200, message: '교회가 삭제되었습니다.' })
  } catch (error) {
    console.error('교회 삭제 오류:', error)
    return NextResponse.json({ status: 500, message: '교회 삭제에 실패했습니다.' })
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { churchId } = params
    const { name, location } = await req.json()

    if (!churchId || !name) {
      return NextResponse.json({ status: 400, message: 'ID와 이름은 필수입니다.' })
    }

    const ref = doc(firestore, 'churches', churchId)
    await updateDoc(ref, {
      name,
      location: location || null,
    })

    return NextResponse.json({ status: 200, message: '교회 정보가 수정되었습니다.' })
  } catch (error) {
    console.error('교회 수정 오류:', error)
    return NextResponse.json({ status: 500, message: '교회 수정에 실패했습니다.' })
  }
}
