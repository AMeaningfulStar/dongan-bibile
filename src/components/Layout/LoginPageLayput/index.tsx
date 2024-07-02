interface PageLayoutType {
  pageName: string
  children: React.ReactNode
}

export function LoginPageLayout({ pageName, children }: PageLayoutType) {
  return (
    <div className="h-screen w-full">
      <div className="fixed left-0 top-0 z-50 flex w-full items-center justify-center border-b bg-white py-4">
        <span className="text-2xl leading-none">{pageName}</span>
      </div>
      {children}
    </div>
  )
}
