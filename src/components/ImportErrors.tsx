import { AlertTriangle } from 'lucide-react'
import type { ImportError } from '../lib/importAddresses'

type ImportErrorsProps = {
  errors: ImportError[]
}

export function ImportErrors({ errors }: ImportErrorsProps) {
  if (errors.length === 0) {
    return null
  }
  return (
    <div className="border-vermilion bg-vermilion-light rounded-md border-2 p-4">
      <p className="flex items-center gap-2 font-bold">
        <AlertTriangle aria-hidden="true" className="size-5 shrink-0" />
        取り込めなかった行が{errors.length}件あります
      </p>
      <p className="mt-1 text-sm">
        元の表を直してから、もう一度取り込んでください。行番号は、見出しを1行目として数えています。
      </p>
      <ul className="mt-2 max-h-48 space-y-1 overflow-y-auto text-sm">
        {errors.map((error) => (
          <li key={error.rowNumber}>
            <span className="font-bold">{error.rowNumber}行目：</span>
            {error.message}
          </li>
        ))}
      </ul>
    </div>
  )
}
