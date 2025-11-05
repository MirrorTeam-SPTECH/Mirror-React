"use client";

import { useState, useEffect } from "react";
import HeaderGerenciamento from "../components/HeaderGerenciamento";
import ControlePedidos from "../components/ControlePedidos";
import Kpi from "../components/KPI";
import Ranking from "../components/Ranking";
import Filtros from "../components/Filtros";
import Resultados from "../components/Resultados";
import { Search, ChevronDown, RefreshCw } from "lucide-react";
import { useDashboardData } from "../data/useDashboardData";

export default function Relatorios() {
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [filtroPagamento, setFiltroPagamento] = useState("");
  const [filtroValor, setFiltroValor] = useState("");
  const [filtroOrigem, setFiltroOrigem] = useState("");
  const [filtroPesquisar, setFiltroPesquisar] = useState("");
  const [loading, setLoading] = useState(true);
  const [novoPagamentoBalcao, setNovoPagamentoBalcao] = useState(null);

  // KPIs/Ranking reagem aos filtros
  const {
    stats,
    loading: statsLoading,
    error,
  } = useDashboardData(
    dataSelecionada,
    filtroPagamento,
    filtroValor,
    filtroOrigem,
    filtroPesquisar
  );

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const item = localStorage.getItem("novoPagamentoBalcao");
    if (item) {
      try {
        setNovoPagamentoBalcao(JSON.parse(item));
      } catch (e) {
        console.error(
          "Erro ao parsear novoPagamentoBalcao do localStorage:",
          e
        );
      }
    }
  }, []);

  const handleDateChange = (e) => {
    setDataSelecionada(e.target.value);
  };

  const handleResetFilters = () => {
    setDataSelecionada("");
    setFiltroPagamento("");
    setFiltroValor("");
    setFiltroOrigem("");
    setFiltroPesquisar("");
  };

  return (
    <>
      {loading ? (
        // skeleton...
        <div className="w-full h-22 flex justify-center items-center ">
          <div className="w-[90%] flex items-center justify-between px-16">
            <ul className="flex gap-6 text-xs">
              {[...Array(5)].map((_, idx) => (
                <li key={idx} className="w-16 h-4 bg-[#e0e0e0] rounded" />
              ))}
            </ul>
            <div className="h-16 w-30 bg-[#e0e0e0]" />
          </div>
        </div>
      ) : (
        <>
          <HeaderGerenciamento activePage="relatorios" />
          <ControlePedidos
            titulo="Relatório de Pedidos"
            esconderBotoes={true}
          />

          <div className="flex !-mt-18 items-center gap-4">
            <div className="relative !ml-18">
              <input
                type="date"
                id="data"
                className="bg-white text-gray-500 rounded-md h-10 pl-4 pr-8 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={dataSelecionada}
                onChange={handleDateChange}
              />
              <ChevronDown className="absolute right-2 top-2.5 h-5 w-5 text-gray-500 pointer-events-none" />
            </div>

            <button
              onClick={handleResetFilters}
              className="flex items-center gap-2 bg-white text-gray-700 border border-gray-300 rounded-md h-10 px-3 hover:bg-gray-50"
              title="Limpar filtros"
            >
              <RefreshCw size={16} />
              Limpar filtros
            </button>
          </div>

          {error && (
            <div className="!ml-18 !mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <p>{error?.message || "Erro ao carregar relatórios"}</p>
            </div>
          )}

          <div className="flex flex-row gap-4 !ml-18">
            <Kpi
              tittle="Total de Pedidos"
              value={stats?.totalPedidos || 0}
              loading={statsLoading}
            />
            <Kpi
              tittle="Faturamento"
              value={stats?.faturamentoTotal || 0}
              loading={statsLoading}
            />
            <Kpi
              tittle="Ticket Médio"
              value={stats?.ticketMedio || 0}
              loading={statsLoading}
            />
            <Kpi
              tittle="Clientes Ativos"
              value={stats?.clientesAtivos || 0}
              loading={statsLoading}
            />
            <Ranking
              title="Ranking de Itens"
              data={stats?.produtosRanking || []}
              loading={statsLoading}
            />
          </div>

          <div className="flex flex-row !ml-18 !-mt-80 items-center">
            <div className="flex gap-4">
              <Filtros
                label="Pagamento"
                options={[
                  { value: "pix", label: "PIX" },
                  { value: "balcao", label: "Balcão" },
                ]}
                value={filtroPagamento}
                onChange={setFiltroPagamento}
              />
              <Filtros
                label="Valor"
                options={[
                  { value: "0-20", label: "Até R$20" },
                  { value: "20-50", label: "R$20–50" },
                  { value: "50+", label: "Acima de R$50" },
                ]}
                value={filtroValor}
                onChange={setFiltroValor}
              />
              <Filtros
                label="Status"
                options={[
                  { value: "pago", label: "Pago" },
                  { value: "não pago", label: "Não pago" },
                ]}
                value={filtroOrigem}
                onChange={setFiltroOrigem}
              />
            </div>
            <div className="w-84" />
            <Filtros
              label="Pesquisar"
              options={[]}
              value={filtroPesquisar}
              onChange={setFiltroPesquisar}
            >
              <div className="relative h-full">
                <input
                  type="text"
                  placeholder="Pesquisar..."
                  className="absolute inset-0 w-full h-full bg-white rounded-xl shadow-md px-4 text-base text-gray-500 focus:outline-none"
                  value={filtroPesquisar}
                  onChange={(e) => setFiltroPesquisar(e.target.value)}
                />
                <Search className="absolute right-4 top-1/2 h-5 w-5 text-gray-500 transform -translate-y-1/2" />
              </div>
            </Filtros>
          </div>

          <Resultados
            pagamentoBalcao={novoPagamentoBalcao}
            filtros={{
              pagamento: filtroPagamento,
              valor: filtroValor,
              origem: filtroOrigem,
              pesquisar: filtroPesquisar,
              data: dataSelecionada, // envia a data para a tabela
            }}
          />
        </>
      )}
    </>
  );
}
