import { useState } from 'react'

const digits = (s) => s.replace(/\D/g, '')

const validators = {
    fullName: (v) => (v.trim().length >= 3 ? '' : 'Enter your full name'),
    email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? '' : 'Enter a valid email'),
    mobileNumber: (v) => (digits(v).length === 9 ? '' : 'Enter a 9-digit number'),
    cardNumber: (v) => (digits(v).length === 16 ? '' : 'Card number must be 16 digits'),
    expiry: (v) => {
        const m = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(v)
        if (!m) return 'Use MM/YY'
        return new Date(2000 + +m[2], +m[1], 1) > new Date() ? '' : 'Card has expired'
    },
    cvv: (v) => (/^\d{3,4}$/.test(v) ? '' : 'Invalid CVV'),
}

function Field({ label, name, values, touched, errors, serverErrors, onChange, onBlur, placeholder }) {
    const err = (touched[name] && errors[name]) || serverErrors?.[name]
    const ok = touched[name] && !errors[name] && !serverErrors?.[name]
    return (
        <label className="block text-xs font-semibold">
            {label}
            <div className="relative mt-1.5">
                <input
                    name={name}
                    value={values[name]}
                    placeholder={placeholder}
                    onChange={onChange}
                    onBlur={onBlur}
                    inputMode={name === 'fullName' || name === 'email' ? undefined : 'numeric'}
                    className={`w-full rounded-[10px] border bg-[#1a1c2e] px-3.5 py-3.5 text-xs font-medium text-white
                        outline-none placeholder:text-white/30 focus:border-white/30 ${
                        err ? 'border-[#f5320f]' : 'border-transparent'
                    }`}
                />
                {ok && <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-emerald-400">✓</span>}
            </div>
            {err && <small className="mt-1 block text-[11px] font-normal text-[#ff6b57]">{err}</small>}
        </label>
    )
}

export default function CheckoutForm({ initial, hold, session, movie, busy, serverErrors, onSubmit }) {
    const [values, setValues] = useState({
        fullName: initial?.fullName ?? '',
        email: initial?.email ?? '',
        mobileNumber: initial?.mobileNumber ?? '',
        cardNumber: '',
        expiry: '',
        cvv: '',
    })
    const [touched, setTouched] = useState(() =>
        Object.fromEntries(['fullName', 'email', 'mobileNumber'].filter((k) => initial?.[k]).map((k) => [k, true]))
    )

    const errors = Object.fromEntries(Object.keys(validators).map((k) => [k, validators[k](values[k])]))
    const valid = Object.values(errors).every((e) => !e)

    const onChange = (e) => {
        let { name, value } = e.target
        if (name === 'cardNumber') value = digits(value).slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
        if (name === 'expiry') {
            const d = digits(value).slice(0, 4)
            value = d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
        }
        if (name === 'cvv') value = digits(value).slice(0, 4)
        setValues((v) => ({ ...v, [name]: value }))
    }
    const onBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }))

    const submit = (e) => {
        e.preventDefault()
        setTouched({
            fullName: true,
            email: true,
            mobileNumber: true,
            cardNumber: true,
            expiry: true,
            cvv: true,
        })
        if (valid && !busy) onSubmit(values)
    }

    const fp = { values, touched, errors, serverErrors, onChange, onBlur }

    const counts = {}
    hold.seats.forEach((s) => (counts[s.ticketType.name] = (counts[s.ticketType.name] || 0) + 1))
    const ticketsText = Object.entries(counts).map(([n, c]) => `${c} x ${n}`).join(', ')

    return (
        <form onSubmit={submit} noValidate className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_300px]">
            <div className="flex flex-col gap-4">
                <Field {...fp} label="Full name" name="fullName" placeholder="e.g. John Doe" />
                <div className="grid grid-cols-2 gap-4">
                    <Field {...fp} label="Email" name="email" placeholder="e.g. john@mail.com" />
                    <Field {...fp} label="Mobile number" name="mobileNumber" placeholder="e.g. 555 123 456" />
                </div>
                <hr className="border-white/10" />
                <Field {...fp} label="Card number" name="cardNumber" placeholder="e.g. 1234 4567 8901 2345" />
                <div className="grid grid-cols-2 gap-4">
                    <Field {...fp} label="Expiry" name="expiry" placeholder="e.g. 12/34" />
                    <Field {...fp} label="CVV" name="cvv" placeholder="e.g. 123" />
                </div>
            </div>

            <aside className="flex flex-col gap-3 md:border-l md:border-white/10 md:pl-6">
                <h4 className="text-xs font-bold">Summary</h4>
                <div className="flex flex-col gap-2 rounded-xl bg-[#1a1c2e] p-3.5 text-xs">
                    <b className="text-[13px]">{movie.title}</b>
                    <p className="border-b border-white/10 pb-2 text-[11px] text-white/60">
                        Hall {session.hall.name} · {session.date} · {session.time}
                    </p>
                    <div className="flex justify-between">
                        <span className="text-white/60">Seats</span>
                        <b>{hold.seats.map((s) => s.code).join(', ')}</b>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-white/60">Tickets</span>
                        <b>{ticketsText}</b>
                    </div>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4">
                    <span className="text-[11px] font-semibold">SUBTOTAL</span>
                    <strong className="text-2xl">₾ {hold.subtotal}</strong>
                </div>
                <button
                    type="submit"
                    disabled={!valid || busy}
                    className="rounded-full bg-[#f5320f] py-3.5 text-xs font-bold text-white transition
                        hover:brightness-110 disabled:cursor-not-allowed disabled:bg-[#4a4d5e] disabled:text-white/50"
                >
                    {busy ? 'Processing…' : 'Pay: Complete order'}
                </button>
            </aside>
        </form>
    )
}