"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Header } from "../components/Header";
import { SubNavigation } from "../components/SubNavigation";
import "../styles/HistoricoPedido.css";

const formatarData = (data) =>
  new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatarPreco = (preco) => {
  const precoNum =
    typeof preco === "number" ? preco : Number.parseFloat(preco || 0);
  return precoNum.toFixed(2).replace(".", ",");
};

function OrderItem({ item }) {
  return (
    <div className="item-pedido">
      <img
        src={item.menuItemImageUrl || "/placeholder.svg?height=60&width=60"}
        alt={item.menuItemName || "Produto"}
        className="imagem-item"
      />
      <div className="detalhes-item">
        <p className="nome-item">{item.menuItemName || "Produto"}</p>
        <p className="preco-item">R$ {formatarPreco(item.unitPrice)}</p>
        {item.quantity > 1 && (
          <p className="quantidade-item">Qtd: {item.quantity}</p>
        )}
        {item.observations && (
          <p className="adicionais-item">
            <strong>Adicionais:</strong> {item.observations}
          </p>
        )}
        <p className="preco-total-item">
          Total: R$ {formatarPreco(item.unitPrice * item.quantity)}
        </p>
      </div>
    </div>
  );
}

function OrderCard({ pedido, onPedirNovamente, numeroPedidoUsuario }) {
  const getStatusText = (status) => {
    const statusMap = {
      PENDING: "Pendente",
      CONFIRMED: "Confirmado",
      PREPARING: "Em Preparo",
      READY: "Pronto",
      DELIVERED: "Entregue",
      CANCELLED: "Cancelado",
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    if (["DELIVERED", "READY"].includes(status)) return "finalizado";
    if (["CANCELLED"].includes(status)) return "cancelado";
    return "em-andamento";
  };

  const statusText = getStatusText(pedido.status);
  const statusClass = getStatusClass(pedido.status);
  const isInProgress = statusClass === "em-andamento";

  return (
    <div className="card-pedido">
      <div className="topo-pedido">
        <span className={`status ${statusClass}`}>{statusText}</span>
        <div className="info-pedido">
          <div>
            <strong>Pedido #{numeroPedidoUsuario}</strong>
          </div>
          <div className="data">{formatarData(pedido.createdAt)}</div>
        </div>
      </div>

      <div className="cliente-info">
        <p>
          <strong>Cliente:</strong> {pedido.customerName}
        </p>
        {pedido.notes && (
          <p className="observacoes">
            <strong>Obs:</strong> {pedido.notes}
          </p>
        )}
      </div>

      <div className="itens-pedido">
        {(pedido.items || []).map((item) => (
          <OrderItem key={item.id} item={item} />
        ))}
      </div>

      <div className="pagamento-info">
        <p>
          <strong>Pagamento:</strong> {pedido.payment?.method || "N/A"}
        </p>
        <p>
          <strong>Status Pagamento:</strong> {pedido.payment?.status || "N/A"}
        </p>
      </div>

      <div className="total-pedido">
        Total: R$ {formatarPreco(pedido.total)}
      </div>

      <button
        className={isInProgress ? "botao-repetir-cinza" : "botao-repetir-claro"}
        onClick={() => onPedirNovamente(pedido)}
        disabled={isInProgress}
      >
        {isInProgress ? "Aguarde..." : "Pedir Novamente"}
      </button>
    </div>
  );
}

export default function HistoricoPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarPedidos = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (!token || !userStr) {
        setError("Você precisa estar logado para ver o histórico");
        setLoading(false);
        return;
      }

      const user = JSON.parse(userStr);
      const userEmail = user.email;

      if (!userEmail) {
        setError("Email do usuário não encontrado");
        setLoading(false);
        return;
      }

      console.log("Buscando pedidos do usuário:", userEmail);

      // Usar o endpoint que filtra por email do cliente
      const response = await axios.get(
        `http://localhost:8080/api/orders/customer/${encodeURIComponent(
          userEmail
        )}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Resposta da API:", response.data);

      // A API retorna um array direto neste endpoint
      const pedidosData = Array.isArray(response.data) ? response.data : [];

      // Ordenar por data mais recente
      const pedidosOrdenados = pedidosData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      console.log("Pedidos ordenados:", pedidosOrdenados);

      // Debug: verificar se os itens têm observations
      if (pedidosOrdenados.length > 0) {
        console.log("Primeiro pedido - items:", pedidosOrdenados[0].items);
      }

      setPedidos(pedidosOrdenados);
    } catch (err) {
      console.error("Erro ao carregar pedidos:", err);
      console.error("Detalhes do erro:", err.response?.data);
      setError(
        "Erro ao carregar histórico de pedidos: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPedidos();

    // Recarregar a cada 30 segundos
    const interval = setInterval(() => {
      carregarPedidos();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handlePedirNovamente = () => {
    alert("Funcionalidade em desenvolvimento: adicionar pedido ao carrinho");
    // TODO: Implementar re-adicionar ao carrinho
  };

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
    );
  }

  if (error) {
    return (
      <div className="containerProjeto">
        <Header titulo="Histórico" p="Seus pedidos anteriores" />
        <main className="historico">
          <div className="sem-pedidos">
            <div className="icone-vazio">⚠️</div>
            <h3>{error}</h3>
            <button onClick={carregarPedidos} className="botao-repetir-claro">
              Tentar Novamente
            </button>
          </div>
        </main>
        <SubNavigation />
      </div>
    );
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
              <OrderCard
                key={pedido.id}
                pedido={pedido}
                numeroPedidoUsuario={pedidos.length - index}
                onPedirNovamente={handlePedirNovamente}
              />
            ))}
          </div>
        )}
      </main>
      <SubNavigation />
    </div>
  );
}
