import React from "react";
import "../styles/CardPagamentoRealizado.css";

export default function CardPagamentoRealizado({ produto }) {
  return (
    <div className="success-wrapper">
      <div className="success-card">
        <div className="icon">✔</div>
        <p className="message">
          Pedido feito com sucesso
          <br />
          Será entregue em <strong>{produto.tempoPreparo}</strong>
          <br />
          Obrigado pela preferência!
        </p>
        <button className="track-order">Acompanhar Pedido</button>
        <button className="back-home">Voltar para o início</button>
      </div>
    </div>
  );
}
