import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { createEmptyMapping, guessColumnMapping } from './columnMapping'
import { decodeText } from './decodeText'
import { importAddresses } from './importAddresses'
import { parseTable } from './parseTable'

const mapping = { ...createEmptyMapping(), postalCode: 0, address1: 1, name: 2 }

describe('importAddresses', () => {
  it('対応づけに従って住所録に変換し、元の行番号を残す', () => {
    const result = importAddresses([['100-0001', ' 見本市1-1 ', '山田 太郎']], mapping)

    expect(result.errors).toEqual([])
    expect(result.addresses).toEqual([
      {
        rowNumber: 2,
        address: expect.objectContaining({
          postalCode: '100-0001',
          address1: '見本市1-1',
          name: '山田 太郎',
          company: '',
        }),
      },
    ])
  })

  it('問題のある行は取り込まず、行番号付きのエラーにする', () => {
    const result = importAddresses(
      [
        ['100-0001', '見本市1-1', '山田 太郎'],
        ['12345', '見本市1-2', '佐藤 花子'],
        ['100-0003', '', '鈴木 一郎'],
        ['100-0004', '見本市1-4', ''],
      ],
      mapping,
    )

    expect(result.addresses.map((imported) => imported.rowNumber)).toEqual([2])
    expect(result.errors).toEqual([
      { rowNumber: 3, message: expect.stringContaining('郵便番号「12345」') },
      { rowNumber: 4, message: '住所1が空です。' },
      { rowNumber: 5, message: expect.stringContaining('宛名') },
    ])
  })

  it('郵便番号が空の行は取り込む', () => {
    const result = importAddresses([['', '見本市1-1', '山田 太郎']], mapping)

    expect(result.addresses).toHaveLength(1)
  })

  it('列が足りない行も、空の項目として扱う', () => {
    const result = importAddresses([['100-0001', '見本市1-1']], {
      ...mapping,
      company: 5,
      name: undefined,
    })

    expect(result.errors).toEqual([{ rowNumber: 2, message: expect.stringContaining('宛名') }])
  })

  it('サンプルCSVを、文字コードの判定から通して取り込める', () => {
    for (const fileName of ['sample-utf8.csv', 'sample-sjis.csv']) {
      const { text } = decodeText(new Uint8Array(readFileSync(resolve('samples', fileName))))
      const table = parseTable(text)
      const result = importAddresses(table.rows, guessColumnMapping(table.headers))

      expect(result.errors).toEqual([])
      expect(result.addresses).toHaveLength(11)
    }
  })
})
