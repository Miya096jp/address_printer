import type { SheetLayout } from './labelLayouts'

/** 印刷位置の微調整。プリンタごとのずれを打ち消すために使う。単位はmm、右と下が正。 */
export type PrintOffset = {
  x: number
  y: number
}

/** 用紙の左上を原点とした、ラベル1枚の位置と大きさ（mm） */
export type LabelPosition = {
  x: number
  y: number
  width: number
  height: number
}

/**
 * 用紙1枚に並ぶラベルの位置を、左上から右へ、段ごとに順に返す。
 */
export function calculateLabelPositions(
  layout: SheetLayout,
  offset: PrintOffset = { x: 0, y: 0 },
): LabelPosition[] {
  const positions: LabelPosition[] = []
  for (let row = 0; row < layout.rows; row++) {
    for (let column = 0; column < layout.columns; column++) {
      positions.push({
        x: layout.marginLeft + column * (layout.labelWidth + layout.gapX) + offset.x,
        y: layout.marginTop + row * (layout.labelHeight + layout.gapY) + offset.y,
        width: layout.labelWidth,
        height: layout.labelHeight,
      })
    }
  }
  return positions
}

/** 用紙1枚分のラベル。印刷しない場所は null。 */
export type Sheet<T> = (T | null)[]

/**
 * 宛先を用紙ごとに分ける。
 * 使いかけの用紙に印刷できるよう、1枚目は startPosition 番目（1始まり）のラベルから詰める。
 */
export function paginate<T>(items: T[], labelsPerSheet: number, startPosition = 1): Sheet<T>[] {
  if (items.length === 0) {
    return []
  }

  const skippedCount = Math.min(Math.max(startPosition, 1), labelsPerSheet) - 1
  const slots: (T | null)[] = [...Array<null>(skippedCount).fill(null), ...items]

  const sheets: Sheet<T>[] = []
  for (let start = 0; start < slots.length; start += labelsPerSheet) {
    const sheet = slots.slice(start, start + labelsPerSheet)
    const emptyCount = labelsPerSheet - sheet.length
    sheets.push([...sheet, ...Array<null>(emptyCount).fill(null)])
  }
  return sheets
}
