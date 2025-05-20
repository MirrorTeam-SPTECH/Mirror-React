// src/components/CardPagamentoReizado.jsx
"use client";

import React from "react";
import "../styles/CardPagamentoRealizado.css";

export default function CardPagamentoRealizado({ produto, metodo, onVoltar }) {
  const tempo = produto?.tempoPreparo || "30 minutos";

  // Mensagem condicional com base no método de pagamento
  const mensagem =
    metodo === "pix"
      ? `Pedido feito com sucesso. Será entregue em ${tempo}. Obrigado pela preferência!`
      : "Seu pagamento precisa ser realizado no estabelecimento para que o pedido comece a ser preparado.";

  return (
    <div className="success-wrapper">
      <div className="success-card">
        <div className="icon">{metodo === "pix" ? "✔" : "💳"}</div>
        <p className="message">{mensagem}</p>
        <button className="back-home" onClick={onVoltar}>
          Voltar para o início
        </button>
      </div>
    </div>
  );
}
