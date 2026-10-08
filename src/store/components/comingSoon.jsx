import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchComingSoon } from "../../api/axios.js";

export default function ComingSoon() {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector((state) => state.comingSoon);

    useEffect(() => {
        dispatch(fetchComingSoon());
    }, [dispatch]);

    return (
        <section className="h-[200px] w-full px-32">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-extrabold uppercase">Coming Soon...</h2>
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
            <div className="relative ">
                <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {items.map((movie) => (
                        <div
                            key={movie.id}
                            className="flex w-[470px] h-[145px] shrink-0 gap-3 rounded-2xl bg-[#1a1c2e] p-2.5 cursor-pointer  hover:border-[1px] hover:border-white/10"
                        >
                            <img
                                src={movie.posterUrl || movie.poster}
                                alt={movie.title}
                                className="h-[125px] w-[150px] shrink-0 rounded-xl object-cover"
                            />
                            <div className="flex min-w-0 flex-col justify-between py-0.5">
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-[#f5320f]">
                                        In cinemas {movie.releaseDate}
                                    </p>
                                    <h3 className="mt-1.5 truncate text-xs font-bold">
                                        {movie.title}
                                    </h3>
                                    <p className="mt-1 text-[10px] text-gray-400">
                                        {movie.genres[0].name} · {movie.runtimeMinutes} min
                                    </p>
                                    <span className="mt-2 inline-block rounded px-1.5 py-0.5 text-[9px] font-semibold bg-[#EC3013]/10 text-[#EC3013]">
                                        {movie.ageRating.code}
                                    </span>
                                </div>
                                <button className="mt-2 flex w-fit items-center gap-1.5 rounded-full border border-gray-400 px-3 py-1 text-[10px] font-medium text-white transition hover:bg-white/10">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-3 w-3"
                                    >
                                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                                    </svg>
                                    Notify Me
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="pointer-events-none absolute right-0 top-0 h-full w-[100px] bg-gradient-to-l from-[#070C1C]" />
            </div>
        </section>
    );
}