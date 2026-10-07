// Excelで入力された郵便番号は、全角数字やさまざまな横棒が混ざりやすい。
// NFKC正規化で全角を半角に直したうえで、横棒として使われがちな文字を許容する。
const postalCodePattern = /^〒?\s*(\d{3})\s*[-‐−–—―ー]?\s*(\d{4})$/

/**
 * 郵便番号を「〒123-4567」の形にそろえる。
 * 7桁の郵便番号として読めないときは undefined を返す。
 */
export function formatPostalCode(raw: string): string | undefined {
  const normalized = raw.normalize('NFKC').trim()
  const match = postalCodePattern.exec(normalized)
  if (!match) {
    return undefined
  }
  const [, firstPart, secondPart] = match
  return `〒${firstPart}-${secondPart}`
}
