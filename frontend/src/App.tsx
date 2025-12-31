import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";
import LenisScroll from "./components/LenisScroll";
import Generate from "./pages/Generate";
import MyGeneration from "./pages/MyGeneration";
import YtPreview from "./pages/YtPreview";
import Login from "./components/Login";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { pathname } = useLocation();
  const { isLoggedIn } = useAuth();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Toaster />
      <LenisScroll />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/generate"
          element={isLoggedIn ? <Generate /> : <Login />}
        />
        <Route
          path="/generate/:id"
          element={isLoggedIn ? <Generate /> : <Login />}
        />
        <Route
          path="/my-generation"
          element={isLoggedIn ? <MyGeneration /> : <Login />}
        />
        <Route
          path="/preview"
          element={isLoggedIn ? <YtPreview /> : <Login />}
        />
        <Route path="/login" element={<Login />} />
      </Routes>

      <Footer />
    </>
  );
}
