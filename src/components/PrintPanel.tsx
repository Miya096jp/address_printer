import { Info, Printer } from 'lucide-react'

type PrintPanelProps = {
  labelCount: number
  sheetCount: number
  disabledReason: string | undefined
}

export function PrintPanel({ labelCount, sheetCount, disabledReason }: PrintPanelProps) {
  return (
    <div className="space-y-4">
      <div className="border-paper-line bg-paper flex gap-3 rounded-md border p-4">
        <Info aria-hidden="true" className="text-ink-muted mt-1 size-5 shrink-0" />
        <p>
          印刷画面で、倍率を<strong>100%</strong>、余白を<strong>「なし」</strong>
          に設定してください。はじめに普通紙で試し刷りをして、位置を確認することをおすすめします。
        </p>
      </div>
      {disabledReason ? (
        <p className="font-bold">{disabledReason}</p>
      ) : (
        <p>
          {labelCount}件の宛名を、用紙{sheetCount}枚に印刷します。
        </p>
      )}
      <button
        type="button"
        className="button-primary w-full py-3 text-lg"
        disabled={disabledReason !== undefined}
        onClick={() => window.print()}
      >
        <Printer aria-hidden="true" className="size-6" />
        印刷する
      </button>
    </div>
  )
}
