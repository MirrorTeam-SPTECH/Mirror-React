"use client";

import { useState, useEffect, useCallback } from "react";
import orderService from "../services/orderService";

export function useDashboardData(dataSelecionada) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("🔍 Buscando dados do dashboard...");

      // Debug: verificar se há token
      const token = localStorage.getItem("token");
      console.log("🔑 Token presente?", token ? "Sim" : "Não");
      if (token) {
        console.log(
          "🔑 Token (primeiros 20 chars):",
          token.substring(0, 20) + "..."
        );
      }

      let response;

      if (!dataSelecionada || dataSelecionada === "Hoje") {
        // Buscar estatísticas do dia atual
        response = await orderService.getDashboardStats();
      } else {
        // Buscar estatísticas de período específico
        const dataInicio = new Date(dataSelecionada);
        dataInicio.setHours(0, 0, 0, 0);

        const dataFim = new Date(dataSelecionada);
        dataFim.setHours(23, 59, 59, 999);

        response = await orderService.getDashboardStatsByPeriod(
          dataInicio,
          dataFim
        );
      }

      console.log("📊 Dados recebidos:", response);
      console.log("📊 Campos disponíveis no stats:", Object.keys(response));
      Object.keys(response).forEach((key) => {
        console.log(`   ${key}:`, response[key]);
      });

      // Buscar pedidos para calcular ranking de produtos
      let produtosRanking = [];
      try {
        const ordersResponse = await import("../services/orderService").then(
          (m) => m.default.getAllOrders()
        );

        // Contar produtos mais pedidos
        const produtosCount = {};
        ordersResponse.content?.forEach((order) => {
          order.items?.forEach((item) => {
            const nome = item.menuItemName || "Item";
            produtosCount[nome] = (produtosCount[nome] || 0) + item.quantity;
          });
        });

        // Converter para array e ordenar
        produtosRanking = Object.entries(produtosCount)
          .map(([nome, quantidade]) => ({ nome, quantidade }))
          .sort((a, b) => b.quantidade - a.quantidade)
          .slice(0, 5); // Top 5

        console.log("📊 Ranking calculado:", produtosRanking);
      } catch (error) {
        console.warn("⚠️ Erro ao calcular ranking:", error);
      }

      // Mapear os campos do backend para o formato esperado pelo frontend
      const mappedStats = {
        totalPedidos: response.todayOrders || response.monthOrders || 0,
        faturamentoTotal: response.todayRevenue || response.monthRevenue || 0,
        ticketMedio: response.averageTicket || 0,
        clientesAtivos: response.activeCustomers || 0,
        produtosRanking: produtosRanking,
      };

      console.log("✅ Stats mapeados:", mappedStats);
      setStats(mappedStats);
    } catch (err) {
      console.error("❌ Erro ao buscar dados do dashboard:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [dataSelecionada]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    stats,
    loading,
    error,
    refetch: fetchData,
  };
}
