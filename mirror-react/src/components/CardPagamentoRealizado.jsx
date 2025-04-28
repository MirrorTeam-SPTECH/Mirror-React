// src/components/CardPagamentoRealizado.jsx
import React from "react";
import "../styles/CardPagamentoRealizado.css";

export default function CardPagamentoRealizado({ produto, onVoltar }) {
  const tempo = produto?.tempoPreparo || "—";

  return (
    <div className="success-wrapper">
      <div className="success-card">
        <div className="icon">✔</div>
        <p className="message">
          Pedido feito com sucesso
          <br />
          Será entregue em <strong>{tempo}</strong>
          <br />
          Obrigado pela preferência!
        </p>
        <button className="back-home" onClick={onVoltar}>
          Voltar para o início
        </button>
      </div>
    </div>
  );
}
