import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('ツール名を表示する', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: '宛名ラベル印刷' })).toBeInTheDocument()
  })
})
