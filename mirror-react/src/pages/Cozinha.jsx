"use client"

import { useEffect, useState } from "react"
import HeaderGerenciamento from "../components/HeaderGerenciamento"
import ControlePedidos from "../components/ControlePedidos"
import DeleteConfirmation from "../components/DeleteConfirmation"
import { todasCategorias } from "../utils/Categorias"
import "../styles/Carregamento.css"
import { Maximize, Minimize, Clock, Search } from "lucide-react"

export default function Cozinha() {
  const [loading, setLoading] = useState(true)
  const [cardAberto, setCardAberto] = useState(null)
  const [expandido, setExpandido] = useState(false)
  const [pedidos, setPedidos] = useState([])
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null)

  function Expandir() {
    setExpandido((prev) => !prev)
  }

  // Carregar pedidos do backend ou localStorage
  useEffect(() => {
    const carregarPedidos = async () => {
      try {
        // Tentar carregar da API
        const response = await fetch("http://localhost:8080/api/pedidos")
          .then((res) => res.json())
          .catch(() => null)

        if (response) {
          // Se tiver resposta da API, processar os pedidos
          setPedidos(processarPedidosAPI(response))
        } else {
          // Se não tiver API, carregar dados de exemplo
          setPedidos(pedidosExemplo)
        }
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error)
        // Fallback para dados de exemplo
        setPedidos(pedidosExemplo)
      } finally {
        setLoading(false)
      }
    }

    carregarPedidos()

    // Atualizar a cada 30 segundos
    const interval = setInterval(() => {
      carregarPedidos()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Processar pedidos da API
  const processarPedidosAPI = (pedidosAPI) => {
    return pedidosAPI.map((pedido) => ({
      id: pedido.id || Math.floor(Math.random() * 10000),
      cliente: pedido.nomeCliente || "Cliente",
      status: pedido.status || "Em preparo",
      tempoPreparo: pedido.tempoPreparo || "20 min",
      itens:
        pedido.itens?.map((item) => ({
          nome: item.nome || "Item",
          quantidade: item.quantidade || 1,
          observacao: item.observacao || "",
        })) || [],
    }))
  }



  const handleCardClose = () => {
    setCardAberto(null)
    setPedidoSelecionado(null)
  }

  const handleCancelarPedido = (pedido) => {
    setPedidoSelecionado(pedido)
    setCardAberto("cancelar")
  }

  const confirmarCancelamento = () => {
    // Aqui você implementaria a chamada para a API para cancelar o pedido
    setPedidos(pedidos.filter((p) => p.id !== pedidoSelecionado.id))
    setCardAberto(null)
    setPedidoSelecionado(null)
  }

  return (
    <div className="containerProjeto">
      {loading ? (
        <>
          <div className="skeleton headerGerenciamento-skeleton"></div>
          <div className="skeleton pesquisa-skeleton" />
          <div className="skeleton nav-skeleton" />
          {todasCategorias.map((_, i) => (
            <div className="skeleton lista-produto-skeleton" key={i}>
              <div className="categoria-titulo-skeleton skeleton" />
              <div className="produtos-grid-skeleton">
                {Array(5)
                  .fill(0)
                  .map((_, j) => (
                    <div className="produto-card-skeleton skeleton" key={j} />
                  ))}
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          <HeaderGerenciamento activePage="cozinha" />
          <ControlePedidos
            titulo="Pedidos detalhados"
            onCancelarPedido={() => setCardAberto("cancelar")}
            onPesquisarPedido={() => {
              /* lógica de pesquisa futura */
            }}
          />

         

          <div className="flex w-full justify-center items-center !mb-0 min-h-[70vh]">
            <div className={cardAberto ? "flex-3 w-[70%]" : "w-full flex justify-center"}>
              {/* Retângulo branco com cards de pedidos */}
              <div
                className={
                  expandido
                    ? "bg-white rounded-2xl fixed top-10 left-20 w-[90%] h-[90vh] shadow-2xl !p-10 m-0 flex flex-wrap gap-5 overflow-auto items-start z-50"
                    : "bg-white rounded-2xl relative w-[90%] shadow-2xl !p-10 overflow-hidden m-8 flex flex-wrap h-[450px] gap-5"
                }
              >
                <button
                  onClick={Expandir}
                  className={
                    expandido
                      ? "absolute top-6 right-6 w-[40px] h-[40px] flex justify-center items-center cursor-pointer z-50 bg-blue-100 rounded-full"
                      : "absolute w-[40px] h-[40px] bottom-0 right-1 flex justify-center items-center cursor-pointer bg-blue-100 rounded-full"
                  }
                  title={expandido ? "Recolher" : "Expandir"}
                >
                  {expandido ? <Minimize color="#000" /> : <Maximize color="#000" />}
                </button>

                {pedidos && pedidos.length > 0 ? (
                  pedidos.map((pedido) => (
                    <div
                      key={pedido.id}
                      className="bg-gradient-to-br from-gray-50 border-zinc-600 to-gray-200 rounded-xl !p-3 w-72 border h-65 flex flex-col items-start shadow-lg transition-transform hover:scale-105 hover:shadow-2xl"
                    >
                      <div className="flex items-center justify-between w-full mb-3">
                        <div className="flex items-center gap-2">
                          <span className="inline-block bg-yellow-400 text-white rounded-full p-1 text-xs font-bold shadow">
                            #{pedido.id}
                          </span>
                          <span className="ml-2 text-green-600 font-semibold text-xs">{pedido.status}</span>
                        </div>
                        <div className="flex items-center text-gray-500 text-xs">
                          <Clock size={12} className="mr-1" />
                          <span>{pedido.tempoPreparo}</span>
                        </div>
                      </div>

                      <div className="flex-1 w-full">
                        <p className="text-gray-700 text-base mb-2 font-semibold">Cliente: {pedido.cliente}</p>
                        <ul className="text-gray-500 text-sm mb-4 list-disc list-inside">
                          {pedido.itens.map((item, index) => (
                            <li key={index}>
                              {item.nome} ({item.quantidade}x)
                              {item.observacao && (
                                <span className="text-xs text-gray-400 ml-1">({item.observacao})</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        className="mt-auto w-full px-4 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition"
                        onClick={() => handleCancelarPedido(pedido)}
                      >
                        Cancelar Pedido
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <p className="text-xl mb-2">Nenhum pedido encontrado</p>
                    <p className="text-sm">Não há pedidos em andamento no momento</p>
                  </div>
                )}
              </div>
            </div>

            {cardAberto && (
              <div className="flex-1 !-mt-25 !mr-17 w-[30%] flex flex-col items-center justify-center">
                {cardAberto === "cancelar" && (
                  <DeleteConfirmation
                    titulo="Cancelar pedido"
                    mensagem={`Tem certeza que deseja cancelar o pedido #${pedidoSelecionado?.id}?`}
                    onConfirm={confirmarCancelamento}
                    onClose={handleCardClose}
                  />
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// Dados de exemplo para quando a API não estiver disponível
const pedidosExemplo = [
  {
    id: 1234,
    cliente: "Carlos",
    status: "Em preparo",
    tempoPreparo: "20 min",
    itens: [
      { quantidade: 1, nome: "X-Tudo", observacao: "Sem Salada" },
      { quantidade: 2, nome: "Batata", observacao: "" },
    ],
  },
  {
    id: 1235,
    cliente: "Maria",
    status: "Em preparo",
    tempoPreparo: "15 min",
    itens: [
      { quantidade: 1, nome: "X-Bacon", observacao: "Sem Cebola" },
      { quantidade: 1, nome: "Refrigerante", observacao: "Coca-Cola" },
    ],
  },
  {
    id: 1236,
    cliente: "João",
    status: "Em preparo",
    tempoPreparo: "25 min",
    itens: [
      { quantidade: 2, nome: "X-Salada", observacao: "" },
      { quantidade: 1, nome: "Batata Grande", observacao: "" },
      { quantidade: 2, nome: "Refrigerante", observacao: "Guaraná" },
    ],
  },
  {
    id: 1237,
    cliente: "Ana",
    status: "Em preparo",
    tempoPreparo: "20 min",
    itens: [
      { quantidade: 1, nome: "X-Tudo", observacao: "Sem Salada" },
      { quantidade: 1, nome: "Batata", observacao: "" },
      { quantidade: 1, nome: "Milkshake", observacao: "Chocolate" },
    ],
  },
]
