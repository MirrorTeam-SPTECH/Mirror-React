"use client"
import { useEffect, useState } from "react"
export default function Kpi({ tittle, value, loading = false, icon }) {
  const [displayValue, setDisplayValue] = useState("0")
  useEffect(() => {
    if (loading) {
      setDisplayValue("...")
      return
    }
    if (value === undefined || value === null) {
      setDisplayValue("0")
      return
    }

    const titulo = tittle.toLowerCase()
    if (titulo.includes("faturamento") || titulo.includes("ticket")) {
      const numValue = typeof value === "string" ? Number.parseFloat(value) : value
      setDisplayValue(
        new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(numValue),
      )
    } else {
      setDisplayValue(value.toString())
    }
  }, [value, tittle, loading])

  const getIcon = () => {
    if (icon) return icon
    const titulo = tittle.toLowerCase()
    if (titulo.includes("pedidos")) return ""
    if (titulo.includes("faturamento")) return ""
    if (titulo.includes("ticket")) return ""
    if (titulo.includes("clientes")) return ""
    return "📊"
  }

  const getColorClass = () => {
    const titulo = tittle.toLowerCase()
    if (titulo.includes("pedidos")) return "text-gray-900"
    if (titulo.includes("faturamento")) return "text-gray-900"
    if (titulo.includes("ticket")) return "text-gray-900"
    if (titulo.includes("clientes")) return "text-gray-900"
    return "text-gray-600"
  }
  return (
    <div className="flex h-40 w-70 bg-white !mt-10 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="flex flex-col justify-between p-4 w-full">
        {}
        <div className="flex items-center justify-between">
          <span className="text-2xl">{getIcon()}</span>
          {loading && (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          )}
        </div>
        {}
        <div className="flex flex-col items-center justify-center flex-1">
          <div className={`text-4xl font-bold ${getColorClass()} mb-2`}>{displayValue}</div>
          <p className="text-gray-700 font-semibold text-center text-ms">{tittle}</p>
        </div>
        {}
        <div className="flex justify-center">
          <div className="w-full h-1 bg-gray-200 rounded-full">
            <div className={`h-1 rounded-full w-3/4 ${getColorClass().replace("text-", "bg-")}`}></div>
          </div>
        </div>
      </div>
    </div>
  )
}