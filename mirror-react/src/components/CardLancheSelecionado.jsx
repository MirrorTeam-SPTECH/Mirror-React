"use client"

import { useState } from "react"
import { Plus, Minus, ArrowLeft } from "lucide-react"
import HeartButton from "./Shared/HeartButton"
import "../styles/CardLancheSelecionado.css"
import "../components/Shared/ButtonBack"
import ButtonBack from "../components/Shared/ButtonBack"

export default function CardLancheSelecionado({ produto, onObservacoes,  onClose, onAdicionarCarrinho }) {
  const [quantity, setQuantity] = useState(1)

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity((q) => q - 1)
  }
  const increaseQuantity = () => setQuantity((q) => q + 1)

  // Calcula preços:
  const unitPrice =
    typeof produto.preco === "string" ? Number.parseFloat(produto.preco.replace(",", ".")) : produto.preco
  const subtotalNum = unitPrice * quantity
  const entregaNum = 0.0
  const totalNum = subtotalNum + entregaNum

  // Formata strings
  const subtotal = subtotalNum.toFixed(2).replace(".", ",")
  const total = totalNum.toFixed(2).replace(".", ",")
  const taxaEntrega = entregaNum.toFixed(2).replace(".", ",")

  // Prepara o objeto com os dados atualizados
  const prepararDadosAtualizados = () => {
    return {
      ...produto,
      quantity,
      subtotal,
      taxaEntrega,
      total,
      // Adicionando valores numéricos para facilitar cálculos futuros
      subtotalNum,
      entregaNum,
      totalNum,
      unitPrice,
    }
  }

  // Dispara o objeto COMPLETO para o pai
  const handleAdd = () => {
  const itemComDados = prepararDadosAtualizados()
  onAdicionarCarrinho(itemComDados) // Nova prop
}

  // CORREÇÃO: Passa os dados atualizados para as observações
  const handleObservacoes = () => {
    const itemComDados = prepararDadosAtualizados()
    console.log("▶️ CardLancheSelecionado vai para observações:", itemComDados)
    onObservacoes(itemComDados)
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <ButtonBack onClose={onClose} />
          <HeartButton produtoId={produto.id} categoria={produto.categoria} />
        </div>

        <div className="card-image">
          <img
            src={produto.imagem || "/placeholder.svg?height=140&width=140"}
            alt={produto.nome}
            className="product-img"
          />
        </div>

        <div className="card-content">
          <div className="card-title">
            <h2>{produto.nome}</h2>
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
            <p>{produto.descricao}</p>
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
  )
}
