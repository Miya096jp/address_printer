import { Lock } from 'lucide-react'

export function PrivacyNotice() {
  return (
    <aside
      aria-label="データの扱いについて"
      className="border-ink-muted/30 flex gap-3 rounded-lg border-2 bg-white px-5 py-4"
    >
      <Lock aria-hidden="true" className="text-ink-muted mt-1 size-5 shrink-0" />
      <div>
        <p className="font-bold">入力した内容は、外部に送信・保存されません。</p>
        <p>
          そのため、ページを閉じたり再読み込みしたりすると、内容は消えます。位置の調整などの設定も、ページを閉じると元に戻ります。
        </p>
      </div>
    </aside>
  )
}
