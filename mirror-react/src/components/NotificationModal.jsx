"use client"

import { useEffect, useState } from "react"
import { CheckCircle, X } from "lucide-react"

export default function NotificationModal({ notification, onClose }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (notification) {
      setIsVisible(true)

      // Auto-close após 3 segundos
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onClose(), 400) // Aguarda animação terminar
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [notification, onClose])

  if (!notification) return null

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className="bg-white rounded-lg shadow-lg border-l-4 border-green-500 !p-4 min-w-[320px] max-w-[400px]">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <CheckCircle className="text-green-500 mt-0.5" size={20} />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 text-sm">Novo Pedido - Pagamento no Balcão</h4>
              <p className="text-gray-600 text-sm mt-1">{notification.nomeLanche}</p>
              <p className="text-gray-500 text-xs mt-1">Total: R$ {notification.valorTotal}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(() => onClose(), 300)
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
