"use client"

import { useState } from "react"
import { AlertTriangle } from 'lucide-react'

export default function DeleteConfirmation({ produto = {}, onConfirm, onCancel }) {
  const [confirmText, setConfirmText] = useState("")
  const [error, setError] = useState("")

  // Usar "Excluir" como fallback quando produto.nome for undefined
  const confirmationText = produto.nome || "Excluir"
  const isConfirmEnabled = confirmText === confirmationText

  const handleConfirm = () => {
    if (confirmText === confirmationText) {
      onConfirm(produto)
    } else {
      setError("O texto digitado não corresponde ao nome do produto.")
    }
  }

  return (
    <div className="w-[350px] h-128 bg-white rounded-2xl shadow-md flex flex-col font-['Montserrat']">
      <div className="text-[#e30613] !mt-8 !mb-6 flex justify-center">
        <AlertTriangle size={48} />
      </div>
      <div className="!px-6 flex-1 flex flex-col">
        <h2 className="text-xl font-bold text-gray-800 !mt-0 !mb-4 text-center">Excluir Produto</h2>
        <p className="text-gray-600 !mb-4 leading-relaxed text-center">
          Você está prestes a excluir <strong>"{produto.nome || "Excluir"}"</strong> do cardápio. Esta ação não pode ser
          desfeita.
        </p>
        <p className="text-gray-600 !mb-4 text-center">Para confirmar, digite o nome do produto abaixo:</p>

        <div className="!mt-5 !mb-6">
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={`Digite "${confirmationText}"`}
            className="w-full !p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e30613] focus:border-[#e30613] text-gray-800"
          />
          {error && <p className="text-[#e30613] text-xs text-left !mt-1">{error}</p>}
        </div>

        <div className="flex justify-center gap-3 !mt-auto !mb-8">
          <button
            className="!px-4 !py-2.5 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 font-medium"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className={`!px-4 !py-2.5 border-none ${
              isConfirmEnabled ? "bg-[#e30613] hover:bg-[#c00]" : "bg-red-200 cursor-not-allowed"
            } text-white rounded-md font-medium`}
            onClick={handleConfirm}
            disabled={!isConfirmEnabled}
          >
            Excluir Produto
          </button>
        </div>
      </div>
    </div>
  )
}
