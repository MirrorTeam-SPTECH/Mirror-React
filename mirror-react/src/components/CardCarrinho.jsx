// src/components/CardCarrinho.jsx
"use client"

import { Trash2 } from "lucide-react"
import ButtonBack from "./Shared/ButtonBack"

export function CardCarrinho({ produto, onAvancar, onRemover, onVoltar, onClose }) {
  // Se não há produto, renderiza estado vazio mantendo altura
  if (!produto) {
    return (
      <div className="w-[350px] h-128 bg-white rounded-2xl shadow-md flex flex-col font-['Montserrat']">
        {/* Topo */}
        <div className="flex-none !p-5">
          <h3 className="text-2xl font-bold !m-0 text-gray-800">Carrinho</h3>
        </div>
        {/* Conteúdo vazio */}
        <div className="flex-grow flex items-center justify-center text-gray-600">
          Nenhum produto no carrinho.
        </div>
        {/* Rodapé vazio (mantém espaço) */}
        <div className="flex-none !px-5 !pb-5">
          <div className="h-[122px]" /> {/* placeholder para manter altura */}
        </div>
      </div>
    )
  }

  // Extrai dados do produto
  const {
    nome = "",
    imagem = "",
    preco = "0,00",
    quantity = 1,
    subtotal = "0,00",
    taxaEntrega = "1,00",
    total = "0,00",
    adicionaisSelecionados = [],
  } = produto

  const precoFormatado =
    typeof preco === "string"
      ? preco
      : preco.toFixed(2).replace(".", ",")

  return (
    <div className="w-[350px] h-128 bg-white rounded-2xl shadow-md flex flex-col font-['Montserrat']">
      {/* Topo */}
      <div className="flex relative !p-5 justify-center">
      <div className="flex absolute left-1 top-0.5 ">
            <ButtonBack onClose={onVoltar || onClose} />
      </div>
        <h3 className="text-2xl font-bold !m-0 text-gray-800">Carrinho</h3>
      </div>

      {/* Conteúdo rolável */}
      <div className="flex-grow overflow-y-auto !px-5 !py-2">
        <div className="flex justify-between items-start bg-gray-50 rounded-xl !p-4 !mb-4">
          {/* Imagem e detalhes */}
          <div className="flex gap-4">
            <img
              src={imagem || "/placeholder.svg"}
              alt={nome}
              className="w-[60px] h-[60px] object-cover rounded-lg"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-base text-gray-800">
                {nome}
              </span>
              <span className="text-sm text-gray-600">Qtd: {quantity}</span>
              <span className="text-sm text-gray-600">
                R$ {precoFormatado} (unidade)
              </span>

              {adicionaisSelecionados.length > 0 && (
                <div className="!mt-2 flex flex-col">
                  <span className="text-sm font-semibold text-gray-700">
                    Adicionais:
                  </span>
                  {adicionaisSelecionados.map((ad, i) => (
                    <span
                      key={i}
                      className="text-xs text-gray-600 !mb-0.5"
                    >
                      {ad.nome} x{ad.quantidade} (R${" "}
                      {ad.preco.toFixed(2).replace(".", ",")} cada)
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Botão remover */}
          <button
            className="bg-transparent border-none text-red-600 cursor-pointer !p-1"
            onClick={onRemover}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Rodapé fixo */}
      <div className="flex-none !px-5 !pb-5">
        <div className="flex justify-between text-sm text-gray-600 !mb-2.5">
          <span>Subtotal ({quantity} itens)</span>
          <span>R$ {subtotal}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 !mb-2.5">
          <span>Taxa de entrega</span>
          <span>R$ {taxaEntrega}</span>
        </div>
        <div className="flex justify-between text-lg font-semibold text-gray-800 !my-4">
          <span>Total</span>
          <span>R$ {total}</span>
        </div>
        <button
          className="w-full bg-red-600 text-white rounded-full !py-4 text-base font-semibold cursor-pointer hover:bg-red-700 transition-colors"
          onClick={() => onAvancar(produto)}
        >
          Finalizar compra
        </button>
      </div>
    </div>
  )
}
