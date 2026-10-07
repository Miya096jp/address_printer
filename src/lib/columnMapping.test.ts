import { describe, expect, it } from 'vitest'
import { createEmptyMapping, findMappingProblems, guessColumnMapping } from './columnMapping'

describe('guessColumnMapping', () => {
  it('ひな形と同じ列名は、そのまま対応づける', () => {
    const headers = [
      '郵便番号',
      '住所1',
      '住所2（建物名など）',
      '会社名',
      '部署名',
      '役職',
      '氏名',
      '敬称',
    ]

    expect(guessColumnMapping(headers)).toEqual({
      postalCode: 0,
      address1: 1,
      address2: 2,
      company: 3,
      department: 4,
      title: 5,
      name: 6,
      honorific: 7,
    })
  })

  it('よくある別の列名からも推定する', () => {
    const headers = ['お名前', '〒', '所在地', '建物名', '社名', '所属部署', '肩書']

    expect(guessColumnMapping(headers)).toEqual({
      ...createEmptyMapping(),
      name: 0,
      postalCode: 1,
      address1: 2,
      address2: 3,
      company: 4,
      department: 5,
      title: 6,
    })
  })

  it('「住所」と「住所２」を取り違えない', () => {
    const headers = ['住所２', '住所']

    expect(guessColumnMapping(headers)).toMatchObject({ address1: 1, address2: 0 })
  })

  it('推定できない列は対応づけない', () => {
    expect(guessColumnMapping(['メモ', '電話番号'])).toEqual(createEmptyMapping())
  })

  it('1つの列を2つの項目に対応づけない', () => {
    // 「担当者名」は氏名だが、会社名の言葉は含まないことを確かめる
    const mapping = guessColumnMapping(['会社名', '担当者名'])

    expect(mapping).toMatchObject({ company: 0, name: 1 })
  })
})

describe('findMappingProblems', () => {
  it('住所1と宛名があれば問題はない', () => {
    expect(findMappingProblems({ ...createEmptyMapping(), address1: 0, company: 1 })).toEqual([])
  })

  it('住所1も宛名もなければ、両方を知らせる', () => {
    expect(findMappingProblems(createEmptyMapping())).toHaveLength(2)
  })
})
