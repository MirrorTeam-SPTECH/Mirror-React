import { Outlet } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function LayoutGerenciamento() {
  const lastHandledTimestamp = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const data = JSON.parse(localStorage.getItem("novoPagamentoBalcao"));
      if (
        data &&
        data.timestamp > lastHandledTimestamp.current
      ) {
        lastHandledTimestamp.current = data.timestamp;
        const nomeLanche = data.nomeLanche ?? "desconhecido";
        alert(`🛎️ Pedido: ${nomeLanche}. Esperando confirmação de pagamento.`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="layout-gerenciamento">
      <Outlet context={{ isGerenciamento: true }} />
    </div>
  );
}
