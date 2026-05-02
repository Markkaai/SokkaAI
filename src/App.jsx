import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import RootLayout from "./rootLayout/RootLayout";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Fixtures from "./components/Fixtures";

export default function App() {
  const router=createBrowserRouter(
   createRoutesFromElements(
    <Route path="/" element={<RootLayout/>}>
      <Route index element={<Home/>}/>
      <Route path="/contact" element={<Contact/>}/>
       <Route path="login" element={<Login />} />
       <Route  path="/dashboard" element={<Dashboard/>}/>
       <Route path="/profile" element={<Profile />} />
       <Route path="/fixtures" element={<Fixtures/>}/>



    </Route>
   )
  );
  return(
    <section className="bg-slate-900 w-full min-h-screen text-white mt-0
                        justify-center align-center">
    <RouterProvider router={router}/>
    </section>
  );
}