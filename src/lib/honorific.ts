import type { Address } from './address'

export type HonorificPlacement =
  /** 氏名の後ろに付ける（例：山田 太郎 様） */
  | 'afterName'
  /** 宛先の最後の行の後ろに付ける（例：営業部 御中） */
  | 'afterLastLine'
  /** 付けない */
  | 'none'

export type Honorific = {
  text: string
  placement: HonorificPlacement
}

/**
 * 敬称と、それを付ける位置を決める。
 * - 敬称の列に値があれば、それを優先する
 * - 氏名がある → 氏名の後ろに「様」
 * - 会社名や部署名だけ → 最後の行に「御中」
 */
export function resolveHonorific(
  address: Pick<Address, 'name' | 'company' | 'department' | 'honorific'>,
): Honorific {
  const hasName = address.name.trim() !== ''
  const hasOrganization = address.company.trim() !== '' || address.department.trim() !== ''
  const specifiedHonorific = address.honorific.trim()

  if (specifiedHonorific !== '') {
    return {
      text: specifiedHonorific,
      placement: hasName ? 'afterName' : 'afterLastLine',
    }
  }
  if (hasName) {
    return { text: '様', placement: 'afterName' }
  }
  if (hasOrganization) {
    return { text: '御中', placement: 'afterLastLine' }
  }
  return { text: '', placement: 'none' }
}
