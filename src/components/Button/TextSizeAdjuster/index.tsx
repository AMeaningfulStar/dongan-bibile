import useBibleTextSize from '@/stores/BibleTextSizeStore'

export function TextSizeAdjuster() {
  const { increaseTextSize, decreaseTextSize } = useBibleTextSize()

  return (
    <div className="fixed bottom-20 right-3 flex gap-x-2">
      <button
        className="h-10 w-10 rounded-full border-4 border-[#0276F9] border-opacity-60 bg-[#A7D2FF] bg-opacity-60 text-2xl font-bold leading-none text-[#0276F9] text-opacity-60"
        onClick={() => increaseTextSize()}
      >
        +
      </button>
      <button
        className="h-10 w-10 rounded-full border-4 border-[#AAA] border-opacity-60 bg-[#CCC] bg-opacity-60 text-2xl font-bold leading-none text-[#AAA] text-opacity-60"
        onClick={() => decreaseTextSize()}
      >
        -
      </button>
    </div>
  )
}
