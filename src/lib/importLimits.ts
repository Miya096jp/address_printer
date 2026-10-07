// 想定外に大きなファイルを読み込むと、ブラウザが固まってしまうため上限を設ける。
// 年賀状や発送の宛名としては十分な量にしている。
export const maxFileSizeBytes = 5 * 1024 * 1024
export const maxAddressRows = 2000
