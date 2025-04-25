// src/App.jsx  
import React from "react";  
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";  

import Home from "./pages/Home";  
import Favoritos from "./pages/Favoritos";  
import SiteInstitucional from "./pages/SiteInstitucional"; 
import "./App.css";
import Login from "./pages/login";
import Cadastro from "./pages/Cadastro";
import CardCarrinho from "./components/CardCarrinho";
import CardValorTotal from "./components/CardValorTotal"
import CardPagamento from "./components/CardPagamento";
import CardCredenciais from "./components/CardCredencias";
import CardQRcode from "./components/CardQRcode";
import CardPagamentoRealizado from "./components/CardPagamentoRealizado";
import CardCarregamento from "./components/CardCarregamento";
import CardErro from "./components/CardErro";

function App() {  
    return (  
        <Router>  
            <Routes>  
                <Route path="/" element={<SiteInstitucional />} />  
                <Route path="/login" element={<Login />} />  
                <Route path="/Cadastro" element={<Cadastro />} />  
                <Route path="/favoritos" element={<Favoritos />} />  
                <Route path="/home" element={< Home/>} />  
                <Route path="/CardCarrinho" element={<CardCarrinho />} />
                <Route path="/CardValorTotal" element={<CardValorTotal />} />
                <Route path="/CardPagamento" element={<CardPagamento />} />
                <Route path="/CardCredenciais" element={<CardCredenciais />} />
                <Route path="/CardPagamentoRealizado" element={<CardPagamentoRealizado />} />
                <Route path="/CardCarregamento" element={<CardCarregamento />} />
                <Route path="/CardQRcode" element={<CardQRcode />} />
                <Route path="/CardErro" element={<CardErro />} />
                

            </Routes>  
        </Router>  
    );  
}  

export default App;  