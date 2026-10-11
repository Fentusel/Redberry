import { useSearchParams } from "react-router-dom";
import Header from "../../components/layout/Header.jsx";
import ProfileForm from "../../features/profile/ProfileForm.jsx";
import Footer from "../../components/layout/Footer.jsx";

const TABS = [
    { key: "info", label: "Personal Information" },
    { key: "tickets", label: "My Tickets" },
];

export default function Profile() {
    const [params, setParams] = useSearchParams();
    const tab = params.get("tab") === "tickets" ? "tickets" : "info";
    const ticketCount = 0;

    return (
        <>
            <div className="flex min-h-screen flex-col bg-[#050a18] text-white">
                <Header />
                <main className="flex-1 px-20 pb-16 pt-32">
                    <h1 className="text-2xl font-extrabold">My Profile</h1>
                    <div className="mt-6 flex gap-8 border-b border-white/10">
                        {TABS.map((t) => {
                            const active = tab === t.key;
                            return (
                                <button
                                    key={t.key}
                                    type="button"
                                    onClick={() => setParams(t.key === "info" ? {} : { tab: t.key })}
                                    className={`-mb-px flex items-center gap-2 border-b-2 pb-3 text-xs font-semibold transition ${
                                        active
                                            ? "border-[#EC3013] text-white"
                                            : "border-transparent text-white/60 hover:text-white"
                                    }`}>
                                    {t.label}
                                    {t.key === "tickets" && ticketCount > 0 && (
                                        <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#EC3013] px-1 text-[10px] font-bold">
                                    {ticketCount}
                                </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    <div className="mt-8">
                        {tab === "info" ? (
                            <ProfileForm />
                        ) : (
                            <p className="text-sm text-white/60">No tickets yet.</p>
                        )}
                    </div>
                </main>
                <Footer/>
            </div>
        </>
    );
}