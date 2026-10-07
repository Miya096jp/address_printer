import { describe, expect, it } from 'vitest'
import type { SheetLayout } from './labelLayouts'
import { calculateLabelPositions, paginate } from './sheetLayout'

const layout: SheetLayout = {
  columns: 2,
  rows: 2,
  labelWidth: 80,
  labelHeight: 40,
  marginTop: 10,
  marginLeft: 20,
  gapX: 5,
  gapY: 3,
}

describe('calculateLabelPositions', () => {
  it('左上から右へ、段ごとに並べる', () => {
    expect(calculateLabelPositions(layout)).toEqual([
      { x: 20, y: 10, width: 80, height: 40 },
      { x: 105, y: 10, width: 80, height: 40 },
      { x: 20, y: 53, width: 80, height: 40 },
      { x: 105, y: 53, width: 80, height: 40 },
    ])
  })

  it('微調整の分だけ、すべてのラベルをずらす', () => {
    const positions = calculateLabelPositions(layout, { x: -0.5, y: 1.5 })

    expect(positions[0]).toMatchObject({ x: 19.5, y: 11.5 })
    expect(positions[3]).toMatchObject({ x: 104.5, y: 54.5 })
  })
})

describe('paginate', () => {
  it('用紙1枚に入る数ごとに分け、余った場所は null にする', () => {
    expect(paginate(['a', 'b', 'c', 'd', 'e'], 4)).toEqual([
      ['a', 'b', 'c', 'd'],
      ['e', null, null, null],
    ])
  })

  it('開始位置を指定すると、1枚目はその位置から詰める', () => {
    expect(paginate(['a', 'b', 'c'], 4, 3)).toEqual([
      [null, null, 'a', 'b'],
      ['c', null, null, null],
    ])
  })

  it('50件以上でも、正しく複数枚に分ける', () => {
    const items = Array.from({ length: 53 }, (_, index) => index)
    const sheets = paginate(items, 12)

    expect(sheets).toHaveLength(5)
    expect(sheets.flat().filter((item) => item !== null)).toEqual(items)
  })

  it('宛先がなければ用紙もない', () => {
    expect(paginate([], 12)).toEqual([])
  })

  it('範囲外の開始位置は、用紙の中に収める', () => {
    expect(paginate(['a'], 2, 0)).toEqual([['a', null]])
    expect(paginate(['a'], 2, 99)).toEqual([[null, 'a']])
  })
})
