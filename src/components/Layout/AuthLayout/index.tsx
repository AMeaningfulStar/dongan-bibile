import { twMerge } from 'tailwind-merge'

interface AuthLayoutType {
  children: React.ReactNode
  style: string
}

interface LayoutType {
  children: React.ReactNode
}

export function AuthLayout({ children, style }: AuthLayoutType) {
  return <div className={twMerge('h-full min-h-screen w-full bg-black', style)}>{children}</div>
}

export function OverlayBackground({ children }: LayoutType) {
  return (
    <div className="absolute h-full w-full px-3 pb-9 pt-12 ">
      <div className="flex h-full w-full flex-col items-center rounded-xl bg-white bg-opacity-50 p-2">{children}</div>
    </div>
  )
}

export function InputContainer({ children }: LayoutType) {
  return (
    <div className="flex w-full flex-grow flex-col justify-between gap-y-4 overflow-scroll rounded-xl bg-white bg-opacity-70 p-2">
      {children}
    </div>
  )
}
