import Footer from "../../components/layout/Footer.jsx";
import {MovieCarousel} from "../../store/components/carousel.jsx";
import NowPlaying from "../../store/components/nowPlaying.jsx";
import ComingSoon from "../../store/components/comingSoon.jsx";

export const Home = () => {
    return (
        <div className="bg-[#070C1C] text-white min-h-screen w-full flex flex-col ">
            <MovieCarousel />
            <NowPlaying />
            <div className="h-[2px] w-full bg-white/10 my-10"></div>
            <ComingSoon />
            <Footer/>
        </div>
    )
}