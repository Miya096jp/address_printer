import { describe, expect, it } from 'vitest'
import { a4Paper, findLayoutProblems, labelProducts, type SheetLayout } from './labelLayouts'

const twelveUp = labelProducts.find((product) => product.id === 'a4-12')!.layout

describe('labelProducts', () => {
  it.each(labelProducts.map((product) => [product.name, product.layout] as const))(
    '%s は A4 に収まり、入力チェックで問題にならない',
    (_name, layout) => {
      expect(findLayoutProblems(layout)).toEqual([])
    },
  )

  it('ID が重複していない', () => {
    const ids = labelProducts.map((product) => product.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('findLayoutProblems', () => {
  it('用紙からはみ出す寸法を知らせる', () => {
    const layout: SheetLayout = { ...twelveUp, marginLeft: 40 }

    expect(findLayoutProblems(layout)).toEqual([expect.stringContaining('はみ出します')])
  })

  it('ちょうど用紙の端までなら問題にしない', () => {
    const layout: SheetLayout = { ...twelveUp, marginLeft: a4Paper.width - 2 * 86.4 }

    expect(findLayoutProblems(layout)).toEqual([])
  })

  it('列数や行数が整数でなければ知らせる', () => {
    expect(findLayoutProblems({ ...twelveUp, columns: 1.5 })).toEqual([
      expect.stringContaining('列数'),
    ])
  })

  it('未入力（NaN）の値を知らせる', () => {
    expect(findLayoutProblems({ ...twelveUp, labelWidth: Number.NaN, gapY: Number.NaN })).toEqual([
      expect.stringContaining('幅と高さ'),
      expect.stringContaining('間隔'),
    ])
  })
})
