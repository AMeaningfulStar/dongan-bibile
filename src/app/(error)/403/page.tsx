// Error 403: 접근 금지 페이지
export default function ForbiddenPage() {
  return (
    <main className="p-6">
      <h1 className="text-lg font-semibold">접근 권한이 없습니다</h1>
      <p className="mt-2 text-sm text-muted-foreground">관리자 권한이 필요한 페이지입니다.</p>
    </main>
  )
}
