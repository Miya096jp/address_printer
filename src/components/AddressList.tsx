import { AlertTriangle } from 'lucide-react'
import type { ImportedAddress } from '../lib/importAddresses'

type AddressListProps = {
  addresses: ImportedAddress[]
  selectedRowNumbers: ReadonlySet<number>
  onSelectionChange: (selectedRowNumbers: Set<number>) => void
  /** 文字を小さくしてもラベルに収まらなかった宛先 */
  overflowRowNumbers: ReadonlySet<number>
}

export function AddressList({
  addresses,
  selectedRowNumbers,
  onSelectionChange,
  overflowRowNumbers,
}: AddressListProps) {
  if (addresses.length === 0) {
    return null
  }

  const allSelected = selectedRowNumbers.size === addresses.length

  function toggleAll() {
    onSelectionChange(
      allSelected ? new Set() : new Set(addresses.map((imported) => imported.rowNumber)),
    )
  }

  function toggleOne(rowNumber: number) {
    const next = new Set(selectedRowNumbers)
    if (next.has(rowNumber)) {
      next.delete(rowNumber)
    } else {
      next.add(rowNumber)
    }
    onSelectionChange(next)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-bold">
          {addresses.length}件中 {selectedRowNumbers.size}件を印刷します
        </p>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            className="accent-vermilion size-5"
            checked={allSelected}
            onChange={toggleAll}
          />
          すべて選ぶ
        </label>
      </div>

      {overflowRowNumbers.size > 0 && (
        <p className="border-vermilion bg-vermilion-light mt-2 flex gap-2 rounded-md border-2 p-3">
          <AlertTriangle aria-hidden="true" className="mt-1 size-5 shrink-0" />
          <span>
            ラベルに収まらない宛先が{overflowRowNumbers.size}
            件あります。一覧の「収まりません」の行を確かめて、住所や会社名を短くしてください。
          </span>
        </p>
      )}

      <div className="border-paper-line mt-3 max-h-96 overflow-auto rounded-md border">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper sticky top-0">
            <tr>
              <th scope="col" className="w-12 px-3 py-2">
                <span className="sr-only">印刷する</span>
              </th>
              <th scope="col" className="px-3 py-2">
                宛名
              </th>
              <th scope="col" className="px-3 py-2">
                住所
              </th>
            </tr>
          </thead>
          <tbody>
            {addresses.map(({ rowNumber, address }) => {
              const addressee = address.name || [address.company, address.department].join(' ')
              const checkboxId = `print-row-${rowNumber}`
              return (
                <tr key={rowNumber} className="border-paper-line border-t">
                  <td className="px-3 py-2">
                    <input
                      id={checkboxId}
                      type="checkbox"
                      className="accent-vermilion size-5"
                      checked={selectedRowNumbers.has(rowNumber)}
                      onChange={() => toggleOne(rowNumber)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <label htmlFor={checkboxId} className="cursor-pointer">
                      {addressee}
                    </label>
                    {overflowRowNumbers.has(rowNumber) && (
                      <span className="text-vermilion-dark mt-1 flex items-center gap-1 font-bold">
                        <AlertTriangle aria-hidden="true" className="size-4" />
                        収まりません
                      </span>
                    )}
                  </td>
                  <td className="text-ink-muted px-3 py-2">{address.address1}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
