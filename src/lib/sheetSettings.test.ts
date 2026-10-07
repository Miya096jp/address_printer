import { describe, expect, it } from 'vitest'
import { labelProducts } from './labelLayouts'
import { customProductId, defaultSheetSettings, resolveLayout } from './sheetSettings'

describe('resolveLayout', () => {
  it('市販品を選んでいれば、そのレイアウトを返す', () => {
    const settings = { ...defaultSheetSettings, productId: 'a4-24' }

    expect(resolveLayout(settings)).toEqual(labelProducts[1].layout)
  })

  it('カスタムを選んでいれば、入力した寸法を返す', () => {
    const customLayout = { ...defaultSheetSettings.customLayout, columns: 3 }
    const settings = { ...defaultSheetSettings, productId: customProductId, customLayout }

    expect(resolveLayout(settings)).toBe(customLayout)
  })
})
