/** 用紙1枚の上に、ラベルがどう並んでいるか。寸法はすべてmm。 */
export type SheetLayout = {
  columns: number
  rows: number
  labelWidth: number
  labelHeight: number
  /** 用紙の上端から、1段目のラベルの上端まで */
  marginTop: number
  /** 用紙の左端から、1列目のラベルの左端まで */
  marginLeft: number
  /** 横に隣り合うラベルどうしの間隔 */
  gapX: number
  /** 縦に隣り合うラベルどうしの間隔 */
  gapY: number
}

export type LabelProduct = {
  id: string
  name: string
  /** 同じレイアウトの市販品の例（画面での案内用） */
  compatibleProducts: string[]
  layout: SheetLayout
}

export const a4Paper = { width: 210, height: 297 }

// 市販品のレイアウト。新しい用紙を使えるようにするには、ここに1件追加すればよい。
// 寸法の出典は README の「ラベル寸法の出典」に書いている。
export const labelProducts: LabelProduct[] = [
  {
    id: 'a4-12',
    name: 'A4 12面（86.4×42.3mm）',
    compatibleProducts: ['エーワン 72212', 'ヒサゴ ELM008', 'コクヨ KPC-E1121'],
    layout: {
      columns: 2,
      rows: 6,
      labelWidth: 86.4,
      labelHeight: 42.3,
      marginTop: 21.2,
      marginLeft: 18.6,
      gapX: 0,
      gapY: 0,
    },
  },
  {
    id: 'a4-24',
    name: 'A4 24面（66×33.9mm）',
    compatibleProducts: ['エーワン 72224', 'ヒサゴ ELM012'],
    layout: {
      columns: 3,
      rows: 8,
      labelWidth: 66,
      labelHeight: 33.9,
      marginTop: 12.9,
      marginLeft: 6,
      gapX: 0,
      gapY: 0,
    },
  },
]

/**
 * カスタム寸法の入力に問題があれば、利用者に見せる文言で返す。問題がなければ空の配列。
 */
export function findLayoutProblems(layout: SheetLayout): string[] {
  const problems: string[] = []

  if (!isWholeNumberBetween(layout.columns, 1, 10) || !isWholeNumberBetween(layout.rows, 1, 20)) {
    problems.push('列数は1〜10、行数は1〜20の整数で入力してください。')
  }
  if (!(layout.labelWidth > 0) || !(layout.labelHeight > 0)) {
    problems.push('ラベルの幅と高さは、0より大きい値を入力してください。')
  }
  if (!(layout.marginTop >= 0) || !(layout.marginLeft >= 0)) {
    problems.push('余白は0以上の値を入力してください。')
  }
  if (!(layout.gapX >= 0) || !(layout.gapY >= 0)) {
    problems.push('ラベルどうしの間隔は0以上の値を入力してください。')
  }
  if (problems.length > 0) {
    return problems
  }

  const { width, height } = occupiedSize(layout)
  if (width > a4Paper.width || height > a4Paper.height) {
    problems.push(
      `ラベルが用紙からはみ出します（使う範囲：幅${round(width)}mm × 高さ${round(height)}mm、A4：幅${a4Paper.width}mm × 高さ${a4Paper.height}mm）。`,
    )
  }
  return problems
}

/** 用紙の左上の角から、いちばん右下のラベルの角までの大きさ */
function occupiedSize(layout: SheetLayout): { width: number; height: number } {
  return {
    width:
      layout.marginLeft + layout.columns * layout.labelWidth + (layout.columns - 1) * layout.gapX,
    height: layout.marginTop + layout.rows * layout.labelHeight + (layout.rows - 1) * layout.gapY,
  }
}

function isWholeNumberBetween(value: number, min: number, max: number): boolean {
  return Number.isInteger(value) && value >= min && value <= max
}

function round(value: number): number {
  return Math.round(value * 10) / 10
}
