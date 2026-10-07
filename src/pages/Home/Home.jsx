import Layout from "../../components/layout/Layout.jsx";
import Footer from "../../components/layout/Footer.jsx";

export const Home = () => {
    return (
        <div className="bg-[#070C1C] text-white min-h-screen w-full flex flex-col ">
            <Layout />
            <div className="h-[700px] w-full">
                <div className="h-[75%] w-full">
                    big section
                </div>
                <div className="h-[25%] w-full">
                    small section
                </div>
            </div>
            <Footer/>
        </div>
    )
}