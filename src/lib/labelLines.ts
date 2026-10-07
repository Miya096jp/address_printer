import type { Address } from './address'
import { resolveHonorific } from './honorific'
import { formatPostalCode } from './postalCode'

export type LabelLineKind = 'postalCode' | 'address' | 'organization' | 'name'

export type LabelLine = {
  kind: LabelLineKind
  text: string
}

/**
 * ラベルに印刷する行を、上から順に組み立てる。
 * 並び：郵便番号 → 住所1 → 住所2 → 会社名 → 部署名・役職 → 氏名＋敬称
 * 空の項目は行にしない。
 */
export function buildLabelLines(address: Address): LabelLine[] {
  const postalCode = formatPostalCode(address.postalCode)
  const departmentAndTitle = joinWithSpace(address.department, address.title)

  const lines: LabelLine[] = [
    { kind: 'postalCode', text: postalCode ?? '' },
    { kind: 'address', text: address.address1.trim() },
    { kind: 'address', text: address.address2.trim() },
    { kind: 'organization', text: address.company.trim() },
    { kind: 'organization', text: departmentAndTitle },
    { kind: 'name', text: address.name.trim() },
  ].filter((line): line is LabelLine => line.text !== '')

  return appendHonorific(lines, address)
}

function appendHonorific(lines: LabelLine[], address: Address): LabelLine[] {
  const honorific = resolveHonorific(address)
  if (honorific.placement === 'none') {
    return lines
  }

  // 氏名の行は常に最後に来るので、「様」も「御中」も最後の行に付ければよい。
  // ただし宛先（会社名・部署名・氏名）がなく住所だけのときは、住所に敬称を付けない。
  const lastLine = lines.at(-1)
  if (!lastLine || lastLine.kind === 'postalCode' || lastLine.kind === 'address') {
    return lines
  }
  return [...lines.slice(0, -1), { ...lastLine, text: `${lastLine.text} ${honorific.text}` }]
}

function joinWithSpace(...parts: string[]): string {
  return parts
    .map((part) => part.trim())
    .filter((part) => part !== '')
    .join(' ')
}
