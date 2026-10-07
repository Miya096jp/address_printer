import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

describe('App', () => {
  it('ツール名と、データを送信・保存しない旨の案内を表示する', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: '宛名ラベル印刷' })).toBeInTheDocument()
    expect(screen.getByText('入力した内容は、外部に送信・保存されません。')).toBeInTheDocument()
  })

  it('サンプルを入れると、プレビューに宛名が表示され、印刷できるようになる', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'サンプルを入れてみる' }))

    const preview = screen.getByRole('region', { name: 'プレビュー' })
    expect(within(preview).getByText('山田 太郎 様')).toBeInTheDocument()
    expect(within(preview).getByText('一般社団法人見本協会 御中')).toBeInTheDocument()
    expect(screen.getByText('10件の宛名を、用紙1枚に印刷します。')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '印刷する' })).toBeEnabled()
  })

  it('すべて消去すると、住所録が空に戻る', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'サンプルを入れてみる' }))
    await user.click(screen.getByRole('button', { name: 'すべて消去' }))

    expect(screen.queryByText('山田 太郎 様')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '印刷する' })).toBeDisabled()
  })

  it('操作しても、ブラウザのストレージに何も保存しない', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'サンプルを入れてみる' }))
    await user.selectOptions(screen.getByLabelText('ラベル用紙'), 'a4-24')

    // 保存していないことを確かめるためだけに、禁止しているストレージを読む
    /* eslint-disable no-restricted-globals, no-restricted-properties */
    expect(localStorage.length).toBe(0)
    expect(sessionStorage.length).toBe(0)
    expect(document.cookie).toBe('')
    /* eslint-enable no-restricted-globals, no-restricted-properties */
  })
})
