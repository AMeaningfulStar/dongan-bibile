import { twMerge } from 'tailwind-merge'

interface HeaderNameType {
  children: React.ReactNode
  textColor: string
}

export function HeaderName({ children, textColor }: HeaderNameType) {
  return <span className={twMerge('text-2xl font-light leading-none', textColor)}>{children}</span>
}
