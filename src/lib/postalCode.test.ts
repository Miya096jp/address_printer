import { describe, expect, it } from 'vitest'
import { formatPostalCode } from './postalCode'

describe('formatPostalCode', () => {
  it.each([
    ['1234567', '〒123-4567'],
    ['123-4567', '〒123-4567'],
    ['〒123-4567', '〒123-4567'],
    ['〒 123-4567', '〒123-4567'],
    ['１２３－４５６７', '〒123-4567'],
    ['１２３ー４５６７', '〒123-4567'],
    ['123−4567', '〒123-4567'],
    ['  123-4567  ', '〒123-4567'],
  ])('「%s」を「%s」にそろえる', (raw, expected) => {
    expect(formatPostalCode(raw)).toBe(expected)
  })

  it.each(['', '123456', '12345678', '1234-567', 'abc-defg', '123-4567-8'])(
    '郵便番号として読めない「%s」は undefined を返す',
    (raw) => {
      expect(formatPostalCode(raw)).toBeUndefined()
    },
  )
})
