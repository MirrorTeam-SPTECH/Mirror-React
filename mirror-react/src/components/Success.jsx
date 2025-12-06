import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CardPagamentoRealizado from "../components/CardPagamentoRealizado";
export default function Success() {
  const navigate = useNavigate();
  const handleVoltar = () => {
    navigate("/home");
  };
  useEffect(() => {
    console.log("Pagamento aprovado!");
  }, []);
  return (
    <div className="flex items-center justify-center h-screen">
      <CardPagamentoRealizado
        produto={{ tempoPreparo: "30 minutos" }}
        metodo="pix"
        onVoltar={handleVoltar}
      />
    </div>
  );
}