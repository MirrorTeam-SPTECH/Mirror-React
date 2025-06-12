"use client";

import { useEffect, useState } from "react";
import HeaderGerenciamento from "../components/HeaderGerenciamento";
import ControlePedidos from "../components/ControlePedidos";
import DeleteConfirmation from "../components/DeleteConfirmation";
import { todasCategorias } from "../utils/Categorias";
import "../styles/Carregamento.css";
import { Maximize, Minimize } from "lucide-react";

export default function Cozinha() {
  const [loading, setLoading] = useState(true);
  const [cardAberto, setCardAberto] = useState(null);
  const [expandido, setExpandido] = useState(false);

  function Expandir() {
    setExpandido((prev) => !prev);
  }

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleCardClose = () => {
    setCardAberto(null);
  };

  return (
    <div className="containerProjeto">
      {loading ? (
        <>
          <div className="skeleton headerGerenciamento-skeleton"></div>
          <div className="skeleton pesquisa-skeleton" />
          <div className="skeleton nav-skeleton" />
          {todasCategorias.map((_, i) => (
            <div className="skeleton lista-produto-skeleton" key={i}>
              <div className="categoria-titulo-skeleton skeleton" />
              <div className="produtos-grid-skeleton">
                {Array(5)
                  .fill(0)
                  .map((_, j) => (
                    <div className="produto-card-skeleton skeleton" key={j} />
                  ))}
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          <HeaderGerenciamento activePage="cozinha" />
          <ControlePedidos
            titulo="Pedidos detalhados"
            onCancelarPedido={() => setCardAberto("cancelar")}
            onPesquisarPedido={() => {
              /* lógica de pesquisa futura */
            }}
          />
          <div className="flex w-full justify-center items-center !mb-0 min-h-[70vh]">
            <div
              className={
                cardAberto ? "flex-3 w-[70%]" : "w-full flex justify-center"
              }
            >
              {/* Retângulo branco com cards de pedidos */}
              <div
                className={
                  expandido
                    ? "bg-white rounded-2xl fixed top-10 left-20 w-[90%] h-[90vh] shadow-2xl !p-10 m-0 flex flex-wrap gap-5 overflow-auto items-start z-50"
                    : "bg-white rounded-2xl relative w-[90%] shadow-2xl !p-10 overflow-hidden m-8 flex flex-wrap h-[450px] gap-5"
                }
              >
                <button
                  onClick={Expandir}
                  className={
                    expandido
                      ? "absolute top-6 right-6 w-[40px] h-[40px] flex justify-center items-center cursor-pointer z-50 bg-blue-100 rounded-full"
                      : "absolute w-[40px] h-[40px] bottom-0 right-1 flex justify-center items-center cursor-pointer bg-blue-100 rounded-full"
                  }
                  title={expandido ? "Recolher" : "Expandir"}
                >
                  {expandido ? (
                    <Minimize color="#000" />
                  ) : (
                    <Maximize color="#000" />
                  )}
                </button>
                {/* Exemplo de pedidos fictícios */}
                {[1, 2, 3, 4, 5, 6].map((pedido) => (
                  <div
                    key={pedido}
                    className="bg-gradient-to-br from-gray-50 border-zinc-600 to-gray-200 rounded-xl !p-3 w-72 border h-65 flex flex-col items-start shadow-lg transition-transform hover:scale-105 hover:shadow-2xl"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-block bg-yellow-400 text-white rounded-full p-1 text-xs font-bold shadow">
                        #{pedido}
                      </span>
                      <span className="ml-2 text-green-600 font-semibold text-xs">
                        Em preparo
                      </span>
                    </div>
                    <div className="flex-1 w-full">
                      <p className="text-gray-700 text-base mb-2 font-semibold">
                        Cliente: Alex
                      </p>
                      <ul className="text-gray-500 text-sm mb-4 list-disc list-inside">
                        <li>Picanha (2x)</li>
                        <li>Linguiça (1x)</li>
                        <li>Guaraná 2L</li>
                      </ul>
                    </div>
                    <button
                      className="mt-auto w-full px-4 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition"
                      onClick={() => setCardAberto("cancelar")}
                    >
                      Cancelar Pedido
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {cardAberto && (
              <div className="flex-1 !-mt-25 !mr-17 w-[30%] flex flex-col items-center justify-center">
                {cardAberto === "cancelar" && (
                  <DeleteConfirmation
                    titulo="Cancelar pedido"
                    onClose={handleCardClose}
                  />
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
