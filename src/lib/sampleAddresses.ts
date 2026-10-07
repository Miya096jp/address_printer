import { createEmptyAddress, type Address } from './address'
import type { ImportedAddress } from './importAddresses'

// 「サンプルを入れてみる」で使う架空の住所録。
// 実在しない県名（見本県）と、ありふれた架空の名前だけを使っている。
const samples: Partial<Address>[] = [
  {
    postalCode: '100-0001',
    address1: '見本県見本市中央1-2-3',
    address2: '見本ビル5階',
    company: '見本商事株式会社',
    department: '営業部',
    title: '部長',
    name: '山田 太郎',
  },
  { postalCode: '123-4567', address1: '見本県架空町本町2-10-4', name: '佐藤 花子' },
  {
    postalCode: '234-5678',
    address1: '見本県見本市北区青葉台3-1-15',
    address2: 'さくらハイツ201',
    name: '鈴木 一郎',
  },
  {
    postalCode: '345-6789',
    address1: '見本県架空郡みどり村大字見本1234',
    company: '株式会社サンプル工業',
    department: '総務部',
  },
  {
    postalCode: '456-7890',
    address1: '見本県見本市南区港町5-6-7',
    address2: '港ビルディング12階',
    company: '架空システム株式会社',
    department: '開発部',
    title: '課長',
    name: '高橋 健二',
  },
  { postalCode: '567-8901', address1: '見本県架空町栄町8-9', company: '一般社団法人見本協会' },
  {
    postalCode: '678-9012',
    address1: '見本県見本市東区桜通4-3-2',
    company: '見本医院',
    title: '院長',
    name: '田中 誠',
    honorific: '先生',
  },
  {
    // 文字の縮小を確かめられるよう、わざと長い宛先を入れている
    postalCode: '789-0123',
    address1: '見本県架空市大通西10丁目1番地',
    address2: '見本タワーオフィス棟 ノースウィング34階',
    company: '見本ホールディングス株式会社',
    department: '経営企画本部 グループ戦略推進部',
    title: 'シニアマネージャー',
    name: '渡辺 美咲',
  },
  { postalCode: '890-1234', address1: '見本県見本市西区若葉1-1-1', name: '伊藤 直子' },
  {
    postalCode: '901-2345',
    address1: '見本県架空町旭2-2-2',
    address2: 'コーポ見本 A棟 305',
    name: '小林 大輔',
  },
]

export function createSampleAddresses(): ImportedAddress[] {
  return samples.map((fields, index) => ({
    // 取り込んだ表と同じく、見出しを1行目とした行番号を振る
    rowNumber: index + 2,
    address: { ...createEmptyAddress(), ...fields },
  }))
}
