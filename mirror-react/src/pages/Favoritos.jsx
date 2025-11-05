"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "../components/Header";
import { Favoritos as CardFav } from "../components/CardFavoritos";
import { SubNavigation } from "../components/SubNavigation";
import menuService from "../services/menuService";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../styles/Favoritos.css";
import "../styles/Carregamento.css";

export default function FavoritosPage() {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [produtosApi, setProdutosApi] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  // Obter email do usuário logado
  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserEmail(user.email);
      }
    } catch (error) {
      console.error("Erro ao obter usuário:", error);
    }
  }, []);

  // Buscar produtos da API
  useEffect(() => {
    const buscarProdutos = async () => {
      try {
        const data = await menuService.getAllItems();
        setProdutosApi(data?.menu || data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };
    buscarProdutos();
  }, []);

  // Função para carregar favoritos do localStorage (específico por usuário)
  const carregarFavoritos = useCallback(() => {
    if (!produtosApi || !userEmail) {
      console.log("Aguardando produtos da API e usuário...");
      return;
    }

    // Chave de favoritos específica por usuário
    const favKey = `favoritos_${userEmail}`;

    // 1) pega do storage usando a chave específica do usuário
    let favsStorage = JSON.parse(localStorage.getItem(favKey)) || [];

    // 2) Limpar favoritos inválidos (sem id ou sem categoria)
    favsStorage = favsStorage.filter((fav) => fav && fav.id && fav.categoria);

    // Salvar a lista limpa de volta no localStorage
    localStorage.setItem(favKey, JSON.stringify(favsStorage));

    // 3) mapeia para objetos completos da API
    const favsCompletos = favsStorage
      .map(({ id, categoria }) => {
        const lista = produtosApi[categoria];
        if (!lista) {
          console.warn(`Categoria inexistente: ${categoria}`);
          return null;
        }

        const produto = lista.find((item) => item.id === id);
        if (!produto) {
          console.warn(`Produto não encontrado em ${categoria} com id ${id}`);
          return null;
        }

        // Adiciona a categoria ao produto para uso no HeartButton
        return { ...produto, categoria };
      })
      .filter(Boolean); // Remover itens nulos

    setFavoritos(favsCompletos);
    console.log(
      `✅ ${favsCompletos.length} favoritos carregados para ${userEmail}`
    );
  }, [produtosApi, userEmail]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Carregar favoritos quando os produtos da API estiverem disponíveis
  useEffect(() => {
    if (produtosApi) {
      carregarFavoritos();
    }
  }, [produtosApi, carregarFavoritos]);

  useEffect(() => {
    // Atualizar quando os favoritos forem alterados em outro componente
    const handleFavoritosUpdate = () => {
      carregarFavoritos();
    };

    window.addEventListener("favoritosAtualizados", handleFavoritosUpdate);
    return () =>
      window.removeEventListener("favoritosAtualizados", handleFavoritosUpdate);
  }, [carregarFavoritos]);

  const handleRemoveFavorito = (id, categoria) => {
    // Remove do estado local
    setFavoritos((prev) =>
      prev.filter((fav) => !(fav.id === id && fav.categoria === categoria))
    );

    // Remove do localStorage
    const favsStorage = JSON.parse(localStorage.getItem("favoritos")) || [];
    const novosFavs = favsStorage.filter(
      (fav) => !(fav.id === id && fav.categoria === categoria)
    );
    localStorage.setItem("favoritos", JSON.stringify(novosFavs));

    // Notificar outros componentes
    window.dispatchEvent(new Event("favoritosAtualizados"));
  };

  return (
    <div>
      {loading ? (
        <>
          <div className="skeleton Header-skeleton " />

          <div className="flex justify-center items-center">
            <div className="skeleton sub-nav-skeleton" />
          </div>
        </>
      ) : (
        <div className="favoritos-page  !-mt-15">
          <Header titulo="Favoritos" p="Seus itens favoritos" />

          <div className="favoritos-page-container !ml-5">
            <h1 className="text-3xl font-bold mb-4">Favoritos</h1>

            <div className="div_favoritos-wrapper">
              {favoritos.length > 0 && (
                <button
                  className="btn-carrossel esquerda"
                  onClick={() => {
                    const carrossel =
                      document.getElementById("carrosselFavoritos");
                    carrossel.scrollLeft -= 350;
                  }}
                >
                  <ChevronLeft color="red" size={20} />
                </button>
              )}

              <div className="div_favoritos " id="carrosselFavoritos">
                {favoritos.map((item) => (
                  <CardFav
                    key={`${item.id}-${item.categoria}`}
                    id={item.id}
                    categoria={item.categoria}
                    nome={item.name || item.nome}
                    valor={`R$ ${item.price || item.preco}`}
                    descricao={item.description || item.descricao}
                    imagem={item.imageUrl || item.image_url || item.imagem}
                    onRemove={handleRemoveFavorito}
                  />
                ))}
              </div>

              {favoritos.length > 0 && (
                <button
                  className="btn-carrossel direita"
                  onClick={() => {
                    const carrossel =
                      document.getElementById("carrosselFavoritos");
                    carrossel.scrollLeft += 350;
                  }}
                >
                  <ChevronRight color="red" size={20} />
                </button>
              )}
            </div>
          </div>

          <SubNavigation />
        </div>
      )}
    </div>
  );
}
