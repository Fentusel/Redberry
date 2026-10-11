const seatBase = 'h-11 w-11 rounded-[10px] border text-xs font-bold transition-colors'
const seatStyle = {
    available: 'border-white/20 bg-[#1a1c2e] text-white hover:bg-[#272a42] cursor-pointer',
    selected: 'border-[#f5320f] bg-[#f5320f] text-white cursor-pointer',
    sold: 'border-white/5 bg-[#0f1426] text-white/20 cursor-not-allowed',
    held: 'border-white/10 text-white/40 cursor-not-allowed bg-[repeating-linear-gradient(135deg,#1a1c2e_0_4px,#2a2f47_4px_8px)]',
}

function Legend({ cls, label }) {
    return (
        <span className="flex items-center gap-2">
            <i className={`inline-block h-3.5 w-3.5 rounded ${cls}`} />
            {label}
        </span>
    )
}

export default function SeatMap({ seats, selectedIds, onToggle }) {
    const rows = {}
    seats.forEach((s) => (rows[s.row] ||= []).push(s))
    const cols = Math.max(...seats.map((s) => s.column ?? s.number), 0)

    return (
        <div>
            <div className="mb-6 rounded-lg bg-[#272a42] py-1.5 text-center text-[11px] font-semibold">SCREEN</div>

            <div className="flex flex-col items-center gap-2">
                {Object.keys(rows).sort().map((r) => (
                    <div key={r} className="flex items-center gap-3">
                        <span className="w-4 text-[11px] text-white/70">{r}</span>
                        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 44px)` }}>
                            {rows[r].map((s) => {
                                const selected = selectedIds.includes(s.id)
                                const state = selected ? 'selected' : s.status === 'sold' ? 'sold' : s.status === 'held' ? 'held' : 'available'
                                return (
                                    <button
                                        key={s.id}
                                        type="button"
                                        disabled={state === 'sold' || state === 'held'}
                                        onClick={() => onToggle(s)}
                                        style={{ gridColumn: s.column ?? s.number }}
                                        className={`${seatBase} ${seatStyle[state]}`}
                                    >
                                        {s.number}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-5 text-[11px] text-white/80">
                <Legend cls="border border-white/20 bg-[#1a1c2e]" label="Available" />
                <Legend cls="bg-[#f5320f]" label="Selected" />
                <Legend cls="bg-[#0f1426]" label="Sold" />
                <Legend cls="bg-[repeating-linear-gradient(135deg,#1a1c2e_0_3px,#2a2f47_3px_6px)]" label="Held by another user" />
            </div>
        </div>
    )
}