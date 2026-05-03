<<<<<<< HEAD
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
=======
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
>>>>>>> 83451b7 (break)
import RootLayout from "./rootLayout/RootLayout";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
<<<<<<< HEAD

export default function App() {
  const router=createBrowserRouter(
   createRoutesFromElements(
    <Route path="/" element={<RootLayout/>}>
      <Route index element={<Home/>}/>
      <Route path="/contact" element={<Contact/>}/>
       <Route path="login" element={<Login />} />
       <Route  path="/dashboard" element={<Dashboard/>}/>



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
=======
import Profile from "./pages/Profile";
import Predictions from "./components/Predictions";
import History from "./components/History";

export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Predictions />} />
          <Route path="predictions" element={<Predictions />} />
          <Route path="history" element={<History />} />
        </Route>
        <Route path="/profile" element={<Profile />} />
      </Route>,
    ),
  );
  return (
    <section
      className="bg-slate-900 w-full min-h-screen text-white mt-0
                        justify-center align-center"
    >
      <RouterProvider router={router} />
    </section>
  );
}
>>>>>>> 83451b7 (break)
