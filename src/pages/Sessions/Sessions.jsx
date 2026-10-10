import Footer from '../../components/layout/Footer.jsx'
import NavBar from '../../components/layout/Nav.jsx'
import Filter from '../../features/sessions/Filter.jsx'
import SessionsRow from '../../features/sessions/SessionsRow.jsx'
import {
    DEFAULT_SORT,
    useFilterOptions,
    useSessionFilters,
    useSessions,
} from '../../features/sessions/hooks.js'

export const Sessions = () => {
    const options = useFilterOptions()
    const filters = useSessionFilters(options)
    const { data, meta, loading, error } = useSessions(filters.params)

    const handlePage = (page) => {
        filters.setPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-[#070C1C] text-white">
            <main className="flex-1 px-6 py-6">
                <h1 className="text-xl font-bold">Sessions</h1>
                <p className="mb-6 text-xs text-white/60">Browse showtimes across all venues</p>
                <div className="flex gap-8">
                    <Filter options={options} filters={filters} />
                    <div className="min-w-0 flex-1">
                        <div className="mb-5 flex items-center justify-between text-xs">
                            <span className="text-white/70">
                                Showing {meta?.totalSessions ?? 0} sessions
                            </span>
                            <label className="flex items-center gap-2 text-white/60">
                                Sort:
                                <select
                                    value={filters.params.get('sort') ?? DEFAULT_SORT}
                                    onChange={(e) => filters.setSort(e.target.value)}
                                    className="cursor-pointer bg-transparent font-semibold text-white outline-none"
                                >
                                    {options?.sorts?.map((o) => (
                                        <option key={o.id} value={o.id} className="bg-[#1a1c2e]">
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        {error && <p className="py-10 text-center text-sm text-red-400">Failed to load sessions.</p>}
                        {!error && loading && data.length === 0 && (
                            <p className="py-10 text-center text-sm text-white/50">Loading...</p>
                        )}
                        {!error && !loading && data.length === 0 && (
                            <p className="py-10 text-center text-sm text-white/50">No sessions match your filters.</p>
                        )}
                        <div className={loading ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
                            {data.map(({ movie, sessions }) => (
                                <SessionsRow key={movie.id} movie={movie} sessions={sessions} />
                            ))}
                        </div>
                        <NavBar
                            page={meta?.currentPage ?? 1}
                            lastPage={meta?.lastPage ?? 1}
                            onChange={handlePage}
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}