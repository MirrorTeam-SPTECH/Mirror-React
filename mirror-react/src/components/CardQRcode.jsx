// src/components/CardQRcode.jsx
"use client";

import React, { useState } from "react";
import { ArrowLeft, Copy, Check, ExternalLink } from "lucide-react";
import "../styles/CardQRcode.css";

export default function CardQRcode({
  qrCode,
  qrCodeBase64,
  ticketUrl,
  onConfirmar,
  onClose,
}) {
  const [copiado, setCopiado] = useState(false);

  const copiarCodigo = () => {
    if (qrCode) {
      navigator.clipboard.writeText(qrCode);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 3000);
    }
  };

  const abrirTicket = () => {
    if (ticketUrl) {
      window.open(ticketUrl, "_blank");
    }
  };

  return (
    <div className="qrcode-overlay">
      <div className="qrcode-container">
        {/* Header */}
        <div className="qrcode-header">
          <button onClick={onClose} className="btn-voltar-qr">
            <ArrowLeft size={20} />
          </button>
          <h2 className="qrcode-titulo">Pagamento via PIX</h2>
          <div style={{ width: "40px" }}></div>
        </div>

        {/* QR Code Display */}
        <div className="qrcode-content">
          <div className="qr-image-container">
            {qrCodeBase64 ? (
              <img
                src={`data:image/png;base64,${qrCodeBase64}`}
                alt="QR Code PIX"
                className="qr-code-image"
              />
            ) : qrCode ? (
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                  qrCode
                )}`}
                alt="QR Code PIX"
                className="qr-code-image"
              />
            ) : (
              <div className="qr-loading">
                <p>Gerando QR Code...</p>
              </div>
            )}
          </div>

          <p className="qrcode-instrucao">
            Escaneie o QR Code com seu app bancário ou copie o código PIX
          </p>

          {/* Código PIX */}
          {qrCode && (
            <div className="codigo-pix-container">
              <p className="codigo-pix-label">Código PIX:</p>
              <div className="codigo-pix-box">
                <p className="codigo-pix-texto">{qrCode}</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="qrcode-actions">
          {qrCode && (
            <button className="btn-qr-action btn-copiar" onClick={copiarCodigo}>
              {copiado ? (
                <>
                  <Check size={20} />
                  <span>Código Copiado!</span>
                </>
              ) : (
                <>
                  <Copy size={20} />
                  <span>Copiar Código PIX</span>
                </>
              )}
            </button>
          )}

          {ticketUrl && (
            <button className="btn-qr-action btn-ticket" onClick={abrirTicket}>
              <ExternalLink size={20} />
              <span>Abrir Comprovante</span>
            </button>
          )}

          {onConfirmar && (
            <button
              className="btn-qr-action btn-confirmar"
              onClick={onConfirmar}
            >
              <Check size={20} />
              <span>Confirmar Pagamento</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
