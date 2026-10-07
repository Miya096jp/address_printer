import { ExternalLink } from 'lucide-react'
import { monitorPageUrl } from '../constants'

export function Footer() {
  return (
    <footer className="mt-12 print:hidden">
      <div className="perforation" aria-hidden="true" />
      <div className="mx-auto max-w-7xl space-y-2 px-4 py-8 text-center sm:px-6">
        <p>こうした道具を、貴社の仕事の流れに合わせて作ることもできます。</p>
        <p>
          <a
            href={monitorPageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-vermilion inline-flex items-center gap-1 font-bold underline underline-offset-4"
          >
            無料モニターのご案内
            <ExternalLink aria-hidden="true" className="size-4" />
            <span className="sr-only">（新しいタブで開きます）</span>
          </a>
        </p>
        <p className="text-ink-muted pt-4 text-sm">無料でお使いいただけます（デモ版）</p>
        <p className="text-ink-muted text-sm">制作：方法システムズ</p>
      </div>
    </footer>
  )
}
