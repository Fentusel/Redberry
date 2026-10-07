import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeaturedCarousel } from '../slices/carouselSlice.js';

export const MovieCarousel = () => {
    const dispatch = useDispatch();

    const {
        items: movies,
        loading,
        error,
    } = useSelector((state) => state.carousel);

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        dispatch(fetchFeaturedCarousel());
    }, [dispatch]);

    useEffect(() => {
        if (movies.length === 0) {
            return;
        }
        { /* carousel interval */ }
        const interval = setInterval(() => {
            setCurrentIndex((current) => {
                return (current + 1) % movies.length;
            });
        }, 4000);

        return () => clearInterval(interval);
    }, [movies]);

    if (loading) {
        return (
            <section className="flex min-h-screen items-center justify-center bg-[#070c1c] text-white">
                Loading...
            </section>
        );
    }

    if (error) {
        return (
            <section className="flex min-h-screen items-center justify-center bg-[#070c1c] text-white">
                {error}
            </section>
        );
    }

    if (movies.length === 0) {
        return null;
    }

    const movie = movies[currentIndex];

    return (
        <section className="relative flex h-[700px] w-full flex-col overflow-hidden bg-[#070c1c] text-white">
            {movies.map((item, index) => (
                <img
                    key={item.id}
                    src={item.backdropUrl}
                    alt=""
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[500ms] ${
                        index === currentIndex
                            ? 'opacity-100'
                            : 'opacity-0'
                    }`}
                />
            ))}

            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 bg-black/20" />

            <div className="relative z-10 flex flex-1 items-center px-32">
                <div className="max-w-[580px]">

                    {/* premiere */}
                    <div className="mb-4 inline-flex rounded-md bg-[#EC3013] px-3 py-1 text-[10px] font-bold uppercase tracking-wide">
                        {movie.isComingSoon
                            ? 'Coming Soon'
                            : 'Featured Movie'}
                    </div>

                    {/* title */}
                    <h1 className="mb-4 text-4xl font-black uppercase leading-none tracking-tight md:text-5xl">
                        {movie.title}
                    </h1>

                    {/* movie information */}
                    <div className="mb-4 flex items-center gap-2 text-xs font-semibold">

                        <span className="rounded bg-[#EC3013] px-2 py-1">
                            {movie.ageRating.code}
                        </span>

                        <span className="rounded bg-white/15 px-2 py-1 backdrop-blur-sm">
                            {movie.runtimeMinutes} Min
                        </span>

                        {movie.formats?.slice(0, 2).map((format) => (
                            <span
                                key={format.id}
                                className="rounded bg-white/15 px-2 py-1 backdrop-blur-sm"
                            >
                                {format.name}
                            </span>
                        ))}
                    </div>

                    {/* movie description */}
                    <p className="mb-6 max-w-[550px] text-sm leading-6 text-white/75">
                        {movie.synopsis}
                    </p>

                    <div className="flex gap-3">

                        <button
                            type="button"
                            className="rounded-full bg-[#EC3013] px-5 py-3 text-xs font-bold transition hover:bg-[#DC2626]"
                        >
                            Buy tickets
                        </button>

                        <button
                            type="button"
                            className="rounded-full bg-white/15 px-5 py-3 text-xs font-bold backdrop-blur-md transition hover:bg-white/25"
                        >
                            All sessions
                        </button>

                    </div>
                </div>
            </div>

            {/* Carousel indicators */}
            <div className="relative z-20 flex w-full items-center gap-3 px-32 pb-8">
                {movies.map((item, index) => (
                    <div
                        key={item.id}
                        className={`h-[3px] flex-1 transition-all duration-300 ${
                            index === currentIndex
                                ? 'bg-[#EC3013]'
                                : 'bg-white'
                        }`}
                    />
                ))}
                <div className="flex items-center gap-3 pl-5 ">
                    <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#070c1c]/10 text-5xl backdrop-blur-md hover:bg-[#070c1c]/60 transition"
                    >‹</button>

                    <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#070c1c]/10 text-[54px] backdrop-blur-md hover:bg-[#070c1c]/60 transition"
                    >›</button>
                </div>
            </div>
        </section>
    );
};