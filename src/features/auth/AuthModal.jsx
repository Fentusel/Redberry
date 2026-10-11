import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeModal, logout } from "../../store/slices/authSlice.js";
import { cancelPending, hasPending } from "./authQueue.js";
import LoginForm from "./LoginForm.jsx";
import SignupForm from "./SignupForm.jsx";

export default function AuthModal() {
    const dispatch = useDispatch();
    const modal = useSelector((s) => s.auth.modal);

    const dismiss = () => {
        if (hasPending()) dispatch(logout());
        cancelPending();
        dispatch(closeModal());
    };

    useEffect(() => {
        if (!modal) return;
        const onKey = (e) => e.key === "Escape" && dismiss();
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [modal]);

    if (!modal) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-md"
            onMouseDown={(e) => e.target === e.currentTarget && dismiss()}>
            <div
                role="dialog"
                aria-modal="true"
                className="relative max-h-[95vh] w-full max-w-[400px] overflow-y-auto rounded-3xl border border-white/10 bg-[#0b0e1a] p-7 text-white shadow-2xl">
                <button
                    type="button"
                    onClick={dismiss}
                    aria-label="Close"
                    className="absolute right-6 top-6 text-white/80 transition hover:text-white">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                </button>
                {modal === "login" ? <LoginForm /> : <SignupForm />}
            </div>
        </div>
    );
}