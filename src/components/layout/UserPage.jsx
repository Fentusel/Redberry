import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../api/authApi.js";
import { logout } from "../../store/slices/authSlice.js";

function Avatar({ user, size = "h-10 w-10", text = "text-xs" }) {
    const name = user?.fullName || user?.username || "";
    const initials = name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();

    return (
        <div className={`relative shrink-0 ${size}`}>
            {user?.avatar ? (
                <img
                    src={user.avatar}
                    alt=""
                    className="h-full w-full rounded-xl object-cover"
                />
            ) : (
                <div
                    className={`flex h-full w-full items-center justify-center rounded-xl bg-[#1f2033] font-bold text-white ${text}`}
                >
                    {initials}
                </div>
            )}
            <span
                className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#050a18] ${
                    user?.profileComplete ? "bg-[#2ecc71]" : "bg-[#e8830c]"
                }`}
            />
        </div>
    );
}

export default function UserMenu() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((s) => s.auth.user);
    const wrapperRef = useRef(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open) return;
        const onClick = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        const onKey = (e) => e.key === "Escape" && setOpen(false);
        document.addEventListener("mousedown", onClick);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onClick);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const displayName = user?.fullName || user?.username || "";
    const firstName = displayName.split(" ")[0];
    const complete = !!user?.profileComplete;

    const go = (path) => {
        setOpen(false);
        navigate(path);
    };

    const handleLogout = () => {
        const token = localStorage.getItem("auth_token");
        setOpen(false);
        navigate("/");
        dispatch(logout());
        logoutUser(token);
    };

    return (
        <div ref={wrapperRef} className="relative">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={open}
                className="flex items-center gap-3"
            >
                <Avatar user={user} />
                <span className="text-sm font-semibold text-white/90">{firstName}</span>
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`ml-1 transition-transform ${open ? "rotate-180" : ""}`}
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>

            {open && (
                <div
                    role="menu"
                    className="absolute right-0 top-full z-40 mt-3 w-[300px] rounded-2xl border border-white/5 bg-[#050a18] p-4 shadow-2xl">
                    <div className="flex items-center gap-3">
                        <Avatar user={user} size="h-12 w-12" text="text-sm" />
                        <div className="min-w-0">
                            <p className="truncate text-sm font-bold">{displayName}</p>
                            <p className="truncate text-xs text-white/60">{user?.email}</p>
                        </div>
                    </div>
                    {complete ? (
                        <div className="mt-4 flex items-center justify-between rounded-xl bg-[#0d2420] px-4 py-3">
                            <span className="text-sm font-bold text-[#2ecc71]">
                                Profile Complete
                            </span>
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#2ecc71"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round">
                                <path d="m5 12 5 5L20 7" />
                            </svg>
                        </div>
                    ) : (
                        <div className="mt-4 rounded-xl bg-[#1f1a17] px-4 py-3">
                            <p className="text-sm font-bold text-[#e8830c]">Profile incomplete</p>
                            <p className="mt-0.5 text-xs text-white/60">
                                Please complete your profile to enable booking
                            </p>
                        </div>
                    )}
                    <div className="mt-3 space-y-1">
                        <button
                            type="button"
                            role="menuitem"
                            onClick={() => go("/profile")}
                            className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-sm font-semibold transition hover:bg-white/5">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="8" r="4" />
                                <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
                            </svg>
                            My Profile
                        </button>
                        <button
                            type="button"
                            role="menuitem"
                            onClick={() => go("/profile?tab=tickets")}
                            className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-sm font-semibold transition hover:bg-white/5">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 9a2 2 0 0 0 0 6v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3a2 2 0 0 1 0-6V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1z" />
                                <path d="M13 5v14" strokeDasharray="2 3" />
                            </svg>
                            My Tickets
                        </button>
                    </div>
                    <div className="mt-2 border-t border-white/10 pt-2">
                        <button
                            type="button"
                            role="menuitem"
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-sm font-semibold text-[#EC3013] transition hover:bg-white/5"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <path d="m16 17 5-5-5-5M21 12H9" />
                            </svg>
                            Log out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}