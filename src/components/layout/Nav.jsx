const getPages = (current, last) => {
    const set = new Set([1, last, current - 1, current, current + 1])
    const sorted = [...set].filter((p) => p >= 1 && p <= last).sort((a, b) => a - b)

    const result = []
    sorted.forEach((p, i) => {
        if (i > 0 && p - sorted[i - 1] > 1) result.push('...')
        result.push(p)
    })
    return result
}

const base = 'w-9 h-9 rounded-full flex items-center justify-center text-xs transition-colors'

export default function NavBar({ page, lastPage, onChange }) {
    if (!lastPage || lastPage <= 1) return null

    return (
        <nav className="flex items-center justify-center gap-2 py-8" aria-label="NavBar">
            <button
                onClick={() => onChange(page - 1)}
                disabled={page === 1}
                className={`${base} bg-[#1e2033] hover:bg-[#2a2d45] disabled:opacity-40 disabled:cursor-not-allowed`}
                aria-label="Previous page"
            >
                ‹
            </button>

            {getPages(page, lastPage).map((p, i) =>
                p === '...' ? (
                    <span key={`dots-${i}`} className="w-6 text-center text-xs text-white/50">...</span>
                ) : (
                    <button
                        key={p}
                        onClick={() => onChange(p)}
                        aria-current={p === page ? 'page' : undefined}
                        className={`${base} ${
                            p === page ? 'bg-[#f5320f] text-white font-semibold' : 'hover:bg-[#1e2033] text-white/80'
                        }`}
                    >
                        {p}
                    </button>
                )
            )}

            <button
                onClick={() => onChange(page + 1)}
                disabled={page === lastPage}
                className={`${base} bg-[#1e2033] hover:bg-[#2a2d45] disabled:opacity-40 disabled:cursor-not-allowed`}
                aria-label="Next page"
            >
                ›
            </button>
        </nav>
    )
}