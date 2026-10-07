import { describe, expect, it } from 'vitest'
import { resolveHonorific } from './honorific'

const blank = { name: '', company: '', department: '', honorific: '' }

describe('resolveHonorific', () => {
  it('氏名があれば、氏名の後ろに「様」を付ける', () => {
    expect(resolveHonorific({ ...blank, name: '山田 太郎', company: '架空商事' })).toEqual({
      text: '様',
      placement: 'afterName',
    })
  })

  it('会社名だけなら、最後の行に「御中」を付ける', () => {
    expect(resolveHonorific({ ...blank, company: '架空商事' })).toEqual({
      text: '御中',
      placement: 'afterLastLine',
    })
  })

  it('部署名だけでも「御中」を付ける', () => {
    expect(resolveHonorific({ ...blank, department: '総務部' })).toEqual({
      text: '御中',
      placement: 'afterLastLine',
    })
  })

  it('敬称の列に値があれば、それを優先する', () => {
    expect(resolveHonorific({ ...blank, name: '山田 太郎', honorific: '先生' })).toEqual({
      text: '先生',
      placement: 'afterName',
    })
  })

  it('氏名がなく敬称の列に値があれば、最後の行に付ける', () => {
    expect(resolveHonorific({ ...blank, company: '架空商事', honorific: '各位' })).toEqual({
      text: '各位',
      placement: 'afterLastLine',
    })
  })

  it('空白だけの値は、空として扱う', () => {
    expect(resolveHonorific({ ...blank, name: '　', company: '架空商事', honorific: ' ' })).toEqual(
      { text: '御中', placement: 'afterLastLine' },
    )
  })

  it('宛名が何もなければ、敬称を付けない', () => {
    expect(resolveHonorific(blank)).toEqual({ text: '', placement: 'none' })
  })
})
