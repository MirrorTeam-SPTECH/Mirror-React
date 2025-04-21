// src/components/CardFavoritos.jsx
import "../styles/Favoritos.css";

export function Favoritos({ nome, valor, descricao, imagem }) {
  return (
    <div className="favoritos-container">
      <div className="container_imagem">
        <img className="imagem" src={imagem || "/assets/img/hamburguer.png"} alt={nome} />
      </div>
      <div className="container_textos">
        <div>
          <h2>{nome}</h2>
          <h4>{valor}</h4>
          <p>Descrição</p>
          <hr />
          <h4 className="descricao">{descricao}</h4>
        </div>
      </div>
    </div>
  );
}
