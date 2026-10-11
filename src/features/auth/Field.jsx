export default function Field({ label, error, valid, className = "", ...inputProps }) {
    return (
        <div className={className}>
            <label
                htmlFor={inputProps.id}
                className={`mb-1.5 block text-[11px] font-semibold ${
                    error ? "text-[#EC3013]" : "text-white"
                }`}>
                {label}
            </label>

            <div
                className={`flex items-center gap-2 rounded-lg border bg-[#1b1d2e] px-3 py-2.5 ${
                    error ? "border-[#EC3013]/70" : "border-transparent"
                }`}>
                <input
                    {...inputProps}
                    className="w-full bg-transparent text-xs text-white placeholder:text-white/40 focus:outline-none disabled:cursor-not-allowed disabled:text-white/50"
                />
                {valid && !error && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                        <path d="m5 12 5 5L20 7" />
                    </svg>
                )}
                {error && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EC3013" strokeWidth="2" strokeLinecap="round" className="shrink-0">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v6M12 16.5v.5" />
                    </svg>
                )}
            </div>
            {error && <p className="mt-1.5 text-[11px] text-[#EC3013]">{error}</p>}
        </div>
    );
}