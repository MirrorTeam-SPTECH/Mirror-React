"use client";
import { useEffect, useState, useMemo } from "react";
import { API_BASE_URL } from "../config/api";
import HeaderGerenciamento from "../components/HeaderGerenciamento";
import DeleteConfirmation from "../components/DeleteConfirmation";
import { todasCategorias } from "../utils/Categorias";
import "../styles/Carregamento.css";
import {
  Maximize,
  Minimize,
  Clock,
  Search,
  CreditCard,
  BadgePercent,
} from "lucide-react";

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

function toNumber(v) {
  if (v == null) return undefined;
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number.parseFloat(v.replace?.(",", ".") ?? v);
    return Number.isNaN(n) ? undefined : n;
  }
  return undefined;
}
function normalizeAddons(maybe) {
  const src = Array.isArray(maybe) ? maybe : [];
  return src
    .map((ad) => {
      const nome =
        ad?.nome ??
        ad?.descricao ??
        ad?.label ??
        (typeof ad === "string" ? ad : "Adicional");
      const precoRaw =
        ad?.preco ?? ad?.valor ?? ad?.precoUnitario ?? ad?.valorUnitario ?? 0;
      const quantidade = toNumber(ad?.quantidade) ?? toNumber(ad?.qtd) ?? 1;
      const preco =
        typeof precoRaw === "string"
          ? Number.parseFloat(precoRaw.replace(",", "."))
          : Number(precoRaw ?? 0);
      return {
        nome,
        preco: Number.isFinite(preco) ? preco : 0,
        quantidade: Number.isFinite(quantidade) ? quantidade : 1,
      };
    })
    .filter((a) => a && a.nome);
}
export default function Cozinha() {
  const [loading, setLoading] = useState(true);
  const [cardAberto, setCardAberto] = useState(null);
  const [expandido, setExpandido] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  function Expandir() {
    setExpandido((prev) => !prev);
  }
  useEffect(() => {
    const carregarPedidos = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/orders`)
          .then((res) => (res.ok ? res.json() : null))
          .catch(() => null);
        if (Array.isArray(response)) {
          setPedidos(processarPedidosAPI(response));
        } else {
          setPedidos([]);
        }
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
        setPedidos([]);
      } finally {
        setLoading(false);
      }
    };
    carregarPedidos();
    const interval = setInterval(() => {
      carregarPedidos();
    }, 30000);
    return () => clearInterval(interval);
  }, []);
  const processarPedidosAPI = (pedidosAPI) => {
    const mapeados = pedidosAPI.map((pedido) => {
      const id =
        pedido?.id != null
          ? String(pedido.id)
          : `${Date.now()}-${Math.random()}`;

      const items =
        Array.isArray(pedido?.itens) && pedido.itens.length > 0
          ? pedido.itens.map((item) => {
              const adicionaisSelecionados = [
                ...normalizeAddons(item?.acompanhamentos),
                ...normalizeAddons(item?.acompanhamentosSelecionados),

                ...normalizeAddons(item?.adicionais),
                ...normalizeAddons(item?.adicionaisSelecionados),
                ...normalizeAddons(item?.extras),
              ];
              return {
                nome: item?.nome || item?.descricao || "Item",
                quantidade: Number(item?.quantidade ?? 1),
                observacao: item?.observacao || "",
                preco:
                  typeof item?.preco === "string"
                    ? Number.parseFloat(item.preco.replace(",", "."))
                    : Number(item?.preco ?? item?.valorUnitario ?? 0),
                categoria: item?.categoria ?? item?.categoriaNome ?? undefined,
                adicionaisSelecionados,
              };
            })
          : [
              {
                nome: pedido?.nomeProduto || pedido?.descricao || "Item",
                quantidade: Number(pedido?.quantidade ?? 1),
                observacao: "",
                preco:
                  typeof pedido?.valorUnitario === "string"
                    ? Number.parseFloat(pedido.valorUnitario.replace(",", "."))
                    : Number(pedido?.valorUnitario ?? 0),
                categoria:
                  pedido?.categoria ?? pedido?.categoriaNome ?? undefined,
                adicionaisSelecionados: [],
              },
            ];

      const topLevelAddons = [
        ...normalizeAddons(pedido?.acompanhamentos),
        ...normalizeAddons(pedido?.acompanhamentosSelecionados),
        ...normalizeAddons(pedido?.adicionais),
        ...normalizeAddons(pedido?.adicionaisSelecionados),
        ...normalizeAddons(pedido?.extras),
      ];
      if (topLevelAddons.length > 0 && items.length > 0) {
        items[0].adicionaisSelecionados = [
          ...(items[0].adicionaisSelecionados || []),
          ...topLevelAddons,
        ];
      }
      const total =
        typeof pedido?.valor === "string"
          ? Number.parseFloat(pedido.valor.replace(",", "."))
          : Number(pedido?.valor ?? 0);
      return {
        id,
        cliente: pedido?.nomeCliente || "Cliente",
        status: pedido?.status || "Em preparo",
        tempoPreparo: pedido?.tempoPreparo || "20 min",
        metodoPagamento: pedido?.metodoPagamento || "—",
        total: Number.isFinite(total) ? total : 0,
        items,
        dataCriacao: pedido?.dataCriacao ?? new Date().toISOString(),
      };
    });
    return dedupeOrders(mapeados);
  };
  const pedidosFiltrados = useMemo(() => {
    if (!searchTerm) return pedidos;
    const term = searchTerm.toLowerCase();
    return pedidos.filter((pedido) => {
      return (
        String(pedido.id).toLowerCase().includes(term) ||
        String(pedido.cliente).toLowerCase().includes(term) ||
        String(pedido.metodoPagamento ?? "")
          .toLowerCase()
          .includes(term) ||
        String(pedido.status ?? "")
          .toLowerCase()
          .includes(term) ||
        (Array.isArray(pedido.items) &&
          pedido.items.some(
            (it) =>
              String(it?.nome ?? "")
                .toLowerCase()
                .includes(term) ||
              String(it?.categoria ?? "")
                .toLowerCase()
                .includes(term) ||
              (Array.isArray(it?.adicionaisSelecionados) &&
                it.adicionaisSelecionados.some((ad) =>
                  String(ad?.nome ?? "")
                    .toLowerCase()
                    .includes(term)
                ))
          ))
      );
    });
  }, [pedidos, searchTerm]);
  const handleCardClose = () => {
    setCardAberto(null);
    setPedidoSelecionado(null);
  };
  const handleCancelarPedido = (pedido) => {
    setPedidoSelecionado(pedido);
    setCardAberto("cancelar");
  };
  const confirmarCancelamento = () => {
    setPedidos((prev) =>
      prev.filter((p) => String(p.id) !== String(pedidoSelecionado?.id))
    );
    setCardAberto(null);
    setPedidoSelecionado(null);
  };
  const formatBRL = (n) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 2,
    }).format(Number(n || 0));
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
          <div className="w-full !p-5 !mb-20">
            <div className="flex justify-between items-center !mb-5">
              <h2 className="text-white text-2xl font-bold">Pedidos do Dia</h2>
              <div className="flex !gap-2.5">
                <button className="!px-4 !py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition flex items-center !gap-2">
                  Novo Pedido
                </button>
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
            <div className="flex w-full justify-center items-center !mb-0 min-h-[70vh]">
              <div
                className={
                  cardAberto ? "flex-3 w-[70%]" : "w-full flex justify-center"
                }
              >
                <div
                  className={
                    expandido
                      ? "bg-white rounded-2xl fixed top-10 left-20 w-[90%] h-[90vh] shadow-2xl !p-10 m-0 flex flex-wrap gap-5 overflow-auto items-start z-50"
                      : "bg-white rounded-2xl relative w-[100%] shadow-2xl !p-10 overflow-auto m-8 flex flex-wrap h-[500px] gap-5 justify-center items-start "
                  }
                >
                  <button
                    onClick={Expandir}
                    className={
                      expandido
                        ? "absolute top-6 right-6 w-[40px] h-[40px] flex justify-center items-center cursor-pointer z-50 bg-blue-100 rounded-full"
                        : "absolute right-0 w-[40px] h-[40px] bottom-0  flex justify-center items-center cursor-pointer bg-blue-100 rounded-full"
                    }
                    title={expandido ? "Recolher" : "Expandir"}
                  >
                    {expandido ? (
                      <Minimize color="#000" />
                    ) : (
                      <Maximize color="#000" />
                    )}
                  </button>
                  {pedidosFiltrados && pedidosFiltrados.length > 0 ? (
                    pedidosFiltrados.map((pedido) => {
                      const categoriasDoPedido = Array.from(
                        new Set(
                          (pedido.items || [])
                            .map((it) => it?.categoria)
                            .filter(Boolean)
                        )
                      );
                      return (
                        <div
                          key={pedido.id}
                          className="bg-gradient-to-br from-gray-50  to-gray-200 rounded-xl !p-4 w-80 border min-h-[16rem] flex flex-col items-start shadow-lg transition-transform hover:scale-[1.02] hover:shadow-2xl"
                        >
                          <div className="flex items-center justify-between w-full mb-2">
                            <div className="flex items-center gap-2">
                              <span className="inline-block text-gray-700 rounded-full px-2 py-0.5 text-[11px] font-bold shadow">
                                #{pedido.id}
                              </span>
                              <span className="ml-2 text-green-700 font-semibold text-xs">
                                {pedido.status}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-500 text-xs">
                              <Clock size={12} className="mr-1" />
                              <span>{pedido.tempoPreparo}</span>
                            </div>
                          </div>
                          <div className="w-full !mt-5">
                            <p className="text-gray-800 text-sm font-semibold">
                              Compra:
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {categoriasDoPedido.length > 0 ? (
                                categoriasDoPedido.map((cat, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 rounded-full px-2 py-0.5 text-[10px]"
                                  >
                                    <BadgePercent size={12} />
                                    {cat}
                                  </span>
                                ))
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 rounded-full px-2 py-0.5 text-[10px]"></span>
                              )}
                            </div>
                          </div>
                          <div className="flex-1 w-full">
                            <ul className="text-gray-700 text-[13px] mb-3 list-disc list-inside">
                              {pedido.items.map((item, index) => (
                                <li key={index} className="flex flex-col gap-1">
                                  <div className="flex justify-between gap-2">
                                    <span className="truncate">
                                      {item.nome} ({item.quantidade}x)
                                      {item.observacao && (
                                        <span className="text-xs text-gray-500 ml-1">
                                          ({item.observacao})
                                        </span>
                                      )}
                                    </span>
                                    <span className="shrink-0 text-gray-600">
                                      {formatBRL(
                                        (item.preco || 0) *
                                          (item.quantidade || 1)
                                      )}
                                    </span>
                                  </div>
                                  {Array.isArray(item.adicionaisSelecionados) &&
                                    item.adicionaisSelecionados.length > 0 && (
                                      <ul className="pl-5 list-[circle] text-[12px] text-gray-600">
                                        {item.adicionaisSelecionados.map(
                                          (ad, i) => (
                                            <li
                                              key={i}
                                              className="flex justify-between gap-2"
                                            >
                                              <span className="truncate">
                                                {ad?.nome}
                                              </span>
                                              <span className="shrink-0">
                                                {formatBRL(
                                                  (toNumber(ad?.preco) ?? 0) *
                                                    (toNumber(ad?.quantidade) ??
                                                      1)
                                                )}
                                              </span>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    )}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="w-full mt-auto">
                            <div className="flex items-center justify-between border-t border-gray-300 pt-2">
                              <div className="flex items-center gap-1 text-gray-700 text-xs">
                                <CreditCard size={14} />
                                <span>{pedido.metodoPagamento}</span>
                              </div>
                              <div className="text-sm font-bold text-gray-900">
                                {formatBRL(pedido.total)}
                              </div>
                            </div>
                            <button
                              className="!mt-2 w-full px-4 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition"
                              onClick={() => handleCancelarPedido(pedido)}
                            >
                              Cancelar Pedido
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <p className="text-xl mb-2">Nenhum pedido encontrado</p>
                      <p className="text-sm">
                        Não há pedidos em andamento no momento
                      </p>
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
          </div>
        </>
      )}
    </div>
  );
}
