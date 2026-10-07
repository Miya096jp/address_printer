import { Sparkles, Trash2 } from 'lucide-react'

type AddressBookActionsProps = {
  hasInput: boolean
  onInsertSample: () => void
  onClear: () => void
}

export function AddressBookActions({ hasInput, onInsertSample, onClear }: AddressBookActionsProps) {
  function confirmAndClear() {
    if (window.confirm('入力した住所録をすべて消去します。よろしいですか？')) {
      onClear()
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button type="button" className="button-secondary" onClick={onInsertSample}>
        <Sparkles aria-hidden="true" className="size-5" />
        サンプルを入れてみる
      </button>
      <button
        type="button"
        className="button-secondary"
        disabled={!hasInput}
        onClick={confirmAndClear}
      >
        <Trash2 aria-hidden="true" className="size-5" />
        すべて消去
      </button>
    </div>
  )
}
