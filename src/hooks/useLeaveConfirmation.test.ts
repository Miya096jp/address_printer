import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useLeaveConfirmation } from './useLeaveConfirmation'

function dispatchBeforeUnload(): Event {
  const event = new Event('beforeunload', { cancelable: true })
  window.dispatchEvent(event)
  return event
}

describe('useLeaveConfirmation', () => {
  it('入力があれば、ページを離れる前に確認を求める', () => {
    renderHook(() => useLeaveConfirmation(true))

    expect(dispatchBeforeUnload().defaultPrevented).toBe(true)
  })

  it('入力がなければ、確認を求めない', () => {
    renderHook(() => useLeaveConfirmation(false))

    expect(dispatchBeforeUnload().defaultPrevented).toBe(false)
  })

  it('入力がなくなったら、確認を求めなくなる', () => {
    const { rerender } = renderHook(({ hasInput }) => useLeaveConfirmation(hasInput), {
      initialProps: { hasInput: true },
    })
    rerender({ hasInput: false })

    expect(dispatchBeforeUnload().defaultPrevented).toBe(false)
  })
})
