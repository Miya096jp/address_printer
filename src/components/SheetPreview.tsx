import clsx from 'clsx'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ImportedAddress } from '../lib/importAddresses'
import { a4Paper, type SheetLayout } from '../lib/labelLayouts'
import { buildLabelLines } from '../lib/labelLines'
import { calculateLabelPositions, paginate, type PrintOffset } from '../lib/sheetLayout'
import { LabelContent } from './LabelContent'

type SheetPreviewProps = {
  addresses: ImportedAddress[]
  layout: SheetLayout
  offset: PrintOffset
  startPosition: number
  showBorders: boolean
  onFitChange: (rowNumber: number, fits: boolean) => void
}

const pixelsPerMillimeter = 96 / 25.4

/**
 * 用紙1枚ごとのプレビュー。印刷するときも、この要素をそのまま原寸で使う。
 * 画面では、表示幅に合わせて縮小して見せる。
 */
export function SheetPreview({
  addresses,
  layout,
  offset,
  startPosition,
  showBorders,
  onFitChange,
}: SheetPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scale = useScaleToFit(containerRef, a4Paper.width * pixelsPerMillimeter)
  const positions = calculateLabelPositions(layout, offset)
  const sheets = paginate(addresses, positions.length, startPosition)

  return (
    <div ref={containerRef} className="space-y-4 print:space-y-0">
      {sheets.map((sheet, sheetIndex) => (
        <div
          key={sheetIndex}
          className="sheet-page overflow-hidden print:!h-auto print:!w-auto print:overflow-visible"
          style={{
            width: `${a4Paper.width * scale}mm`,
            height: `${a4Paper.height * scale}mm`,
          }}
        >
          <p className="sr-only print:hidden">
            {sheetIndex + 1}枚目（全{sheets.length}枚）
          </p>
          <div
            className="relative origin-top-left overflow-hidden bg-white shadow-md print:!transform-none print:shadow-none"
            style={{
              width: `${a4Paper.width}mm`,
              height: `${a4Paper.height}mm`,
              transform: `scale(${scale})`,
            }}
          >
            {sheet.map((imported, slotIndex) => (
              <div
                key={slotIndex}
                className={clsx(
                  'absolute',
                  showBorders
                    ? 'border-ink-muted border-[0.2mm]'
                    : 'outline-paper-line outline outline-dashed print:outline-none',
                )}
                style={{
                  left: `${positions[slotIndex].x}mm`,
                  top: `${positions[slotIndex].y}mm`,
                  width: `${positions[slotIndex].width}mm`,
                  height: `${positions[slotIndex].height}mm`,
                }}
              >
                {imported && (
                  <FittedLabel
                    imported={imported}
                    labelHeight={layout.labelHeight}
                    onFitChange={onFitChange}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

type FittedLabelProps = {
  imported: ImportedAddress
  labelHeight: number
  onFitChange: (rowNumber: number, fits: boolean) => void
}

function FittedLabel({ imported, labelHeight, onFitChange }: FittedLabelProps) {
  const { rowNumber, address } = imported
  // 測り直しは重いので、住所が変わらない限り同じ配列を渡し、無駄な測り直しを避ける
  const lines = useMemo(() => buildLabelLines(address), [address])
  const handleFitChange = useCallback(
    (fits: boolean) => onFitChange(rowNumber, fits),
    [onFitChange, rowNumber],
  )
  return <LabelContent lines={lines} labelHeight={labelHeight} onFitChange={handleFitChange} />
}

/** 要素の幅に収まるよう、原寸の幅（px）をどれだけ縮小するかを返す。1より大きくはしない。 */
function useScaleToFit(containerRef: React.RefObject<HTMLElement | null>, naturalWidth: number) {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }
    const observer = new ResizeObserver(([entry]) => {
      setScale(Math.min(entry.contentRect.width / naturalWidth, 1))
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [containerRef, naturalWidth])

  return scale
}
