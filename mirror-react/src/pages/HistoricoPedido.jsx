import React from "react";
import "../styles/HistoricoPedido.css";
import { Header } from "../components/Header";
import { SubNavigation }  from "../components/SubNavigation";

// Sample data for the orders
const orders = [
  {
    id: "#02383",
    date: "21/01/2025",
    status: "em-andamento",
    items: [
      {
        name: "Chef's Chicken",
        price: "R$ 37,00",
        image: "/img/lanche.png",
      },
    ],
  },
  {
    id: "#02383",
    date: "21/01/2025",
    status: "finalizado",
    items: [
      {
        name: "Chef's Chicken",
        price: "R$ 37,00",
        image: "/img/lanche.png",
      },
      {
        name: "Chef's Chicken",
        price: "R$ 37,00",
        image: "/img/lanche.png",
      },
      {
        name: "Chef's Chicken",
        price: "R$ 37,00",
        image: "/img/lanche.png",
      },
    ],
  },
  {
    id: "#02383",
    date: "21/01/2025",
    status: "finalizado",
    items: [
      {
        name: "Chef's Chicken",
        price: "R$ 37,00",
        image: "/img/lanche.png",
      },
    ],
  },
  {
    id: "#02383",
    date: "21/01/2025",
    status: "finalizado",
    items: [
      {
        name: "Chef's Chicken",
        price: "R$ 37,00",
        image: "/img/lanche.png",
      },
    ],
  },
];

// Componente de item
function OrderItem({ item }) {
  return (
    <div className="item-pedido">
      <img src={item.image || "/placeholder.svg"} alt={item.name} className="imagem-item" />
      <div className="detalhes-item">
        <p className="nome-item">{item.name}</p>
        <p className="preco-item">{item.price}</p>
      </div>
    </div>
  );
}

// Componente de cartão de pedido
function OrderCard({ order }) {
  const isInProgress = order.status === "em-andamento";
  const statusClass = isInProgress ? "em-andamento" : "finalizado";
  const buttonClass = isInProgress ? "botao-repetir-cinza" : "botao-repetir-claro";

  return (
    <div className="cards">
      <div className="card-pedido">
        <div className="topo-pedido">
          <span className={`status ${statusClass}`}>
            {isInProgress ? "Em Andamento" : "Finalizado"}
          </span>
          <div className="info-pedido">
            <strong>{order.id}</strong>
            <br />
            <span className="data">{order.date}</span>
          </div>
        </div>

        {order.items.map((item, index) => (
          <OrderItem key={index} item={item} />
        ))}

        <button className={buttonClass}>Pedir Novamente</button>
      </div>
    </div>
  );
}

// Componente principal
export default function HistoricoPedidos() {
  return (
    <div id="app">
      <Header />
        
      <main className="historico">
        <h2 className="titulo-secao">Histórico</h2>

        <div className="cards-container">
          {orders.map((order, index) => (
            <OrderCard key={index} order={order} />
          ))}
        </div>
      </main>
      
      <SubNavigation />
    </div>
    
  );
}
