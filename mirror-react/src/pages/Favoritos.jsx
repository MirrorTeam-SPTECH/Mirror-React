import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Favoritos as CardFav } from "../components/CardFavoritos";
import { SubNavigation } from "../components/SubNavigation";
import produtosData from "../data/produtos.json";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../styles/Favoritos.css";

export default function FavoritosPage() {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1) pega do storage
    const favsStorage = JSON.parse(localStorage.getItem("favoritos")) || [];
    console.log("favsStorage raw:", favsStorage);

    // 2) mapeia para objetos completos do JSON
    const favsCompletos = favsStorage
      .map(({ id, categoria }) => {
        const lista = produtosData[categoria];
        if (!lista) {
          console.warn(`Categoria inexistente: ${categoria}`);
          return null;
        }
        const produto = lista.find(item => item.id === id);
        if (!produto) {
          console.warn(`Produto não encontrado em ${categoria} com id ${id}`);
        }
        return produto || null;
      })
      .filter(Boolean);

    console.log("favsCompletos mapeados:", favsCompletos);

    setFavoritos(favsCompletos);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="carregando">Carregando...</div>;
  }

  return (
    <div className="favoritos-page !-mt-15">
      <Header titulo="Favoritos" p="Seus itens favoritos" />

      <div className="favoritos-page-container">
        <h1 className="text-3xl font-bold mb-4">Favoritos</h1>
        {favoritos.length === 0 ? (
          <p>Nenhum favorito ainda.</p>
        ) : (
          <div className="div_favoritos-wrapper">
            <button
              className="btn-carrossel esquerda"
              onClick={() => {
                const carrossel = document.getElementById("carrosselFavoritos");
                carrossel.scrollLeft -= 350;
              }}
            >
              <ChevronLeft color="red" size={20} />
            </button>

            <div className="div_favoritos" id="carrosselFavoritos">
              {favoritos.map(item => (
                <CardFav
                  key={`${item.id}-${item.nome}`}
                  nome={item.nome}
                  valor={`R$ ${item.preco}`}
                  descricao={item.descricao}
                  imagem={item.imagem}
                />
              ))}
            </div>

            <button
              className="btn-carrossel direita"
              onClick={() => {
                const carrossel = document.getElementById("carrosselFavoritos");
                carrossel.scrollLeft += 350;
              }}
            >
              <ChevronRight color="red" size={20} />
            </button>
          </div>
        )}
      </div>

      <SubNavigation />
    </div>
  );
}
