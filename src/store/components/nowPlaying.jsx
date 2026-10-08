import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNowPlaying } from "../../api/axios.js";

export default function NowPlaying() {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector((state) => state.nowPlayingCards);

    useEffect(() => {
        dispatch(fetchNowPlaying());
    }, [dispatch]);

    return (
        <section className="min-h-[525px] w-full pt-[32px] px-32">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold uppercase">Now Playing</h2>
                <a href="/movies" className="text-xs text-[#f5320f] hover:underline">
                    See all
                </a>
            </div>

            {loading && <p className="text-sm text-gray-400">Loading...</p>}
            {error && (
                <p className="text-sm text-red-500">
                    {typeof error === "string" ? error : "Something went wrong"}
                </p>
            )}

            <div className="relative w-full flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {items.map((movie) => (
                    <div
                        key={movie.id}
                        className="w-[280px] h-[450px] shrink-0 rounded-3xl bg-[#14162a] p-2.5"
                    >
                        <img
                            src={movie.posterUrl }
                            alt={movie.title}
                            className="max-h-[300px] w-full rounded-xl object-cover"
                        />
                        <h3 className="mt-3 truncate text-sm font-bold">{movie.title}</h3>
                        <p className="mt-1 text-[10px] text-gray-400">
                            {movie.genres[0].name } · {movie.runtimeMinutes} min
                        </p>

                        <span className="mt-2 inline-block rounded  px-1.5 py-0.5 text-[9px] font-semibold bg-[#EC3013]/10 text-[#EC3013]">
                            {movie.ageRating.code}
                        </span>
                        <div className="mt-3 flex items-center justify-between">
                            <p className="text-[10px] text-gray-300">
                                From <span className="font-bold">₾ {movie.fromPrice}</span>
                            </p>
                            <button className="rounded-full bg-[#f5320f] px-3 py-1.5 text-[10px] h-[35px] w-[110px] font-bold text-white transition hover:bg-[#d92a0a]">
                                Buy Ticket
                            </button>
                        </div>
                    </div>
                ))}
                <div className="pointer-events-none absolute right-0 top-0 h-full w-[100px] bg-gradient-to-l from-[#070C1C]" />
            </div>
        </section>
    );
}