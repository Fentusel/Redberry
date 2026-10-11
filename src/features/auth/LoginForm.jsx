import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../api/authApi.js";
import { closeModal, openSignup, setCredentials } from "../../store/slices/authSlice.js";
import { runPending } from "./authQueue.js";
import Field from "./Field.jsx";
import { validate } from "./validation.js";

const FIELDS = ["email", "password"];

export default function LoginForm() {
    const dispatch = useDispatch();
    const [values, setValues] = useState({ email: "", password: "" });
    const [touched, setTouched] = useState({});
    const [serverErrors, setServerErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [loading, setLoading] = useState(false);

    const errors = validate(values, FIELDS);
    const canSubmit = Object.keys(errors).length === 0 && !loading;

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched({ email: true, password: true });
        if (!canSubmit) return;
        setLoading(true);
        try {
            const data = await loginUser(values);
            dispatch(setCredentials(data));
            dispatch(closeModal());
            runPending();
        } catch (err) {
            const res = err.response?.data;

            if (err.response?.status === 401) {
                setFormError(res?.message || "Invalid email or password");
                setValues((v) => ({ ...v, password: "" }));
                setTouched((t) => ({ ...t, password: false }));
            } else if (res?.errors) {
                setServerErrors(
                    Object.fromEntries(Object.entries(res.errors).map(([k, v]) => [k, v[0]]))
                );
            } else {
                setFormError(res?.message || "Something went wrong. Try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <h2 className="text-lg font-extrabold">Log in</h2>
            <p className="mb-6 mt-1 text-[10px] text-white/60">Welcome back to Kino XII</p>

            <div className="space-y-4">
                <Field
                    id="login-email"
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
                <Field
                    id="login-password"
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={fieldError("password")}
                    valid={!!values.password && !errors.password}
                />
            </div>

            {formError && (
                <p role="alert" className="mt-3 text-[11px] text-[#EC3013]">
                    {formError}
                </p>
            )}

            <button
                type="submit"
                disabled={!canSubmit}
                className="mt-6 w-full rounded-full bg-[#EC3013] py-3 text-xs font-bold text-white transition hover:bg-[#d42a10] disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/50 disabled:hover:bg-white/20">
                {loading ? "Logging in..." : "Log in"}
            </button>

            <p className="mt-5 text-center text-[11px] text-white/70">
                Don&apos;t have an account?{" "}
                <button
                    type="button"
                    onClick={() => dispatch(openSignup())}
                    className="font-bold text-[#EC3013] hover:underline">
                    Sign up
                </button>
            </p>
        </form>
    );
}