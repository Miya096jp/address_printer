import { addressFields, createEmptyAddress, type Address } from './address'
import type { ColumnMapping } from './columnMapping'
import { formatPostalCode } from './postalCode'

export type ImportedAddress = {
  /** 元の表での行番号（見出しを1行目とする）。一覧での識別とエラー表示に使う。 */
  rowNumber: number
  address: Address
}

export type ImportError = {
  rowNumber: number
  message: string
}

export type ImportResult = {
  addresses: ImportedAddress[]
  errors: ImportError[]
}

/**
 * 表のデータ行を、列の対応づけに従って住所録に変換する。
 * 問題のある行は取り込まず、行番号付きのエラーとして返す。
 */
export function importAddresses(rows: string[][], mapping: ColumnMapping): ImportResult {
  const addresses: ImportedAddress[] = []
  const errors: ImportError[] = []

  rows.forEach((row, index) => {
    // 見出しが1行目なので、データの1件目は2行目になる
    const rowNumber = index + 2
    const address = readAddress(row, mapping)
    const problem = findAddressProblem(address)

    if (problem) {
      errors.push({ rowNumber, message: problem })
    } else {
      addresses.push({ rowNumber, address })
    }
  })

  return { addresses, errors }
}

function readAddress(row: string[], mapping: ColumnMapping): Address {
  const address = createEmptyAddress()
  for (const field of addressFields) {
    const columnIndex = mapping[field]
    address[field] = columnIndex === undefined ? '' : (row[columnIndex] ?? '').trim()
  }
  return address
}

function findAddressProblem(address: Address): string | undefined {
  if (address.postalCode !== '' && formatPostalCode(address.postalCode) === undefined) {
    return `郵便番号「${address.postalCode}」を読み取れません。7桁の数字で入力してください。`
  }
  if (address.address1 === '') {
    return '住所1が空です。'
  }
  if (address.name === '' && address.company === '' && address.department === '') {
    return '宛名（氏名・会社名・部署名のどれか）が空です。'
  }
  return undefined
}
