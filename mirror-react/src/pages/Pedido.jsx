"use client";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";
import HeaderGerenciamento from "../components/HeaderGerenciamento";
import { Search, Clock } from "lucide-react";

const HISTORICO_KEY = "historicoPedidos";
const STATUS_OVERRIDES_KEY = "pedidoStatusOverrides";

const PENDENTE = "pendente";
const EM_ANDAMENTO = "em_andamento";
const FINALIZADO = "finalizado";

function buildSignature(p) {
  try {
    const cliente = String(p?.cliente ?? "")
      .trim()
      .toLowerCase();
    const firstItem = String(p?.items?.[0]?.nome ?? "")
      .trim()
      .toLowerCase();
    const totalCents = Math.round(Number(p?.total ?? 0) * 100);
    const minute = new Date(p?.dataCriacao ?? Date.now())
      .toISOString()
      .slice(0, 16);
    return `${cliente}|${firstItem}|${totalCents}|${minute}`;
  } catch {
    return `sig-${Date.now()}`;
  }
}

function dedupeOrders(list) {
  const byId = new Set();
  const bySig = new Set();
  const result = [];
  for (const p of list) {
    const id = p?.id != null ? String(p.id) : null;
    const sig = buildSignature(p);
    const hasId = id && byId.has(id);
    const hasSig = bySig.has(sig);
    if (!hasId && !hasSig) {
      if (id) byId.add(id);
      bySig.add(sig);
      result.push(p);
    }
  }
  return result;
}
export default function Pedido() {
  const [loading, setLoading] = useState(true);
  const [pedidos, setPedidos] = useState({
    pendente: [],
    em_andamento: [],
    finalizado: [],
  });
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pedidosEntregues, setPedidosEntregues] = useState([]);

  const readJSON = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const data = JSON.parse(raw);
      return data ?? fallback;
    } catch {
      return fallback;
    }
  };
  const writeJSON = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("Falha ao salvar localStorage:", key, e);
    }
  };
  const loadOverrides = () => readJSON(STATUS_OVERRIDES_KEY, {});
  const saveOverride = (id, status) => {
    const overrides = loadOverrides();
    overrides[String(id)] = status;
    writeJSON(STATUS_OVERRIDES_KEY, overrides);
  };

  const normalizeFromAPI = (p) => {
    const id = p?.id != null ? String(p.id) : `#${Date.now()}`;
    const items =
      Array.isArray(p?.items) && p.items.length > 0
        ? p.items.map((it) => ({
            nome: it?.nome ?? it?.descricao ?? "Produto",
            quantidade: Number(it?.quantidade ?? 1),
            preco:
              typeof it?.preco === "string"
                ? Number.parseFloat(it.preco.replace(",", "."))
                : Number(it?.preco ?? 0),
            categoria: it?.categoria ?? it?.categoriaNome ?? undefined,
          }))
        : [
            {
              nome: p?.nomeProduto ?? p?.descricao ?? "Produto",
              quantidade: Number(p?.quantidade ?? 1),
              preco:
                typeof p?.valorUnitario === "string"
                  ? Number.parseFloat(p.valorUnitario.replace(",", "."))
                  : Number(p?.valorUnitario ?? 0),
              categoria: p?.categoria ?? p?.categoriaNome ?? undefined,
            },
          ];
    const total =
      typeof p?.valor === "string"
        ? Number.parseFloat(p.valor.replace(",", "."))
        : Number(p?.valor ?? 0);

    let status = PENDENTE;
    const apiStatus = String(p?.status ?? "").toUpperCase();
    const emPreparo = Boolean(p?.emPreparo);
    if (apiStatus === "FINALIZADO" || apiStatus === "FINALIZADO_PAGO") {
      status = FINALIZADO;
    } else if (
      (apiStatus === "PAGO" || apiStatus === "APROVADO") &&
      emPreparo
    ) {
      status = EM_ANDAMENTO;
    } else if (
      apiStatus === "PAGO" ||
      apiStatus === "APROVADO" ||
      apiStatus === "PENDENTE"
    ) {
      status = PENDENTE;
    }
    return {
      id,
      cliente: p?.nomeCliente ?? "Cliente",
      items,
      total: Number.isFinite(total) ? total : 0,
      metodoPagamento: p?.metodoPagamento ?? "Cartão",
      status,
      dataCriacao: p?.dataCriacao ?? new Date().toISOString(),
      tempoPreparo: p?.tempoPreparo ?? "20 min",
    };
  };
  const normalizeFromHistorico = (p) => {
    const id = p?.id != null ? String(p.id) : `#${Date.now()}`;
    const items = Array.isArray(p?.items)
      ? p.items.map((it) => ({
          nome: it?.nome ?? it?.descricao ?? "Produto",
          quantidade: Number(it?.quantidade ?? 1),
          preco:
            typeof it?.preco === "string"
              ? Number.parseFloat(it.preco.replace(",", "."))
              : Number(it?.preco ?? 0),
          categoria: it?.categoria ?? it?.categoriaNome ?? undefined,
        }))
      : [
          {
            nome: p?.nomeLanche ?? p?.nomeProduto ?? p?.descricao ?? "Produto",
            quantidade: Number(p?.quantidade ?? 1),
            preco:
              typeof p?.precoUnitario === "string"
                ? Number.parseFloat(p.precoUnitario.replace(",", "."))
                : Number(p?.precoUnitario ?? 0),
            categoria: p?.categoria ?? p?.categoriaNome ?? undefined,
          },
        ];
    const total =
      typeof p?.total === "string"
        ? Number.parseFloat(p.total.replace(",", "."))
        : Number(
            p?.total ??
              (Array.isArray(items)
                ? items.reduce(
                    (acc, it) => acc + (it.preco || 0) * (it.quantidade || 1),
                    0
                  )
                : 0)
          );
    let status = String(p?.status ?? PENDENTE).toLowerCase();
    if (["finalizado", "entregue", "finalizado_pago"].includes(status))
      status = FINALIZADO;
    else if (
      [
        "em_andamento",
        "em-andamento",
        "andamento",
        "preparo",
        "preparando",
      ].includes(status)
    )
      status = EM_ANDAMENTO;
    else status = PENDENTE;
    return {
      id,
      cliente: p?.cliente ?? "Cliente",
      items,
      total: Number.isFinite(total) ? total : 0,
      metodoPagamento: p?.metodoPagamento ?? "Cartão",
      status,
      dataCriacao: p?.dataCriacao ?? p?.dataPedido ?? new Date().toISOString(),
      tempoPreparo: p?.tempoPreparo ?? "20 min",
    };
  };
  const applyOverrides = (list) => {
    const overrides = loadOverrides();
    return list.map((p) => {
      const overridden = overrides[String(p.id)];
      return overridden ? { ...p, status: overridden } : p;
    });
  };
  const distributeToColumns = (list) => {
    const result = { pendente: [], em_andamento: [], finalizado: [] };
    list.forEach((p) => {
      if (p.status === FINALIZADO) result.finalizado.push(p);
      else if (p.status === EM_ANDAMENTO) result.em_andamento.push(p);
      else result.pendente.push(p);
    });
    return result;
  };
  const flattenAndSaveHistorico = (stateObj) => {
    const combined = [
      ...stateObj.pendente,
      ...stateObj.em_andamento,
      ...stateObj.finalizado,
    ];
    const deduped = dedupeOrders(combined);

    deduped.sort((a, b) => {
      const ta = new Date(a.dataCriacao).getTime() || 0;
      const tb = new Date(b.dataCriacao).getTime() || 0;
      return tb - ta;
    });
    writeJSON(HISTORICO_KEY, deduped);
  };

  useEffect(() => {
    const carregarPedidos = async () => {
      try {
        let apiList = null;
        try {
          const res = await fetch(`${API_BASE_URL}/orders`);
          if (res.ok) {
            const json = await res.json();
            if (Array.isArray(json)) {
              apiList = dedupeOrders(json.map(normalizeFromAPI));
            }
          }
        } catch {
          apiList = null;
        }
        if (apiList && apiList.length > 0) {
          const withOverrides = applyOverrides(apiList);
          const distributed = distributeToColumns(withOverrides);
          setPedidos(distributed);
          flattenAndSaveHistorico(distributed);
        } else {
          const hist = readJSON(HISTORICO_KEY, []);
          const normalized = (Array.isArray(hist) ? hist : []).map(
            normalizeFromHistorico
          );
          const withOverrides = applyOverrides(dedupeOrders(normalized));
          const distributed = distributeToColumns(withOverrides);
          setPedidos(distributed);
        }

        verificarNovosPedidos(true);
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
        const hist = readJSON(HISTORICO_KEY, []);
        const normalized = (Array.isArray(hist) ? hist : []).map(
          normalizeFromHistorico
        );
        const withOverrides = applyOverrides(dedupeOrders(normalized));
        const distributed = distributeToColumns(withOverrides);
        setPedidos(distributed);
      } finally {
        setLoading(false);
      }
    };
    carregarPedidos();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      verificarNovosPedidos(false);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  const existeNoEstadoPorIdOuAssinatura = (candidate) => {
    const id = candidate?.id != null ? String(candidate.id) : null;
    const sig = buildSignature(candidate);
    const all = [
      ...pedidos.pendente,
      ...pedidos.em_andamento,
      ...pedidos.finalizado,
    ];
    return all.some((p) => String(p.id) === id || buildSignature(p) === sig);
  };

  const verificarNovosPedidos = (consumirImediato) => {
    const processar = (key, metodo) => {
      const raw = localStorage.getItem(key);
      if (!raw) return;
      try {
        const dadosPagamento = JSON.parse(raw);

        const candidato = construirPedidoDePagamento(dadosPagamento, metodo);
        if (!existeNoEstadoPorIdOuAssinatura(candidato)) {
          adicionarNovoPedidoConstruido(candidato);
        }
      } catch (error) {
        console.error("Erro ao processar pagamento:", key, error);
      } finally {
        if (consumirImediato) {
          localStorage.removeItem(key);
        } else {
          localStorage.removeItem(key);
        }
      }
    };
    processar("novoPagamentoBalcao", "balcao");
    processar("novoPagamentoPix", "pix");
  };

  const construirPedidoDePagamento = (dadosPagamento, metodoPagamento) => {
    const produtoPrincipal = {
      nome: dadosPagamento?.nomeLanche || dadosPagamento?.nome || "Produto",
      quantidade: Number(dadosPagamento?.quantidade ?? 1),
      preco:
        typeof dadosPagamento?.precoUnitario === "string"
          ? Number.parseFloat(dadosPagamento.precoUnitario.replace(",", "."))
          : Number(dadosPagamento?.precoUnitario ?? dadosPagamento?.preco ?? 0),
    };
    const items = [produtoPrincipal];
    if (
      Array.isArray(dadosPagamento?.adicionaisSelecionados) &&
      dadosPagamento.adicionaisSelecionados.length > 0
    ) {
      dadosPagamento.adicionaisSelecionados.forEach((ad) => {
        items.push({
          nome: `+ ${ad?.nome ?? "Adicional"}`,
          quantidade: Number(ad?.quantidade ?? 1),
          preco:
            typeof ad?.preco === "string"
              ? Number.parseFloat(ad.preco.replace(",", "."))
              : Number(ad?.preco ?? 0),
        });
      });
    }
    const total =
      typeof dadosPagamento?.total === "string"
        ? Number.parseFloat(dadosPagamento.total.replace(",", "."))
        : Number(dadosPagamento?.total ?? 0);

    const idBase =
      dadosPagamento?.id ??
      dadosPagamento?.pedidoId ??
      dadosPagamento?.timestamp ??
      dadosPagamento?.createdAt ??
      Date.now();
    return {
      id: String(idBase),
      cliente: "Cliente",
      items,
      total: Number.isFinite(total) ? total : 0,
      metodoPagamento: metodoPagamento === "pix" ? "PIX" : "Cartão",
      status: PENDENTE,
      dataCriacao: new Date().toISOString(),
      tempoPreparo: "20 min",
    };
  };

  const adicionarNovoPedidoConstruido = (novoPedido) => {
    setPedidos((prev) => {
      const already =
        prev.pendente.some(
          (p) =>
            String(p.id) === String(novoPedido.id) ||
            buildSignature(p) === buildSignature(novoPedido)
        ) ||
        prev.em_andamento.some(
          (p) =>
            String(p.id) === String(novoPedido.id) ||
            buildSignature(p) === buildSignature(novoPedido)
        ) ||
        prev.finalizado.some(
          (p) =>
            String(p.id) === String(novoPedido.id) ||
            buildSignature(p) === buildSignature(novoPedido)
        );
      if (already) return prev;
      const novosPendentes = [novoPedido, ...prev.pendente];
      const next = {
        ...prev,
        pendente: dedupeOrders(novosPendentes),
      };

      saveOverride(novoPedido.id, PENDENTE);
      flattenAndSaveHistorico(next);
      return next;
    });
  };

  const handleSelectPedido = (pedido) => {
    if (pedidoSelecionado && pedidoSelecionado.id === pedido.id) {
      setPedidoSelecionado(null);
    } else {
      setPedidoSelecionado(pedido);
    }
  };

  const moverPedido = (pedido, origem, destino) => {
    setPedidos((prev) => {
      const novaOrigem = prev[origem].filter(
        (p) => String(p.id) !== String(pedido.id)
      );
      const pedidoAtualizado = { ...pedido, status: destino };
      const novoDestino = [pedidoAtualizado, ...prev[destino]];
      const nextState = {
        ...prev,
        [origem]: novaOrigem,
        [destino]: dedupeOrders(novoDestino),
      };
      saveOverride(pedidoAtualizado.id, destino);
      flattenAndSaveHistorico(nextState);
      return nextState;
    });
    setPedidoSelecionado(null);
  };

  const filtrarPedidos = (pedidosLista) => {
    if (!searchTerm) return pedidosLista;
    const term = String(searchTerm).toLowerCase();
    return pedidosLista.filter((pedido) => {
      if (!pedido) return false;
      const idStr = String(pedido.id ?? "").toLowerCase();
      if (idStr.includes(term)) return true;
      const clienteStr = String(pedido.cliente ?? "").toLowerCase();
      if (clienteStr.includes(term)) return true;
      if (Array.isArray(pedido.items)) {
        const temItem = pedido.items.some((item) =>
          String(item?.nome ?? "")
            .toLowerCase()
            .includes(term)
        );
        if (temItem) return true;
      }
      const totalStr = String(
        typeof pedido.total === "number"
          ? pedido.total.toFixed(2)
          : pedido.total ?? ""
      ).toLowerCase();
      if (totalStr.includes(term)) return true;
      const metodoStr = String(pedido.metodoPagamento ?? "").toLowerCase();
      if (metodoStr.includes(term)) return true;
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
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 !gap-5">
          {}
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
          {}
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
          {}
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
    </div>
  );
}
