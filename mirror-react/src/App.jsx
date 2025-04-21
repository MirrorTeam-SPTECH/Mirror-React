// src/App.jsx  
import React from "react";  
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";  

import Home from "./pages/Home";  
import Favoritos from "./pages/Favoritos";  
import SiteInstitucional from "./pages/SiteInstitucional"; 
import "./App.css";
import Login from "./pages/login";
import Cadastro from "./pages/Cadastro";

function App() {  
    return (  
        <Router>  
            <Routes>  
                <Route path="/" element={<SiteInstitucional />} />  
                <Route path="/login" element={<Login />} />  
                <Route path="/Cadastro" element={<Cadastro />} />  
                <Route path="/favoritos" element={<Favoritos />} />  
                <Route path="/home" element={< Home/>} />  

            </Routes>  
        </Router>  
    );  
}  

export default App;  