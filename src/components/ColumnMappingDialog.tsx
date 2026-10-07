import * as Dialog from '@radix-ui/react-dialog'
import { AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { addressFieldLabels, addressFields, type AddressField } from '../lib/address'
import { findMappingProblems, type ColumnMapping } from '../lib/columnMapping'

type ColumnMappingDialogProps = {
  headers: string[]
  /** 列の中身の例として見せる、最初のデータ行 */
  exampleRow: string[] | undefined
  initialMapping: ColumnMapping
  onConfirm: (mapping: ColumnMapping) => void
  onCancel: () => void
}

const notUsedValue = ''

export function ColumnMappingDialog({
  headers,
  exampleRow,
  initialMapping,
  onConfirm,
  onCancel,
}: ColumnMappingDialogProps) {
  const [mapping, setMapping] = useState(initialMapping)
  const problems = findMappingProblems(mapping)

  function changeColumn(field: AddressField, value: string) {
    setMapping({ ...mapping, [field]: value === notUsedValue ? undefined : Number(value) })
  }

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onCancel()}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-ink/50 fixed inset-0" />
        <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[90vh] w-[min(40rem,calc(100vw-2rem))] -translate-1/2 overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
          <Dialog.Title className="text-xl font-bold">列の対応を確かめてください</Dialog.Title>
          <Dialog.Description className="text-ink-muted mt-2">
            表の列名から、それぞれの項目にあたる列を推定しました。違っていれば選び直してください。
          </Dialog.Description>

          <div className="mt-5 space-y-3">
            {addressFields.map((field) => {
              const selectId = `column-for-${field}`
              const selectedColumn = mapping[field]
              const example =
                selectedColumn === undefined ? undefined : exampleRow?.[selectedColumn]
              return (
                <div key={field} className="grid gap-1 sm:grid-cols-[10rem_1fr] sm:items-center">
                  <label htmlFor={selectId} className="font-bold">
                    {addressFieldLabels[field]}
                  </label>
                  <div>
                    <select
                      id={selectId}
                      className="text-input"
                      value={selectedColumn ?? notUsedValue}
                      onChange={(event) => changeColumn(field, event.target.value)}
                    >
                      <option value={notUsedValue}>（使わない）</option>
                      {headers.map((header, index) => (
                        <option key={index} value={index}>
                          {header || `${index + 1}列目（列名なし）`}
                        </option>
                      ))}
                    </select>
                    {example && <p className="text-ink-muted mt-1 text-sm">例：{example}</p>}
                  </div>
                </div>
              )
            })}
          </div>

          {problems.length > 0 && (
            <ul className="border-vermilion bg-vermilion-light mt-5 space-y-1 rounded-md border-2 p-3">
              {problems.map((problem) => (
                <li key={problem} className="flex gap-2">
                  <AlertTriangle aria-hidden="true" className="mt-1 size-5 shrink-0" />
                  <span>{problem}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <Dialog.Close className="button-secondary">やめる</Dialog.Close>
            <button
              type="button"
              className="button-primary"
              disabled={problems.length > 0}
              onClick={() => onConfirm(mapping)}
            >
              この対応で取り込む
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
