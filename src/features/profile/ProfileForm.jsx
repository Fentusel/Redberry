import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVenues, updateProfile } from "../../api/profileApi.js";
import { updateUser } from "../../store/slices/authSlice.js";
import Field from "../auth/Field.jsx";

const digitsOnly = (v) => v.replace(/\D/g, "");

const formatMobile = (v) =>
    digitsOnly(v)
        .slice(0, 9)
        .replace(/(\d{3})(?=\d)/g, "$1 ")
        .trim();

const todayStr = () => new Date().toISOString().slice(0, 10);

function validate(values) {
    const errors = {};
    if (values.fullName.trim().length < 3) errors.fullName = "Enter your full name";
    if (!/^5\d{8}$/.test(digitsOnly(values.mobileNumber))) {
        errors.mobileNumber = "Enter a valid number, e.g. 555 123 456";
    }
    if (!values.dateOfBirth) errors.dateOfBirth = "Date of birth is required";
    else if (values.dateOfBirth > todayStr()) errors.dateOfBirth = "Date can't be in the future";
    return errors;
}

export default function ProfileForm() {
    const dispatch = useDispatch();
    const user = useSelector((s) => s.auth.user);

    const [values, setValues] = useState({
        fullName: user?.fullName || "",
        mobileNumber: formatMobile(user?.mobileNumber || ""),
        dateOfBirth: user?.dateOfBirth || "",
        preferredVenueId: user?.preferredVenue?.id ? String(user.preferredVenue.id) : "",
    });
    const [venues, setVenues] = useState([]);
    const [touched, setTouched] = useState({});
    const [serverErrors, setServerErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getVenues()
            .then(setVenues)
            .catch((e) => console.error(e));
    }, []);

    const errors = validate(values);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((v) => ({
            ...v,
            [name]: name === "mobileNumber" ? formatMobile(value) : value,
        }));
        setServerErrors((s) => ({ ...s, [name]: undefined }));
        setFormError("");
        setSaved(false);
    };

    const handleBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

    const fieldError = (name) =>
        serverErrors[name] || (touched[name] ? errors[name] : "");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched({ fullName: true, mobileNumber: true, dateOfBirth: true });
        if (Object.keys(errors).length || loading) return;

        setLoading(true);
        setSaved(false);
        try {
            const updated = await updateProfile({
                fullName: values.fullName.trim(),
                mobileNumber: digitsOnly(values.mobileNumber),
                dateOfBirth: values.dateOfBirth,
                preferredVenueId: values.preferredVenueId
                    ? Number(values.preferredVenueId)
                    : null,
            });
            dispatch(updateUser(updated));
            setSaved(true);
        } catch (err) {
            const res = err.response?.data;
            if (res?.errors) {
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
        <form onSubmit={handleSubmit} noValidate className="max-w-2xl space-y-5">
            <Field
                id="pf-name"
                label="Full name"
                name="fullName"
                placeholder="e.g. John Doe"
                autoComplete="name"
                value={values.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={fieldError("fullName")}
            />
            <div>
                <Field
                    id="pf-email"
                    label="Email"
                    name="email"
                    value={user?.email || ""}
                    readOnly
                    disabled
                />
                <p className="mt-1.5 text-[11px] text-white/50">
                    Set at registration and cannot be changed
                </p>
            </div>
            <Field
                id="pf-mobile"
                label="Mobile number"
                name="mobileNumber"
                type="tel"
                inputMode="numeric"
                placeholder="555 123 456"
                autoComplete="tel-national"
                value={values.mobileNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={fieldError("mobileNumber")}
            />
            <Field
                id="pf-dob"
                label="Date of birth"
                name="dateOfBirth"
                type="date"
                max={todayStr()}
                value={values.dateOfBirth}
                onChange={handleChange}
                onBlur={handleBlur}
                error={fieldError("dateOfBirth")}
                className="[color-scheme:dark]"
            />
            <div>
                <label
                    htmlFor="pf-venue"
                    className="mb-1.5 block text-[11px] font-semibold text-white"
                >
                    Preferred Venue (Optional)
                </label>
                <div className="relative">
                    <select
                        id="pf-venue"
                        name="preferredVenueId"
                        value={values.preferredVenueId}
                        onChange={handleChange}
                        className={`w-full appearance-none rounded-lg bg-[#1b1d2e] px-3 py-2.5 pr-9 text-xs focus:outline-none ${
                            values.preferredVenueId ? "text-white" : "text-white/40"
                        }`}
                    >
                        <option value="" className="bg-[#1b1d2e]">
                            Select a venue
                        </option>
                        {venues.map((v) => (
                            <option key={v.id} value={v.id} className="bg-[#1b1d2e] text-white">
                                {v.name}
                            </option>
                        ))}
                    </select>
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/70"
                    >
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </div>
            </div>

            {formError && <p className="text-[11px] text-[#EC3013]">{formError}</p>}
            {saved && <p className="text-[11px] text-[#2ecc71]">Profile saved</p>}

            <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-[#EC3013] px-6 py-3 text-xs font-bold text-white transition hover:bg-[#d42a10] disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/50"
            >
                {loading ? "Saving..." : "Save changes"}
            </button>
        </form>
    );
}