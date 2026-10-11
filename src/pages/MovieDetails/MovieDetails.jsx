import Footer from "../../components/layout/Footer.jsx";
import MovieDetails from "../../store/components/movieDetails.jsx";

export const MovieDetailsPage = () => {
    return (
        <div className="bg-[#070C1C] text-white min-h-screen w-full flex flex-col ">
            <MovieDetails/>
            <Footer/>
        </div>
    )
}