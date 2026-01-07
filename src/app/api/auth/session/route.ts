import { adminAuth } from '@/libs/firebase-admin'
import { NextResponse } from 'next/server'

const SESSION_EXPIRES_IN = 1000 * 60 * 60 * 24 * 5 // 5 days

export async function POST(req: Request) {
  try {
    // 1) idToken 받기
    const authHeader = req.headers.get('authorization') || ''
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

    const body = await req.json().catch(() => ({}))
    const idToken = bearerToken ?? body.idToken

    if (!idToken) {
      return NextResponse.json({ message: 'Missing idToken' }, { status: 400 })
    }

    // 2) 토큰 검증 (진짜 Firebase 로그인 유저인지)
    await adminAuth.verifyIdToken(idToken)

    // 3) 세션 쿠키 생성
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn: SESSION_EXPIRES_IN })

    // 4) 쿠키 설정
    const res = NextResponse.json({ ok: true })

    res.cookies.set({
      name: '__session',
      value: sessionCookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_EXPIRES_IN / 1000,
    })

    return res
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create session' }, { status: 401 })
  }
}
