import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { searchMovies } from "../../api/moviesApi.js";
import { openLogin, openSignup } from "../../store/slices/authSlice.js";
import UserMenu from "./UserPage.jsx";

function useDebounce(value, delay = 300) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
}

function SearchBox() {
    const navigate = useNavigate();
    const wrapperRef = useRef(null);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [open, setOpen] = useState(false);
    const debouncedQuery = useDebounce(query.trim());

    useEffect(() => {
        if (!debouncedQuery) {
            setResults([]);
            return;
        }

        const controller = new AbortController();

        searchMovies(debouncedQuery, controller.signal)
            .then((data) => setResults(data))
            .catch((error) => {
                if (error.code !== "ERR_CANCELED") console.error(error);
            });

        return () => controller.abort();
    }, [debouncedQuery]);

    useEffect(() => {
        const handleClick = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const goTo = (slug) => {
        setOpen(false);
        setQuery("");
        setResults([]);
        navigate(`/movies/${slug}`);
    };

    return (
        <div ref={wrapperRef} className="relative w-[300px]">
            <div className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-2 backdrop-blur-md">
                <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="shrink-0 text-white/70"
                >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                </svg>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    placeholder="Search films and live events"
                    className="w-full bg-transparent text-xs text-white placeholder:text-white/70 focus:outline-none"
                />
            </div>

            {open && debouncedQuery && (
                <ul className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-xl bg-[#1b1d2e] shadow-2xl">
                    {results.length === 0 ? (
                        <li className="px-4 py-3 text-xs text-white/60">No results found</li>
                    ) : (
                        results.map((movie) => (
                            <li key={movie.id}>
                                <button
                                    type="button"
                                    onClick={() => goTo(movie.slug)}
                                    className="flex w-full items-center gap-3 px-3 py-2 text-left transition hover:bg-[#25283d]"
                                >
                                    <img
                                        src={movie.posterUrl}
                                        alt=""
                                        className="h-12 w-8 rounded object-cover"
                                    />
                                    <div className="min-w-0">
                                        <p className="truncate text-xs font-semibold text-white">
                                            {movie.title}
                                        </p>
                                        <p className="text-[10px] text-white/50">
                                            {movie.runtimeMinutes} min · {movie.releaseDate.slice(0, 4)}
                                        </p>
                                    </div>
                                </button>
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
}

export default function Header() {
    const dispatch = useDispatch();
    const token = useSelector((s) => s.auth.token);

    return (
        <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between bg-gradient-to-b from-black/50 px-20 py-8 text-white">
            <div className="flex items-center gap-8">
                <Link to="/" className="text-xl font-extrabold tracking-wide">
                    KINO <span className="text-[#EC3013]">XII</span>
                </Link>
                <Link
                    to="/sessions"
                    className="text-md font-semibold uppercase tracking-wide transition hover:text-white/70"
                >
                    Sessions
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <SearchBox />

                {token ? (
                    <UserMenu />
                ) : (
                    <>
                        <button
                            type="button"
                            onClick={() => dispatch(openSignup())}
                            className="rounded-full bg-[#EC3013] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#d42a10]"
                        >
                            Sign up
                        </button>
                        <button
                            type="button"
                            onClick={() => dispatch(openLogin())}
                            className="rounded-full bg-white px-5 py-2 text-xs font-bold text-black transition hover:bg-white/90"
                        >
                            Log in
                        </button>
                    </>
                )}
            </div>
        </header>
    );
}