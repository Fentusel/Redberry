import { useMemo } from 'react'
import { KEYS } from './hooks'

const DAYS_TO_SHOW = 14
const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function formatDateISO(date) {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
}

function parseLabelAndHint(text) {
    if (!text) return { label: '', hint: null }
    const match = text.match(/^(.*?)\s*\((.*)\)$/)
    return match ? { label: match[1], hint: match[2] } : { label: text, hint: null }
}

function SectionGroup({ title, children }) {
    return (
        <div className="border-b border-white/10 py-4 last:border-b-0">
            <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-white/60">
                {title}
            </h3>
            {children}
        </div>
    )
}

function CheckboxRow({ checked, onChange, label, hint }) {
    return (
        <label className="flex cursor-pointer items-center gap-2 py-1 text-xs">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="h-3.5 w-3.5 cursor-pointer rounded border-white/30 bg-transparent accent-[#f5320f]"
            />
            <span className="font-medium">{label}</span>
            {hint && <span className="text-[10px] text-white/50">· {hint}</span>}
        </label>
    )
}

export default function Filter({ options, filters }) {
    const { params, toggle, setDate, activeCount, clearAll } = filters

    const days = useMemo(() => {
        const list = []
        const today = new Date()

        for (let i = 0; i < DAYS_TO_SHOW; i++) {
            const d = new Date(today)
            d.setDate(today.getDate() + i)
            list.push({
                value: formatDateISO(d),
                weekday: SHORT_DAYS[d.getDay()],
                day: d.getDate(),
            })
        }
        return list
    }, [])

    const selectedDate = params.get('date') ?? days[0]?.value
    const selectedVenueSlugs = params.getAll(KEYS.venues)

    const isChecked = (key, val) => params.getAll(key).includes(val)

    const availableFormats = useMemo(() => {
        const allFormats = options?.formats ?? []
        if (!selectedVenueSlugs.length) return allFormats
        const allowed = new Set()
        options?.venues?.forEach((v) => {
            if (selectedVenueSlugs.includes(v.slug)) {
                v.formats?.forEach((f) => allowed.add(f.slug))
            }
        })
        return allFormats.filter((f) => allowed.has(f.slug))
    }, [options?.venues, options?.formats, selectedVenueSlugs])

    return (
        <aside className="sticky top-6 w-[230px] shrink-0 self-start rounded-2xl bg-[#1a1c2e] p-5">
            <h2 className="mb-2 text-sm font-bold">Filters</h2>
            <SectionGroup title="Venue">
                {options?.venues?.map((venue) => (
                    <CheckboxRow
                        key={venue.slug}
                        checked={isChecked(KEYS.venues, venue.slug)}
                        onChange={() => toggle(KEYS.venues, venue.slug)}
                        label={venue.name}
                        hint={venue.city}
                    />
                ))}
            </SectionGroup>
            <SectionGroup title="Date">
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                    {days.map((item) => {
                        const isActive = item.value === selectedDate
                        return (
                            <button
                                key={item.value}
                                type="button"
                                onClick={() => setDate(item.value)}
                                className={`flex h-11 w-9 shrink-0 flex-col items-center justify-center rounded-md text-[9px] transition-colors ${
                                    isActive
                                        ? 'bg-[#f5320f] text-white'
                                        : 'bg-[#272a42] text-white/70 hover:bg-[#31355a]'
                                }`}
                            >
                                <span className="font-semibold">{item.weekday}</span>
                                <span>{item.day}</span>
                            </button>
                        )
                    })}
                </div>
            </SectionGroup>
            <SectionGroup title="Format">
                {availableFormats.map((fmt) => (
                    <CheckboxRow
                        key={fmt.slug}
                        checked={isChecked(KEYS.formats, fmt.slug)}
                        onChange={() => toggle(KEYS.formats, fmt.slug)}
                        label={fmt.slug}
                    />
                ))}
            </SectionGroup>
            <SectionGroup title="Language">
                {options?.languages?.map((lang) => (
                    <CheckboxRow
                        key={lang.slug}
                        checked={isChecked(KEYS.languages, lang.slug)}
                        onChange={() => toggle(KEYS.languages, lang.slug)}
                        label={lang.name}
                    />
                ))}
            </SectionGroup>
            <SectionGroup title="Time of day">
                {options?.timeBands?.map((tb) => {
                    const { label, hint } = parseLabelAndHint(tb.label)
                    return (
                        <CheckboxRow
                            key={tb.id}
                            checked={isChecked(KEYS.timeBands, tb.id)}
                            onChange={() => toggle(KEYS.timeBands, tb.id)}
                            label={label}
                            hint={hint}
                        />
                    )
                })}
            </SectionGroup>
            <div className="pt-4 text-center text-[10px] text-white/50">
                {activeCount} filters active
                {activeCount > 0 && (
                    <button
                        type="button"
                        onClick={clearAll}
                        className="ml-2 text-[#f5320f] hover:underline"
                    >
                        Clear
                    </button>
                )}
            </div>
        </aside>
    )
}