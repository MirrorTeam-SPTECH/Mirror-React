"use client"

import { useState, useEffect } from "react"
import { Header } from "../components/Header"
import { SubNavigation } from "../components/SubNavigation"
import "../styles/HistoricoPedido.css"
import { Trash2 } from "lucide-react"

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

// Função para formatar preço
const formatarPreco = (preco) => {
  const precoNum = typeof preco === "number" ? preco : Number.parseFloat(preco || 0)
  return precoNum.toFixed(2).replace(".", ",")
}

function OrderItem({ item, onRemover }) {
  console.log("👉 OrderItem recebeu imagem:", item.imagem);
  const {
    nome,
    imagem,
    preco,
    quantidade,
    adicionaisSelecionados = [],
  } = item

  const precoFormatado = typeof preco === "number"
    ? preco.toFixed(2).replace(".", ",")
    : preco

  return (
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
          <span className="text-sm text-gray-600">
            Qtd: {quantidade}
          </span>
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
                  {ad.nome} x{ad.quantidade} (
                  R$
                  {" "}
                  {typeof ad.preco === "number"
                    ? ad.preco.toFixed(2).replace(".", ",")
                    : ad.preco
                  }
                  cada)
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Botão remover (se necessário) */}
      {onRemover && (
        <button
          className="bg-transparent border-none text-red-600 cursor-pointer !p-1"
          onClick={onRemover}
        >
          <Trash2 size={18} />
        </button>
      )}
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

      <div className="total-pedido">Total: R$ {formatarPreco(pedido.total)}</div>

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
        console.log("📋 Pedidos carregados do localStorage:", pedidosData)

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
        console.log("🏪 Novo pagamento balcão detectado:", dadosPagamento)
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
        console.log("💳 Novo pagamento PIX detectado:", dadosPagamento)
        adicionarNovoPedido(dadosPagamento, "pix")
        localStorage.removeItem("novoPagamentoPix")
      } catch (error) {
        console.error("Erro ao processar pagamento PIX:", error)
      }
    }
  }

  const adicionarNovoPedido = (dadosPagamento, metodoPagamento) => {
    console.log("🔍 DADOS COMPLETOS DO PAGAMENTO:", JSON.stringify(dadosPagamento, null, 2))
   const { produto: produtoCarrinho, pagamentoData } = dadosPagamento;
    // Array para armazenar todos os itens do pedido
    const itens = []

    // 1. ADICIONAR O PRODUTO PRINCIPAL
    console.log("🍔 PROCESSANDO PRODUTO PRINCIPAL...")

    // Extrair preço unitário do produto principal
    let precoUnitarioProduto = 0

    // Tentar múltiplas fontes para o preço unitário
    if (dadosPagamento.unitPrice && dadosPagamento.unitPrice > 0) {
      precoUnitarioProduto = dadosPagamento.unitPrice
      console.log("💰 Preço unitário encontrado em unitPrice:", precoUnitarioProduto)
    } else if (dadosPagamento.precoUnitario && dadosPagamento.precoUnitario > 0) {
      precoUnitarioProduto = dadosPagamento.precoUnitario
      console.log("💰 Preço unitário encontrado em precoUnitario:", precoUnitarioProduto)
    } else if (dadosPagamento.preco && dadosPagamento.preco > 0) {
      precoUnitarioProduto = dadosPagamento.preco
      console.log("💰 Preço unitário encontrado em preco:", precoUnitarioProduto)
    } else {
      // Se não encontrou o preço unitário, vamos calcular baseado no subtotal
      if (dadosPagamento.subtotalNum && dadosPagamento.quantity) {
        // Subtrair o valor dos adicionais do subtotal para obter o preço do produto
        let valorAdicionais = 0
        if (Array.isArray(dadosPagamento.adicionaisSelecionados)) {
          valorAdicionais = dadosPagamento.adicionaisSelecionados.reduce((total, adicional) => {
            const precoAdicional =
              typeof adicional.preco === "number" ? adicional.preco : Number.parseFloat(adicional.preco || 0)
            const quantidadeAdicional = adicional.quantidade || 1
            return total + precoAdicional * quantidadeAdicional
          }, 0)
        }

        precoUnitarioProduto = (dadosPagamento.subtotalNum - valorAdicionais) / dadosPagamento.quantity
        console.log(
          "💰 Preço calculado: (subtotal - adicionais) / quantidade =",
          `(${dadosPagamento.subtotalNum} - ${valorAdicionais}) / ${dadosPagamento.quantity} = ${precoUnitarioProduto}`,
        )
      }
    }

    // Criar item do produto principal
   const produtoPrincipal = {
    ...produtoCarrinho,
    // sobrescreve apenas o preço, se quiser usar o que veio do pagamento
    preco: pagamentoData.valorUnitario,
    quantidade: produtoCarrinho.quantity,
    adicionaisSelecionados: produtoCarrinho.adicionaisSelecionados || [],
  };


      itens.push(produtoPrincipal);
    console.log("✅ Produto principal adicionado:", produtoPrincipal)

    // 2. ADICIONAR OS ADICIONAIS COMO ITENS SEPARADOS
    console.log("🍟 PROCESSANDO ADICIONAIS...")

    if (Array.isArray(dadosPagamento.adicionaisSelecionados) && dadosPagamento.adicionaisSelecionados.length > 0) {
      console.log("📝 Adicionais encontrados:", dadosPagamento.adicionaisSelecionados.length)

      dadosPagamento.adicionaisSelecionados.forEach((adicional, index) => {
        console.log(`🔍 Processando adicional ${index + 1}:`, adicional)

        const precoAdicional =
          typeof adicional.preco === "number" ? adicional.preco : Number.parseFloat(adicional.preco || 0)
        const quantidadeAdicional = adicional.quantidade || 1

        const itemAdicional = {
          nome: `+ ${adicional.nome}`,
          preco: precoAdicional,
          quantidade: quantidadeAdicional,
          imagem: adicional.imagem || "/placeholder.svg?height=60&width=60",
          tipo: "adicional",
        }

        itens.push(itemAdicional)
        console.log(`✅ Adicional ${index + 1} adicionado:`, itemAdicional)
      })
    } else {
      console.log("❌ Nenhum adicional encontrado")
      console.log("   - adicionaisSelecionados:", dadosPagamento.adicionaisSelecionados)
      console.log("   - É array?", Array.isArray(dadosPagamento.adicionaisSelecionados))
      console.log("   - Length:", dadosPagamento.adicionaisSelecionados?.length)
    }

    // 3. CALCULAR TOTAL FINAL
    let totalFinal = 0
    if (dadosPagamento.totalNum && typeof dadosPagamento.totalNum === "number") {
      totalFinal = dadosPagamento.totalNum
    } else if (dadosPagamento.valorTotal) {
      totalFinal =
        typeof dadosPagamento.valorTotal === "number"
          ? dadosPagamento.valorTotal
          : Number.parseFloat(String(dadosPagamento.valorTotal).replace(",", "."))
    } else if (dadosPagamento.total) {
      totalFinal =
        typeof dadosPagamento.total === "number"
          ? dadosPagamento.total
          : Number.parseFloat(String(dadosPagamento.total).replace(",", "."))
    } else {
      // Calcular total baseado nos itens
      totalFinal = itens.reduce((total, item) => total + item.preco * item.quantidade, 0)
      // Adicionar taxa de entrega se existir
      if (dadosPagamento.entregaNum) {
        totalFinal += dadosPagamento.entregaNum
      }
    }

    console.log("💵 TOTAL FINAL CALCULADO:", totalFinal)

    // 4. CRIAR PEDIDO COMPLETO
    const novoPedido = {
      id: gerarId(),
      dataPedido: new Date().toISOString(),
      tempoPreparo: dadosPagamento.tempoPreparo || "15-20 min",
      status: "em-andamento",
      metodoPagamento: metodoPagamento,
      total: totalFinal,
      itens: itens,
      // Dados extras para debug
      dadosOriginais: dadosPagamento,
    }

    console.log("📦 NOVO PEDIDO COMPLETO:")
    console.log("   - ID:", novoPedido.id)
    console.log("   - Total:", novoPedido.total)
    console.log("   - Itens:", novoPedido.itens.length)
    novoPedido.itens.forEach((item, i) => {
      console.log(`     ${i + 1}. ${item.nome} - R$ ${item.preco} x${item.quantidade} (${item.tipo})`)
    })

    // 5. SALVAR PEDIDO
    setPedidos((pedidosAntigos) => {
      const novosPedidos = [novoPedido, ...pedidosAntigos]
      localStorage.setItem("historicoPedidos", JSON.stringify(novosPedidos))
      console.log("💾 Pedidos salvos no localStorage")
      return novosPedidos
    })
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
