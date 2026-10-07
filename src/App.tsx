import { useState } from 'react'
import { AddressInput } from './components/AddressInput'
import { AddressList } from './components/AddressList'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { PrivacyNotice } from './components/PrivacyNotice'
import { StepSection } from './components/StepSection'
import type { ImportedAddress } from './lib/importAddresses'

function App() {
  const [addresses, setAddresses] = useState<ImportedAddress[]>([])
  const [selectedRowNumbers, setSelectedRowNumbers] = useState<ReadonlySet<number>>(new Set())

  function replaceAddresses(nextAddresses: ImportedAddress[]) {
    setAddresses(nextAddresses)
    setSelectedRowNumbers(new Set(nextAddresses.map((imported) => imported.rowNumber)))
  }

  return (
    <>
      <div className="print:hidden">
        <Header />
        <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
          <PrivacyNotice />
          <StepSection step={1} title="住所録を入れる">
            <AddressInput onImport={replaceAddresses} />
            <AddressList
              addresses={addresses}
              selectedRowNumbers={selectedRowNumbers}
              onSelectionChange={setSelectedRowNumbers}
              overflowRowNumbers={new Set()}
            />
          </StepSection>
        </main>
      </div>
      <Footer />
    </>
  )
}

export default App
