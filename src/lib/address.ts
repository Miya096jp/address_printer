/** 住所録の1件分。取り込んだ文字列をそのまま持ち、整形はラベルを作るときに行う。 */
export type Address = {
  postalCode: string
  address1: string
  address2: string
  company: string
  department: string
  title: string
  name: string
  honorific: string
}

export const addressFields = [
  'postalCode',
  'address1',
  'address2',
  'company',
  'department',
  'title',
  'name',
  'honorific',
] as const satisfies readonly (keyof Address)[]

export type AddressField = (typeof addressFields)[number]

/** 画面やひな形CSVで使う列名 */
export const addressFieldLabels: Record<AddressField, string> = {
  postalCode: '郵便番号',
  address1: '住所1',
  address2: '住所2（建物名など）',
  company: '会社名',
  department: '部署名',
  title: '役職',
  name: '氏名',
  honorific: '敬称',
}

export function createEmptyAddress(): Address {
  return {
    postalCode: '',
    address1: '',
    address2: '',
    company: '',
    department: '',
    title: '',
    name: '',
    honorific: '',
  }
}
