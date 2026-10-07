import Papa from 'papaparse'
import { maxAddressRows } from './importLimits'

export type ParsedTable = {
  headers: string[]
  /** 見出し行を除いたデータ行 */
  rows: string[][]
}

/**
 * CSV（カンマ区切り）や、Excelからコピーした表（タブ区切り）を読み取る。
 * 区切り文字は自動で判定する。1行目は見出しとして扱う。
 * 読み取れないときは、利用者に見せる文言で例外を投げる。
 */
export function parseTable(text: string): ParsedTable {
  if (text.trim() === '') {
    throw new Error('データが空です。')
  }

  const result = Papa.parse<string[]>(text.trim(), {
    delimitersToGuess: ['\t', ',', ';'],
    skipEmptyLines: 'greedy',
  })

  // 列が1つしかないと区切り文字を判定できないが、読み取り自体はできているので問題にしない
  const firstError = result.errors.find((error) => error.code !== 'UndetectableDelimiter')
  if (firstError) {
    const rowNumber = firstError.row === undefined ? '' : `${firstError.row + 1}行目：`
    throw new Error(`${rowNumber}表の形式を読み取れませんでした（${firstError.message}）`)
  }

  const [headers = [], ...rows] = result.data
  if (rows.length > maxAddressRows) {
    throw new Error(
      `一度に取り込めるのは${maxAddressRows}件までです（${rows.length}件ありました）。ファイルを分けてください。`,
    )
  }

  return { headers: headers.map((header) => header.trim()), rows }
}
