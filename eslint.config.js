import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

// 個人情報を扱うため、ブラウザへの保存と外部への通信をコードに書けないようにする。
// どうしても必要になったときは、この一覧を見直すところから議論する。
const storageAndNetworkMessage =
  '入力データの保存や外部への通信は禁止しています（CLAUDE.md「データの扱い」を参照）'

const forbiddenGlobals = [
  'localStorage',
  'sessionStorage',
  'indexedDB',
  'caches',
  'fetch',
  'XMLHttpRequest',
  'WebSocket',
  'EventSource',
].map((name) => ({ name, message: storageAndNetworkMessage }))

const forbiddenProperties = [
  ['window', 'localStorage'],
  ['window', 'sessionStorage'],
  ['window', 'indexedDB'],
  ['window', 'fetch'],
  ['document', 'cookie'],
  ['navigator', 'sendBeacon'],
  ['navigator', 'serviceWorker'],
].map(([object, property]) => ({ object, property, message: storageAndNetworkMessage }))

export default tseslint.config(
  { ignores: ['dist', 'coverage'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-restricted-globals': ['error', ...forbiddenGlobals],
      'no-restricted-properties': ['error', ...forbiddenProperties],
      'no-restricted-syntax': [
        'error',
        {
          selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
          message: '住所録の内容をHTMLとして扱うとXSSの原因になるため禁止しています',
        },
        {
          selector: 'MemberExpression[property.name=/^(innerHTML|outerHTML)$/]',
          message: '住所録の内容をHTMLとして扱うとXSSの原因になるため禁止しています',
        },
      ],
    },
  },
  prettier,
)
