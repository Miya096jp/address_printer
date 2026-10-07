import { useId } from 'react'

type MillimeterInputProps = {
  label: string
  value: number
  onChange: (value: number) => void
  step?: number
  unit?: string
}

/** mm 単位の数値を入れる欄。空欄は NaN として渡し、入力チェックで知らせる。 */
export function MillimeterInput({
  label,
  value,
  onChange,
  step = 0.1,
  unit = 'mm',
}: MillimeterInputProps) {
  const inputId = useId()
  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-bold">
        {label}
      </label>
      <div className="mt-1 flex items-center gap-2">
        <input
          id={inputId}
          type="number"
          inputMode="decimal"
          step={step}
          value={Number.isNaN(value) ? '' : value}
          onChange={(event) => onChange(event.target.valueAsNumber)}
          className="text-input"
        />
        <span className="text-ink-muted text-sm">{unit}</span>
      </div>
    </div>
  )
}
