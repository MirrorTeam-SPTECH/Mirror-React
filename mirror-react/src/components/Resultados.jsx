"use client";

import "handsontable/styles/handsontable.min.css";
import "handsontable/styles/ht-theme-main.min.css";
import "../styles/Resultados.css";

import { registerAllModules } from "handsontable/registry";
import { HotTable } from "@handsontable/react-wrapper";
import { useState, useEffect, useRef, useMemo } from "react";
import api from "../config/api"; // Usar api configurada com Bearer token

registerAllModules();

// Helpers
function formatCurrency(value) {
  const num = Number(value) || 0;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(num);
}

function formatDate(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Compara somente a data em horário local (evita deslocamentos por fuso/UTC)
function sameDayLocal(isoString, yyyyMmDd) {
  if (!isoString || !yyyyMmDd) return true;
  try {
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return false;
    const [y, m, day] = yyyyMmDd.split("-").map(Number);
    return (
      d.getFullYear() === y && d.getMonth() + 1 === m && d.getDate() === day
    );
  } catch {
    return false;
  }
}

export default function Resultados({ filtros = {}, pagamentoBalcao }) {
  const [pedidosOriginais, setPedidosOriginais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchPedidos();

    // Atualização automática a cada 5 segundos
    intervalRef.current = setInterval(() => {
      fetchPedidos();
    }, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recarrega quando um novo pagamento no balcão é detectado
  useEffect(() => {
    if (pagamentoBalcao) {
      fetchPedidos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagamentoBalcao]);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      let response;
      try {
        response = await api.get("/api/orders");
      } catch {
        // Fallback para dados do histórico local se existir
        const historico = JSON.parse(
          localStorage.getItem("historicoPedidos") || "[]"
        );
        if (Array.isArray(historico) && historico.length > 0) {
          response = {
            data: historico.map((p, idx) => ({
              id: p.id || idx + 1,
              nomeProduto: p.itens?.[0]?.nome || "Item",
              quantidade: p.itens?.[0]?.quantidade || 1,
              valor: Number(p.total) || 0,
              metodoPagamento: p.metodoPagamento || "balcao",
              status: p.status || "pago",
              dataCriacao: p.dataPedido || new Date().toISOString(),
            })),
          };
        } else {
          // Mock básico (último recurso)
          response = {
            data: [
              {
                id: 1,
                nomeProduto: "X-Burger",
                quantidade: 2,
                valor: 25.0,
                metodoPagamento: "pix",
                status: "pago",
                dataCriacao: "2024-01-15T18:30:00Z",
              },
              {
                id: 2,
                nomeProduto: "X-Salada",
                quantidade: 1,
                valor: 18.0,
                metodoPagamento: "balcao",
                status: "não pago",
                dataCriacao: "2024-01-15T19:00:00Z",
              },
              {
                id: 3,
                nomeProduto: "Batata Frita",
                quantidade: 3,
                valor: 12.0,
                metodoPagamento: "pix",
                status: "pago",
                dataCriacao: "2024-01-15T19:15:00Z",
              },
              {
                id: 4,
                nomeProduto: "Refrigerante",
                quantidade: 2,
                valor: 8.0,
                metodoPagamento: "balcao",
                status: "pago",
                dataCriacao: "2024-01-15T19:30:00Z",
              },
              {
                id: 5,
                nomeProduto: "X-Bacon",
                quantidade: 1,
                valor: 35.0,
                metodoPagamento: "pix",
                status: "não pago",
                dataCriacao: "2024-01-15T20:00:00Z",
              },
              {
                id: 6,
                nomeProduto: "Pizza Grande",
                quantidade: 1,
                valor: 55.0,
                metodoPagamento: "balcao",
                status: "pago",
                dataCriacao: "2024-01-15T20:15:00Z",
              },
              {
                id: 7,
                nomeProduto: "Hambúrguer Simples",
                quantidade: 1,
                valor: 15.0,
                metodoPagamento: "pix",
                status: "pago",
                dataCriacao: "2024-01-15T20:30:00Z",
              },
              {
                id: 8,
                nomeProduto: "Combo Família",
                quantidade: 1,
                valor: 75.0,
                metodoPagamento: "balcao",
                status: "não pago",
                dataCriacao: "2024-01-15T21:00:00Z",
              },
            ],
          };
        }
      }

      console.log("📦 Resposta da API /api/orders:", response);
      console.log("📦 response.data:", response.data);
      console.log("📦 response.data.content:", response.data.content);

      // Log do primeiro pedido para ver a estrutura
      if (response.data?.content && response.data.content.length > 0) {
        const primeiroPedido = response.data.content[0];
        console.log("🔍 Estrutura do primeiro pedido:", primeiroPedido);
        console.log("🔍 Campos disponíveis:", Object.keys(primeiroPedido));
        console.log("🔍 Valores dos campos:");
        Object.keys(primeiroPedido).forEach((key) => {
          console.log(`   ${key}:`, primeiroPedido[key]);
        });
      }

      // A API retorna um objeto com { content: [], totalElements: X }
      // Então precisamos pegar o array de dentro de 'content'
      let pedidos = Array.isArray(response.data?.content)
        ? response.data.content
        : Array.isArray(response.data)
        ? response.data
        : [];

      // Mapear campos do backend para o formato esperado pelo frontend
      pedidos = pedidos.map((pedido) => {
        // Pegar o primeiro item para nome e quantidade (simplificado)
        const primeiroItem = pedido.items?.[0] || {};
        const nomeItem =
          primeiroItem.menuItemName || primeiroItem.name || "Item";
        const quantidade = primeiroItem.quantity || 1;

        return {
          id: pedido.id,
          nomeProduto: nomeItem,
          quantidade: quantidade,
          valor: pedido.total || 0,
          metodoPagamento: pedido.payment?.method?.toLowerCase() || "balcao",
          status: pedido.status || "PENDING",
          dataCriacao: pedido.createdAt,
          // Campos extras para possível uso futuro
          customerName: pedido.customerName,
          items: pedido.items,
          payment: pedido.payment,
        };
      });

      console.log(
        "✅ Pedidos extraídos e mapeados:",
        pedidos.length,
        "pedidos"
      );
      console.log("🔍 Primeiro pedido mapeado:", pedidos[0]);
      setPedidosOriginais(pedidos);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err);
      setError("Erro ao carregar pedidos");
    } finally {
      setLoading(false);
    }
  };

  // Aplicar filtros aos dados (inclui data local)
  const pedidosFiltrados = useMemo(() => {
    // Garantir que pedidosOriginais seja um array
    if (!Array.isArray(pedidosOriginais)) {
      console.warn("⚠️ pedidosOriginais não é um array:", pedidosOriginais);
      return [];
    }

    let filtrados = [...pedidosOriginais];

    // Filtro por pagamento
    if (filtros.pagamento) {
      filtrados = filtrados.filter(
        (pedido) =>
          pedido.metodoPagamento?.toLowerCase() ===
          filtros.pagamento.toLowerCase()
      );
    }

    // Filtro por valor
    if (filtros.valor) {
      filtrados = filtrados.filter((pedido) => {
        const valor = Number(pedido.valor) || 0;
        switch (filtros.valor) {
          case "0-20":
            return valor <= 20;
          case "20-50":
            return valor > 20 && valor <= 50;
          case "50+":
            return valor > 50;
          default:
            return true;
        }
      });
    }

    // Filtro por status/origem
    if (filtros.origem) {
      filtrados = filtrados.filter((pedido) =>
        pedido.status?.toLowerCase().includes(filtros.origem.toLowerCase())
      );
    }

    // Filtro por pesquisa
    if (filtros.pesquisar) {
      const termo = filtros.pesquisar.toLowerCase();
      filtrados = filtrados.filter((pedido) => {
        return (
          pedido.nomeProduto?.toLowerCase().includes(termo) ||
          pedido.descricao?.toLowerCase().includes(termo) ||
          pedido.id?.toString().includes(termo)
        );
      });
    }

    // Filtro por data (YYYY-MM-DD, local)
    if (filtros.data) {
      filtrados = filtrados.filter((pedido) =>
        sameDayLocal(pedido.dataCriacao, filtros.data)
      );
    }

    return filtrados;
  }, [pedidosOriginais, filtros]);

  // Transformar dados filtrados para o formato do Handsontable
  const dadosFormatados = useMemo(() => {
    return pedidosFiltrados.map((pedido) => [
      pedido.id,
      pedido.nomeProduto || pedido.descricao || "Item",
      pedido.quantidade,
      formatCurrency(pedido.valor),
      pedido.metodoPagamento,
      pedido.status,
      formatDate(pedido.dataCriacao),
    ]);
  }, [pedidosFiltrados]);

  // Configurações da tabela (sem col widths rígidas para ocupar 100%)
  const columns = [
    { title: "ID" },
    { title: "Produto" },
    { title: "Qtd" },
    { title: "Valor" },
    { title: "Pagamento" },
    { title: "Status" },
    { title: "Data/Hora" },
  ];

  if (loading) {
    return (
      <div className="resultados-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <span>Carregando resultados...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="resultados-container">
        <div className="error-state">
          <p>{error?.message || "Erro ao carregar dados"}</p>
        </div>
      </div>
    );
  }

  const isDateFiltered = Boolean(filtros.data);

  return (
    <div className="resultados-container">
      <div className="tabela-wrapper">
        {dadosFormatados.length > 0 ? (
          <HotTable
            data={dadosFormatados}
            columns={columns}
            colHeaders={true}
            width="100%"
            height="100%"
            licenseKey="non-commercial-and-evaluation"
            readOnly={true}
            stretchH="all"
            autoColumnSize={true}
            className="tabela-resultados"
            autoWrapRow={false}
            autoWrapCol={false}
            rowHeaders={false}
            contextMenu={false}
            // Use header height consistente com o CSS
            columnHeaderHeight={45}
            rowHeights={40}
            settings={{
              // Permitir scroll horizontal/vertical quando necessário
              scrollV: true,
              scrollH: true,
              manualRowResize: false,
              manualColumnResize: false,
              viewportRowRenderingOffset: 10,
              viewportColumnRenderingOffset: 10,
              cells: (row) => {
                const cellProperties = {};
                if (row % 2 === 1) {
                  cellProperties.className = "linha-par";
                }
                return cellProperties;
              },
            }}
          />
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p>
              {isDateFiltered
                ? "Nenhuma compra encontrada para a data selecionada."
                : "Nenhum pedido encontrado"}
            </p>
            {Object.values({ ...filtros, data: undefined }).some((f) => f) && (
              <small className="text-gray-500">
                Tente ajustar os filtros para ver mais resultados
              </small>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
