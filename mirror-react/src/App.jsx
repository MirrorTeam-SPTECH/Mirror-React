// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Favoritos from "./pages/Favoritos";
import SiteInstitucional from "./pages/SiteInstitucional";
import Login from "./pages/login";
import Cadastro from "./pages/Cadastro";
import Perfil from "./pages/Perfil";
import NovoPedido from "./pages/NovoPedido";
import CardapioEditar from "./pages/CardapioEditar";
import HistoricoPedidos from "./pages/HistoricoPedido";
// Layouts
import LayoutCliente from "./layouts/LayoutCliente";
import LayoutGerenciamento from "./layouts/LayoutGerenciamento";
// Outros componentes
import CardLancheSelecionado from "./components/CardLancheSelecionado";
import CardValorTotal from "./components/CardValorTotal";
import CardPagamento from "./components/CardPagamento";
import CardCredenciais from "./components/CardCredenciais";
import CardPagamentoRealizado from "./components/CardPagamentoRealizado";
import CardCarregamento from "./components/CardCarregamento";
import CardQRcode from "./components/CardQRcode";
import CardErro from "./components/CardErro";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>

        {/* Layout Cliente */}
        <Route element={<LayoutCliente />}>
          <Route path="/" element={<SiteInstitucional />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/home" element={<Home />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="historicoPedido" element={<HistoricoPedidos />} />
        </Route>

        {/* Layout Gerenciamento */}
        <Route  element={<LayoutGerenciamento />}>
          <Route path="novoPedido" element={<NovoPedido />} />
          <Route path="cardapioEditar" element={<CardapioEditar />} />
          
        </Route>

        {/* Rotas diretas de componentes */}
        <Route
          path="/cardCarrinho"
          element={
            <CardLancheSelecionado
              produto={{ nome: "Teste", preco: "18,00", imagem: "" }}
              onAvancar={() => {}}
            />
          }
        />
        <Route path="/cardValorTotal" element={<CardValorTotal />} />
        <Route
          path="/cardPagamento"
          element={
            <CardPagamento
              produto={{ nome: "Teste", preco: "18,00" }}
              onPix={() => {}}
              onCartao={() => {}}
            />
          }
        />
        <Route
          path="/cardCredenciais"
          element={
            <CardCredenciais
              produto={{ nome: "Teste", preco: "18,00" }}
              onConfirmar={() => {}}
            />
          }
        />
        <Route path="/cardPagamentoRealizado" element={<CardPagamentoRealizado />} />
        <Route path="/cardCarregamento" element={<CardCarregamento />} />
        <Route
          path="/cardQRcode"
          element={
            <CardQRcode
              produto={{ nome: "Teste", preco: "18,00" }}
              onConfirmar={() => {}}
            />
          }
        />
        <Route path="/cardErro" element={<CardErro />} />
        
      </Routes>
    </Router>
  );
}

export default App;
