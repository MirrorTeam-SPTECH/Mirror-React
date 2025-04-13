// src/pages/FavoritosPage.jsx
import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Favoritos } from "../components/CardFavoritos";
import { SubNavigation } from "../components/SubNavigation";
import produtosData from "../data/produtos.json";
import "../styles/Favoritos.css";

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

  useEffect(() => {
    // Neste exemplo, usamos todos os hamburgueres como favoritos.
    setFavoritos(produtosData.hamburgueres || []);
  }, []);

  return (
    <div>
          <Header titulo="Bem vindos!" p="Vamos fazer seu pedido" />
    <div className="favoritos-page-container">
      <h1>Favoritos</h1>
      <div className="div_favoritos-wrapper">
        <button
          className="btn-carrossel esquerda"
          onClick={() => scrollCarrossel("esquerda")}
        >
          <span>&lt;</span>
        </button>

        <div className="div_favoritos" id="carrosselFavoritos">
          {favoritos.map((item) => (
            <Favoritos
              key={item.id}
              nome={item.nome}
              valor={`R$ ${item.preco}`}
              descricao={item.descricao}
              imagem={item.imagem}
            />
          ))}
        </div>

        <button
          className="btn-carrossel direita"
          onClick={() => scrollCarrossel("direita")}
        >
          <span>&gt;</span>
        </button>
      </div>
    </div>
          <SubNavigation />
    
    </div>
  );
}
