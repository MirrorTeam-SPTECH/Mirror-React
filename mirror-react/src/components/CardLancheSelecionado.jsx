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

  // Mapear campos da API (inglês) para campos do componente (português)
  const nome = produto.name || produto.nome || "Produto sem nome";
  const descricao = produto.description || produto.descricao || "Sem descrição";
  const imagem =
    produto.imageUrl ||
    produto.image_url ||
    produto.imagem ||
    "/placeholder.svg";
  const precoOriginal = produto.price || produto.preco || 0;

  // Calcula preços:
  const unitPrice =
    typeof precoOriginal === "string"
      ? Number.parseFloat(precoOriginal.replace(",", "."))
      : precoOriginal;
  const subtotalNum = unitPrice * quantity;
  const entregaNum = 0.0;
  const totalNum = subtotalNum + entregaNum;

  // Formata strings
  const subtotal = subtotalNum.toFixed(2).replace(".", ",");
  const total = totalNum.toFixed(2).replace(".", ",");
  const taxaEntrega = entregaNum.toFixed(2).replace(".", ",");

  // Prepara o objeto com os dados atualizados
  const prepararDadosAtualizados = () => {
    return {
      ...produto,
      // Garantir que sempre tenha o campo preco e price
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
      // Adicionando valores numéricos para facilitar cálculos futuros
      subtotalNum,
      entregaNum,
      totalNum,
      unitPrice,
    };
  };

  // Dispara o objeto COMPLETO para o pai
  const handleAdd = () => {
    const itemComDados = prepararDadosAtualizados();
    onAdicionarCarrinho(itemComDados); // Nova prop
  };

  // CORREÇÃO: Passa os dados atualizados para as observações
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
