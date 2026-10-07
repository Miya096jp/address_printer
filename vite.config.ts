/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

// 個人情報を扱うため、ブラウザの機能で外部への通信を禁止する。
// connect-src 'none' により、万一依存ライブラリに悪意のあるコードが入っても、
// fetch や WebSocket でデータを外に送ることはできない。
// style-src の 'unsafe-inline' は、mm 指定の寸法を style 属性で渡すために必要。
// スクリプトは 'self' だけを許可し、インラインのスクリプトは実行させない。
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'none'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
].join('; ')

// 開発サーバーは HMR のために WebSocket で通信するので、本番のビルドにだけ入れる
function contentSecurityPolicyPlugin(): Plugin {
  return {
    name: 'content-security-policy',
    apply: 'build',
    transformIndexHtml() {
      return [
        {
          tag: 'meta',
          attrs: { 'http-equiv': 'Content-Security-Policy', content: contentSecurityPolicy },
          injectTo: 'head-prepend',
        },
      ]
    },
  }
}

export default defineConfig({
  // GitHub Pages では https://<user>.github.io/address_printer/ で公開されるため
  base: '/address_printer/',
  plugins: [react(), tailwindcss(), contentSecurityPolicyPlugin()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
