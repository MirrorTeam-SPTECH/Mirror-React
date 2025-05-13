import { useState } from "react";
import "../styles/Pesquisa.css";
import imgSearch from "../assets/icon/search.png";

export function Pesquisa({ categorias, onProdutoEncontrado }) {
  const [searchTerm, setSearchTerm] = useState("");

  const normalizeText = (text) =>
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const handleSearch = (e) => {
    const term = normalizeText(e.target.value);
    setSearchTerm(term);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      for (const categoria of categorias) {
        const produtoEncontrado = categoria.produtos.find((produto) =>
          normalizeText(produto.nome).includes(searchTerm)
        );

        if (produtoEncontrado) {
          onProdutoEncontrado(categoria.titulo);
          break;
        }
      }
    }
  };

  return (
    <div className="container-Search h-10">
      <div className="Search">
        <img src={imgSearch} alt="lupa / barra de pesquisa" />
        <input
          type="text"
          placeholder="Buscar"
          className="searchInput"
          value={searchTerm}
          onChange={handleSearch}
          onKeyPress={handleKeyPress}
        />
      </div>
    </div>
  );
}