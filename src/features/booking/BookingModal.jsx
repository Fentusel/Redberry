import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getFilterOptions, getSeats, createHold, getHold, releaseHold, checkout } from '../../api/sessionsApi'
import { useCountdown, formatTime } from './useCountdown'
import SeatMap from './SeatMap'
import TicketPanel from './TicketPanel'
import CheckoutForm from './CheckoutForm'
import Confirmation from './Confirmation'

// i dont have time for ui. it is what it is

const parseErr = (e) => ({
    status: e.response?.status,
    message: e.response?.data?.message,
    errors: e.response?.data?.errors,
    contested: e.response?.data?.contested,
})
const flatErrors = (errors) =>
    Object.fromEntries(Object.entries(errors).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]))

export default function BookingModal({ session, movie, onClose }) {
    const profile = useSelector((s) => s.auth.user)

    const storageKey = `hold:${session.id}`
    const [step, setStep] = useState('seats')
    const [seats, setSeats] = useState([])
    const [selection, setSelection] = useState([])
    const [hold, setHold] = useState(null)
    const [order, setOrder] = useState(null)
    const [banner, setBanner] = useState(null)
    const [busy, setBusy] = useState(false)
    const [fieldErrors, setFieldErrors] = useState({})
    const [types, setTypes] = useState([])

    const holdRef = useRef(null)
    const paidRef = useRef(false)
    holdRef.current = hold

    const loadSeats = useCallback(async (soldCodes = []) => {
        const res = await getSeats(session.id)
        const list = res.data?.seats ?? res.data
        setSeats(list.map((s) => (soldCodes.includes(s.code) ? { ...s, status: 'sold' } : s)))
    }, [session.id])

    useEffect(() => {
        void loadSeats()
        getFilterOptions().then((res) => {
            const raw = res.data?.ticketTypes ?? []
            setTypes(
                raw.map((t) => ({
                    slug: t.slug,
                    name: t.name,
                    percent: t.percent ?? Math.round((t.ratio ?? 1) * 100),
                }))
            )
        })
    }, [loadSeats])

    useEffect(() => {
        const id = sessionStorage.getItem(storageKey)
        if (!id) return
        getHold(id)
            .then((res) => {
                const h = res.data
                if (h.isLive) {
                    setHold(h)
                    setSelection(h.seats.map((s) => ({ seatId: s.seatId, code: s.code, ticketType: s.ticketType.slug })))
                    setStep('checkout')
                } else {
                    sessionStorage.removeItem(storageKey)
                    setBanner({ text: 'Your hold time expired. Please re-select your seats.' })
                }
            })
            .catch(() => sessionStorage.removeItem(storageKey))
    }, [storageKey])

    useEffect(
        () => () => {
            if (holdRef.current && !paidRef.current) {
                sessionStorage.removeItem(storageKey)
                releaseHold(holdRef.current.holdId).catch(() => {})
            }
        },
        [storageKey]
    )

    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && onClose()
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [onClose])

    const resetToStep1 = useCallback(
        (text) => {
            sessionStorage.removeItem(storageKey)
            setHold(null)
            setSelection([])
            setFieldErrors({})
            setStep('seats')
            setBanner({ text })
            void loadSeats()
        },
        [loadSeats]
    )

    const left = useCountdown(hold?.expiresAt, () =>
        resetToStep1('Your hold time expired. Please re-select your seats.')
    )

    const handleContested = async (codes) => {
        setBanner({ text: `Seats ${codes.join(', ')} were just taken. Your other seats are still selected.` })
        setSeats((prev) => prev.map((s) => (codes.includes(s.code) ? { ...s, status: 'sold' } : s)))
        setSelection((prev) => prev.filter((s) => !codes.includes(s.code)))
        sessionStorage.removeItem(storageKey)
        setHold(null)
        setStep('seats')
        await loadSeats(codes)
    }

    const toggleSeat = (seat) => {
        setBanner(null)
        setSelection((prev) => {
            if (prev.some((s) => s.seatId === seat.id)) return prev.filter((s) => s.seatId !== seat.id)
            if (prev.length >= 3) return prev
            return [...prev, { seatId: seat.id, code: seat.code, ticketType: 'adult' }]
        })
    }
    const setType = (seatId, ticketType) =>
        setSelection((prev) => prev.map((s) => (s.seatId === seatId ? { ...s, ticketType } : s)))
    const removeSeat = (seatId) => setSelection((prev) => prev.filter((s) => s.seatId !== seatId))

    const pctOf = (slug) => types.find((t) => t.slug === slug)?.percent ?? 100
    const subtotal = selection.reduce((sum, s) => sum + Math.round((session.price * pctOf(s.ticketType)) / 100), 0)

    const goCheckout = async () => {
        setBusy(true)
        setBanner(null)
        try {
            const res = await createHold(
                session.id,
                selection.map((s) => ({ seatId: s.seatId, ticketType: s.ticketType }))
            )
            setHold(res.data)
            sessionStorage.setItem(storageKey, res.data.holdId)
            setStep('checkout')
        } catch (e) {
            const { status, message, errors, contested } = parseErr(e)
            if (status === 409) await handleContested(contested ?? [])
            else if (status === 422 && errors) setBanner({ text: Object.values(flatErrors(errors)).join(' ') })
            else if (status === 422) setBanner({ text: message, profile: /profile/i.test(message ?? '') })
            else setBanner({ text: message ?? 'Something went wrong. Please try again.' })
        } finally {
            setBusy(false)
        }
    }

    const pay = async (values) => {
        setBusy(true)
        setFieldErrors({})
        try {
            const res = await checkout({ holdId: hold.holdId, ...values })
            paidRef.current = true
            sessionStorage.removeItem(storageKey)
            setHold(null)
            setOrder(res.data)
            setStep('done')
        } catch (e) {
            const { status, message, errors, contested } = parseErr(e)
            if (status === 422 && errors) setFieldErrors(flatErrors(errors))
            else if (status === 422) resetToStep1(message ?? 'Your hold time expired. Please re-select your seats.')
            else if (status === 409) await handleContested(contested ?? [])
            else setBanner({ text: message ?? 'Payment failed. Please try again.' })
        } finally {
            setBusy(false)
        }
    }

    const subtitle = `${session.venue.name} · Hall ${session.hall.name} · ${new Date(session.date).toLocaleDateString(
        'en-GB',
        { weekday: 'long', day: 'numeric', month: 'long' }
    )} · ${session.time} · ${session.format?.name} · ${session.language?.name}`

    return (
        <div
            className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4 backdrop-blur-md"
            onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="max-h-[92vh] w-full max-w-[1000px] overflow-y-auto rounded-3xl bg-[#060b1a] p-7 text-white shadow-2xl">
                {step === 'done' ? (
                    <Confirmation order={order} onClose={onClose} />
                ) : (
                    <>
                        <header className="mb-5 flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-extrabold uppercase">{movie.title}</h3>
                                <p className="mt-1 text-[11px] text-white/60">{subtitle}</p>
                            </div>
                            <div className="rounded-xl bg-[#1a1c2e] px-4 py-2 text-center">
                                <small className="block text-[10px] font-semibold uppercase text-white/60">Seats held</small>
                                <b className="text-sm">{formatTime(left)}</b>
                            </div>
                        </header>

                        <div className="mb-4 grid grid-cols-2 rounded-full bg-[#1a1c2e] p-0">
                            {[
                                ['seats', 'SEATS'],
                                ['checkout', 'CHECKOUT'],
                            ].map(([key, label]) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => key === 'seats' && setStep('seats')}
                                    disabled={key === 'checkout'}
                                    className={`rounded-full py-2.5 text-[11px] font-bold transition-colors ${
                                        step === key ? 'bg-[#f5320f] text-white' : 'text-white/80'
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {banner && (
                            <div className="mb-3 rounded-[10px] border border-[#f5320f] bg-[#3a1410] px-3.5 py-2.5 text-[13px]">
                                {banner.text}{' '}
                                {banner.profile && (
                                    <Link to="/profile" onClick={onClose} className="font-semibold text-[#ff8a75] underline">
                                        Complete your profile
                                    </Link>
                                )}
                            </div>
                        )}

                        {step === 'seats' && (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_300px]">
                                <SeatMap
                                    seats={seats}
                                    selectedIds={selection.map((s) => s.seatId)}
                                    onToggle={toggleSeat}
                                />
                                <aside className="flex flex-col md:border-l md:border-white/10 md:pl-6">
                                    <TicketPanel
                                        selection={selection}
                                        types={types}
                                        unitPrice={session.price}
                                        onType={setType}
                                        onRemove={removeSeat}
                                        subtotal={subtotal}
                                    />
                                    <button
                                        type="button"
                                        disabled={!selection.length || busy}
                                        onClick={goCheckout}
                                        className="mt-3 rounded-full bg-[#f5320f] py-3.5 text-xs font-bold text-white transition
                                            hover:brightness-110 disabled:cursor-not-allowed disabled:bg-[#4a4d5e] disabled:text-white/50"
                                    >
                                        {busy ? 'Holding seats…' : 'Next: Checkout'}
                                    </button>
                                </aside>
                            </div>
                        )}

                        {step === 'checkout' && hold && (
                            <CheckoutForm
                                initial={profile}
                                hold={hold}
                                session={session}
                                movie={movie}
                                busy={busy}
                                serverErrors={fieldErrors}
                                onSubmit={pay}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    )
}