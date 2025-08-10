"use client"

import { useState } from "react"
import axios from "axios"
import ButtonBack from "./Shared/ButtonBack"
import CardCarregamento from "./CardCarregamento"
import { addPaymentNotification } from "../utils/notifications"

export default function CardPagamento({ produto, onCartao, onClose }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (!produto) {
    return (
      <div className="w-[350px] h-128 flex flex-col font-['Montserrat']">
        <div className="flex-none !p-5 bg-white rounded-t-2xl shadow-md">
          <h2 className="text-2xl font-bold !m-0 text-gray-800">Finalizar compra</h2>
        </div>
        <div className="flex-grow bg-white rounded-b-2xl shadow-md flex items-center justify-center text-gray-600">
          Nenhum produto selecionado
        </div>
      </div>
    )
  }

  const nome = produto.nome || ""
  const quantity = produto.quantity || 1
  const subtotal = produto.subtotal || "0,00"
  const taxaEntrega = produto.taxaEntrega || "1,00"
  const total = produto.total || "0,00"
  const adicionais = Array.isArray(produto.adicionaisSelecionados) ? produto.adicionaisSelecionados : []

  const parsePreco = (preco) => {
    if (typeof preco === "string") return Number.parseFloat(preco.replace(",", "."))
    if (typeof preco === "number") return preco
    return 0
  }
  const toNumber = (v) => {
    if (v == null) return 0
    if (typeof v === "number") return Number.isFinite(v) ? v : 0
    if (typeof v === "string") {
      const n = Number.parseFloat(v.replace(",", "."))
      return Number.isNaN(n) ? 0 : n
    }
    return 0
  }

  const calcularTotal = () => {
    const precoBase = parsePreco(produto.preco)
    const qtd = produto.quantity || 1
    const totalAdicionais = adicionais.reduce((acc, adicional) => {
      return acc + parsePreco(adicional.preco)
    }, 0)
    const totalCalc = (precoBase + totalAdicionais) * qtd
    return totalCalc.toFixed(2)
  }

  const buildStandardPayment = (metodoPagamento) => {
    const unitPrice = typeof produto.unitPrice === "number" ? produto.unitPrice : toNumber(produto.preco)
    const qtd = produto.quantity || 1
    const entregaNum = typeof produto.entregaNum === "number" ? produto.entregaNum : 0
    const adicionaisSelecionados = Array.isArray(produto.adicionaisSelecionados) ? produto.adicionaisSelecionados : []
    const adicionaisTotal = adicionaisSelecionados.reduce((acc, ad) => {
      const p = toNumber(ad?.preco)
      const q = toNumber(ad?.quantidade) || 1
      return acc + p * q
    }, 0)
    const subtotalNum = typeof produto.subtotalNum === "number" ? produto.subtotalNum : unitPrice * qtd
    const totalNum =
      typeof produto.totalNum === "number" ? produto.totalNum : subtotalNum + entregaNum + adicionaisTotal

    const timestamp = Date.now()

    return {
      nomeLanche: nome,
      nome,
      imagem: produto.imagem || "/placeholder.svg?height=60&width=60",
      tempoPreparo: produto.tempoPreparo || "15-20 min",

      preco: unitPrice,
      precoUnitario: unitPrice,
      unitPrice,
      quantidade: qtd,
      quantity: qtd,

      subtotal: subtotal,
      subtotalNum,
      taxaEntrega: produto.taxaEntrega || "0,00",
      entregaNum,
      valorTotal: totalNum,
      total: total,
      totalNum,

      adicionaisSelecionados,
      totalAdicionais: adicionaisTotal,

      observacoes: produto.observacoes || "",

      timestamp,
      metodoPagamento,
    }
  }

  const saveHistorico = (dadosPagamento) => {
    try {
      const historico = JSON.parse(localStorage.getItem("historicoPedidos") || "[]")
      const jaExiste = Array.isArray(historico)
        ? historico.some((p) => p?.dadosOriginais?.timestamp === dadosPagamento.timestamp)
        : false
      if (jaExiste) return

      const unit = toNumber(dadosPagamento.unitPrice)
      const qtd = toNumber(dadosPagamento.quantity)
      const entrega = typeof dadosPagamento.entregaNum === "number" ? dadosPagamento.entregaNum : 0
      const adicionais = Array.isArray(dadosPagamento.adicionaisSelecionados)
        ? dadosPagamento.adicionaisSelecionados
        : []

      const itens = [
        {
          nome: dadosPagamento.nomeLanche,
          preco: unit,
          quantidade: qtd,
          imagem: dadosPagamento.imagem,
          tipo: "produto",
          adicionaisSelecionados: adicionais,
        },
      ]
      adicionais.forEach((ad) => {
        itens.push({
          nome: `+ ${ad?.nome}`,
          preco: toNumber(ad?.preco),
          quantidade: toNumber(ad?.quantidade) || 1,
          imagem: ad?.imagem || "/placeholder.svg?height=60&width=60",
          tipo: "adicional",
        })
      })

      const totalNumCalc =
        typeof dadosPagamento.totalNum === "number"
          ? dadosPagamento.totalNum
          : unit * qtd +
            entrega +
            adicionais.reduce((acc, ad) => acc + toNumber(ad?.preco) * (toNumber(ad?.quantidade) || 1), 0)

      const novoPedido = {
        id: `#${String(dadosPagamento.timestamp).toString(36).toUpperCase()}`,
        dataPedido: new Date().toISOString(),
        tempoPreparo: dadosPagamento.tempoPreparo || "15-20 min",
        status: "em-andamento",
        metodoPagamento: dadosPagamento.metodoPagamento,
        total: totalNumCalc,
        itens,
        dadosOriginais: { timestamp: dadosPagamento.timestamp },
      }

      const atualizado = [novoPedido, ...(Array.isArray(historico) ? historico : [])]
      localStorage.setItem("historicoPedidos", JSON.stringify(atualizado))
    } catch (e) {
      console.error("Erro ao salvar no histórico:", e)
    }
  }

  const handlePagamentoBalcao = async () => {
    setLoading(true)
    setError("")
    try {
      const token = localStorage.getItem("token")
      const userId = localStorage.getItem("userId") || "0"
      const totalCalculado = calcularTotal()

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

      const response = await axios.post("http://localhost:8080/api/pedidos/registrar-balcao", pagamentoData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      console.log("Resposta do backend (balcão):", response.data)

      const std = buildStandardPayment("balcao")
      const payload = { ...std, produto, pagamentoData }
      // Persistências locais
      saveHistorico(std)
      localStorage.setItem("novoPagamentoBalcao", JSON.stringify(payload))
      // Notificação persistente
      addPaymentNotification(std)

      if (onCartao) onCartao()
      if (onClose) onClose()
      alert("Pagamento no balcão registrado com sucesso!")
    } catch (err) {
      console.error("Erro ao registrar pagamento no balcão:", err)
      setError("Erro ao registrar pagamento no balcão")
      alert("Erro ao registrar pagamento no balcão.")
    } finally {
      setLoading(false)
    }
  }

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

      const checkoutData = {
        items: [
          {
            title: nome + (adicionais.length > 0 ? ` + ${adicionais.map((a) => a.nome).join(", ")}` : ""),
            quantity: quantity,
            unit_price: Number.parseFloat(totalCalculado) / quantity,
            currency_id: "BRL",
          },
        ],
      }

      const checkoutResponse = await axios.post("http://localhost:8080/api/checkout", checkoutData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (checkoutResponse.data.initPoint) {
        try {
          await axios.post(
            "http://localhost:8080/api/pedidos/registrar-pix",
            { items: checkoutData.items },
            { headers: { Authorization: `Bearer ${token}` } },
          )
          console.log("✅ Pedido PIX registrado para estatísticas")
        } catch (registroError) {
          console.error("⚠️ Erro ao registrar pedido para estatísticas:", registroError)
        }

        const std = buildStandardPayment("pix")
        const payload = { ...std, produto }
        saveHistorico(std)
        localStorage.setItem("novoPagamentoPix", JSON.stringify(payload))
        // Notificação persistente (pedido iniciado via PIX)
        addPaymentNotification(std)

        setTimeout(() => {
          window.location.href = checkoutResponse.data.initPoint
        }, 300)
      } else {
        alert("Não foi possível obter o link de pagamento.")
      }
    } catch (err) {
      console.error("Erro ao iniciar pagamento PIX:", err)
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
      <div className="flex justify-center !p-5 bg-white rounded-t-2xl shadow-md">
        <div className="flex absolute left-1 top-0.5 ">
          <ButtonBack onClose={onClose} />
        </div>
        <h2 className="text-2xl font-bold !m-0 text-gray-800">Finalizar compra</h2>
      </div>

      <div className="flex-grow overflow-y-auto bg-white shadow-inner !px-5 !py-2">
        <div className="flex justify-between text-sm text-gray-700 !mb-2.5">
          <span>
            {nome} {quantity > 1 ? `(${quantity}x)` : ""}
          </span>
          <span>R$ {subtotal}</span>
        </div>

        {adicionais.length > 0 && (
          <div className="!mb-2.5">
            {adicionais.map((ad, i) => (
              <div key={i} className="flex justify-between text-xs text-gray-600 !mb-1">
                <span>
                  {ad.nome} x{ad.quantidade || 1}
                </span>
                <span>R$ {(parsePreco(ad.preco) * (ad.quantidade || 1)).toFixed(2).replace(".", ",")}</span>
              </div>
            ))}
          </div>
        )}

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

        {error && <div className="bg-red-50 text-red-600 p-2 rounded-md text-sm mb-2">{error}</div>}
      </div>

      <div className="flex-none !px-5 !pb-5 bg-white rounded-b-2xl shadow-md">
        <p className="text-base font-medium !mb-4 text-gray-800">Como prefere fazer o pagamento?</p>

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
