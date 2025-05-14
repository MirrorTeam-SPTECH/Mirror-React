// src/pages/Home.jsx
"use client";

import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Pesquisa } from "../components/Pesquisa";
import NavigationBar from "../components/NavigationBar";
import { ListaProdutos } from "../components/ListaProdutos";
import { SubNavigation } from "../components/SubNavigation";
import CardLancheSelecionado from "../components/CardLancheSelecionado";
import { CardCarrinho } from "../components/CardCarrinho";
import CardPagamento from "../components/CardPagamento";
import CardQRCode from "../components/CardQRcode";
import CardCarregamento from "../components/CardCarregamento";
import CardPagamentoRealizado from "../components/CardPagamentoRealizado";
import { todasCategorias } from "../utils/Categorias";
import "../styles/Carregamento.css";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [etapaAtual, setEtapaAtual] = useState(null);
  const [metodoPagamento, setMetodoPagamento] = useState(null);
  const [favoritos, setFavoritos] = useState(() => {
    // Carrega os favoritos do localStorage ao iniciar
    const storedFavoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    return storedFavoritos;
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Atualiza o localStorage sempre que os favoritos mudarem
  useEffect(() => {
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
  }, [favoritos]);

  const handleClickProduto = (produto) => {
    if (produtoSelecionado?.id === produto.id) {
      setProdutoSelecionado(null);
      setEtapaAtual(null);
    } else {
      setProdutoSelecionado({ ...produto, preco: produto.preco });
      setEtapaAtual("lancheSelecionado");
    }
  };

  const handleFavoritar = (produtoId, categoria) => {
    setFavoritos((prevFavoritos) => {
      const isFavorito = prevFavoritos.some((fav) => fav.id === produtoId);
      if (isFavorito) {
        // Remove dos favoritos
        return prevFavoritos.filter((fav) => fav.id !== produtoId);
      } else {
        // Adiciona aos favoritos
        const categoriaEncontrada = todasCategorias.find((cat) => cat.titulo === categoria);
        const produto = categoriaEncontrada?.produtos.find((prod) => prod.id === produtoId);
        return produto ? [...prevFavoritos, produto] : prevFavoritos;
      }
    });
  };

  const handleAvancarCarrinho = () => setEtapaAtual("carrinho");
  const handleAvancarPagamento = () => setEtapaAtual("pagamento");

  const handlePix = () => {
    setMetodoPagamento("pix");
    setEtapaAtual("carregamento");
    setTimeout(() => setEtapaAtual("realizado"), 2000);
  };

  const handleCartao = () => {
    setMetodoPagamento("balcao");
    setEtapaAtual("carregamento");
    setTimeout(() => setEtapaAtual("realizado"), 2000);
  };

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
      ) : etapaAtual === "favoritos" ? (
        <>
          <Header titulo="Favoritos" p="Seus produtos favoritos" />
          <NavigationBar />
          <ListaProdutos
            categorias={[
              {
                titulo: "Favoritos",
                produtos: favoritos.map((fav) => {
                  const categoria = todasCategorias.find((cat) => cat.titulo === fav.categoria);
                  return categoria?.produtos.find((prod) => prod.id === fav.produtoId);
                }).filter(Boolean), // Remove produtos inválidos
              },
            ]}
            onProdutoClick={handleClickProduto}
            onFavoritar={handleFavoritar}
          />
          <SubNavigation />
        </>
      ) : produtoSelecionado == null ? (
        <>
          <Header titulo="Bem vindos!" p="Vamos fazer seu pedido" />
          <Pesquisa
            categorias={todasCategorias}
            onProdutoEncontrado={(titulo) => {
              const categoriaId = titulo
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .replace(/\s+/g, ""); // Normaliza o título para gerar o ID

              const categoriaElement = document.getElementById(categoriaId);
              if (categoriaElement) {
                categoriaElement.scrollIntoView({ behavior: "smooth" });
              }
            }}
          />
          <NavigationBar />
          <ListaProdutos
            categorias={todasCategorias}
            onProdutoClick={handleClickProduto}
            onFavoritar={handleFavoritar}
          />
          <SubNavigation />
        </>
      ) : (
        <>
          <Header titulo="Bem vindos!" p="Vamos fazer seu pedido" />
          <Pesquisa
            categorias={todasCategorias}
            onProdutoEncontrado={(titulo) => {
              const categoriaId = titulo
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .replace(/\s+/g, ""); // Normaliza o título para gerar o ID

              const categoriaElement = document.getElementById(categoriaId);
              if (categoriaElement) {
                categoriaElement.scrollIntoView({ behavior: "smooth" });
              }
            }}
          />
          <div className="flex w-[100%] ">
            <div className="flex-3 w-[70%]">
              <NavigationBar />
              <ListaProdutos
                categorias={todasCategorias}
                onProdutoClick={handleClickProduto}
                onFavoritar={handleFavoritar}
                compact
              />
              <SubNavigation />
            </div>

            <div className="flex-1 relative right-15 top-5 w-[30%] flex flex-col items-center justify-center">
              {etapaAtual === "lancheSelecionado" && (
                <CardLancheSelecionado
                  produto={produtoSelecionado}
                  onAvancar={handleAvancarCarrinho}
                  onClose={handleVoltarHome}
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
              {etapaAtual === "carregamento" && <CardCarregamento />}
              {etapaAtual === "realizado" && (
                <CardPagamentoRealizado
                  produto={produtoSelecionado}
                  metodoPagamento={metodoPagamento}
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