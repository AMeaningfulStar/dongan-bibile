import { twMerge } from 'tailwind-merge'

interface TitleType {
  children: React.ReactNode
  textColor: string
}

export function Title({ children, textColor }: TitleType) {
  return <span className={twMerge('text-2xl font-light leading-none', textColor)}>{children}</span>
}
