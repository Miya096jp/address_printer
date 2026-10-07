import { describe, expect, it } from 'vitest'
import { createSampleAddresses } from './sampleAddresses'
import { importAddresses } from './importAddresses'
import { addressFields } from './address'
import { createEmptyMapping } from './columnMapping'

describe('createSampleAddresses', () => {
  it('10件の架空の住所録を返す', () => {
    expect(createSampleAddresses()).toHaveLength(10)
  })

  it('取り込みのチェックで問題にならない内容になっている', () => {
    const rows = createSampleAddresses().map(({ address }) =>
      addressFields.map((field) => address[field]),
    )
    const mapping = createEmptyMapping()
    addressFields.forEach((field, index) => (mapping[field] = index))

    expect(importAddresses(rows, mapping).errors).toEqual([])
  })
})
