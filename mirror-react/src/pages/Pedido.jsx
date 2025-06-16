"use client";

import { useEffect, useState } from "react";
import HeaderGerenciamento from "../components/HeaderGerenciamento";
import DeleteConfirmation from "../components/DeleteConfirmation";

import { Search, Clock } from "lucide-react";

// Tipos de pedidos
const PENDENTE = "pendente";
const EM_ANDAMENTO = "em_andamento";
const FINALIZADO = "finalizado";

export default function Pedido() {
  const [loading, setLoading] = useState(true);
  const [pedidos, setPedidos] = useState({
    pendente: [],
    em_andamento: [],
    finalizado: [],
  });
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Carregar pedidos do localStorage e/ou API
  useEffect(() => {
    const carregarPedidos = async () => {
      try {
        // Tentar carregar da API
        const response = await fetch("http://localhost:8080/api/pedidos")
          .then((res) => res.json())
          .catch(() => null);

        if (response) {
          // Se tiver resposta da API, processar os pedidos
          const pedidosProcessados = processarPedidosAPI(response);
          setPedidos(pedidosProcessados);
        } else {
          // Se não tiver API, carregar do localStorage
          carregarPedidosLocalStorage();
        }
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
        // Fallback para localStorage
        carregarPedidosLocalStorage();
      } finally {
        setLoading(false);
      }
    };

    carregarPedidos();
  }, []);

  // Verificar novos pedidos a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      verificarNovosPedidos();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Processar pedidos da API
  const processarPedidosAPI = (pedidosAPI) => {
    const resultado = {
      pendente: [],
      em_andamento: [],
      finalizado: [],
    };

    pedidosAPI.forEach((pedido) => {
      const pedidoProcessado = {
        id: pedido.id || `#${Math.floor(Math.random() * 10000)}`,
        cliente: pedido.nomeCliente || "Cliente",
        items: [
          {
            nome: pedido.nomeProduto || "Produto",
            quantidade: pedido.quantidade || 1,
            preco: pedido.valorUnitario || 0,
          },
        ],
        total: pedido.valor || 0,
        metodoPagamento: pedido.metodoPagamento || "Cartão",
        status: pedido.status || "PENDENTE",
        dataCriacao: pedido.dataCriacao || new Date().toISOString(),
        tempoPreparo: "20 min",
      };

      // Adicionar à coluna correta com base no status
      if (pedido.status === "PAGO" && !pedido.emPreparo) {
        resultado.pendente.push(pedidoProcessado);
      } else if (pedido.status === "PAGO" && pedido.emPreparo) {
        resultado.em_andamento.push(pedidoProcessado);
      } else if (pedido.status === "FINALIZADO") {
        resultado.finalizado.push(pedidoProcessado);
      } else {
        // Default para pendente
        resultado.pendente.push(pedidoProcessado);
      }
    });

    return resultado;
  };

  // Carregar pedidos do localStorage
  const carregarPedidosLocalStorage = () => {
    try {
      // Verificar pedidos salvos no histórico
      const historicoPedidos = JSON.parse(
        localStorage.getItem("historicoPedidos") || "[]"
      );

      // Processar pedidos do histórico
      const pedidosProcessados = {
        pendente: [],
        em_andamento: [],
        finalizado: [],
      };

      historicoPedidos.forEach((pedido) => {
        const pedidoProcessado = {
          id: pedido.id || `#${Math.floor(Math.random() * 10000)}`,
          cliente: "Cliente",
          items: pedido.items.map((item) => ({
            nome: item.nome,
            quantidade: item.quantidade,
            preco:
              typeof item.preco === "string"
                ? Number.parseFloat(item.preco.replace(",", "."))
                : item.preco,
          })),
          total:
            typeof pedido.total === "string"
              ? Number.parseFloat(pedido.total.replace(",", "."))
              : pedido.total,
          metodoPagamento: pedido.metodoPagamento || "Cartão",
          status: pedido.status || "pendente",
          dataCriacao: pedido.dataPedido || new Date().toISOString(),
          tempoPreparo: pedido.tempoPreparo || "20 min",
        };

        // Distribuir entre as colunas com base no status
        if (pedido.status === "finalizado" || pedido.status === "FINALIZADO") {
          pedidosProcessados.finalizado.push(pedidoProcessado);
        } else if (
          pedido.status === "em_andamento" ||
          pedido.status === "em-andamento" ||
          pedido.status === "EM_ANDAMENTO"
        ) {
          pedidosProcessados.em_andamento.push(pedidoProcessado);
        } else if (pedido.status === "PAGO" || pedido.status === "pago") {
          pedidosProcessados.pendente.push(pedidoProcessado);
        } else {
          pedidosProcessados.pendente.push(pedidoProcessado);
        }
      });

      setPedidos(pedidosProcessados);
    } catch (error) {
      console.error("Erro ao carregar pedidos do localStorage:", error);
    }
  };

  // Verificar novos pedidos
  const verificarNovosPedidos = () => {
    // Verificar pagamento no balcão
    const novoPagamentoBalcao = localStorage.getItem("novoPagamentoBalcao");
    if (novoPagamentoBalcao) {
      try {
        const dadosPagamento = JSON.parse(novoPagamentoBalcao);
        adicionarNovoPedido(dadosPagamento, "balcao");
        localStorage.removeItem("novoPagamentoBalcao");
      } catch (error) {
        console.error("Erro ao processar pagamento balcão:", error);
      }
    }

    // Verificar pagamento PIX
    const novoPagamentoPix = localStorage.getItem("novoPagamentoPix");
    if (novoPagamentoPix) {
      try {
        const dadosPagamento = JSON.parse(novoPagamentoPix);
        adicionarNovoPedido(dadosPagamento, "pix");
        localStorage.removeItem("novoPagamentoPix");
      } catch (error) {
        console.error("Erro ao processar pagamento PIX:", error);
      }
    }
  };

  // Adicionar novo pedido
  const adicionarNovoPedido = (dadosPagamento, metodoPagamento) => {
    console.log("Dados do pagamento recebidos:", dadosPagamento);

    // Extrair dados do produto principal
    const produtoPrincipal = {
      nome: dadosPagamento.nomeLanche || dadosPagamento.nome || "Produto",
      quantidade: dadosPagamento.quantidade || 1,
      preco: dadosPagamento.precoUnitario || dadosPagamento.preco || 0,
    };

    // Criar array de itens (produto principal + adicionais se houver)
    const items = [produtoPrincipal];

    // Adicionar adicionais se existirem
    if (
      dadosPagamento.adicionaisSelecionados &&
      dadosPagamento.adicionaisSelecionados.length > 0
    ) {
      dadosPagamento.adicionaisSelecionados.forEach((adicional) => {
        items.push({
          nome: `+ ${adicional.nome}`,
          quantidade: adicional.quantidade,
          preco: adicional.preco,
        });
      });
    }

    const novoPedido = {
      id: `#${Math.floor(Math.random() * 10000)}`,
      cliente: "Cliente",
      items: items,
      total:
        typeof dadosPagamento.total === "string"
          ? Number.parseFloat(dadosPagamento.total.replace(",", "."))
          : dadosPagamento.total,
      metodoPagamento: metodoPagamento === "pix" ? "PIX" : "Cartão",
      status: PENDENTE,
      dataCriacao: new Date().toISOString(),
      tempoPreparo: "20 min",
    };

    console.log("Novo pedido criado:", novoPedido);

    setPedidos((prev) => {
      const novosPendentes = [novoPedido, ...prev.pendente];
      const todosPedidos = [
        ...novosPendentes,
        ...prev.em_andamento,
        ...prev.finalizado,
      ];
      localStorage.setItem("historicoPedidos", JSON.stringify(todosPedidos));
      return {
        ...prev,
        pendente: novosPendentes,
      };
    });
  };

  // Selecionar um pedido
  const handleSelectPedido = (pedido) => {
    if (pedidoSelecionado && pedidoSelecionado.id === pedido.id) {
      setPedidoSelecionado(null);
    } else {
      setPedidoSelecionado(pedido);
    }
  };

  const moverPedido = (pedido, origem, destino) => {
    setPedidos((prev) => {
      // Remover da origem
      const novaOrigem = prev[origem].filter((p) => p.id !== pedido.id);

      // Adicionar ao destino com status atualizado
      const pedidoAtualizado = {
        ...pedido,
        status: destino,
      };

      const novoDestino = [pedidoAtualizado, ...prev[destino]];

      const novoPedidos = {
        ...prev,
        [origem]: novaOrigem,
        [destino]: novoDestino,
      };

      // Salvar todos os pedidos juntos, com status atualizado
      const todosPedidos = [
        ...novoPedidos.pendente,
        ...novoPedidos.em_andamento,
        ...novoPedidos.finalizado,
      ];
      localStorage.setItem("historicoPedidos", JSON.stringify(todosPedidos));

      return novoPedidos;
    });

    setPedidoSelecionado(null);
  };

  // Cancelar pedido

  const [pedidosEntregues, setPedidosEntregues] = useState([]);
  // Filtrar pedidos com base na pesquisa
  const filtrarPedidos = (pedidosLista) => {
    if (!searchTerm) return pedidosLista;

    return pedidosLista.filter((pedido) => {
      // Verificar ID
      if (pedido.id.toLowerCase().includes(searchTerm.toLowerCase()))
        return true;

      // Verificar cliente
      if (pedido.cliente.toLowerCase().includes(searchTerm.toLowerCase()))
        return true;

      // Verificar itens
      const temItem = pedido.items.some((item) =>
        item.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (temItem) return true;

      // Verificar valor total
      if (pedido.total.toString().includes(searchTerm)) return true;

      // Verificar método de pagamento
      if (
        pedido.metodoPagamento.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return true;

      return false;
    });
  };

  if (loading) {
    return (
      <div className="containerProjeto layout-gerenciamento">
        <div className="skeleton headerGerenciamento-skeleton"></div>
        <div className="skeleton pesquisa-skeleton" />
        <div className="skeleton nav-skeleton" />
        <div className="skeleton lista-produto-skeleton">
          <div className="categoria-titulo-skeleton skeleton" />
          <div className="produtos-grid-skeleton">
            {Array(5)
              .fill(0)
              .map((_, j) => (
                <div className="produto-card-skeleton skeleton" key={j} />
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="containerProjeto layout-gerenciamento">
      <HeaderGerenciamento activePage="pedido" />
      <div className="w-full !p-5 !mb-20">
        <div className="flex justify-between items-center !mb-5">
          <h2 className="text-white text-2xl font-bold">Pedidos do Dia</h2>
          <div className="flex !gap-2.5">
            <div className="relative w-[250px]">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={16}
              />
              <input
                type="text"
                placeholder="Buscar pedido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full !py-2 !pl-10 !pr-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button
              className={`!px-4 !py-2 rounded-lg font-bold transition flex items-center !gap-2 ${
                pedidoSelecionado
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              onClick={() => pedidoSelecionado}
              disabled={!pedidoSelecionado}
            >
              Cancelar Pedido
            </button>
            <button className="!px-4 !py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition flex items-center !gap-2">
              Novo Pedido
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 !gap-5">
          {/* Coluna 1: Pagamento Pendente */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="text-lg font-bold text-gray-800 !p-4 border-b border-gray-200">
              Pagamento Pendente
            </div>
            <div className="flex flex-col !gap-4 !p-4 max-h-[70vh] overflow-y-auto">
              {filtrarPedidos(pedidos.pendente).length > 0 ? (
                filtrarPedidos(pedidos.pendente).map((pedido) => (
                  <div
                    key={pedido.id}
                    className={`bg-gray-50 rounded-lg !p-4 shadow-sm cursor-pointer transition hover:translate-y-[-2px] hover:shadow-md ${
                      pedidoSelecionado?.id === pedido.id
                        ? "border-2 border-red-600"
                        : "border-2 border-transparent"
                    }`}
                    onClick={() => handleSelectPedido(pedido)}
                  >
                    <div className="flex justify-between items-center !mb-3">
                      <span className="font-bold text-gray-800">
                        {pedido.id}
                      </span>
                      <span className="flex items-center !gap-1 text-gray-600 text-sm">
                        <Clock size={14} />
                        {pedido.tempoPreparo}
                      </span>
                    </div>
                    <div className="text-base !mb-2">{pedido.cliente}</div>
                    <div className="!mb-3">
                      {pedido.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm text-gray-600 !mb-1"
                        >
                          <span>
                            {item.nome} ({item.quantidade}x)
                          </span>
                          <span>
                            R${" "}
                            {typeof item.preco === "number"
                              ? item.preco.toFixed(2)
                              : item.preco}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center !mt-3 !pt-3 border-t border-gray-200">
                      <span className="font-bold text-base">
                        R${" "}
                        {typeof pedido.total === "number"
                          ? pedido.total.toFixed(2)
                          : pedido.total}
                      </span>
                      <span className="text-sm text-gray-600">
                        {pedido.metodoPagamento}
                      </span>
                    </div>
                    <button
                      className="w-full !mt-3 !py-2.5 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        moverPedido(pedido, PENDENTE, EM_ANDAMENTO);
                      }}
                    >
                      Confirmar Pagamento
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center !py-16 text-gray-500">
                  <div className="text-4xl !mb-2.5 opacity-50">💰</div>
                  <p>Nenhum pagamento pendente</p>
                </div>
              )}
            </div>
          </div>

          {/* Coluna 2: Pedido em Andamento */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="text-lg font-bold text-gray-800 !p-4 border-b border-gray-200">
              Pedido em Andamento
            </div>
            <div className="flex flex-col !gap-4 !p-4 max-h-[70vh] overflow-y-auto">
              {filtrarPedidos(pedidos.em_andamento).length > 0 ? (
                filtrarPedidos(pedidos.em_andamento).map((pedido) => (
                  <div
                    key={pedido.id}
                    className={`bg-gray-50 rounded-lg !p-4 shadow-sm cursor-pointer transition hover:translate-y-[-2px] hover:shadow-md ${
                      pedidoSelecionado?.id === pedido.id
                        ? "border-2 border-red-600"
                        : "border-2 border-transparent"
                    }`}
                    onClick={() => handleSelectPedido(pedido)}
                  >
                    <div className="flex justify-between items-center !mb-3">
                      <span className="font-bold text-gray-800">
                        {pedido.id}
                      </span>
                      <span className="flex items-center !gap-1 text-gray-600 text-sm">
                        <Clock size={14} />
                        {pedido.tempoPreparo}
                      </span>
                    </div>
                    <div className="text-base !mb-2">{pedido.cliente}</div>
                    <div className="!mb-3">
                      {pedido.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm text-gray-600 !mb-1"
                        >
                          <span>
                            {item.nome} ({item.quantidade}x)
                          </span>
                          <span>
                            R${" "}
                            {typeof item.preco === "number"
                              ? item.preco.toFixed(2)
                              : item.preco}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center !mt-3 !pt-3 border-t border-gray-200">
                      <span className="font-bold text-base">
                        R${" "}
                        {typeof pedido.total === "number"
                          ? pedido.total.toFixed(2)
                          : pedido.total}
                      </span>
                      <span className="text-sm text-gray-600">
                        {pedido.metodoPagamento}
                      </span>
                    </div>
                    <button
                      className="w-full !mt-3 !py-2.5 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        moverPedido(pedido, EM_ANDAMENTO, FINALIZADO);
                      }}
                    >
                      Avançar Pedido
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center !py-16 text-gray-500">
                  <div className="text-4xl !mb-2.5 opacity-50">👨‍🍳</div>
                  <p>Nenhum pedido em andamento</p>
                </div>
              )}
            </div>
          </div>

          {/* Coluna 3: Pedido Finalizado */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="text-lg font-bold text-gray-800 !p-4 border-b border-gray-200">
              Pedido Finalizado
            </div>
            <div className="flex flex-col !gap-4 !p-4 max-h-[70vh] overflow-y-auto">
              {filtrarPedidos(pedidos.finalizado).length > 0 ? (
                filtrarPedidos(pedidos.finalizado).map((pedido) => (
                  <div
                    key={pedido.id}
                    className={`bg-gray-50 rounded-lg !p-4 shadow-sm cursor-pointer transition hover:translate-y-[-2px] hover:shadow-md ${
                      pedidoSelecionado?.id === pedido.id
                        ? "border-2 border-red-600"
                        : "border-2 border-transparent"
                    }`}
                    onClick={() => handleSelectPedido(pedido)}
                  >
                    <div className="flex justify-between items-center !mb-3">
                      <span className="font-bold text-gray-800">
                        {pedido.id}
                      </span>
                      <span className="flex items-center !gap-1 text-gray-600 text-sm">
                        <Clock size={14} />
                        {pedido.tempoPreparo}
                      </span>
                    </div>
                    <div className="text-base !mb-2">{pedido.cliente}</div>
                    <div className="!mb-3">
                      {pedido.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm text-gray-600 !mb-1"
                        >
                          <span>
                            {item.nome} ({item.quantidade}x)
                          </span>
                          <span>
                            R${" "}
                            {typeof item.preco === "number"
                              ? item.preco.toFixed(2)
                              : item.preco}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center !mt-3 !pt-3 border-t border-gray-200">
                      <span className="font-bold text-base">
                        R${" "}
                        {typeof pedido.total === "number"
                          ? pedido.total.toFixed(2)
                          : pedido.total}
                      </span>
                      <span className="text-sm text-gray-600">
                        {pedido.metodoPagamento}
                      </span>
                    </div>
                    <button
                      className={`w-full !mt-3 !py-2.5 bg-amber-500 text-white font-bold rounded-md hover:bg-amber-600 transition ${
                        pedidosEntregues.includes(pedido.id)
                          ? "cursor-not-allowed opacity-60"
                          : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPedidosEntregues((prev) => [...prev, pedido.id]);
                        alert(`Pedido ${pedido.id} entregue ao cliente!`);
                      }}
                      disabled={pedidosEntregues.includes(pedido.id)}
                    >
                      Entregar Pedido
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center !py-16 text-gray-500">
                  <div className="text-4xl !mb-2.5 opacity-50">✅</div>
                  <p>Nenhum pedido finalizado</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Cancelamento removido */}
    </div>
  );
}
