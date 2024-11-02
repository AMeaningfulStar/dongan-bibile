import { twMerge } from 'tailwind-merge'

interface VersionType {
  marginBottom: string
  textColor: string
}
export function Version({ marginBottom, textColor }: VersionType) {
  return <p className={twMerge('text-base font-normal leading-none', marginBottom, textColor)}>버전: 3.0.0</p>
}
