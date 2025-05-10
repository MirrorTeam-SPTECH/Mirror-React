// src/pages/Home.jsx
"use client";

import { useEffect, useState } from "react";
import { Header } from "../components/Header";
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
    <div className="containerProjeto h-screen">
      {loading ? (
        <>
          <div className="skeleton header-skeleton" />
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

          <div className="skeleton sub-nav-skeleton" />
        </>
      ) : produtoSelecionado == null ? (
        <>
          <Header titulo="Bem vindos!" p="Vamos fazer seu pedido" />
          <Pesquisa />
          <NavigationBar />
          <ListaProdutos
            categorias={todasCategorias}
            onProdutoClick={handleClickProduto}
          />
          <SubNavigation />
        </>
      ) : (
        <>
          <Header titulo="Bem vindos!" p="Vamos fazer seu pedido" />
          <Pesquisa />
          <div className="flex w-[100%] ">
            <div className="flex-3 w-[70%]">
              <NavigationBar />
              <ListaProdutos
                categorias={todasCategorias}
                onProdutoClick={handleClickProduto}
                compact
              />
              <SubNavigation />
            </div>

            <div className="flex-1 relative right-15 top-5 w-[30%] flex flex-col items-center justify-center">
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
