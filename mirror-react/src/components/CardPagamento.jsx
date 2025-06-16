"use client"

import { useState } from "react"
import axios from "axios"
import ButtonBack from "../components/Shared/ButtonBack"
import CardCarregamento from "./CardCarregamento"

export default function CardPagamento({ produto, onCartao, onClose }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Se não tiver produto, renderiza estado vazio mantendo altura fixa igual ao CardCarrinho
  if (!produto) {
    return (
      <div className="w-[350px] h-128 flex flex-col font-['Montserrat']">
        {/* Topo */}
        <div className="flex-none !p-5 bg-white rounded-t-2xl shadow-md">
          <h2 className="text-2xl font-bold !m-0 text-gray-800">Finalizar compra</h2>
        </div>
        {/* Conteúdo vazio */}
        <div className="flex-grow bg-white rounded-b-2xl shadow-md flex items-center justify-center text-gray-600">
          Nenhum produto selecionado
        </div>
      </div>
    )
  }

  // Extrai dados
  const nome = produto.nome || ""
  const quantity = produto.quantity || 1
  const subtotal = produto.subtotal || "0,00"
  const taxaEntrega = produto.taxaEntrega || "1,00"
  const total = produto.total || "0,00"
  const adicionais = produto.adicionaisSelecionados || []

  // Função para converter preço de string para número
  const parsePreco = (preco) => {
    if (typeof preco === "string") {
      return Number.parseFloat(preco.replace(",", "."))
    } else if (typeof preco === "number") {
      return preco
    }
    return 0
  }

  // Função para calcular o total
  const calcularTotal = () => {
    const precoBase = parsePreco(produto.preco)
    const quantidade = produto.quantity || 1

    const totalAdicionais = adicionais.reduce((acc, adicional) => {
      return acc + parsePreco(adicional.preco)
    }, 0)

    const total = (precoBase + totalAdicionais) * quantidade
    return total.toFixed(2)
  }

  // Dispara evento e chama callback ao clicar em "Balcão"
  const handlePagamentoBalcao = async () => {
    setLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      const userId = localStorage.getItem("userId") || "0"
      const totalCalculado = calcularTotal()

      // Dados para enviar ao backend
      const pagamentoData = {
        nomeLanche: nome,
        quantidade: quantity,
        valorUnitario: parsePreco(produto.preco),
        valorTotal: Number.parseFloat(totalCalculado),
        clienteId: userId,
        adicionais: adicionais.map((adicional) => ({
          nome: adicional.nome,
          quantidade: adicional.quantidade || 1,
          precoUnitario: parsePreco(adicional.preco),
        })),
      }

      // Enviar para o novo endpoint de pedidos
      const response = await axios.post("http://localhost:8080/api/pedidos/registrar-balcao", pagamentoData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })

      console.log("Resposta do backend (balcão):", response.data)

      // Salvar no localStorage para histórico local
      localStorage.setItem(
  "novoPagamentoBalcao",
  JSON.stringify({
    timestamp: Date.now(),
    metodo: "balcao",
    produto,               // ← aqui incluímos tudo
    pagamentoData: {
      nomeLanche: nome,
      valorUnitario: parsePreco(produto.preco),
      valorTotal: Number.parseFloat(totalCalculado),
      adicionais: adicionais.map(ad => ({
        nome: ad.nome,
        quantidade: ad.quantidade || 1,
        precoUnitario: parsePreco(ad.preco),
      })),
    },
  }),
);



      // Chamar callback se existir
      if (onCartao) onCartao()

      // Fechar o modal após sucesso
      if (onClose) onClose()

      // Mostrar mensagem de sucesso
      alert("Pagamento no balcão registrado com sucesso!")
    } catch (error) {
      console.error("Erro ao registrar pagamento no balcão:", error)
      setError("Erro ao registrar pagamento no balcão")
      alert("Erro ao registrar pagamento no balcão.")
    } finally {
      setLoading(false)
    }
  }

  // Função para pagamento via PIX
  const handlePagamentoPix = async () => {
    setLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      const totalCalculado = calcularTotal()

      if (!token) {
        alert("Você precisa estar logado para fazer o pagamento via PIX.")
        setLoading(false)
        return
      }

      // Preparar dados para o checkout original (Mercado Pago)
      const checkoutData = {
        items: [
          {
            title: nome + (adicionais.length > 0 ? ` + ${adicionais.map((a) => a.nome).join(", ")}` : ""),
            quantity: quantity,
            unit_price: Number.parseFloat(totalCalculado) / quantity, // Preço unitário já com adicionais
            currency_id: "BRL",
          },
        ],
      }

      // Primeiro, chamar o checkout original para gerar o link do Mercado Pago
      const checkoutResponse = await axios.post("http://localhost:8080/api/checkout", checkoutData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Se o checkout foi bem-sucedido, registrar o pedido para as KPIs
      if (checkoutResponse.data.initPoint) {
        try {
          // Registrar o pedido para as estatísticas
          await axios.post(
            "http://localhost:8080/api/pedidos/registrar-pix",
            {
              items: checkoutData.items,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          console.log("✅ Pedido PIX registrado para estatísticas")
        } catch (registroError) {
          console.error("⚠️ Erro ao registrar pedido para estatísticas:", registroError)
          // Não bloqueia o fluxo principal, apenas loga o erro
        }

        // Redireciona para o checkout do Mercado Pago
        setTimeout(() => {
          window.location.href = checkoutResponse.data.initPoint
        }, 500)
      } else {
        alert("Não foi possível obter o link de pagamento.")
      }
    } catch (error) {
      console.error("Erro ao iniciar pagamento:", error)
      setError("Erro ao iniciar pagamento")
      alert("Erro ao iniciar pagamento.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <CardCarregamento />
  }

  return (
    <div className="w-[350px] h-128 flex flex-col font-['Montserrat']">
      {/* Topo */}
      <div className="flex justify-center !p-5 bg-white rounded-t-2xl shadow-md">
        <div className="flex absolute left-1 top-0.5 ">
          <ButtonBack onClose={onClose} />
        </div>
        <h2 className="text-2xl font-bold !m-0 text-gray-800">Finalizar compra</h2>
      </div>

      {/* Conteúdo rolável */}
      <div className="flex-grow overflow-y-auto bg-white shadow-inner !px-5 !py-2">
        {/* Resumo do item */}
        <div className="flex justify-between text-sm text-gray-700 !mb-2.5">
          <span>
            {nome} {quantity > 1 ? `(${quantity}x)` : ""}
          </span>
          <span>R$ {subtotal}</span>
        </div>

        {/* Adicionais */}
        {adicionais.length > 0 && (
          <div className="!mb-2.5">
            {adicionais.map((ad, i) => (
              <div key={i} className="flex justify-between text-xs text-gray-600 !mb-1">
                <span>
                  {ad.nome} x{ad.quantidade}
                </span>
                <span>R$ {(parsePreco(ad.preco) * (ad.quantidade || 1)).toFixed(2).replace(".", ",")}</span>
              </div>
            ))}
          </div>
        )}

        {/* Subtotal e taxa */}
        <div className="flex justify-between text-sm text-gray-700 !mb-2.5">
          <span>Subtotal</span>
          <span>R$ {subtotal}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-700 !mb-2.5">
          <span>Taxa de entrega</span>
          <span>R$ {taxaEntrega}</span>
        </div>

        <hr className="border-none h-px bg-gray-200 !my-4" />

        <div className="flex justify-between text-lg font-bold text-gray-800 !mb-2.5">
          <span>Total</span>
          <span>R$ {total}</span>
        </div>

        {/* Mensagem de erro */}
        {error && <div className="bg-red-50 text-red-600 p-2 rounded-md text-sm mb-2">{error}</div>}
      </div>

      {/* Rodapé fixo */}
      <div className="flex-none !px-5 !pb-5 bg-white rounded-b-2xl shadow-md">
        <p className="text-base font-medium !mb-4 text-gray-800">Como prefere fazer o pagamento?</p>

        {/* Botão PIX */}
        <button
          className={`w-full flex justify-between items-center !p-4 !mb-2.5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          onClick={handlePagamentoPix}
          disabled={loading}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-xl">💠</span>
            <span className="text-base font-medium text-gray-800">PIX</span>
          </div>
          {loading ? (
            <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <span className="text-lg text-gray-600">➔</span>
          )}
        </button>

        {/* Botão Balcão */}
        <button
          className={`w-full flex justify-between items-center !p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          onClick={handlePagamentoBalcao}
          disabled={loading}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-xl">💳</span>
            <span className="text-base font-medium text-gray-800">Balcão</span>
          </div>
          {loading ? (
            <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <span className="text-lg text-gray-600">➔</span>
          )}
        </button>
      </div>
    </div>
  )
}