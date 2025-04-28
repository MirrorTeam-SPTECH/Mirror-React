"use client";

import { useEffect, useState, useRef } from "react";
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
  const [categoriaAtiva, setCategoriaAtiva] = useState(null);
  const refs = useRef({});

  // Skeleton
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(t);
  }, []);

  // Scroll para categoria ativa
  useEffect(() => {
    if (categoriaAtiva && refs.current[categoriaAtiva]) {
      refs.current[categoriaAtiva].scrollIntoView({ behavior: "smooth" });
    }
  }, [categoriaAtiva]);

  if (loading) {
    return (
      <div className="containerProjeto">
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
      </div>
    );
  }

  // Navegação de etapas
  const handleClickProduto = (produto) => {
    setProdutoSelecionado({
      ...produto,
      preco: Number(produto.preco.replace(",", ".")),
    });
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
      {!produtoSelecionado ? (
        <>
          <Header titulo="Bem vindos!" p="Vamos fazer seu pedido" />
          <Pesquisa />
          <NavigationBar
            categorias={todasCategorias.map((c) => c.titulo)}
            onSelectCategoria={setCategoriaAtiva}
          />
          <ListaProdutos
            categorias={todasCategorias}
            onProdutoClick={handleClickProduto}
            refs={refs}
          />
          <SubNavigation />
        </>
      ) : (
        <>
          <Header titulo="Bem vindos!" p="Vamos fazer seu pedido" />
          <Pesquisa />

          <div style={{ display: "flex", gap: "24px", marginTop: "1rem" }}>
            <div style={{ flex: 3 }}>
              <NavigationBar
                categorias={todasCategorias.map((c) => c.titulo)}
                onSelectCategoria={setCategoriaAtiva}
              />
              <ListaProdutos
                categorias={todasCategorias}
                onProdutoClick={handleClickProduto}
                compact
                refs={refs}
              />
              <SubNavigation />
            </div>

            <div style={{ flex: 1, paddingTop: "1rem", paddingRight: "2rem" }}>
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
                <CardPagamentoRealizado produto={produtoSelecionado} />
              )}

              {(etapaAtual === "realizado" || etapaAtual === "carregamento") && (
                <button
                  onClick={handleVoltarHome}
                  className="mt-4 px-4 py-2 bg-gray-200 rounded"
                >
                
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
