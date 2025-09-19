"use client"

import { useState, useEffect } from "react"
import { Header } from "../components/Header"
import { SubNavigation } from "../components/SubNavigation"
import "../styles/HistoricoPedido.css"

// Helpers
const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

const calcularStatus = (dataPedido, tempoPreparo) => {
  const agora = new Date()
  const dataInicio = new Date(dataPedido)
  const tempoDecorrido = Math.floor((agora - dataInicio) / (1000 * 60))
  const tempoMax = Number.parseInt(tempoPreparo?.split("-").pop() || tempoPreparo?.split(" ")[0]) || 15
  return tempoDecorrido >= tempoMax ? "finalizado" : "em-andamento"
}

const formatarData = (data) =>
  new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

const gerarId = (baseTs) => {
  if (baseTs && Number.isFinite(baseTs)) {
    return `#${baseTs.toString(36).toUpperCase()}`
  }
  return "#" + Math.random().toString(36).substr(2, 5).toUpperCase()
}

const formatarPreco = (preco) => {
  const precoNum = typeof preco === "number" ? preco : Number.parseFloat(preco || 0)
  return precoNum.toFixed(2).replace(".", ",")
}

function normalizarPagamento(dpRaw) {
  const dp = dpRaw || {}

  const produtoN = dp.produto || null
  const pagamentoN = dp.pagamentoData || null

  const nome = dp.nomeLanche || dp.nome || produtoN?.nome || "Produto"
  const imagem = dp.imagem || produtoN?.imagem || "/placeholder.svg?height=60&width=60"
  const tempoPreparo = dp.tempoPreparo || produtoN?.tempoPreparo || "15-20 min"

  const unitPrice =
    toNumber(dp.unitPrice) ??
    toNumber(dp.precoUnitario) ??
    toNumber(dp.preco) ??
    toNumber(pagamentoN?.valorUnitario) ??
    toNumber(produtoN?.unitPrice) ??
    0

  const quantity = toNumber(dp.quantity) ?? toNumber(dp.quantidade) ?? toNumber(produtoN?.quantity) ?? 1

  const adicionaisSelecionados = Array.isArray(dp.adicionaisSelecionados)
    ? dp.adicionaisSelecionados
    : Array.isArray(produtoN?.adicionaisSelecionados)
      ? produtoN.adicionaisSelecionados
      : []

  const adicionaisTotal = adicionaisSelecionados.reduce((acc, ad) => {
    const p = toNumber(ad?.preco) ?? 0
    const q = toNumber(ad?.quantidade) ?? 1
    return acc + p * q
  }, 0)

  const subtotalNum = toNumber(dp.subtotalNum) ?? toNumber(pagamentoN?.subtotalNum) ?? unitPrice * quantity + 0 // base

  const entregaNum = toNumber(dp.entregaNum) ?? 0
  const totalNum = toNumber(dp.totalNum) ?? toNumber(pagamentoN?.totalNum) ?? subtotalNum + adicionaisTotal + entregaNum

  const timestamp = toNumber(dp.timestamp) ?? toNumber(pagamentoN?.timestamp) ?? Date.now()

  return {
    nome,
    imagem,
    tempoPreparo,
    unitPrice,
    quantity,
    adicionaisSelecionados,
    adicionaisTotal,
    subtotalNum,
    entregaNum,
    totalNum,
    timestamp,
    dadosOriginais: dp,
  }
}

function toNumber(v) {
  if (v == null) return undefined
  if (typeof v === "number" && Number.isFinite(v)) return v
  if (typeof v === "string") {
    const n = Number.parseFloat(v.replace?.(",", ".") ?? v)
    return Number.isNaN(n) ? undefined : n
  }
  return undefined
}

