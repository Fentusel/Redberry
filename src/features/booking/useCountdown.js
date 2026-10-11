import { useEffect, useRef, useState } from 'react'

// Counts down to an absolute timestamp (expiresAt), so a background tab or slow render can't drift.
export function useCountdown(expiresAt, onExpire) {
    const [left, setLeft] = useState(null)
    const cb = useRef(onExpire)
    cb.current = onExpire

    useEffect(() => {
        if (!expiresAt) {
            setLeft(null)
            return
        }
        let id
        const tick = () => {
            const s = Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 1000))
            setLeft(s)
            if (s === 0) {
                clearInterval(id)
                cb.current()
            }
        }
        id = setInterval(tick, 500)
        tick()
        return () => clearInterval(id)
    }, [expiresAt])

    return left
}

export const formatTime = (s) =>
    s == null ? '—' : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`