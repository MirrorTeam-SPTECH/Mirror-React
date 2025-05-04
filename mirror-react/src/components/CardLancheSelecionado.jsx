import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import "../styles/CardLancheSelecionado.css";
import HeartButton from "./Shared/HeartButton";

export default function CardLancheSelecionado({ produto, onAvancar }) {
  const [quantity, setQuantity] = useState(1);

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => setQuantity(quantity + 1);

  return (
    <div className="container">
      <div className="card">
        <div className="card-image">
          <HeartButton />
          <img
            src={produto.imagem || "/placeholder.svg?height=140&width=140"}
            alt={produto.nome}
            className="product-img"
          />
        </div>

        <div className="card-content">
          <div className="card-title">
            <h2>{produto.nome}</h2>
            <p className="price">R$ {produto.preco}</p>
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
            <p>{produto.descricao}</p>
          </div>

          <button className="btn-observacoes">Observações →</button>
          <button className="add-to-cart" onClick={onAvancar}>
            Adicionar ao carrinho →
          </button>
        </div>
      </div>
    </div>
  );
}