function OrderItem({ item }) {
  const { nome, imagem, preco, quantidade, adicionaisSelecionados = [] } = item
  const precoFormatado = typeof preco === "number" ? preco.toFixed(2).replace(".", ",") : preco

  return (
    <div className="item-pedido">
      <img src={imagem || "/placeholder.svg?height=60&width=60"} alt={nome} className="imagem-item" />
      <div className="detalhes-item">
        <p className="nome-item">{nome}</p>
        <p className="preco-item">R$ {precoFormatado}</p>
        {quantidade > 1 && <p className="quantidade-item">Qtd: {quantidade}</p>}
        <p className="preco-total-item">Total: R$ {formatarPreco((toNumber(preco) ?? 0) * (quantidade || 1))}</p>

        {Array.isArray(adicionaisSelecionados) && adicionaisSelecionados.length > 0 && (
          <div className="!mt-2 flex flex-col">
            <span className="text-sm font-semibold text-gray-700">Adicionais:</span>
            {adicionaisSelecionados.map((ad, i) => (
              <span key={i} className="text-xs text-gray-600 !mb-0.5">
                {ad?.nome} x{ad?.quantidade || 1} (R$ {(toNumber(ad?.preco) ?? 0).toFixed(2).replace(".", ",")} cada)
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function OrderCard({ pedido, onPedirNovamente }) {
  const [status, setStatus] = useState(pedido.status)
  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(calcularStatus(pedido.dataPedido, pedido.tempoPreparo))
    }, 60000)
    return () => clearInterval(interval)
  }, [pedido.dataPedido, pedido.tempoPreparo])

  const isInProgress = status === "em-andamento"
  const statusClass = isInProgress ? "em-andamento" : "finalizado"

  return (
    <div className="card-pedido">
      <div className="topo-pedido">
        <span className={`status ${statusClass}`}>{isInProgress ? "Em Andamento" : "Finalizado"}</span>
        <div className="info-pedido">
          <div>
            <strong>{pedido.id}</strong>
          </div>
          <div className="data">{formatarData(pedido.dataPedido)}</div>
        </div>
      </div>

      <div className="itens-pedido">
        {(pedido.itens || []).map((item, index) => (
          <OrderItem key={index} item={item} />
        ))}
      </div>

      <div className="total-pedido">Total: R$ {formatarPreco(pedido.total)}</div>

      <button
        className={isInProgress ? "botao-repetir-cinza" : "botao-repetir-claro"}
        onClick={() => onPedirNovamente(pedido)}
        disabled={isInProgress}
      >
        {isInProgress ? "Aguarde..." : "Pedir Novamente"}
      </button>
    </div>
  )
}

export default function HistoricoPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)

  const carregarPedidos = () => {
    const raw = localStorage.getItem("historicoPedidos")
    const list = safeParse(raw, [])
    const limpos = (Array.isArray(list) ? list : [])
      .filter((p) => p && Array.isArray(p.itens) && p.itens.length > 0)
      .map((p) => ({
        ...p,
        total: toNumber(p.total) ?? 0,
        tempoPreparo: p.tempoPreparo || "15-20 min",
        status: calcularStatus(p.dataPedido, p.tempoPreparo),
        itens: p.itens.filter(Boolean).map((i) => ({
          ...i,
          preco: toNumber(i.preco) ?? 0,
          quantidade: toNumber(i.quantidade) ?? 1,
          imagem: i.imagem || "/placeholder.svg?height=60&width=60",
        })),
      }))
    setPedidos(limpos)
    setLoading(false)
  }

  useEffect(() => {
    carregarPedidos()

    const handleVisibility = () => {
      if (!document.hidden) carregarPedidos()
    }
    document.addEventListener("visibilitychange", handleVisibility)

    const interval = setInterval(() => {
      verificarNovosPedidos()
    }, 2000)

    return () => {
      clearInterval(interval)
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [])

  const jaExistePedidoComTimestamp = (ts) => {
    return pedidos.some((p) => p?.dadosOriginais?.timestamp === ts)
  }

  const adicionarNovoPedido = (dadosPagamento, metodoPagamento) => {
    const norm = normalizarPagamento(dadosPagamento)

    if (norm.timestamp && jaExistePedidoComTimestamp(norm.timestamp)) {
      if (metodoPagamento === "pix") localStorage.removeItem("novoPagamentoPix")
      if (metodoPagamento === "balcao") localStorage.removeItem("novoPagamentoBalcao")
      return
    }

    const produtoPrincipal = {
      nome: norm.nome,
      preco: norm.unitPrice,
      quantidade: norm.quantity,
      imagem: norm.imagem,
      tipo: "produto",
      adicionaisSelecionados: norm.adicionaisSelecionados,
    }

    const itens = [produtoPrincipal]
    if (Array.isArray(norm.adicionaisSelecionados) && norm.adicionaisSelecionados.length > 0) {
      norm.adicionaisSelecionados.forEach((ad) => {
        itens.push({
          nome: `+ ${ad?.nome}`,
          preco: toNumber(ad?.preco) ?? 0,
          quantidade: toNumber(ad?.quantidade) ?? 1,
          imagem: ad?.imagem || "/placeholder.svg?height=60&width=60",
          tipo: "adicional",
        })
      })
    }

    const totalFinal =
      toNumber(norm.totalNum) ??
      itens.reduce((acc, it) => acc + (toNumber(it.preco) ?? 0) * (toNumber(it.quantidade) ?? 1), 0) +
        (toNumber(norm.entregaNum) ?? 0)

    const novoPedido = {
      id: gerarId(norm.timestamp),
      dataPedido: new Date().toISOString(),
      tempoPreparo: norm.tempoPreparo,
      status: "em-andamento",
      metodoPagamento,
      total: totalFinal,
      itens,
      dadosOriginais: { ...norm.dadosOriginais, timestamp: norm.timestamp },
    }

    setPedidos((prev) => {
      const novos = [novoPedido, ...prev]
      localStorage.setItem("historicoPedidos", JSON.stringify(novos))
      return novos
    })

    if (metodoPagamento === "pix") localStorage.removeItem("novoPagamentoPix")
    if (metodoPagamento === "balcao") localStorage.removeItem("novoPagamentoBalcao")
  }

  const verificarNovosPedidos = () => {
    const novoPagamentoBalcao = localStorage.getItem("novoPagamentoBalcao")
    if (novoPagamentoBalcao) {
      const dadosPagamento = safeParse(novoPagamentoBalcao, null)
      if (dadosPagamento) {
        adicionarNovoPedido(dadosPagamento, "balcao")
      } else {
        localStorage.removeItem("novoPagamentoBalcao")
      }
    }

    const novoPagamentoPix = localStorage.getItem("novoPagamentoPix")
    if (novoPagamentoPix) {
      const dadosPagamento = safeParse(novoPagamentoPix, null)
      if (dadosPagamento) {
        adicionarNovoPedido(dadosPagamento, "pix")
      } else {
        localStorage.removeItem("novoPagamentoPix")
      }
    }
  }

  const handlePedirNovamente = (pedido) => {
    const nomesProdutos = pedido.itens.map((item) => item.nome).join(", ")
    alert(`Adicionando "${nomesProdutos}" ao carrinho!`)
    // TODO: Implementar re-adicionar ao carrinho
  }

  if (loading) {
    return (
      <div className="containerProjeto">
        <Header titulo="Histórico" p="Seus pedidos anteriores" />
        <div className="loading-historico">
          <div className="spinner"></div>
          <p>Carregando histórico...</p>
        </div>
        <SubNavigation />
      </div>
    )
  }

  return (
    <div className="containerProjeto">
      <Header titulo="Histórico" p="Seus pedidos anteriores" />
      <main className="historico">
        <h2 className="titulo-secao">Histórico de Pedidos</h2>

        {pedidos.length === 0 ? (
          <div className="sem-pedidos">
            <div className="icone-vazio">📋</div>
            <h3>Nenhum pedido encontrado</h3>
            <p>Quando você fizer seu primeiro pedido, ele aparecerá aqui!</p>
          </div>
        ) : (
          <div className="cards-container">
            {pedidos.map((pedido, index) => (
              <OrderCard key={`${pedido.id}-${index}`} pedido={pedido} onPedirNovamente={handlePedirNovamente} />
            ))}
          </div>
        )}
      </main>
      <SubNavigation />
    </div>
  )
}
