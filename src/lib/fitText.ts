export type FitOptions = {
  /** これ以上は小さくしない倍率。小さすぎると読めなくなるため */
  minScale: number
  /** 一度に小さくする幅 */
  step: number
}

export const defaultFitOptions: FitOptions = { minScale: 0.6, step: 0.05 }

export type FitResult = {
  scale: number
  /** false のときは、いちばん小さくしても収まらなかった */
  fits: boolean
}

/**
 * 文字が収まる、いちばん大きな倍率（1以下）を探す。
 * 収まるかどうかの判定は、実際に描画して測る必要があるため、呼び出し側から関数で受け取る。
 */
export function findFittingScale(
  fitsAt: (scale: number) => boolean,
  options: FitOptions = defaultFitOptions,
): FitResult {
  // 0.05 刻みで足し引きすると誤差がたまるため、段階の数で数える
  const stepCount = Math.round((1 - options.minScale) / options.step)
  for (let stepIndex = 0; stepIndex <= stepCount; stepIndex++) {
    const scale = roundScale(1 - stepIndex * options.step)
    if (fitsAt(scale)) {
      return { scale, fits: true }
    }
  }
  return { scale: options.minScale, fits: false }
}

/**
 * ラベルの高さに合わせた、基本の文字の大きさ（mm）。
 * 小さいラベルでも読める大きさを保ち、大きいラベルでは大きくなりすぎないようにする。
 */
export function baseFontSize(labelHeight: number): number {
  const minFontSize = 2.6 // 約7.5pt
  const maxFontSize = 4.2 // 約12pt
  return Math.min(Math.max(labelHeight / 9, minFontSize), maxFontSize)
}

function roundScale(scale: number): number {
  return Math.round(scale * 100) / 100
}
