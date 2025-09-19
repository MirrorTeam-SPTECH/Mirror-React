"use client"

import { useEffect, useState } from "react"
import { Header } from "../components/Header"
import { Pesquisa } from "../components/Pesquisa"
import NavigationBar from "../components/NavigationBar"
import { ListaProdutos } from "../components/ListaProdutos"
import { SubNavigation } from "../components/SubNavigation"
import CardLancheSelecionado from "../components/CardLancheSelecionado"
import CardAdicionais from "../components/CardAdicionais"
import { CardCarrinho } from "../components/CardCarrinho"
import CardPagamento from "../components/CardPagamento"
import CardQRCode from "../components/CardQRcode"
import CardCarregamento from "../components/CardCarregamento"
import CardPagamentoRealizado from "../components/CardPagamentoRealizado"
import { todasCategorias } from "../utils/Categorias"
import "../styles/Carregamento.css"


export default function Home() {
  const [loading, setLoading] = useState(true)
  const [produtoSelecionado, setProdutoSelecionado] = useState(null)
  const [produtoComAdicionais, setProdutoComAdicionais] = useState(null)
  const [produtoCarrinho, setProdutoCarrinho] = useState(null)
  const [etapaAtual, setEtapaAtual] = useState(null)
  const [metodoPagamento, setMetodoPagamento] = useState(null)
  const [favoritos, setFavoritos] = useState(() => {
    const storedFavoritos = JSON.parse(localStorage.getItem("favoritos")) || []
    return storedFavoritos
  })

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    localStorage.setItem("favoritos", JSON.stringify(favoritos))
  }, [favoritos])

  // Para debug - mostra o estado atual do produtoCarrinho sempre que ele mudar
  useEffect(() => {
    if (produtoCarrinho) {
      console.log("Estado atual do produtoCarrinho:", produtoCarrinho)
    }
  }, [produtoCarrinho])

  const handleClickProduto = (produto) => {
    if (produtoSelecionado?.id === produto.id) {
      setProdutoSelecionado(null)
      setProdutoComAdicionais(null)
      setProdutoCarrinho(null)
      setEtapaAtual(null)
    } else {
      setProdutoSelecionado({ ...produto, preco: produto.preco })
      setProdutoComAdicionais(null)
      setProdutoCarrinho(null)
      setEtapaAtual("lancheSelecionado")
    }
  }

  const handleFavoritar = (produtoId, categoria) => {
    setFavoritos((prevFavoritos) => {
      const isFavorito = prevFavoritos.some((fav) => fav.id === produtoId)
      if (isFavorito) {
        return prevFavoritos.filter((fav) => fav.id !== produtoId)
      } else {
        const categoriaEncontrada = todasCategorias.find((cat) => cat.titulo === categoria)
        const produto = categoriaEncontrada?.produtos.find((prod) => prod.id === produtoId)
        return produto ? [...prevFavoritos, produto] : prevFavoritos
      }
    })
  }

  const handleAvancarAdicionais = (produtoComQuantidade) => {
    console.log("Home recebeu do CardLancheSelecionado:", produtoComQuantidade)
    setProdutoComAdicionais(produtoComQuantidade)
    setEtapaAtual("adicionais")
  }

  const handleIrParaObservacoes = (produtoComQuantidade) => {
    console.log("Home recebeu do CardLancheSelecionado para observações:", produtoComQuantidade)
    setProdutoComAdicionais(produtoComQuantidade)
    setEtapaAtual("adicionais")
  }

  const handleAvancarCarrinho = (produtoFinalizado) => {
    console.log("Home recebeu do CardAdicionais:", produtoFinalizado)
    setProdutoCarrinho(produtoFinalizado)
    setEtapaAtual("carrinho")
  }

  const handleVoltarLancheSelecionado = () => {
    setEtapaAtual("lancheSelecionado")
  }

  const handleAvancarPagamento = () => setEtapaAtual("pagamento")

  const handlePix = () => {
    setMetodoPagamento("pix")
<<<<<<< HEAD
     setEtapaAtual("carregamento"); // Mostra o CardCarregamento
  setTimeout(() => setEtapaAtual("qrcode"), 2000);
=======
    setEtapaAtual("qrcode"); 
>>>>>>> 685f498b886d356c13ccf31e59a4a11107ecbf0e
  }

  const handleCartao = () => {
  setMetodoPagamento("balcao");
  setEtapaAtual("carregamento"); // Vai para carregamento
  setTimeout(() => setEtapaAtual("realizado"), 2000); // Depois de 2s, vai para realizado
};

  const handleConfirmarPagamento = () => {
    setEtapaAtual("carregamento")
    setTimeout(() => setEtapaAtual("realizado"), 2000)
  }

  

  const handleVoltarHome = () => {
    setProdutoSelecionado(null)
    setProdutoComAdicionais(null)
    setProdutoCarrinho(null)
    setEtapaAtual(null)
  }

  const handleRemoverDoCarrinho = () => {
    setProdutoSelecionado(null)
    setProdutoComAdicionais(null)
    setProdutoCarrinho(null)
    setEtapaAtual(null)
  }

  

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
          <div className="flex justify-center items-center">
         <div className="skeleton sub-nav-skeleton" />
        </div>
        </>
      ) : etapaAtual === "favoritos" ? (
        <>
          <Header titulo="Favoritos" p="Seus produtos favoritos" />
          <NavigationBar />
          <ListaProdutos
            categorias={[
              {
                titulo: "Favoritos",
                produtos: favoritos,
              },
            ]}
            onProdutoClick={handleClickProduto}
            onFavoritar={handleFavoritar}
          />
          <SubNavigation />
        </>
      ) : produtoSelecionado == null ? (
        <>
          <Header titulo="Bem-vindos!" p="Vamos fazer seu pedido" />
          <Pesquisa
            categorias={todasCategorias}
            onProdutoEncontrado={(titulo) => {
              const categoriaId = titulo
                .normalize("NFD")
                .replace(/[^\w\s]/g, "")
                .toLowerCase()
                .replace(/\s+/g, "")
              const categoriaElement = document.getElementById(categoriaId)
              if (categoriaElement) {
                categoriaElement.scrollIntoView({ behavior: "smooth" })
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
                .replace(/[^\w\s]/g, "")
                .toLowerCase()
                .replace(/\s+/g, "")
              const categoriaElement = document.getElementById(categoriaId)
              if (categoriaElement) {
                categoriaElement.scrollIntoView({ behavior: "smooth" })
              }
            }}
          />
          <div className="flex w-full">
            <div className="flex-3 w-[70%]">
              <NavigationBar />
              <ListaProdutos
                categorias={todasCategorias}
                onProdutoClick={handleClickProduto}
                onFavoritar={handleFavoritar}
                compact
                 isGerenciamento={false}
              />
              <SubNavigation />
            </div>

            

            <div className="flex-1 relative right-15 top-5 w-[30%] flex flex-col items-center justify-center">
              {etapaAtual === "lancheSelecionado" && (
                <CardLancheSelecionado
                  produto={produtoSelecionado}
                  onAvancar={handleAvancarAdicionais}
                  onClose={handleVoltarHome}
                  onObservacoes={handleIrParaObservacoes}
                  onAdicionarCarrinho={handleAvancarCarrinho}
                />
              )}
              {etapaAtual === "adicionais" && (
                <CardAdicionais
                  produto={produtoComAdicionais}
                  onAvancar={handleAvancarCarrinho}
                  onVoltar={handleVoltarLancheSelecionado}
                />
              )}
              {etapaAtual === "carrinho" && (
                <CardCarrinho
                  produto={produtoCarrinho}
                  onAvancar={handleAvancarPagamento}
                  onRemover={handleRemoverDoCarrinho}
                  onClose={handleVoltarHome}
                />
              )}
              {etapaAtual === "pagamento" && (
                <CardPagamento 
                produto={produtoCarrinho} 
                onPix={handlePix} 
                onCartao={handleCartao}
                onClose={handleVoltarHome}
                />
              )}
              {etapaAtual === "qrcode" && (
                <CardQRCode produto={produtoCarrinho} onConfirmar={handleConfirmarPagamento} />
              )}
              {etapaAtual === "carregamento" && <CardCarregamento metodo={metodoPagamento} />}
              {etapaAtual === "realizado" && (
                <CardPagamentoRealizado
                  produto={produtoCarrinho}
                  metodo={metodoPagamento}
                  onVoltar={handleVoltarHome}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
