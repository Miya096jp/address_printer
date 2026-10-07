import { describe, expect, it } from 'vitest'
import { baseFontSize, findFittingScale } from './fitText'

describe('findFittingScale', () => {
  it('そのままで収まるなら、縮小しない', () => {
    expect(findFittingScale(() => true)).toEqual({ scale: 1, fits: true })
  })

  it('収まるところまで、少しずつ小さくする', () => {
    const triedScales: number[] = []
    const result = findFittingScale((scale) => {
      triedScales.push(scale)
      return scale <= 0.85
    })

    expect(result).toEqual({ scale: 0.85, fits: true })
    expect(triedScales).toEqual([1, 0.95, 0.9, 0.85])
  })

  it('いちばん小さくしても収まらなければ、その倍率で fits: false を返す', () => {
    expect(findFittingScale(() => false)).toEqual({ scale: 0.6, fits: false })
  })

  it('最小の倍率ちょうどで収まる場合は fits: true', () => {
    expect(findFittingScale((scale) => scale <= 0.6)).toEqual({ scale: 0.6, fits: true })
  })
})

describe('baseFontSize', () => {
  it('ラベルの高さに合わせて大きさを決める', () => {
    expect(baseFontSize(36)).toBe(4)
  })

  it('大きいラベルでも、上限より大きくしない', () => {
    expect(baseFontSize(42.3)).toBe(4.2)
  })

  it('小さいラベルでも、下限より小さくしない', () => {
    expect(baseFontSize(17)).toBe(2.6)
  })
})
