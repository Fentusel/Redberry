import SessionCard from './SessionCard'

export default function SessionsRow({ movie, sessions }) {
    return (
        <section className="border-b border-white/10 py-6 first:pt-0">
            <div className="mb-4 flex items-center gap-3">
                <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="h-[52px] w-9 rounded object-cover"
                />
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold">{movie.title}</h2>
                        <span className="rounded-full bg-red-900/50 px-1.5 py-0.5 text-[9px] font-semibold text-red-500">
                            {movie.ageRating.code}
                        </span>
                    </div>
                    <p className="mt-1 text-[11px] text-white/60">{movie.runtimeMinutes} min</p>
                </div>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
                {sessions.map((s) => (
                    <SessionCard key={s.id} session={s} />
                ))}
            </div>
        </section>
    )
}