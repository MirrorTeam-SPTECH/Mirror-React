"use client"

import { useState, useEffect } from "react"
import axios from "axios"

export function useDashboardData(dataSelecionada) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log("🔍 Buscando dados do dashboard...")

      let url = "http://localhost:8080/api/pedidos/dashboard/stats"

      // Se uma data foi selecionada, usar endpoint de período
      if (dataSelecionada) {
        const dataInicio = new Date(dataSelecionada)
        dataInicio.setHours(0, 0, 0, 0)

        const dataFim = new Date(dataSelecionada)
        dataFim.setHours(23, 59, 59, 999)

        url = `http://localhost:8080/api/pedidos/dashboard/stats/periodo?inicio=${dataInicio.toISOString()}&fim=${dataFim.toISOString()}`
      }

      const response = await axios.get(url)
      console.log("📊 Dados recebidos:", response.data)
      setStats(response.data)
    } catch (err) {
      console.error("❌ Erro ao buscar dados do dashboard:", err)
      
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [dataSelecionada])

  return {
    stats,
    loading,
    error,
    refetch: fetchData,
  }
}
