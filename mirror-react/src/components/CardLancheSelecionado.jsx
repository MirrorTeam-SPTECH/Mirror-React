"use client";
import { useState } from "react";
import { Plus, Minus, ArrowLeft } from "lucide-react";
import HeartButton from "./Shared/HeartButton";
import "../styles/CardLancheSelecionado.css";
import "../components/Shared/ButtonBack";
import ButtonBack from "../components/Shared/ButtonBack";
export default function CardLancheSelecionado({
  produto,
  onObservacoes,
  onClose,
  onAdicionarCarrinho,
}) {
  const [quantity, setQuantity] = useState(1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };
  const increaseQuantity = () => setQuantity((q) => q + 1);

  const nome = produto.name || produto.nome || "Produto sem nome";
  const descricao = produto.description || produto.descricao || "Sem descrição";
  const imagem =
    produto.imageUrl ||
    produto.image_url ||
    produto.imagem ||
    "/placeholder.svg";
  const precoOriginal = produto.price || produto.preco || 0;

  const unitPrice =
    typeof precoOriginal === "string"
      ? Number.parseFloat(precoOriginal.replace(",", "."))
      : precoOriginal;
  const subtotalNum = unitPrice * quantity;
  const entregaNum = 0.0;
  const totalNum = subtotalNum + entregaNum;

  const subtotal = subtotalNum.toFixed(2).replace(".", ",");
  const total = totalNum.toFixed(2).replace(".", ",");
  const taxaEntrega = entregaNum.toFixed(2).replace(".", ",");

  const prepararDadosAtualizados = () => {
    return {
      ...produto,

      preco: precoOriginal,
      price: precoOriginal,
      nome: nome,
      name: nome,
      descricao: descricao,
      description: descricao,
      imagem: imagem,
      imageUrl: imagem,
      quantity,
      subtotal,
      taxaEntrega,
      total,

      subtotalNum,
      entregaNum,
      totalNum,
      unitPrice,
    };
  };

  const handleAdd = () => {
    const itemComDados = prepararDadosAtualizados();
    onAdicionarCarrinho(itemComDados);
  };

  const handleObservacoes = () => {
    const itemComDados = prepararDadosAtualizados();
    console.log("▶️ CardLancheSelecionado vai para observações:", itemComDados);
    onObservacoes(itemComDados);
  };
  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <ButtonBack onClose={onClose} />
          <HeartButton produtoId={produto.id} categoria={produto.categoria} />
        </div>
        <div className="card-image">
          <img src={imagem} alt={nome} className="product-img" />
        </div>
        <div className="card-content">
          <div className="card-title">
            <h2>{nome}</h2>
            <p className="price">R$ {total}</p>
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
            <p>{descricao}</p>
          </div>
          <button className="btn-observacoes" onClick={handleObservacoes}>
            Adicionais →
          </button>
          <button className="add-to-cart" onClick={handleAdd}>
            Adicionar ao carrinho →
          </button>
        </div>
      </div>
    </div>
  );
}