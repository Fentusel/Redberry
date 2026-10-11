import { useNavigate } from 'react-router-dom'

export default function Confirmation({ order, onClose }) {
    const navigate = useNavigate()
    const { session } = order

    const counts = {}
    order.tickets.forEach((t) => (counts[t.ticketType.name] = (counts[t.ticketType.name] || 0) + 1))
    const ticketsText = Object.entries(counts).map(([n, c]) => `${c} x ${n}`).join(', ')

    const go = (path) => {
        onClose()
        navigate(path)
    }

    return (
        <div className="flex flex-col items-center gap-3 px-4 py-8 text-center">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-400 text-lg font-bold text-[#060b1a]">✓</div>
            <h2 className="text-xl font-extrabold">Booking confirmed!</h2>
            <p className="max-w-[260px] text-[11px] text-white/60">
                Your tickets are ready. We've sent the confirmation to your email.
            </p>
            <span className="rounded-full bg-[#272a42] px-5 py-1.5 text-[11px] font-semibold uppercase">
                Order #{order.reference}
            </span>

            <div className="mt-2 flex w-full max-w-[480px] flex-col gap-2 rounded-xl bg-[#1a1c2e] p-4 text-left text-xs">
                <div className="flex gap-3 border-b border-white/10 pb-3">
                    <img src={session.movie.posterUrl} alt="" className="h-12 w-9 rounded object-cover" />
                    <div>
                        <b className="text-[13px]">{session.movie.title}</b>
                        <p className="text-[11px] text-white/60">
                            {session.venue.name} · Hall {session.hall.name} · {session.date} · {session.time}
                        </p>
                    </div>
                </div>
                <div className="flex justify-between">
                    <span className="text-white/60">Seats</span>
                    <b>{order.tickets.map((t) => t.seatCode).join(', ')}</b>
                </div>
                <div className="flex justify-between">
                    <span className="text-white/60">Tickets</span>
                    <b>{ticketsText}</b>
                </div>
                <div className="mt-1 flex items-center justify-between border-t border-white/10 pt-3">
                    <span className="text-[11px] text-white/60">TOTAL PAID</span>
                    <strong className="text-xl">₾ {order.totalPrice}</strong>
                </div>
            </div>

            <div className="mt-2 flex gap-2.5">
                <button
                    onClick={() => go('/profile')}
                    className="rounded-full bg-[#f5320f] px-5 py-2.5 text-xs font-bold hover:brightness-110"
                >
                    View my tickets
                </button>
                <button
                    onClick={() => go('/')}
                    className="rounded-full bg-[#272a42] px-5 py-2.5 text-xs font-bold hover:bg-[#31355a]"
                >
                    Back to home
                </button>
            </div>
        </div>
    )
}