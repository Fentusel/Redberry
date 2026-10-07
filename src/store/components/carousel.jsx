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

    const goPrevious = () => {
        setCurrentIndex((current) =>
            current === 0 ? movies.length - 1 : current - 1
        );
    };

    const goNext = () => {
        setCurrentIndex((current) =>
            (current + 1) % movies.length
        );
    };

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
                <div className="max-w-[580px] h-[310px] flex flex-col">

                    {/* premiere */}
                    <div className="mb-4 inline-flex rounded-full bg-[#EC3013]/10 text-[#EC3013] w-[200px] px-3 py-1 text-[10px] font-bold uppercase tracking-wide">
                        {movie.isComingSoon
                            ? 'Coming Soon'
                            : 'PREMIERE · WEEK OF 15 SEPT'}
                    </div>

                    {/* title */}
                    <div className="gap-[18px]">
                        <h1 className="mb-4 text-4xl font-black uppercase leading-none tracking-tight md:text-5xl">
                            {movie.title}
                        </h1>

                        <div className="gap-[8px]">
                            {/* movie information */}
                            <div className="mb-4 flex items-center gap-2 text-xs font-semibold">
                                <span className="rounded-full bg-[#EC3013]/10 text-[#EC3013] px-[12px] py-[6px]">
                                    {movie.ageRating.code}
                                </span>
                                <span className="rounded-full bg-white/10 px-[12px] py-[6px] backdrop-blur-sm">
                                    {movie.runtimeMinutes} Min
                                </span>
                                    {movie.formats?.slice(0, 2).map((format) => (
                                    <span
                                        key={format.id}
                                        className="rounded-full bg-white/10 px-[12px] py-[6px] backdrop-blur-sm"
                                        >
                                    {format.name}
                                    </span>
                                ))}
                            </div>
                            {/* movie description */}
                            <p className="mb-6 w-[580px] text-sm leading-6 text-white">
                                {movie.synopsis}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-[12px] mt-auto">
                        <button
                            type="button"
                            className="flex gap-[4px] rounded-full bg-[#EC3013] px-5 py-3 text-xs font-bold transition hover:bg-[#DC2626]"
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.93907 0.586073C8.1248 0.40027 8.34531 0.252879 8.58802 0.152318C8.83072 0.0517584 9.09086 0 9.35357 0C9.61628 0 9.87642 0.0517584 10.1191 0.152318C10.3618 0.252879 10.5823 0.40027 10.7681 0.586073L11.4981 1.31707C11.7981 1.61707 11.7661 2.06007 11.5541 2.33707C11.3374 2.62593 11.2323 2.98324 11.2578 3.34341C11.2834 3.70357 11.4381 4.04242 11.6934 4.29773C11.9487 4.55305 12.2876 4.7077 12.6477 4.7333C13.0079 4.7589 13.3652 4.65372 13.6541 4.43707L13.7661 4.36707C13.9109 4.28799 14.0774 4.25754 14.2409 4.28023C14.4043 4.30292 14.5562 4.37753 14.6741 4.49307L15.4141 5.23307C16.1941 6.01407 16.1941 7.28207 15.4141 8.06307L13.5961 9.88007L12.2371 8.52107C12.1428 8.42999 12.0165 8.3796 11.8854 8.38074C11.7543 8.38188 11.6289 8.43446 11.5362 8.52716C11.4435 8.61987 11.3909 8.74527 11.3897 8.87637C11.3886 9.00747 11.439 9.13377 11.5301 9.22807L12.8891 10.5871L8.06107 15.4151C7.87534 15.6009 7.65483 15.7483 7.41213 15.8488C7.16942 15.9494 6.90929 16.0011 6.64657 16.0011C6.38386 16.0011 6.12372 15.9494 5.88102 15.8488C5.63831 15.7483 5.4178 15.6009 5.23207 15.4151L4.49207 14.6751C4.19207 14.3751 4.22407 13.9331 4.43607 13.6551L4.50607 13.5581C4.69619 13.2614 4.7758 12.9073 4.73096 12.5578C4.68611 12.2083 4.51968 11.8858 4.26083 11.6468C4.00198 11.4077 3.66724 11.2674 3.3153 11.2505C2.96336 11.2335 2.61669 11.341 2.33607 11.5541C2.05807 11.7661 1.61507 11.7981 1.31407 11.4981L0.586073 10.7681C0.40027 10.5823 0.252879 10.3618 0.152318 10.1191C0.0517584 9.87642 0 9.61628 0 9.35357C0 9.09086 0.0517584 8.83072 0.152318 8.58802C0.252879 8.34531 0.40027 8.1248 0.586073 7.93907L5.41307 3.11107L6.76307 4.46107C6.85737 4.55215 6.98368 4.60255 7.11477 4.60141C7.24587 4.60027 7.37128 4.54769 7.46398 4.45498C7.55669 4.36228 7.60927 4.23687 7.61041 4.10577C7.61155 3.97468 7.56115 3.84837 7.47007 3.75407L6.12007 2.40407L7.93907 0.586073ZM9.23707 5.52207C9.14277 5.43099 9.01647 5.3806 8.88537 5.38174C8.75427 5.38287 8.62887 5.43546 8.53616 5.52816C8.44346 5.62087 8.39088 5.74627 8.38974 5.87737C8.3886 6.00847 8.43899 6.13477 8.53007 6.22907L9.76307 7.46207C9.85737 7.55315 9.98368 7.60355 10.1148 7.60241C10.2459 7.60127 10.3713 7.54869 10.464 7.45598C10.5567 7.36328 10.6093 7.23787 10.6104 7.10677C10.6115 6.97568 10.5612 6.84937 10.4701 6.75507L9.23707 5.52207Z" fill="white"/>
                            </svg>
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
            <div className="relative z-20 flex h-[54px] w-full items-center gap-3 px-32 pb-8">
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
                <div className="flex h-full items-center gap-[12px] pl-5 ">
                    <button
                        type="button"
                        className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[#070c1c]/10 text-5xl backdrop-blur-md hover:bg-[#070c1c] transition-colors duration-300 ease-in-out"
                        onClick={goPrevious}
                    >
                        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21.2499 8.5C21.2499 8.5 12.75 14.7602 12.75 17.0001C12.75 19.24 21.25 25.5 21.25 25.5" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" stroke="white"/>
                        </svg>
                    </button>

                    <button
                        type="button"
                        className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[#070c1c]/10 text-5xl backdrop-blur-md hover:bg-[#070c1c] transition-colors duration-300 ease-in-out"
                        onClick={goNext}
                    >
                        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.7501 8.5C12.7501 8.5 21.25 14.7602 21.25 17.0001C21.25 19.24 12.75 25.5 12.75 25.5" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" stroke="white"/>
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};