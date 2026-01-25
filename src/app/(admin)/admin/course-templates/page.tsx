import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { listCourseTemplates } from '@/features/admin/course-templates/actions'
import { MoreHorizontalIcon } from 'lucide-react'

function formatDaysOfWeek(dows?: number[] | null) {
  if (!dows || dows.length === 0) return '-'
  const map: Record<number, string> = { 0: '일', 1: '월', 2: '화', 3: '수', 4: '목', 5: '금', 6: '토' }
  return dows
    .slice()
    .sort((a, b) => a - b)
    .map((d) => map[d] ?? String(d))
    .join(', ')
}

export default async function AdminCourseTemplatesPage() {
  const templates = await listCourseTemplates()

  return (
    <div className="space-y-4 p-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">코스 템플릿 관리</h1>

        <Button size="sm" variant="outline">
          <Link href="/admin/course-templates/create" className="text-sm">
            코스 템플릿 생성
          </Link>
        </Button>
      </div>

      {/* 목록 */}
      <div className="rounded-lg border px-4 py-2">
        <div className="border-b px-2 py-2 text-sm font-medium">코스 템플릿 목록</div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">제목</TableHead>
              <TableHead className="text-center">기간</TableHead>
              <TableHead className="text-center">기본 요일</TableHead>
              <TableHead className="text-center">운영</TableHead>
              <TableHead className="text-center"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.map((t) => (
              <TableRow key={t.id} className="hover:bg-muted/40">
                <TableCell className="text-center font-medium">
                  <Link href={`/admin/course-templates/${t.id}`} className="hover:underline">
                    {t.title}
                  </Link>
                  {t.isDefault && (
                    <span className="ml-2 rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-800">기본</span>
                  )}
                </TableCell>
                <TableCell className="text-center">{t.periodDays}일</TableCell>
                <TableCell className="text-center">{formatDaysOfWeek(t.defaultDaysOfWeek)}</TableCell>
                <TableCell className="text-center">
                  <span
                    className={`inline-flex items-center rounded px-2 py-0.5 text-xs ${
                      t.isArchived ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {t.isArchived ? '운영중' : '보관됨'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-6">
                        <MoreHorizontalIcon />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Link href={`/admin/course-templates/${t.id}`} className="hover:underline">
                          수정
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>삭제</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}

            {templates.length === 0 && (
              <tr>
                <td className="px-4 py-10 text-center text-sm text-muted-foreground" colSpan={5}>
                  등록된 코스 템플릿이 없습니다.
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
