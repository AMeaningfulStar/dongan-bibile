import { twMerge } from 'tailwind-merge'

interface VersionType {
  marginBottom: string
  textColor: string
}
export function Version({ marginBottom, textColor }: VersionType) {
  return <p className={twMerge('text-base font-normal leading-none', marginBottom, textColor)}>버전: 2.1.0</p>
}
