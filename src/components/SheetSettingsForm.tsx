import { AlertTriangle } from 'lucide-react'
import { useId } from 'react'
import { findLayoutProblems, labelProducts, type SheetLayout } from '../lib/labelLayouts'
import { customProductId, resolveLayout, type SheetSettings } from '../lib/sheetSettings'
import { MillimeterInput } from './MillimeterInput'

type SheetSettingsFormProps = {
  settings: SheetSettings
  onChange: (settings: SheetSettings) => void
}

export function SheetSettingsForm({ settings, onChange }: SheetSettingsFormProps) {
  const productSelectId = useId()
  const startPositionId = useId()
  const layout = resolveLayout(settings)
  const isCustom = settings.productId === customProductId
  const selectedProduct = labelProducts.find((product) => product.id === settings.productId)
  const labelsPerSheet = layout.columns * layout.rows
  const hasLayoutProblems = findLayoutProblems(layout).length > 0

  function update(changes: Partial<SheetSettings>) {
    onChange({ ...settings, ...changes })
  }

  function updateCustomLayout(changes: Partial<SheetLayout>) {
    update({ customLayout: { ...settings.customLayout, ...changes } })
  }

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor={productSelectId} className="block font-bold">
          ラベル用紙
        </label>
        <select
          id={productSelectId}
          value={settings.productId}
          onChange={(event) => update({ productId: event.target.value, startPosition: 1 })}
          className="text-input mt-1"
        >
          {labelProducts.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
          <option value={customProductId}>カスタム（寸法を入力する）</option>
        </select>
        {selectedProduct && (
          <p className="text-ink-muted mt-1 text-sm">
            同じ並びの用紙の例：{selectedProduct.compatibleProducts.join('、')}
          </p>
        )}
      </div>

      {isCustom && (
        <CustomLayoutFields layout={settings.customLayout} onChange={updateCustomLayout} />
      )}

      <fieldset>
        <legend className="font-bold">印刷位置の微調整</legend>
        <p className="text-ink-muted text-sm">
          試し刷りでずれていた分だけ、0.5mm単位でずらせます。右と下がプラスです。
        </p>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <MillimeterInput
            label="左右（右へ）"
            step={0.5}
            value={settings.offset.x}
            onChange={(x) => update({ offset: { ...settings.offset, x: valueOrZero(x) } })}
          />
          <MillimeterInput
            label="上下（下へ）"
            step={0.5}
            value={settings.offset.y}
            onChange={(y) => update({ offset: { ...settings.offset, y: valueOrZero(y) } })}
          />
        </div>
      </fieldset>

      {!hasLayoutProblems && (
        <div>
          <label htmlFor={startPositionId} className="block font-bold">
            印刷を始める位置
          </label>
          <p className="text-ink-muted text-sm">
            使いかけの用紙に印刷するときは、空いている最初のラベルを選んでください。左上から右へ数えます。
          </p>
          <select
            id={startPositionId}
            value={Math.min(settings.startPosition, labelsPerSheet)}
            onChange={(event) => update({ startPosition: Number(event.target.value) })}
            className="text-input mt-1"
          >
            {Array.from({ length: labelsPerSheet }, (_, index) => index + 1).map((position) => (
              <option key={position} value={position}>
                {position}枚目（{Math.ceil(position / layout.columns)}段目の
                {((position - 1) % layout.columns) + 1}列目）
              </option>
            ))}
          </select>
        </div>
      )}

      <label className="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          className="accent-vermilion size-5"
          checked={settings.showBorders}
          onChange={(event) => update({ showBorders: event.target.checked })}
        />
        <span>
          <span className="font-bold">枠線を印刷する</span>
          <span className="text-ink-muted block text-sm">普通紙で試し刷りするときに使います</span>
        </span>
      </label>
    </div>
  )
}

type CustomLayoutFieldsProps = {
  layout: SheetLayout
  onChange: (changes: Partial<SheetLayout>) => void
}

function CustomLayoutFields({ layout, onChange }: CustomLayoutFieldsProps) {
  const problems = findLayoutProblems(layout)
  return (
    <fieldset className="border-paper-line rounded-md border p-4">
      <legend className="px-1 font-bold">カスタム寸法</legend>
      <div className="grid grid-cols-2 gap-3">
        <MillimeterInput
          label="列数"
          unit="列"
          step={1}
          value={layout.columns}
          onChange={(columns) => onChange({ columns })}
        />
        <MillimeterInput
          label="行数"
          unit="行"
          step={1}
          value={layout.rows}
          onChange={(rows) => onChange({ rows })}
        />
        <MillimeterInput
          label="ラベルの幅"
          value={layout.labelWidth}
          onChange={(labelWidth) => onChange({ labelWidth })}
        />
        <MillimeterInput
          label="ラベルの高さ"
          value={layout.labelHeight}
          onChange={(labelHeight) => onChange({ labelHeight })}
        />
        <MillimeterInput
          label="上の余白"
          value={layout.marginTop}
          onChange={(marginTop) => onChange({ marginTop })}
        />
        <MillimeterInput
          label="左の余白"
          value={layout.marginLeft}
          onChange={(marginLeft) => onChange({ marginLeft })}
        />
        <MillimeterInput
          label="横の間隔"
          value={layout.gapX}
          onChange={(gapX) => onChange({ gapX })}
        />
        <MillimeterInput
          label="縦の間隔"
          value={layout.gapY}
          onChange={(gapY) => onChange({ gapY })}
        />
      </div>
      {problems.length > 0 && (
        <ul className="border-vermilion bg-vermilion-light mt-3 space-y-1 rounded-md border-2 p-3">
          {problems.map((problem) => (
            <li key={problem} className="flex gap-2">
              <AlertTriangle aria-hidden="true" className="mt-1 size-5 shrink-0" />
              <span>{problem}</span>
            </li>
          ))}
        </ul>
      )}
    </fieldset>
  )
}

function valueOrZero(value: number): number {
  return Number.isNaN(value) ? 0 : value
}
