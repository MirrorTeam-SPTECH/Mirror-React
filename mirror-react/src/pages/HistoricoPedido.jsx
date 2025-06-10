"use client"

import { useState, useEffect } from "react"
import { Header } from "../components/Header"
import { SubNavigation } from "../components/SubNavigation"
import "../styles/HistoricoPedido.css"

// Função para calcular o status baseado no tempo de preparo
const calcularStatus = (dataPedido, tempoPreparo) => {
  const agora = new Date()
  const dataInicio = new Date(dataPedido)
  const tempoDecorrido = Math.floor((agora - dataInicio) / (1000 * 60)) // em minutos

  // Extrair número do tempo de preparo (ex: "10-15 min" -> 15)
  const tempoMax = Number.parseInt(tempoPreparo?.split("-").pop() || tempoPreparo?.split(" ")[0]) || 15

  return tempoDecorrido >= tempoMax ? "finalizado" : "em-andamento"
}

// Função para formatar data
const formatarData = (data) => {
  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

// Função para gerar ID único
const gerarId = () => {
  return "#" + Math.random().toString(36).substr(2, 5).toUpperCase()
}

// Componente de item do pedido
function OrderItem({ item }) {
  return (
    <div className="item-pedido">
      <img src={item.imagem || "/placeholder.svg?height=60&width=60"} alt={item.nome} className="imagem-item" />
      <div className="detalhes-item">
        <p className="nome-item">{item.nome}</p>
        <p className="preco-item">
          R$ {typeof item.preco === "number" ? item.preco.toFixed(2).replace(".", ",") : item.preco}
        </p>
        {item.quantidade > 1 && <p className="quantidade-item">Qtd: {item.quantidade}</p>}
      </div>
    </div>
  )
}

// Componente de cartão de pedido
function OrderCard({ pedido, onPedirNovamente }) {
  const [status, setStatus] = useState(pedido.status)

  // Atualizar status a cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      const novoStatus = calcularStatus(pedido.dataPedido, pedido.tempoPreparo)
      setStatus(novoStatus)
    }, 60000) // Atualiza a cada minuto

    return () => clearInterval(interval)
  }, [pedido.dataPedido, pedido.tempoPreparo])

  const isInProgress = status === "em-andamento"
  const statusClass = isInProgress ? "em-andamento" : "finalizado"

  const handlePedirNovamente = () => {
    onPedirNovamente(pedido)
  }

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
        {pedido.itens.map((item, index) => (
          <OrderItem key={index} item={item} />
        ))}
      </div>

      <div className="total-pedido">
        Total: R$ {typeof pedido.total === "number" ? pedido.total.toFixed(2).replace(".", ",") : pedido.total}
      </div>

      <button
        className={isInProgress ? "botao-repetir-cinza" : "botao-repetir-claro"}
        onClick={handlePedirNovamente}
        disabled={isInProgress}
      >
        {isInProgress ? "Aguarde..." : "Pedir Novamente"}
      </button>
    </div>
  )
}

// Componente principal
export default function HistoricoPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)

  // Carregar pedidos do localStorage
  useEffect(() => {
    carregarPedidos()

    // Verificar novos pedidos a cada 2 segundos
    const interval = setInterval(() => {
      verificarNovosPedidos()
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const carregarPedidos = () => {
    try {
      // Carregar pedidos salvos do histórico
      const pedidosSalvos = localStorage.getItem("historicoPedidos")
      if (pedidosSalvos) {
        const pedidosData = JSON.parse(pedidosSalvos)
        // Atualizar status de todos os pedidos
        const pedidosAtualizados = pedidosData.map((pedido) => ({
          ...pedido,
          status: calcularStatus(pedido.dataPedido, pedido.tempoPreparo),
        }))
        setPedidos(pedidosAtualizados)
      }
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error)
    }
    setLoading(false)
  }

  const verificarNovosPedidos = () => {
    // Verificar pagamento no balcão
    const novoPagamentoBalcao = localStorage.getItem("novoPagamentoBalcao")
    if (novoPagamentoBalcao) {
      try {
        const dadosPagamento = JSON.parse(novoPagamentoBalcao)
        adicionarNovoPedido(dadosPagamento, "balcao")
        localStorage.removeItem("novoPagamentoBalcao")
      } catch (error) {
        console.error("Erro ao processar pagamento balcão:", error)
      }
    }

    // Verificar pagamento PIX
    const novoPagamentoPix = localStorage.getItem("novoPagamentoPix")
    if (novoPagamentoPix) {
      try {
        const dadosPagamento = JSON.parse(novoPagamentoPix)
        adicionarNovoPedido(dadosPagamento, "pix")
        localStorage.removeItem("novoPagamentoPix")
      } catch (error) {
        console.error("Erro ao processar pagamento PIX:", error)
      }
    }
  }

  const adicionarNovoPedido = (dadosPagamento, metodoPagamento) => {
    console.log("Dados do pagamento recebidos:", dadosPagamento)

    // Extrair dados do produto principal
    const produtoPrincipal = {
      nome: dadosPagamento.nomeLanche || dadosPagamento.nome || "Produto",
      preco: dadosPagamento.precoUnitario || dadosPagamento.preco || 0,
      quantidade: dadosPagamento.quantidade || 1,
      imagem: dadosPagamento.imagem || "/placeholder.svg?height=60&width=60",
    }

    // Criar array de itens (produto principal + adicionais se houver)
    const itens = [produtoPrincipal]

    // Adicionar adicionais se existirem
    if (dadosPagamento.adicionaisSelecionados && dadosPagamento.adicionaisSelecionados.length > 0) {
      dadosPagamento.adicionaisSelecionados.forEach((adicional) => {
        itens.push({
          nome: `+ ${adicional.nome}`,
          preco: adicional.preco,
          quantidade: adicional.quantidade,
          imagem: "/placeholder.svg?height=60&width=60",
        })
      })
    }

    const novoPedido = {
      id: gerarId(),
      dataPedido: new Date().toISOString(),
      tempoPreparo: dadosPagamento.tempoPreparo || "15-20 min",
      status: "em-andamento",
      metodoPagamento: metodoPagamento,
      total: dadosPagamento.valorTotal || dadosPagamento.total || "0,00",
      itens: itens,
    }

    console.log("Novo pedido criado:", novoPedido)

    const novosPedidos = [novoPedido, ...pedidos]
    setPedidos(novosPedidos)

    // Salvar no localStorage
    localStorage.setItem("historicoPedidos", JSON.stringify(novosPedidos))
  }

  // Função para pedir novamente
  const handlePedirNovamente = (pedido) => {
    const nomesProdutos = pedido.itens.map((item) => item.nome).join(", ")
    alert(`Adicionando "${nomesProdutos}" ao carrinho!`)
    // Aqui você pode implementar a lógica para adicionar ao carrinho
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
