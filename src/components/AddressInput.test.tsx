import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AddressInput } from './AddressInput'

const templateHeader = '郵便番号\t住所1\t住所2（建物名など）\t会社名\t部署名\t役職\t氏名\t敬称'

async function pasteAndImport(text: string) {
  const user = userEvent.setup()
  const onImport = vi.fn()
  render(<AddressInput onImport={onImport} />)

  await user.click(screen.getByLabelText('Excelからコピーした表を貼り付ける'))
  await user.paste(text)
  await user.click(screen.getByRole('button', { name: '貼り付けた表を取り込む' }))
  return { user, onImport }
}

describe('AddressInput', () => {
  it('ひな形と同じ列なら、確認なしで取り込む', async () => {
    const { onImport } = await pasteAndImport(
      `${templateHeader}\n100-0001\t見本市1-1\t\t\t\t\t山田 太郎\t`,
    )

    expect(onImport).toHaveBeenCalledWith([
      expect.objectContaining({
        rowNumber: 2,
        address: expect.objectContaining({ name: '山田 太郎' }),
      }),
    ])
    expect(screen.getByRole('status')).toHaveTextContent('1件を取り込みました')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('列名が違えば、対応づけの画面を出してから取り込む', async () => {
    const { user, onImport } = await pasteAndImport(
      '〒\t所在地\tお名前\n100-0001\t見本市1-1\t山田 太郎',
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByLabelText('氏名')).toHaveDisplayValue('お名前')

    await user.click(screen.getByRole('button', { name: 'この対応で取り込む' }))

    expect(onImport).toHaveBeenCalledOnce()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('取り込めなかった行を、行番号付きで表示する', async () => {
    await pasteAndImport(`${templateHeader}\n12345\t見本市1-1\t\t\t\t\t山田 太郎\t`)

    expect(screen.getByText('取り込めなかった行が1件あります')).toBeInTheDocument()
    expect(screen.getByText('2行目：')).toBeInTheDocument()
  })
})
