// src/components/CardQRcode.jsx
"use client";

import React from "react";
import "../styles/CardQRcode.css";

export default function CardQRcode({ onConfirmar }) {
  return (
    <div className="qrcode-wrapper">
      <div className="card-pix">
        <h2>Finalizar compra</h2>
        <div className="pix-info">
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PIX_EXEMPLO"
            alt="QR Code Pix"
            className="qr-code"
          />
          <p className="pix-code">
            0002010102126330014br.gov.bcb.pix0111
            <br />
            620901913495204000053039685802
            <br />
            BR5909FoodApp6009SAO
            <br />
            PAULO62070503***6304B65B
          </p>
        </div>
        <button className="btn copiar">Copiar Código QR</button>
        <button className="btn pagar" onClick={onConfirmar}>
          Confirmar Pagamento
        </button>
      </div>
    </div>
  );
}
