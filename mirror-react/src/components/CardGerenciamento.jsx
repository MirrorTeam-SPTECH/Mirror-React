import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import "../styles/CardsGerenciamento.css";
import ButtonGerenciamento from "../components/Shared/ButtonGerenciamento";

export default function CardsGerenciamento({ produto = {}, onAction }) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };
  const increaseQuantity = () => setQuantity(quantity + 1);
  const toggleFavorite = () => setIsFavorite((fav) => !fav);

  const handleAction = (action) => {
    if (onAction) onAction(action, produto);
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-image">
          <div className="heart-icon" onClick={toggleFavorite}>
            {isFavorite ? "❤️" : "♡"}
          </div>
          <img
            src={produto.imagem || "/placeholder.svg?height=140&width=140"}
            alt={produto.nome || "Produto sem nome"}
            className="product-img"
          />
        </div>

        <div className="card-content">
          <div className="card-title">
            <h2>{produto.nome || "Produto sem nome"}</h2>
            <p className="price">R$ {produto.preco || "0,00"}</p>
          </div>

          <div className="quantity">
            <button onClick={decreaseQuantity}>
              <Minus size={20} />
            </button>
            <span>{quantity}</span>
            <button onClick={increaseQuantity}>
              <Plus size={20} />
            </button>
          </div>

          <div className="description">
            <strong>Descrição</strong>
            <hr className="divider" />
            <p>{produto.descricao || "Sem descrição disponível"}</p>
          </div>

          <ButtonGerenciamento onClick={() => handleAction("update")} variant="primary">
            Atualizar Lanche
          </ButtonGerenciamento>

          <ButtonGerenciamento onClick={() => handleAction("create")} variant="secondary">
            Criar Lanche
          </ButtonGerenciamento>

          <ButtonGerenciamento onClick={() => handleAction("delete")} variant="error">
            Deletar Lanche
          </ButtonGerenciamento>
        </div>
      </div>
    </div>
  );
}