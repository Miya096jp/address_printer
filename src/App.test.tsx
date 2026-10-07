import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('ツール名と、データを送信・保存しない旨の案内を表示する', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: '宛名ラベル印刷' })).toBeInTheDocument()
    expect(screen.getByText('入力した内容は、外部に送信・保存されません。')).toBeInTheDocument()
  })
})
