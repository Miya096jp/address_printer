export function Header() {
  return (
    <header className="bg-vermilion text-white shadow-md print:hidden">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 sm:px-6">
        <span aria-hidden="true" className="font-serif text-3xl leading-none">
          〒
        </span>
        <h1 className="font-serif text-2xl font-semibold tracking-wide">宛名ラベル印刷</h1>
      </div>
    </header>
  )
}
