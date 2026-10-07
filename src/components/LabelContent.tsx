import clsx from 'clsx'
import { useLayoutEffect, useRef, useState } from 'react'
import { baseFontSize, findFittingScale } from '../lib/fitText'
import type { LabelLine } from '../lib/labelLines'

type LabelContentProps = {
  lines: LabelLine[]
  labelHeight: number
  /** 文字を小さくしても収まらなかったかどうかを知らせる */
  onFitChange: (fits: boolean) => void
}

/** ラベル1枚分の宛名。はみ出すときは、収まるまで文字を小さくする。 */
export function LabelContent({ lines, labelHeight, onFitChange }: LabelContentProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const fontSize = baseFontSize(labelHeight)

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    function measure(element: HTMLDivElement) {
      const result = findFittingScale((candidate) => {
        // 収まるかどうかは実際に描画しないとわからないため、一時的に大きさを変えて測る
        element.style.fontSize = `${fontSize * candidate}mm`
        return (
          element.scrollHeight <= element.clientHeight && element.scrollWidth <= element.clientWidth
        )
      })
      // React は倍率が前回と同じだと style を付け直さないため、測った結果をここで直接反映しておく
      element.style.fontSize = `${fontSize * result.scale}mm`
      setScale(result.scale)
      onFitChange(result.fits)
    }

    measure(container)
    // フォントの読み込みが終わると文字の幅が変わるため、測り直す
    let cancelled = false
    document.fonts?.ready.then(() => {
      if (!cancelled) {
        measure(container)
      }
    })
    return () => {
      cancelled = true
    }
  }, [lines, fontSize, onFitChange])

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full flex-col justify-center overflow-hidden leading-snug"
      style={{ fontSize: `${fontSize * scale}mm`, padding: '2.5mm 4mm' }}
    >
      {lines.map((line, index) => (
        <p
          key={index}
          className={clsx(
            'whitespace-nowrap',
            line.kind === 'name' && 'mt-[0.3em] pl-[1em] text-[1.25em] font-bold',
          )}
        >
          {line.text}
        </p>
      ))}
    </div>
  )
}
