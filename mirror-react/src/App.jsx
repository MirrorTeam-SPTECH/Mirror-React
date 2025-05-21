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
import Fidelidade from "./pages/Fidelidade";
import Relatorios from "./pages/Relatorios";
// Layouts
import LayoutCliente from "./layouts/LayoutCliente";
import LayoutGerenciamento from "./layouts/LayoutGerenciamento";
// Outros componentes
import PedidoPage from "./components/PedidoPage";

import CardLancheSelecionado from "./components/CardLancheSelecionado";
import CardValorTotal from "./components/CardValorTotal";
import CardPagamento from "./components/CardPagamento";
import CardCredenciais from "./components/CardCredenciais";
import CardPagamentoRealizado from "./components/CardPagamentoRealizado";
import CardCarregamento from "./components/CardCarregamento";
import CardQRcode from "./components/CardQRcode";
import CardErro from "./components/CardErro";
import CardAdicionais from "./components/CardAdicionais";

import CardsGerenciamento from "./components/CardGerenciamento";
import DeleteConfirmation from "./components/DeleteConfirmation";

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

          <Route path="/historicoPedido" element={<HistoricoPedidos />} />
          <Route path="/fidelidade" element={<Fidelidade />} />
          <Route path="/pedido" element={<PedidoPage />} />
        </Route>

        {/* Layout Gerenciamento */}
        <Route element={<LayoutGerenciamento />}>
          <Route path="novoPedido" element={<NovoPedido />} />
          <Route path="cardapioEditar" element={<CardapioEditar />} />
          <Route path="/cardGerenciamento" element={<CardsGerenciamento  titulo="Editar" />}/>
          <Route path="relatorios" element={<Relatorios />} />
          <Route path="deleteCard" element={<DeleteConfirmation />} />
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
        <Route
          path="/cardPagamentoRealizado"
          element={<CardPagamentoRealizado />}
        />
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
        <Route
          path="/cardAdicionais"
          element={
            <CardAdicionais
              produto={{
                nome: "Chef’s Chicken",
                preco: "37,00",
                quantity: 1,
                adicionais: [
                  {
                    id: 1,
                    nome: "Queijo",
                    preco: 2,
                    imagem: "/img/adicionais.png",
                  },
                  {
                    id: 2,
                    nome: "Queijo Cheddar",
                    preco: 4,
                    imagem: "/img/adicionais.png",
                  },
                  {
                    id: 3,
                    nome: "Hamburguer",
                    preco: 6,
                    imagem: "/img/adicionais.png",
                  },
                  {
                    id: 5,
                    nome: "Bacon",
                    preco: 4,
                    imagem: "/img/adicionais.png",
                  },
                ],
              }}
              onAvancar={(item) => console.log("Avançou com:", item)}
              onVoltar={() => console.log("Voltar acionado")}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
