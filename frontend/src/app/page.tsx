export default function Home() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-[-0.02em]">Muraho, Mukamana 👋</h1>
        <p className="mt-1 text-ink-2">Uko ubucuruzi bwawe buhagaze uyu munsi.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl bg-surface p-6 shadow-md">
          <b className="block text-sm font-semibold text-ink">Ibyagurishijwe · Sales</b>
          <span className="mt-1 block text-xs text-ink-2">Tano amakono</span>
          <b className="mt-2 block text-2xl font-bold text-ink">
            86,500 <small className="text-sm font-semibold text-ink-2">RWF</small>
          </b>
        </div>
        <div className="rounded-2xl bg-surface p-6 shadow-md">
          <b className="block text-sm font-semibold text-ink">Yakiriwe · Cash in</b>
          <span className="mt-1 block text-xs text-ink-2">Tano amakono</span>
          <b className="mt-2 block text-2xl font-bold text-ink">
            61,500 <small className="text-sm font-semibold text-ink-2">RWF</small>
          </b>
        </div>
        <div className="rounded-2xl bg-surface p-6 shadow-md">
          <b className="block text-sm font-semibold text-ink">Amadeni · Owed to you</b>
          <span className="mt-1 block text-xs text-ink-2">Abakiriya abo bashya</span>
          <b className="mt-2 block text-2xl font-bold text-ink">
            184,000 <small className="text-sm font-semibold text-ink-2">RWF</small>
          </b>
        </div>
      </div>
    </div>
  )
}
