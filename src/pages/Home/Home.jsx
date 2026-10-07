import { MovieCarousel } from "../../store/components/carousel";

export const Home = () => {
    return (
        <div className="bg-[#070C1C] text-white min-h-screen w-full flex flex-col ">
            <MovieCarousel />
            <div className="h-[700px] w-full">
                <div className="h-[75%] w-full">
                    big section
                </div>
                <div className="h-[25%] w-full">
                    small section
                </div>
            </div>
            <div className="h-[100px] w-full">footer</div>
        </div>
    )
}