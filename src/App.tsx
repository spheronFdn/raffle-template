import React from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/admin' element={<Admin />} />
          <Route path='/' element={<HeroSection />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
