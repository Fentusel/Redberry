import Footer from "../../components/layout/Footer.jsx";
import MovieDetails from "../../store/components/movieDetails.jsx";
import Header from "../../components/layout/Header.jsx";

export const MovieDetailsPage = () => {
    return (
        <div className="bg-[#070C1C] text-white min-h-screen w-full flex flex-col ">
            <Header/>
            <MovieDetails/>
            <Footer/>
        </div>
    )
}