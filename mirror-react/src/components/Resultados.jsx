"use client"

import "handsontable/styles/handsontable.min.css"
import "handsontable/styles/ht-theme-main.min.css"
import "../styles/Resultados.css"

import { registerAllModules } from "handsontable/registry"
import { HotTable } from "@handsontable/react-wrapper"
import { useState, useEffect, useRef } from "react"
import axios from "axios"

registerAllModules()

export default function Resultados() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    fetchPedidos()

    // Atualização automática a cada 5 segundos
    intervalRef.current = setInterval(() => {
      fetchPedidos()
    }, 5000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const fetchPedidos = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/pedidos")

      // Transformar dados para o formato do Handsontable
      const dadosFormatados = response.data.map((pedido) => [
        pedido.id,
        pedido.nomeProduto || pedido.descricao,
        pedido.quantidade,
        formatCurrency(pedido.valor),
        pedido.metodoPagamento,
        pedido.status,
        formatDate(pedido.dataCriacao),
      ])

      setPedidos(dadosFormatados)
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err)
      setError("Erro ao carregar pedidos")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Configurações da tabela
  const columns = [
    { title: "ID", width: 55 },
    { title: "Produto", width: 140 },
    { title: "Qtd", width: 60 },
    { title: "Valor", width: 80 },
    { title: "Pagamento", width: 100 },
    { title: "Status", width: 80 },
    { title: "Data/Hora", width: 110 },
  ]

  if (loading) {
    return (
      <div className="flex h-70 w-292 bg-white rounded-xl z-10 !ml-18 !mt-5 shadow-md">
        <div className="flex items-center justify-center w-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Carregando resultados...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-70 w-292 bg-white rounded-xl z-10 !ml-18 !mt-5 shadow-md">
        <div className="flex items-center justify-center w-full">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-64 w-292 bg-white rounded-xl z-10 !ml-18 !mt-5 shadow-md">
      <div className="flex flex-col w-full p-4 h-full">
        <div className="flex-1 overflow-hidden">
          {pedidos.length > 0 ? (
            <HotTable
              data={pedidos}
              columns={columns}
              colHeaders={true}
              width="100%"
              height="100%"
              licenseKey="non-commercial-and-evaluation"
              readOnly={true}
              stretchH="all"
              className="htCenter htMiddle"
              // Configurações essenciais para scroll
              autoWrapRow={false}
              autoWrapCol={false}
              // Força o scroll vertical
              settings={{
                scrollV: true,
                scrollH: false,
                manualRowResize: false,
                manualColumnResize: false,
                rowHeaders: false,
                contextMenu: false,
                // Força altura das linhas para permitir mais itens
                rowHeight: 35,
                // Configurações de viewport
                viewportRowRenderingOffset: 10,
                viewportColumnRenderingOffset: 10,
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-4xl mb-2">📋</div>
              <p className="text-gray-500">Nenhum pedido encontrado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
