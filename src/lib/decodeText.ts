import Encoding from 'encoding-japanese'

export type TextEncodingName = 'UTF-8' | 'Shift_JIS'

export type DecodedText = {
  text: string
  encoding: TextEncodingName
}

/**
 * ファイルの中身を文字列に直す。UTF-8 と Shift_JIS を自動で判定する。
 * Excelの「CSV（コンマ区切り）」で保存すると Shift_JIS になるため、両方に対応している。
 * どちらとも判定できないときは例外を投げる。
 */
export function decodeText(bytes: Uint8Array): DecodedText {
  const detected = Encoding.detect(bytes, ['UTF8', 'SJIS'])

  if (detected === 'UTF8') {
    // TextDecoder は先頭のBOMを自動で取り除く
    return { text: new TextDecoder('utf-8').decode(bytes), encoding: 'UTF-8' }
  }
  if (detected === 'SJIS') {
    // ブラウザの shift_jis は、Excelが使う Windows-31J（機種依存文字を含む）として読む
    return { text: new TextDecoder('shift_jis').decode(bytes), encoding: 'Shift_JIS' }
  }
  throw new Error(
    '文字コードを判定できませんでした。UTF-8 か Shift_JIS で保存したCSVファイルを選んでください。',
  )
}
