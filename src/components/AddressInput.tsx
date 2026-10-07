import { Download, FileUp } from 'lucide-react'
import { useId, useState, type ChangeEvent } from 'react'
import { addressFieldLabels, addressFields } from '../lib/address'
import { guessColumnMapping, type ColumnMapping } from '../lib/columnMapping'
import { decodeText } from '../lib/decodeText'
import { importAddresses, type ImportedAddress, type ImportError } from '../lib/importAddresses'
import { maxFileSizeBytes } from '../lib/importLimits'
import { parseTable, type ParsedTable } from '../lib/parseTable'
import { ColumnMappingDialog } from './ColumnMappingDialog'
import { ImportErrors } from './ImportErrors'

type AddressInputProps = {
  onImport: (addresses: ImportedAddress[]) => void
}

type PendingImport = {
  table: ParsedTable
  guessedMapping: ColumnMapping
}

const templateHeaders = addressFields.map((field) => addressFieldLabels[field])

export function AddressInput({ onImport }: AddressInputProps) {
  const [pastedText, setPastedText] = useState('')
  const [pendingImport, setPendingImport] = useState<PendingImport | null>(null)
  const [errors, setErrors] = useState<ImportError[]>([])
  const [statusMessage, setStatusMessage] = useState('')
  const fileInputId = useId()
  const pasteAreaId = useId()

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    // 同じファイルを選び直しても change が起きるように、選択を空に戻しておく
    event.target.value = ''
    if (!file) {
      return
    }
    if (file.size > maxFileSizeBytes) {
      showFailure('ファイルが大きすぎます（5MBまで）。ファイルを分けてください。')
      return
    }
    try {
      const { text } = decodeText(new Uint8Array(await file.arrayBuffer()))
      startImport(parseTable(text))
    } catch (error) {
      showFailure(errorMessage(error))
    }
  }

  function handlePasteImport() {
    try {
      startImport(parseTable(pastedText))
    } catch (error) {
      showFailure(errorMessage(error))
    }
  }

  function startImport(table: ParsedTable) {
    const guessedMapping = guessColumnMapping(table.headers)
    // ひな形のままなら確かめる必要はないので、そのまま取り込む
    if (hasSameHeaders(table.headers, templateHeaders)) {
      finishImport(table, guessedMapping)
    } else {
      setPendingImport({ table, guessedMapping })
    }
  }

  function finishImport(table: ParsedTable, mapping: ColumnMapping) {
    const result = importAddresses(table.rows, mapping)
    onImport(result.addresses)
    setErrors(result.errors)
    setStatusMessage(`${result.addresses.length}件を取り込みました。`)
    setPendingImport(null)
  }

  function showFailure(message: string) {
    setErrors([])
    setStatusMessage(message)
  }

  return (
    <div className="space-y-5">
      <p>
        ひな形と同じ列のCSVファイルか、Excelの表を使えます。列名がひな形と違っていても、取り込むときに対応を選べます。
      </p>
      <a
        href={`${import.meta.env.BASE_URL}template.csv`}
        download="宛名ラベル_ひな形.csv"
        className="button-secondary"
      >
        <Download aria-hidden="true" className="size-5" />
        ひな形CSVをダウンロード
      </a>

      <div>
        <label htmlFor={fileInputId} className="block font-bold">
          CSVファイルから取り込む
        </label>
        <p className="text-ink-muted text-sm">UTF-8 と Shift_JIS のどちらでも読み込めます。</p>
        <div className="mt-2 flex items-center gap-2">
          <FileUp aria-hidden="true" className="text-ink-muted size-5 shrink-0" />
          <input
            id={fileInputId}
            type="file"
            accept=".csv,.txt,text/csv,text/plain"
            onChange={handleFileChange}
            className="file:border-vermilion file:text-vermilion hover:file:bg-vermilion-light w-full text-sm file:mr-3 file:cursor-pointer file:rounded-md file:border-2 file:bg-white file:px-3 file:py-1.5 file:font-bold"
          />
        </div>
      </div>

      <div>
        <label htmlFor={pasteAreaId} className="block font-bold">
          Excelからコピーした表を貼り付ける
        </label>
        <p className="text-ink-muted text-sm">見出しの行も含めて、表全体をコピーしてください。</p>
        <textarea
          id={pasteAreaId}
          value={pastedText}
          onChange={(event) => setPastedText(event.target.value)}
          rows={5}
          className="text-input postcard-lines mt-2 font-mono text-sm"
          spellCheck={false}
        />
        <button
          type="button"
          className="button-primary mt-2"
          disabled={pastedText.trim() === ''}
          onClick={handlePasteImport}
        >
          貼り付けた表を取り込む
        </button>
      </div>

      <p className="text-ink-muted text-sm">
        取り込むと、それまでに取り込んだ住所録は置き換わります。
      </p>

      <p role="status" className="font-bold">
        {statusMessage}
      </p>
      <ImportErrors errors={errors} />

      {pendingImport && (
        <ColumnMappingDialog
          headers={pendingImport.table.headers}
          exampleRow={pendingImport.table.rows[0]}
          initialMapping={pendingImport.guessedMapping}
          onConfirm={(mapping) => finishImport(pendingImport.table, mapping)}
          onCancel={() => setPendingImport(null)}
        />
      )}
    </div>
  )
}

function hasSameHeaders(headers: string[], expected: string[]): boolean {
  return headers.length === expected.length && headers.every((header, i) => header === expected[i])
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '読み込みに失敗しました。'
}
