import { useCallback, useState } from 'react'
import { AddressBookActions } from './components/AddressBookActions'
import { AddressInput } from './components/AddressInput'
import { AddressList } from './components/AddressList'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { PrintPanel } from './components/PrintPanel'
import { PrivacyNotice } from './components/PrivacyNotice'
import { SheetPreview } from './components/SheetPreview'
import { SheetSettingsForm } from './components/SheetSettingsForm'
import { StepSection } from './components/StepSection'
import { useLeaveConfirmation } from './hooks/useLeaveConfirmation'
import type { ImportedAddress } from './lib/importAddresses'
import { findLayoutProblems } from './lib/labelLayouts'
import { createSampleAddresses } from './lib/sampleAddresses'
import { paginate } from './lib/sheetLayout'
import { defaultSheetSettings, resolveLayout } from './lib/sheetSettings'

function App() {
  const [addresses, setAddresses] = useState<ImportedAddress[]>([])
  const [selectedRowNumbers, setSelectedRowNumbers] = useState<ReadonlySet<number>>(new Set())
  const [overflowRowNumbers, setOverflowRowNumbers] = useState<ReadonlySet<number>>(new Set())
  const [sheetSettings, setSheetSettings] = useState(defaultSheetSettings)
  // 「すべて消去」で取り込み欄の入力も空に戻すため、key を変えて作り直す
  const [addressInputKey, setAddressInputKey] = useState(0)

  useLeaveConfirmation(addresses.length > 0)

  const layout = resolveLayout(sheetSettings)
  const layoutIsValid = findLayoutProblems(layout).length === 0
  const addressesToPrint = addresses.filter((imported) =>
    selectedRowNumbers.has(imported.rowNumber),
  )
  const sheetCount = layoutIsValid
    ? paginate(addressesToPrint, layout.columns * layout.rows, sheetSettings.startPosition).length
    : 0

  function replaceAddresses(nextAddresses: ImportedAddress[]) {
    setAddresses(nextAddresses)
    setSelectedRowNumbers(new Set(nextAddresses.map((imported) => imported.rowNumber)))
    setOverflowRowNumbers(new Set())
  }

  function clearAll() {
    replaceAddresses([])
    setAddressInputKey((key) => key + 1)
  }

  // ラベルごとに呼ばれるため、変化がないときは同じ Set を返して再描画を避ける
  const reportFit = useCallback((rowNumber: number, fits: boolean) => {
    setOverflowRowNumbers((current) => {
      if (current.has(rowNumber) === !fits) {
        return current
      }
      const next = new Set(current)
      if (fits) {
        next.delete(rowNumber)
      } else {
        next.add(rowNumber)
      }
      return next
    })
  }, [])

  const visibleOverflowRowNumbers = new Set(
    [...overflowRowNumbers].filter((rowNumber) => selectedRowNumbers.has(rowNumber)),
  )

  return (
    <>
      <Header />
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 print:m-0 print:max-w-none print:space-y-0 print:p-0">
        <div className="print:hidden">
          <PrivacyNotice />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,30rem)_minmax(0,1fr)] print:block">
          <main className="space-y-6 print:hidden">
            <StepSection step={1} title="住所録を入れる">
              <AddressInput key={addressInputKey} onImport={replaceAddresses} />
              <AddressBookActions
                hasInput={addresses.length > 0}
                onInsertSample={() => replaceAddresses(createSampleAddresses())}
                onClear={clearAll}
              />
              <AddressList
                addresses={addresses}
                selectedRowNumbers={selectedRowNumbers}
                onSelectionChange={setSelectedRowNumbers}
                overflowRowNumbers={visibleOverflowRowNumbers}
              />
            </StepSection>
            <StepSection step={2} title="用紙を選ぶ">
              <SheetSettingsForm settings={sheetSettings} onChange={setSheetSettings} />
            </StepSection>
            <StepSection step={3} title="印刷する">
              <PrintPanel
                labelCount={addressesToPrint.length}
                sheetCount={sheetCount}
                disabledReason={printDisabledReason(addressesToPrint.length, layoutIsValid)}
              />
            </StepSection>
          </main>

          <section aria-labelledby="preview-heading" className="lg:sticky lg:top-6 lg:self-start">
            <h2 id="preview-heading" className="mb-3 text-xl font-bold print:hidden">
              プレビュー
            </h2>
            {addressesToPrint.length > 0 && layoutIsValid ? (
              <div className="lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto print:max-h-none print:overflow-visible">
                <SheetPreview
                  addresses={addressesToPrint}
                  layout={layout}
                  offset={sheetSettings.offset}
                  startPosition={sheetSettings.startPosition}
                  showBorders={sheetSettings.showBorders}
                  onFitChange={reportFit}
                />
              </div>
            ) : (
              <p className="border-paper-line text-ink-muted rounded-lg border-2 border-dashed bg-white p-8 text-center print:hidden">
                {layoutIsValid
                  ? '住所録を入れると、ここに用紙のプレビューが表示されます。'
                  : '用紙の寸法を直すと、プレビューが表示されます。'}
              </p>
            )}
          </section>
        </div>
      </div>
      <Footer />
    </>
  )
}

function printDisabledReason(labelCount: number, layoutIsValid: boolean): string | undefined {
  if (!layoutIsValid) {
    return '用紙の寸法に問題があるため、印刷できません。'
  }
  if (labelCount === 0) {
    return '印刷する宛先がありません。住所録を入れて、印刷する宛先を選んでください。'
  }
  return undefined
}

export default App
