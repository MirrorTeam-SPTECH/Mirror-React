import React from "react";
import "../styles/CardPagamentoRealizado.css";

export default function CardPagamentoRealizado({
  produto,
  metodoPagamento,
  onVoltar,
}) {
  const tempo = produto?.tempoPreparo || "—";

  // Mensagem condicional com base no método de pagamento
  const mensagem =
    metodoPagamento === "pix"
      ? `Pedido feito com sucesso. Será entregue em ${tempo}. Obrigado pela preferência!`
      : "Seu pagamento precisa ser realizado no estabelecimento para que o pedido comece a ser preparado.";

  return (
    <div className="success-wrapper">
      <div className="success-card">
        <div className="icon">{metodoPagamento === "pix" ? "✔" : "💳"}</div>
        <p className="message">{mensagem}</p>
        <button className="back-home" onClick={onVoltar}>
          Voltar para o início
        </button>
      </div>
    </div>
  );
}