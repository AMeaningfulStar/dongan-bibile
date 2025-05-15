import { firestore } from '@/libs/firebase'
import { deleteDoc, doc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

interface Params {
  params: {
    id: string
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ status: 400, message: '교회 ID가 필요합니다.' })
    }

    await deleteDoc(doc(firestore, 'churches', id))

    return NextResponse.json({ status: 200, message: '교회가 삭제되었습니다.' })
  } catch (error) {
    console.error('교회 삭제 오류:', error)
    return NextResponse.json({ status: 500, message: '교회 삭제에 실패했습니다.' })
  }
}
