import { labelProducts, type SheetLayout } from './labelLayouts'
import type { PrintOffset } from './sheetLayout'

export const customProductId = 'custom'

/** 「② 用紙を選ぶ」で設定する内容 */
export type SheetSettings = {
  /** labelProducts の id か、カスタム寸法なら customProductId */
  productId: string
  customLayout: SheetLayout
  offset: PrintOffset
  /** 何枚目のラベルから印刷するか（1始まり） */
  startPosition: number
  /** 普通紙での試し刷り用に、ラベルの枠線を印刷する */
  showBorders: boolean
}

export const defaultSheetSettings: SheetSettings = {
  productId: labelProducts[0].id,
  // カスタムを選んだときは、よく使われる12面の寸法を出発点にする
  customLayout: { ...labelProducts[0].layout },
  offset: { x: 0, y: 0 },
  startPosition: 1,
  showBorders: false,
}

export function resolveLayout(settings: SheetSettings): SheetLayout {
  if (settings.productId === customProductId) {
    return settings.customLayout
  }
  const product = labelProducts.find((candidate) => candidate.id === settings.productId)
  return product?.layout ?? labelProducts[0].layout
}
