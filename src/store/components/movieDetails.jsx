import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovieDetails, fetchMovieSessions } from "../../api/moviesApi.js";
import { setSelectedDate, clearMovieDetails } from "../slices/movieDetailsSlice.js";
import BookingModal from "../../features/booking/BookingModal";
import useRequireAuth from "../../features/auth/useRequireAuth";

function getDayParts(iso) {
    const date = new Date(`${iso}T00:00:00`);
    return {
        weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
        day: date.getDate(),
    };
}

function formatReleaseDate(iso) {
    return new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
        day: "numeric",
        weekday: "long",
    });
}

function groupByHall(sessions) {
    const halls = {};

    sessions.forEach((session) => {
        const id = session.hall.id;
        if (!halls[id]) {
            halls[id] = { hall: session.hall, sessions: [] };
        }
        halls[id].sessions.push(session);
    });
    return Object.values(halls);
}

function DetailItem({ label, children }) {
    return (
        <div className="mb-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white/50">
                {label}
            </p>
            <p className=" text-xs font-semibold text-white">{children}</p>
        </div>
    );
}

function SessionTicket({ session, onSelect }) {
    const { isSoldOut, time, language, format, price, seatsLeft } = session;

    return (
        <button
            type="button"
            onClick={() => onSelect(session)}
            disabled={isSoldOut}
            title={language.name}
            className={`flex overflow-hidden rounded-xl bg-[#0b0f1f] text-left transition ${
                isSoldOut ? "cursor-not-allowed opacity-40" : "hover:bg-[#10152b]"
            }`}
        >
            <div className="flex min-w-[120px] flex-col items-center justify-center px-5 py-3">
                <span className="text-lg font-bold">{time}</span>
                <div className="mt-1 flex items-center gap-2 text-[10px]">
                    <span className="text-white/50">{language.code}</span>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 font-semibold uppercase text-white/70">
                        {format.name}
                    </span>
                </div>
            </div>
            <div className="border-l-2 border-dashed border-white/30" />
            <div className="flex min-w-[80px] flex-col items-center justify-center px-4 py-3">
                {isSoldOut ? (
                    <span className="text-xs font-bold text-white/60">Sold out</span>
                ) : (
                    <>
                        <span className="text-base font-bold text-[#EC3013]">₾{price}</span>
                        <span className="mt-1 flex items-center gap-1 text-[10px] text-white/60">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M4 10a2 2 0 0 0 0 4v4h16v-4a2 2 0 0 1 0-4V6H4v4z" />
                            </svg>
                            {seatsLeft} left
                        </span>
                    </>
                )}
            </div>
        </button>
    );
}

