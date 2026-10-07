

export const Footer = () => {
    return (
        <div className="h-[100px] w-full flex flex-col px-[40px] justify-evenly">
            <div className="h-[3px] w-full bg-white/10"></div>
            <div className="flex justify-between">
                <h1 className=" flex gap-[6px]">
                    <span className="text-[20px] font-bold">KINO</span>
                    <span className="text-[20px] font-bold text-[#EC3013]">XII</span>
                </h1>
                <p className="text-white/50">© 2026 Kino XII. All rights reserved.</p>
            </div>
        </div>
    )
}

export default Footer;