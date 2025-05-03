// src/pages/Home.jsx
"use client";

import { useEffect, useState } from "react";
import HeaderGerenciamento from "../components/HeaderGerenciamento"
import ControlePedidos from "../components/ControlePedidos";
import { Pesquisa } from "../components/Pesquisa";
import { NavigationBar } from "../components/NavigationBar";
import { ListaProdutos } from "../components/ListaProdutos";
import { SubNavigation } from "../components/SubNavigation";
import CardLancheSelecionado from "../components/CardLancheSelecionado";
import { CardCarrinho } from "../components/CardCarrinho";
import CardPagamento from "../components/CardPagamento";
import CardQRCode from "../components/CardQRcode";
import CardCredenciais from "../components/CardCredenciais";
import CardCarregamento from "../components/CardCarregamento";
import CardPagamentoRealizado from "../components/CardPagamentoRealizado";
import { todasCategorias } from "../utils/Categorias";
import "../styles/Carregamento.css";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [etapaAtual, setEtapaAtual] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleClickProduto = (produto) => {
    setProdutoSelecionado({ ...produto, preco: produto.preco });
    setEtapaAtual("lancheSelecionado");
  };

  const handleAvancarCarrinho = () => setEtapaAtual("carrinho");
  const handleAvancarPagamento = () => setEtapaAtual("pagamento");
  const handlePix = () => setEtapaAtual("pix");
  const handleCartao = () => setEtapaAtual("credenciais");
  const handleCarregamento = () => {
    setEtapaAtual("carregamento");
    setTimeout(() => setEtapaAtual("realizado"), 2000);
  };
  const handleVoltarHome = () => {
    setProdutoSelecionado(null);
    setEtapaAtual(null);
  };

  return (
    <div className="containerProjeto">
      {loading ? (
        <>
          <div className="skeleton headerGerenciamento-skeleton"></div>
          <div className="skeleton pesquisa-skeleton" />
          <div className="skeleton nav-skeleton" />

          {todasCategorias.map((_, i) => (
            <div className="skeleton lista-produto-skeleton" key={i}>
              <div className="categoria-titulo-skeleton skeleton" />
              <div className="produtos-grid-skeleton">
                {Array(5)
                  .fill(0)
                  .map((_, j) => (
                    <div className="produto-card-skeleton skeleton" key={j} />
                  ))}
              </div>
            </div>
          ))}
        </>
      ) : produtoSelecionado == null ? (
        <>
           <HeaderGerenciamento activePage="pedidos" />
          <ControlePedidos titulo="Novo Pedido" esconderBotoes={true} />
          <Pesquisa />
          <NavigationBar />
          <ListaProdutos
            categorias={todasCategorias}
            onProdutoClick={handleClickProduto}
          />
        </>
      ) : (
        <>
           <HeaderGerenciamento activePage="pedidos" />
          <ControlePedidos titulo="Novo Pedido" esconderBotoes={true} />
          <Pesquisa />
          <div style={{ display: "flex", marginTop: "0", gap: "0px" }}>
            <div style={{ flex: 3 }}>
              <NavigationBar />
              <ListaProdutos
                categorias={todasCategorias}
                onProdutoClick={handleClickProduto}
                compact
              />
            </div>

            <div
              style={{
                flex: 1,
                paddingTop: "1rem",
                paddingRight: "4.5rem",
              }}
            >
              {etapaAtual === "lancheSelecionado" && (
                <CardLancheSelecionado
                  produto={produtoSelecionado}
                  onAvancar={handleAvancarCarrinho}
                />
              )}
              {etapaAtual === "carrinho" && (
                <CardCarrinho
                  produto={produtoSelecionado}
                  onAvancar={handleAvancarPagamento}
                />
              )}
              {etapaAtual === "pagamento" && (
                <CardPagamento
                  produto={produtoSelecionado}
                  onPix={handlePix}
                  onCartao={handleCartao}
                />
              )}
              {etapaAtual === "pix" && (
                <CardQRCode
                  produto={produtoSelecionado}
                  onConfirmar={handleCarregamento}
                />
              )}
              {etapaAtual === "credenciais" && (
                <CardCredenciais
                  produto={produtoSelecionado}
                  onConfirmar={handleCarregamento}
                />
              )}
              {etapaAtual === "carregamento" && <CardCarregamento />}
              {etapaAtual === "realizado" && (
                <CardPagamentoRealizado
                  produto={produtoSelecionado}
                  onVoltar={handleVoltarHome}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
