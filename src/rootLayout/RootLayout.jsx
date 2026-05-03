import { Outlet } from "react-router-dom";
<<<<<<< HEAD
import Navbar from "../components/Navbar";
=======

>>>>>>> 83451b7 (break)
import Footer from "../components/Footer";

export default function RootLayout() {
  return (
    <div className="relative">
      <div className="fixed top-0 left-0 right-0 z-10">
<<<<<<< HEAD
        <Navbar />
      </div>
      <Outlet />
      <Footer/>
=======
      </div>
      <Outlet />
      
>>>>>>> 83451b7 (break)
    </div>
  );
}