import { describe, expect, it } from 'vitest'
import { createEmptyAddress, type Address } from './address'
import { buildLabelLines } from './labelLines'

function address(fields: Partial<Address>): Address {
  return { ...createEmptyAddress(), ...fields }
}

describe('buildLabelLines', () => {
  it('郵便番号 → 住所1 → 住所2 → 会社名 → 部署名・役職 → 氏名＋敬称 の順に並べる', () => {
    const lines = buildLabelLines(
      address({
        postalCode: '1000000',
        address1: '架空県架空市中央1-2-3',
        address2: '架空ビル5階',
        company: '架空商事株式会社',
        department: '営業部',
        title: '部長',
        name: '山田 太郎',
      }),
    )

    expect(lines).toEqual([
      { kind: 'postalCode', text: '〒100-0000' },
      { kind: 'address', text: '架空県架空市中央1-2-3' },
      { kind: 'address', text: '架空ビル5階' },
      { kind: 'organization', text: '架空商事株式会社' },
      { kind: 'organization', text: '営業部 部長' },
      { kind: 'name', text: '山田 太郎 様' },
    ])
  })

  it('空の項目は行にしない', () => {
    const lines = buildLabelLines(
      address({ postalCode: '1000000', address1: '架空市1-1', name: '山田 太郎' }),
    )

    expect(lines.map((line) => line.text)).toEqual(['〒100-0000', '架空市1-1', '山田 太郎 様'])
  })

  it('氏名がなければ、最後の行（部署名）に「御中」を付ける', () => {
    const lines = buildLabelLines(
      address({ address1: '架空市1-1', company: '架空商事株式会社', department: '総務部' }),
    )

    expect(lines.at(-1)).toEqual({ kind: 'organization', text: '総務部 御中' })
  })

  it('部署名がなく役職だけでも、1行にまとめる', () => {
    const lines = buildLabelLines(address({ title: '代表取締役', name: '山田 太郎' }))

    expect(lines.map((line) => line.text)).toEqual(['代表取締役', '山田 太郎 様'])
  })

  it('郵便番号として読めない値は表示しない', () => {
    const lines = buildLabelLines(address({ postalCode: '不明', name: '山田 太郎' }))

    expect(lines.map((line) => line.text)).toEqual(['山田 太郎 様'])
  })
})
