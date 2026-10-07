import { addressFieldLabels, addressFields, type AddressField } from './address'

/** 住所録の項目ごとに、表の何列目（0始まり）を使うか。使わない項目は undefined。 */
export type ColumnMapping = Record<AddressField, number | undefined>

// 列名に含まれていたら、その項目とみなす言葉。
// 「住所2」は「住所」を含むので、住所1より先に判定する必要がある。
// そのため、判定する順番どおりに並べている。
const keywordsByField: [AddressField, string[]][] = [
  ['postalCode', ['郵便', '〒', '郵便番号', 'zip', 'postal']],
  ['address2', ['住所2', '建物', 'ビル', 'マンション', '方書']],
  ['address1', ['住所1', '住所', '所在地']],
  ['honorific', ['敬称']],
  ['department', ['部署', '部門', '所属']],
  ['title', ['役職', '肩書']],
  ['company', ['会社', '社名', '法人', '企業', '団体', '組織']],
  ['name', ['氏名', '名前', '宛名', '担当者', 'name']],
]

/**
 * 表の見出しから、どの列がどの項目にあたるかを推定する。
 * ひな形と同じ列名なら、そのまま対応づける。
 * 1つの列は1つの項目にしか対応づけない。
 */
export function guessColumnMapping(headers: string[]): ColumnMapping {
  const normalizedHeaders = headers.map(normalizeHeader)
  const mapping = createEmptyMapping()
  const usedColumns = new Set<number>()

  function assign(field: AddressField, columnIndex: number) {
    mapping[field] = columnIndex
    usedColumns.add(columnIndex)
  }

  // まず、ひな形と完全に同じ列名を対応づける
  for (const field of addressFields) {
    const columnIndex = normalizedHeaders.indexOf(normalizeHeader(addressFieldLabels[field]))
    if (columnIndex !== -1 && !usedColumns.has(columnIndex)) {
      assign(field, columnIndex)
    }
  }

  // 残りは、列名に含まれる言葉から推定する
  for (const [field, keywords] of keywordsByField) {
    if (mapping[field] !== undefined) {
      continue
    }
    const columnIndex = normalizedHeaders.findIndex(
      (header, index) =>
        !usedColumns.has(index) && keywords.some((keyword) => header.includes(keyword)),
    )
    if (columnIndex !== -1) {
      assign(field, columnIndex)
    }
  }

  return mapping
}

/**
 * 対応づけで足りないものがあれば、利用者に見せる文言で返す。問題がなければ空の配列。
 */
export function findMappingProblems(mapping: ColumnMapping): string[] {
  const problems: string[] = []
  if (mapping.address1 === undefined) {
    problems.push('「住所1」にあたる列を選んでください。')
  }
  if (
    mapping.name === undefined &&
    mapping.company === undefined &&
    mapping.department === undefined
  ) {
    problems.push('「氏名」「会社名」「部署名」のどれか1つ以上にあたる列を選んでください。')
  }
  return problems
}

export function createEmptyMapping(): ColumnMapping {
  return {
    postalCode: undefined,
    address1: undefined,
    address2: undefined,
    company: undefined,
    department: undefined,
    title: undefined,
    name: undefined,
    honorific: undefined,
  }
}

// 全角・半角や大文字・小文字、空白の違いで推定が外れないようにそろえる
function normalizeHeader(header: string): string {
  return header.normalize('NFKC').toLowerCase().replace(/\s/g, '')
}
