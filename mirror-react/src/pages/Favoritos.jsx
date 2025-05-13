import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Favoritos } from "../components/CardFavoritos";
import { SubNavigation } from "../components/SubNavigation";
import { todasCategorias } from "../utils/Categorias";
import "../styles/Favoritos.css";
import "../styles/FavoritosLoading.css";
import "../styles/Carregamento.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

function scrollCarrossel(direcao) {
  const carrossel = document.getElementById("carrosselFavoritos");
  const larguraCard = 350;
  if (direcao === "direita") {
    carrossel.scrollLeft += larguraCard;
  } else {
    carrossel.scrollLeft -= larguraCard;
  }
}

export default function FavoritosPage() {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const favoritosIds = JSON.parse(localStorage.getItem("favoritos")) || [];
    const todosProdutos = todasCategorias.flatMap((categoria) =>
      categoria.produtos.map((produto) => ({
        ...produto,
        categoria: categoria.titulo,
        produtoKey: `${categoria.titulo}-${produto.id}`,
      }))
    );
    const favoritosFiltrados = todosProdutos.filter((produto) =>
      favoritosIds.includes(produto.produtoKey)
    );
    setFavoritos(favoritosFiltrados);
    setLoading(false);
  }, []);

  return (
    <div>
      {loading ? (
        <div>Carregando...</div>
      ) : (
        <div className="flex flex-col gap=32px">
          <Header titulo="Favoritos" p="Seus itens favoritos" />
          <div className="favoritos-page-container">
            <h1 className="text-3xl font-bold">Favoritos</h1>
            <div className="div_favoritos-wrapper">
              <button className="btn-carrossel esquerda" onClick={() => scrollCarrossel("esquerda")}>
                <ChevronLeft color="red" size={20} absoluteStrokeWidth={false} />
              </button>
              <div className="div_favoritos" id="carrosselFavoritos">
                {favoritos.map((item) => (
                  <Favoritos
                    key={item.produtoKey}
                    nome={item.nome}
                    valor={`R$ ${item.preco}`}
                    descricao={item.descricao}
                    imagem={item.imagem}
                  />
                ))}
              </div>
              <button className="btn-carrossel direita" onClick={() => scrollCarrossel("direita")}>
                <ChevronRight color="red" size={20} absoluteStrokeWidth={false} />
              </button>
            </div>
          </div>
          <SubNavigation />
        </div>
      )}
    </div>
  );
}