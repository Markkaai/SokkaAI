
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Reviews from "../components/Reveiws";

export default function Home() {
    return(
        <section>
            <Navbar />
            <Hero/>
            
            <Reviews/>
        </section>
    );
}