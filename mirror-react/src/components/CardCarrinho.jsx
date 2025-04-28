// src/components/CardCarrinho.jsx
import React from "react"
import { Trash2 } from "lucide-react"
import "../styles/CardCarrinho.css"

export function CardCarrinho({ produto, onAvancar }) {
  return (
    <div className="carrinho-container">
      <h3 className="carrinho-titulo">Carrinho</h3>

      <div className="item-card">
        <div className="item-info">
          <img
            src={produto.imagem || "/placeholder.svg?height=70&width=70"}
            alt={produto.nome}
            className="item-imagem"
          />
          <div className="item-detalhes">
            <span className="item-nome">{produto.nome}</span>
            <span className="item-preco">R$ {produto.preco}</span>
          </div>
        </div>
        <button className="botao-lixeira">
          <Trash2 size={18} />
        </button>
      </div>

      <div className="detalhes-container">
        <h4 className="detalhes-titulo">Detalhes</h4>

        <div className="linha-preco">
          <span>Subtotal</span>
          <span>R$ {produto.subtotal || produto.preco}</span>
        </div>
        <div className="linha-preco">
          <span>Taxa de entrega</span>
          <span>R$ {produto.taxaEntrega || "1,00"}</span>
        </div>

        <div className="linha-total">
          <span>Total</span>
          <span>R$ {produto.total || produto.preco}</span>
        </div>

        <button className="botao-finalizar" onClick={onAvancar}>
          Finalizar compra
        </button>
      </div>
    </div>
  )
}
