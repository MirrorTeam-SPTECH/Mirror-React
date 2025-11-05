import api from "../config/api";

/**
 * Serviço para gerenciamento de pagamentos
 */
const paymentService = {
  /**
   * Cria checkout para pagamento
   * @param {Object} checkoutData - Dados do checkout
   * @returns {Promise<Object>} - Dados do checkout (com URL de pagamento)
   */
  createCheckout: async (checkoutData) => {
    const response = await api.post("/api/payments", checkoutData);
    return response.data;
  },

  /**
   * Cria pagamento para um pedido
   * @param {Object} paymentData - Dados do pagamento
   * @returns {Promise<Object>} - Pagamento criado
   */
  createPayment: async (paymentData) => {
    const response = await api.post("/api/payments", paymentData);
    return response.data;
  },

  /**
   * Busca pagamento por ID
   * @param {number} id - ID do pagamento
   * @returns {Promise<Object>} - Dados do pagamento
   */
  getPaymentById: async (id) => {
    const response = await api.get(`/api/payments/${id}`);
    return response.data;
  },

  /**
   * Busca pagamento por ID do pedido
   * @param {number} orderId - ID do pedido
   * @returns {Promise<Object>} - Dados do pagamento
   */
  getPaymentByOrderId: async (orderId) => {
    const response = await api.get(`/api/payments/order/${orderId}`);
    return response.data;
  },

  /**
   * Confirma pagamento manualmente (balcão)
   * @param {number} id - ID do pagamento
   * @returns {Promise<Object>} - Pagamento confirmado
   */
  confirmPayment: async (id) => {
    const response = await api.post(`/api/payments/${id}/confirm`);
    return response.data;
  },

  /**
   * Cancela pagamento
   * @param {number} id - ID do pagamento
   * @returns {Promise<Object>} - Pagamento cancelado
   */
  cancelPayment: async (id) => {
    const response = await api.post(`/api/payments/${id}/cancel`);
    return response.data;
  },
};

export default paymentService;
