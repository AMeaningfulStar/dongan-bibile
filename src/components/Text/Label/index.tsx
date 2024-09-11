import Image from 'next/image'

interface LabelType {
  label: string
  imageSrc: any
  imageAlt: string
}

export function Label({ label, imageSrc, imageAlt }: LabelType) {
  return (
    <div className="flex items-center gap-x-1">
      <Image alt={imageAlt} src={imageSrc} />
      <span className="text-lg font-light leading-none">{label}</span>
    </div>
  )
}
