import React, { useState, useEffect } from "react";
import HeaderGerenciamento from "../components/HeaderGerenciamento";
import ControlePedidos from "../components/ControlePedidos";
import Kpi from "../components/KPI";
import Ranking from "../components/Ranking";
import Filtros from "../components/Filtros";
import Resultados from "../components/Resultados";
import { Search, ChevronDown } from "lucide-react";

export default function Relatorios() {
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timeout);
  }, []);

  const handleChange = (e) => {
    setDataSelecionada(e.target.value);
  };

  return (
    <>
      {loading ? (
        <>
          <div className="w-full h-22 flex justify-center items-center">
            <div className="w-[90%] flex items-center justify-between px-16">
              <ul className="flex gap-6 text-xs cursor-pointer">
                {[...Array(5)].map((_, idx) => (
                  <li key={idx} className="w-16 h-4 bg-[#e0e0e0] rounded"></li>
                ))}
              </ul>
              <div className="h-16 w-30 bg-[#e0e0e0] "></div>
            </div>
          </div>

          <div className="w-full flex justify-center h-26">
            <div className="w-[90%] py-6">
              <div className="h-6 w-40 bg-[#e0e0e0] rounded  mb-2"></div>
            </div>
          </div>

          <div className="flex !-mt-18">
            <div className="skeleton h-10 w-40 bg-[#e0e0e0] rounded-md !ml-18 "></div>
          </div>

          <div className="flex flex-row  !ml-5">
            {[...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="skeleton flex h-40 w-70 bg-[#e0e0e0] rounded-xl !mt-10 "
              />
            ))}
            <div className="skeleton flex h-125 w-50 bg-[#e0e0e0] rounded-xl !-ml-5 !mt-10 " />
          </div>

          <div className="flex flex-row !ml-10 !-mt-80 items-center">
            <div className="flex gap-4">
              {[...Array(3)].map((_, idx) => (
                <div
                  key={idx}
                  className="skeleton h-12 w-50 bg-[#e0e0e0] rounded-xl "
                />
              ))}
            </div>

            <div className="w-84"></div>
            <div className="h-12 w-50 bg-[#e0e0e0] rounded-xl " />
          </div>

          <div className="skeleton flex h-63 w-292 bg-[#e0e0e0] rounded-xl z-10 !ml-10 !mt-5 "></div>
        </>
      ) : (
        <>
          <HeaderGerenciamento activePage="relatorios" />
          <ControlePedidos titulo="Novo Pedido" esconderBotoes={true} />
          <div className="flex !-mt-18">
            <div className="relative !ml-18">
              <input
                className="bg-white text-gray-500 rounded-md h-10 pl-4 pr-8 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="date"
                id="data"
                value={dataSelecionada}
                onChange={handleChange}
              />
              <div className="absolute right-2 top-2.5 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-500" />
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-4 !ml-18">
            <Kpi tittle={"Total de Pedidos"} />
            <Kpi tittle={"Faturamento"} />
            <Kpi tittle={"Ticket Médio"} />
            <Kpi tittle={"Clientes Ativos"} />
            <Ranking title={"Ranking de Itens"} />
          </div>
          <div className="flex flex-row !ml-18 !-mt-80 items-center">
            <div className="flex gap-4">
              <Filtros label={"Pagamento"} Icon={ChevronDown} />
              <Filtros label={"Valor"} Icon={ChevronDown} />
              <Filtros label={"Origem"} Icon={ChevronDown} />
            </div>

            <div className="w-84"></div>
            <Filtros label={"Pesquisar"} Icon={Search} />
          </div>
          <Resultados />
        </>
      )}
    </>
  );
}
