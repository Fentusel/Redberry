import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../../api/authApi.js";
import { closeModal, openLogin, setCredentials } from "../../store/slices/authSlice.js";
import { cancelPending } from "./authQueue.js";
import Field from "./Field.jsx";
import { validate } from "./validation.js";

const FIELDS = ["username", "email", "password", "confirmPassword"];
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function SignupForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const fileRef = useRef(null);

    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState(null);
    const [avatarError, setAvatarError] = useState("");
    const [touched, setTouched] = useState({});
    const [serverErrors, setServerErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!avatar) return setPreview(null);
        const url = URL.createObjectURL(avatar);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [avatar]);

    const errors = validate(values, FIELDS);
    const canSubmit = Object.keys(errors).length === 0 && !avatarError && !loading;

    //i know i just dont have time to fix duplicates :l
    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((v) => ({ ...v, [name]: value }));
        setServerErrors((s) => ({ ...s, [name]: undefined }));
        setFormError("");
    };

    const handleBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

    const fieldError = (name) =>
        serverErrors[name] || (touched[name] ? errors[name] : "");

    const handleAvatar = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!ALLOWED_TYPES.includes(file.type)) {
            setAvatar(null);
            setAvatarError("Only JPG, PNG or WEBP allowed");
            return;
        }
        setAvatarError("");
        setAvatar(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched(Object.fromEntries(FIELDS.map((f) => [f, true])));
        if (!canSubmit) return;

        setLoading(true);
        try {
            const data = await registerUser({ ...values, avatar });
            dispatch(setCredentials(data));
            dispatch(closeModal());
            cancelPending();
            navigate("/profile");
        } catch (err) {
            const res = err.response?.data;
            if (res?.errors) {
                const mapped = Object.fromEntries(
                    Object.entries(res.errors).map(([k, v]) => [k, v[0]])
                );
                if (mapped.password_confirmation) {
                    mapped.confirmPassword = mapped.password_confirmation;
                }
                if (mapped.avatar) setAvatarError(mapped.avatar);
                setServerErrors(mapped);
            } else {
                setFormError(res?.message || "Something went wrong. Try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <h2 className="text-lg font-extrabold">Sign up</h2>
            <p className="mb-5 mt-1 text-[10px] text-white/60">Welcome to Kino XII</p>
            <div className="mb-5 flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#1b1d2e] text-white/60 transition hover:bg-[#25283d]"
                    aria-label="Upload avatar">
                    {preview ? (
                        <img src={preview} alt="" className="h-full w-full object-cover" />
                    ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                    )}
                </button>
                <input
                    ref={fileRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handleAvatar}
                    className="hidden"
                />
                <div>
                    <p className="text-xs font-semibold">Upload avatar (optional)</p>
                    <p className={`text-[10px] ${avatarError ? "text-[#EC3013]" : "text-white/50"}`}>
                        {avatarError || "JPG, PNG or WEBP"}
                    </p>
                </div>
            </div>
            <div className="space-y-4">
                <Field
                    id="su-username"
                    label="Username"
                    name="username"
                    placeholder="User"
                    autoComplete="username"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={fieldError("username")}
                    valid={!!values.username && !errors.username}
                />
                <Field
                    id="su-email"
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="example@gmail.com"
                    autoComplete="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={fieldError("email")}
                    valid={!!values.email && !errors.email}
                />
                <div className="grid grid-cols-2 gap-3">
                    <Field
                        id="su-password"
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={fieldError("password")}
                        valid={!!values.password && !errors.password}
                    />
                    <Field
                        id="su-confirm"
                        label="Confirm password"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={fieldError("confirmPassword")}
                        valid={!!values.confirmPassword && !errors.confirmPassword}
                    />
                </div>
            </div>

            {formError && <p className="mt-3 text-[11px] text-[#EC3013]">{formError}</p>}

            <button
                type="submit"
                disabled={!canSubmit}
                className="mt-6 w-full rounded-full bg-[#EC3013] py-3 text-xs font-bold text-white transition hover:bg-[#d42a10] disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/50 disabled:hover:bg-white/20"
            >
                {loading ? "Creating account..." : "Sign up"}
            </button>

            <p className="mt-5 text-center text-[11px] text-white/70">
                Already have an account?{" "}
                <button
                    type="button"
                    onClick={() => dispatch(openLogin())}
                    className="font-bold text-[#EC3013] hover:underline"
                >
                    Log in
                </button>
            </p>
        </form>
    );
}