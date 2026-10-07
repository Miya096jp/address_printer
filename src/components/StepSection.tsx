import type { ReactNode } from 'react'

type StepSectionProps = {
  step: number
  title: string
  children: ReactNode
}

/** ①②③の操作の段階を表す区画。番号は郵便番号の記入枠のような赤い四角で囲む。 */
export function StepSection({ step, title, children }: StepSectionProps) {
  const headingId = `step-${step}-heading`
  return (
    <section aria-labelledby={headingId} className="rounded-lg bg-white shadow-sm">
      <h2 id={headingId} className="flex items-center gap-3 px-5 pt-5 text-xl font-bold">
        <span
          aria-hidden="true"
          className="border-vermilion text-vermilion flex size-9 items-center justify-center border-2 font-serif text-lg"
        >
          {step}
        </span>
        <span>
          <span className="sr-only">ステップ{step}：</span>
          {title}
        </span>
      </h2>
      <div className="space-y-4 px-5 pt-4 pb-5">{children}</div>
    </section>
  )
}
