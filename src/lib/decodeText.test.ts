import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { decodeText } from './decodeText'

function readSample(fileName: string): Uint8Array {
  return new Uint8Array(readFileSync(resolve('samples', fileName)))
}

describe('decodeText', () => {
  it('UTF-8 のCSVを読める', () => {
    const result = decodeText(readSample('sample-utf8.csv'))

    expect(result.encoding).toBe('UTF-8')
    expect(result.text).toContain('見本商事株式会社')
  })

  it('Shift_JIS のCSVを、UTF-8 と同じ内容で読める', () => {
    const result = decodeText(readSample('sample-sjis.csv'))

    expect(result.encoding).toBe('Shift_JIS')
    expect(result.text).toBe(decodeText(readSample('sample-utf8.csv')).text)
  })

  it('先頭のBOMを取り除く', () => {
    const bytes = new Uint8Array([0xef, 0xbb, 0xbf, ...new TextEncoder().encode('郵便番号')])

    expect(decodeText(bytes).text).toBe('郵便番号')
  })

  it('どちらの文字コードとも判定できなければ例外を投げる', () => {
    const utf16Bytes = new Uint8Array([0xff, 0xfe, 0x0f, 0x90, 0xd8, 0x4f])

    expect(() => decodeText(utf16Bytes)).toThrow('文字コードを判定できませんでした')
  })
})
