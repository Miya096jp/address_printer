import { describe, expect, it } from 'vitest'
import { maxAddressRows } from './importLimits'
import { parseTable } from './parseTable'

describe('parseTable', () => {
  it('CSVを見出しとデータ行に分ける', () => {
    const table = parseTable('郵便番号,氏名\n100-0001,山田 太郎\n100-0002,佐藤 花子\n')

    expect(table).toEqual({
      headers: ['郵便番号', '氏名'],
      rows: [
        ['100-0001', '山田 太郎'],
        ['100-0002', '佐藤 花子'],
      ],
    })
  })

  it('Excelからコピーしたタブ区切りの表を読める', () => {
    const table = parseTable('郵便番号\t会社名\r\n100-0001\t見本商事株式会社, 本社\r\n')

    expect(table.rows).toEqual([['100-0001', '見本商事株式会社, 本社']])
  })

  it('引用符で囲まれたセルの中の改行や引用符を読める', () => {
    const table = parseTable('住所2,氏名\n"見本ビル\n5階","山田 ""タロウ"""\n')

    expect(table.rows).toEqual([['見本ビル\n5階', '山田 "タロウ"']])
  })

  it('空の行は読み飛ばす', () => {
    const table = parseTable('氏名\n山田 太郎\n\n,\n佐藤 花子\n')

    expect(table.rows).toEqual([['山田 太郎'], ['佐藤 花子']])
  })

  it('空のデータは例外を投げる', () => {
    expect(() => parseTable('  \n')).toThrow('データが空です')
  })

  it('上限を超える行数は例外を投げる', () => {
    const text = ['氏名', ...Array.from({ length: maxAddressRows + 1 }, () => '山田')].join('\n')

    expect(() => parseTable(text)).toThrow(`${maxAddressRows}件まで`)
  })
})
