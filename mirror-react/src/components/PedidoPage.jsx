import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CardLancheSelecionado from "../components/CardLancheSelecionado";
import { CardCarrinho } from "../components/CardCarrinho";
import CardPagamento from "../components/CardPagamento";
import CardQRCode from "../components/CardQRcode";
import CardCarregamento from "../components/CardCarregamento";
import CardPagamentoRealizado from "../components/CardPagamentoRealizado";
export default function PedidoPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const produtoSelecionado = state?.produtoSelecionado;
  const [cartItem, setCartItem] = useState(null);
  const [etapaAtual, setEtapaAtual] = useState("lancheSelecionado");
  const [metodoPagamento, setMetodoPagamento] = useState(null);
  useEffect(() => {
    if (!produtoSelecionado) {
      navigate("/home");
    }
  }, [produtoSelecionado, navigate]);
  if (!produtoSelecionado) return null;
  const handleAvancarCarrinho = (itemComDados) => {
    setCartItem(itemComDados);
    setEtapaAtual("carrinho");
  };
  return (
    <div className="flex-1 relative right-15 top-5 w-[30%] flex flex-col items-center justify-center">
      {etapaAtual === "lancheSelecionado" && (
        <CardLancheSelecionado
          produto={produtoSelecionado}
          onAvancar={handleAvancarCarrinho}
          onClose={() => navigate(-1)}
        />
      )}
      {etapaAtual === "carrinho" && cartItem && (
        <CardCarrinho
          produto={cartItem}
          onAvancar={() => setEtapaAtual("pagamento")}
          onRemover={() => {
            setCartItem(null);
            setEtapaAtual("lancheSelecionado");
          }}
        />
      )}
      {etapaAtual === "pagamento" && (
        <CardPagamento
          produto={cartItem}
          onPix={() => setEtapaAtual("pix")}
          onCartao={() => {
            setMetodoPagamento("cartao");
            setEtapaAtual("pagamento");
          }}
        />
      )}
      {etapaAtual === "pix" && (
        <CardQRCode produto={cartItem} onConfirmar={() => setEtapaAtual("carregamento")} />
      )}
      {etapaAtual === "carregamento" && <CardCarregamento />}
      {etapaAtual === "realizado" && (
        <CardPagamentoRealizado
          produto={cartItem}
          metodoPagamento={metodoPagamento}
          onVoltar={() => navigate("/home")}
        />
      )}
    </div>
  );
}