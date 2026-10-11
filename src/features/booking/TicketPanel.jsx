const ORDER = ['child', 'student', 'adult']

export default function TicketPanel({ selection, types, hideChild, unitPrice, onType, onRemove, subtotal }) {
    const shown = types
        .filter((t) => !(hideChild && t.slug === 'child'))
        .sort((a, b) => ORDER.indexOf(a.slug) - ORDER.indexOf(b.slug))

    return (
        <>
            <h4 className="text-xs font-bold">Your seats · Max 3</h4>

            {selection.length === 0 && (
                <p className="mt-3 text-[11px] text-white/60">
                    Pick up to 3 seats from the map. Each seat can carry its own ticket type.
                </p>
            )}

            <div className="mt-3 flex max-h-[300px] flex-col gap-2.5 overflow-y-auto">
                {selection.map((s) => {
                    const pct = types.find((t) => t.slug === s.ticketType)?.percent ?? 100
                    return (
                        <div key={s.seatId} className="rounded-xl bg-[#1a1c2e] p-3">
                            <div className="mb-2 flex items-center justify-between border-b border-white/10 pb-2 text-xs">
                                <span className="text-white/60">
                                    Seat <b className="ml-2 text-white">{s.code}</b>
                                </span>
                                <span className="flex items-center gap-2 font-semibold">
                                    ₾{Math.round((unitPrice * pct) / 100)}
                                    <button
                                        type="button"
                                        onClick={() => onRemove(s.seatId)}
                                        className="text-white/50 hover:text-white"
                                        aria-label={`Remove seat ${s.code}`}
                                    >
                                        ×
                                    </button>
                                </span>
                            </div>
                            <div className="flex gap-1.5">
                                {shown.map((t) => (
                                    <button
                                        key={t.slug}
                                        type="button"
                                        onClick={() => onType(s.seatId, t.slug)}
                                        className={`flex-1 rounded-full py-2 text-[11px] font-semibold transition-colors ${
                                            s.ticketType === t.slug
                                                ? 'bg-[#f5320f] text-white'
                                                : 'bg-[#272a42] text-white/80 hover:bg-[#31355a]'
                                        }`}
                                    >
                                        {t.name} {t.percent}%
                                    </button>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="mt-auto flex items-center justify-between pt-4">
                <span className="text-[11px] font-semibold">SUBTOTAL</span>
                <strong className="text-2xl">₾ {subtotal}</strong>
            </div>
        </>
    )
}