function SessionsList({ groups, status, error, selectedDate, onSelect }) {
    if (status === "idle" || status === "loading") {
        return <p className="mt-8 text-sm text-white/60">Loading sessions...</p>;
    }
    if (status === "failed") {
        return <p className="mt-8 text-sm text-red-500">{error}</p>;
    }
    if (groups.length === 0) {
        return <p className="mt-8 text-sm text-white/60">No sessions for this date.</p>;
    }

    return (
        <div className="mt-8 flex flex-col gap-8">
            {groups.map(({ venue, sessions }) => (
                <div key={venue.id}>
                    <h3 className="mb-3 text-sm font-bold">{venue.name}</h3>
                    <div className="flex flex-wrap gap-4">
                        {groupByHall(sessions).map(({ hall, sessions }) => (
                            <div key={hall.id} className="rounded-2xl bg-[#1b1d2e] p-4">
                                <p className="mb-3 text-xs font-semibold">Hall {hall.name}</p>
                                <div className="flex flex-wrap gap-3">
                                    {sessions.map((session) => (
                                        <SessionTicket
                                            key={session.id}
                                            session={session}
                                            onSelect={(s) =>
                                                onSelect({
                                                    ...s,
                                                    venue: s.venue ?? venue,
                                                    hall: s.hall ?? hall,
                                                    date: s.date ?? selectedDate,
                                                })
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function DatePicker({ dates, selectedDate, onSelect }) {
    return (
        <div className="flex gap-3 overflow-x-auto pb-2">
            {dates.map((date) => {
                const { weekday, day } = getDayParts(date);
                const isActive = date === selectedDate;

                return (
                    <button
                        key={date}
                        onClick={() => onSelect(date)}
                        className={`flex h-[70px] w-[70px] shrink-0 flex-col items-center justify-center rounded-xl text-xs font-bold transition ${
                            isActive
                                ? "bg-red-600 text-white"
                                : "bg-[#1b1d2e] text-white hover:bg-[#25283d]"
                        }`}
                    >
                        <span className="text-[10px]">{weekday}</span>
                        <span className="text-sm">{day}</span>
                    </button>
                );
            })}
        </div>
    );
}

function Hero({ movie }) {
    return (
        <section className="relative h-[450px] overflow-hidden">
            <img
                src={movie.backdropUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050b1a] via-[#050b1a]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050b1a]/70 to-transparent" />

            <div className="relative flex flex-col gap-8 px-20 py-[8rem] md:flex-row md:items-end ">
                <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="h-[265px] w-[205px] rounded-2xl object-cover shadow-2xl"
                />
                <div className="max-w-[560px] pb-2">
                    <div className="mb-3 flex flex-wrap gap-2">
                        {movie.genres.map((genre) => (
                            <span
                                key={genre.id}
                                className="rounded bg-[#EC3013]/10 px-2 py-0.5 text-xs font-semibold uppercase text-[#EC3013]"
                            >
                                {genre.name}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-3xl font-extrabold uppercase md:text-4xl">
                        {movie.title}
                    </h1>
                    <p className="mt-3 text-sm leading-relaxed">{movie.synopsis}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold">
                        <span className="rounded-full bg-[#EC3013]/10 px-2 py-1 text-[#EC3013]">
                            {movie.ageRating.code}
                        </span>
                        <span className="rounded-full bg-white/15 px-3 py-1">
                            {movie.runtimeMinutes} Min
                        </span>
                        {movie.formats.map((format) => (
                            <span
                                key={format.id}
                                className="rounded-full bg-white/15 px-3 py-1 uppercase"
                            >
                                {format.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function MovieInfo({ movie }) {
    const { ageRating } = movie;

    return (
        <aside>
            <h2 className="mb-5 text-base font-bold">Details</h2>
            <DetailItem label="Director">{movie.director}</DetailItem>
            <DetailItem label="Main cast">{movie.cast}</DetailItem>
            <DetailItem label="Duration">{movie.runtimeMinutes} minutes</DetailItem>
            <DetailItem label="Release date">{formatReleaseDate(movie.releaseDate)}</DetailItem>
            <DetailItem label="Formats">
                {movie.formats.map((format) => format.name).join(", ")}
            </DetailItem>
            <DetailItem label="From">₾{movie.fromPrice}</DetailItem>
            {ageRating.minAge > 0 && (
                <div className="rounded-lg bg-[#1f1a17] p-3">
                    <p className="text-[10px] font-bold uppercase text-orange-500">
                        Rating note
                    </p>
                    <p className="mt-1 text-[10px] text-orange-400">
                        <span className="mr-2 font-bold">{ageRating.code}</span>
                        {ageRating.description}
                    </p>
                </div>
            )}
        </aside>
    );
}

export default function MovieDetails() {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const {
        movie,
        movieStatus,
        movieError,
        selectedDate,
        groups,
        sessionsStatus,
        sessionsError,
    } = useSelector((state) => state.movieDetails);

    const [booking, setBooking] = useState(null);
    const requireAuth = useRequireAuth();

    const openBooking = (session) => requireAuth(() => setBooking(session));

    useEffect(() => {
        const request = dispatch(fetchMovieDetails(slug));
        return () => {
            request.abort();
            dispatch(clearMovieDetails());
        };
    }, [slug, dispatch]);

    useEffect(() => {
        if (!selectedDate) return;
        const request = dispatch(fetchMovieSessions({ slug, date: selectedDate }));
        return () => request.abort();
    }, [slug, selectedDate, dispatch]);

    if (movieStatus === "idle" || movieStatus === "loading") {
        return <div className="p-10 text-center text-white/60">Loading...</div>;
    }
    if (movieStatus === "failed" || !movie) {
        return (
            <div className="p-10 text-center text-red-500">
                {movieError || "Movie not found"}
            </div>
        );
    }

    return (
        <div className="">
            <Hero movie={movie} />
            <div className="grid gap-10 px-20 py-8 lg:grid-cols-[1fr_300px]">
                <section>
                    <h2 className="mb-5 text-xl font-bold">Sessions</h2>
                    <DatePicker
                        dates={movie.availableDates.slice(0, 7)}
                        selectedDate={selectedDate}
                        onSelect={(date) => dispatch(setSelectedDate(date))}
                    />
                    <SessionsList
                        groups={groups}
                        status={sessionsStatus}
                        error={sessionsError}
                        selectedDate={selectedDate}
                        onSelect={openBooking}
                    />
                </section>
                <MovieInfo movie={movie} />
            </div>
            {booking && (
                <BookingModal
                    session={booking}
                    movie={movie}
                    onClose={() => setBooking(null)}
                />
            )}
        </div>
    );
}