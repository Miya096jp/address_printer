import { useEffect } from 'react'

/**
 * 入力がある状態でページを閉じたり再読み込みしたりしようとしたら、ブラウザの確認を出す。
 * データを保存しないので、うっかり閉じると入力が消えてしまうため。
 */
export function useLeaveConfirmation(hasUnsavedInput: boolean) {
  useEffect(() => {
    if (!hasUnsavedInput) {
      return
    }
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      // 文言はブラウザが決めるため、ここでは確認を出すよう求めるだけ
      event.preventDefault()
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedInput])
}
