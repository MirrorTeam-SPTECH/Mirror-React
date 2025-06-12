import React, { useState } from "react";
import { CirclePlus, CircleX, SquarePen, Trash2, Search } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function ControlePedidos({
  titulo,
  esconderBotoes = false,
  onCriar,
  onAtualizar,
  onDeletar,
  onCancelarPedido = false,
  onPesquisarPedido, // nova prop para ação de pesquisa
}) {
  const location = useLocation();
  const [pesquisa, setPesquisa] = useState("");

  const handlePesquisar = () => {
    if (onPesquisarPedido) onPesquisarPedido(pesquisa);
  };

  return (
    <div className="w-full flex justify-center h-26">
      <div className="w-[90%] py-6">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-white text-lg font-semibold">{titulo}</h2>
        </div>
        {!esconderBotoes && (
          <div className="flex justify-end gap-6 font-Montserrat text-sm items-center">
            {location.pathname === "/cozinha" ? (
              <>
                <button
                  onClick={onCancelarPedido}
                  className="flex items-center gap-28 h-7 !px-3 py-3 bg-white text-gray-500 rounded-lg shadow hover:bg-gray-100 transition cursor-pointer"
                >
                  Cancelar Pedido <CircleX size={18} color="#9D9DAA" />
                </button>
                <div className="flex items-center gap-2 ml-2">
                  <div className="flex items-center bg-white rounded-lg shadow !p-1 border focus:outline-none">
                    <input
                      type="text"
                      value={pesquisa}
                      onChange={(e) => setPesquisa(e.target.value)}
                      placeholder="Pesquisar pedido"
                      className="bg-transparent border-none focus:outline-none text-gray-700"
                    />
                    <button
                      onClick={handlePesquisar}
                      className="flex items-center ml-2"
                      title="Pesquisar"
                    >
                      <Search size={18} color="#9D9DAA" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={onCriar}
                  className="flex items-center gap-28 h-7 !px-3 py-3 bg-white text-gray-500 rounded-lg shadow hover:bg-gray-100 transition cursor-pointer"
                >
                  Criar <CirclePlus size={18} color="#9D9DAA" />
                </button>
                <button
                  onClick={onAtualizar}
                  className="flex items-center gap-28 h-7 !px-3 py-3 bg-white text-gray-500 rounded-lg shadow hover:bg-gray-100 transition cursor-pointer"
                >
                  Atualizar <SquarePen size={18} color="#9D9DAA" />
                </button>
                <button
                  onClick={onDeletar}
                  className="flex items-center gap-28 h-7 !px-3 py-3 bg-white text-gray-500 rounded-lg shadow hover:bg-gray-100 transition cursor-pointer"
                >
                  Deletar <Trash2 size={18} color="#9D9DAA" />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
