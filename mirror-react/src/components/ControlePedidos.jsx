import React from "react";
import { CirclePlus, SquarePen, Trash2 } from "lucide-react";

export default function ControlePedidos({ 
  titulo, 
  esconderBotoes = false,
  onCriar,
  onAtualizar,
  onDeletar 
}) {
  return (
    <div className="w-full flex justify-center h-26">
      <div className="w-[90%] py-6">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-white text-lg font-semibold">{titulo}</h2>
        </div>
        {!esconderBotoes && (
          <div className="flex justify-end gap-6 font-Montserrat text-sm items-center">
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
          </div>
        )}
      </div>
    </div>
  );
}