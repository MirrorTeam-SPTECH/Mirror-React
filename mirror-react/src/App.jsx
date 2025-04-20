// src/App.jsx  
import React from "react";  
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";  

import Home from "./pages/Home";  
import Favoritos from "./pages/Favoritos";  
import SiteInstitucional from "./pages/SiteInstitucional"; 
import "./App.css";

function App() {  
    return (  
        <Router>  
            <Routes>  
                <Route path="/" element={<SiteInstitucional />} />  
                <Route path="/favoritos" element={<Favoritos />} />  
                <Route path="/home" element={< Home/>} />  

            </Routes>  
        </Router>  
    );  
}  

export default App;  