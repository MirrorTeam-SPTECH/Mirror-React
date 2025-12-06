import api from "../config/api";
const paymentService = {
  createCheckout: async (checkoutData) => {
    const response = await api.post("/payments", checkoutData);
    return response.data;
  },
  createPayment: async (paymentData) => {
    const response = await api.post("/payments", paymentData);
    return response.data;
  },
  getPaymentById: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },
  getPaymentByOrderId: async (orderId) => {
    const response = await api.get(`/payments/order/${orderId}`);
    return response.data;
  },
  confirmPayment: async (id) => {
    const response = await api.post(`/payments/${id}/confirm`);
    return response.data;
  },
  cancelPayment: async (id) => {
    const response = await api.post(`/payments/${id}/cancel`);
    return response.data;
  },
};
export default paymentService;