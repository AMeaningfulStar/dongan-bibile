import { NextResponse, type NextRequest } from "next/server"

const ADMIN_PREFIX = "/admin"

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  // admin 영역만 보호
  if (!pathname.startsWith(ADMIN_PREFIX)) {
    return NextResponse.next()
  }

  const sessionCookie = req.cookies.get("__session")?.value

  // 세션 없으면 로그인으로
  if (!sessionCookie) {
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = "/login"
    loginUrl.searchParams.set("next", pathname + search)
    return NextResponse.redirect(loginUrl)
  }

  // 세션 있으면 통과 (role은 서버에서 2차 체크)
  return NextResponse.next()
}

// /admin/* 만 matcher
export const config = {
  matcher: ["/admin/:path*"],
}