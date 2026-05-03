import { Outlet,useLocation } from "react-router-dom";

import Footer from "../components/Footer";

export default function RootLayout() {
  
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";
  return (
    <div className="relative">
      <div className="fixed top-0 left-0 right-0 z-10">
      </div>
      <Outlet />
      {!isDashboard && <Footer />}
     
    </div>
  );
}