import api from "../config/api";

/**
 * Serviço para gerenciamento de pedidos
 */
const orderService = {
  /**
   * Cria novo pedido
   * @param {Object} orderData - Dados do pedido
   * @returns {Promise<Object>} - Pedido criado
   */
  createOrder: async (orderData) => {
    const response = await api.post("/api/orders", orderData);
    return response.data;
  },

  /**
   * Registra pedido no balcão
   * @param {Object} orderData - Dados do pedido
   * @returns {Promise<Object>} - Pedido registrado
   */
  createCounterOrder: async (orderData) => {
    const response = await api.post("/api/orders", orderData);
    return response.data;
  },

  /**
   * Registra pedido com pagamento PIX
   * @param {Object} orderData - Dados do pedido
   * @returns {Promise<Object>} - Pedido e informações de pagamento
   */
  createPixOrder: async (orderData) => {
    const response = await api.post("/api/orders", orderData);
    return response.data;
  },

  /**
   * Busca todos os pedidos
   * @returns {Promise<Array>} - Lista de pedidos
   */
  getAllOrders: async () => {
    const response = await api.get("/api/orders");
    return response.data;
  },

  /**
   * Busca pedido por ID
   * @param {number} id - ID do pedido
   * @returns {Promise<Object>} - Dados do pedido
   */
  getOrderById: async (id) => {
    const response = await api.get(`/api/orders/${id}`);
    return response.data;
  },

  /**
   * Busca pedidos por status
   * @param {string} status - Status do pedido
   * @returns {Promise<Array>} - Lista de pedidos
   */
  getOrdersByStatus: async (status) => {
    const response = await api.get(`/api/orders/status/${status}`);
    return response.data;
  },

  /**
   * Atualiza status do pedido
   * @param {number} id - ID do pedido
   * @param {string} status - Novo status
   * @returns {Promise<Object>} - Pedido atualizado
   */
  updateOrderStatus: async (id, status) => {
    const response = await api.patch(`/api/orders/${id}/status`, { status });
    return response.data;
  },

  /**
   * Adiciona item ao pedido
   * @param {number} orderId - ID do pedido
   * @param {Object} itemData - Dados do item
   * @returns {Promise<Object>} - Pedido atualizado
   */
  addItemToOrder: async (orderId, itemData) => {
    const response = await api.post(`/api/orders/${orderId}/items`, itemData);
    return response.data;
  },

  /**
   * Remove item do pedido
   * @param {number} orderId - ID do pedido
   * @param {number} itemId - ID do item
   * @returns {Promise<Object>} - Pedido atualizado
   */
  removeItemFromOrder: async (orderId, itemId) => {
    const response = await api.delete(`/api/orders/${orderId}/items/${itemId}`);
    return response.data;
  },

  /**
   * Busca estatísticas do dashboard
   * @returns {Promise<Object>} - Estatísticas
   */
  getDashboardStats: async () => {
    console.log("📡 Chamando endpoint: /api/orders/stats");
    const response = await api.get("/api/orders/stats");
    console.log("✅ Resposta recebida:", response.data);
    return response.data;
  },

  /**
   * Busca estatísticas do dashboard por período
   * @param {Date} startDate - Data inicial
   * @param {Date} endDate - Data final
   * @returns {Promise<Object>} - Estatísticas do período
   */
  getDashboardStatsByPeriod: async (startDate, endDate) => {
    const response = await api.get("/api/orders/stats", {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });
    return response.data;
  },
};

export default orderService;
