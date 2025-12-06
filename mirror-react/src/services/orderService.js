import api from "../config/api";
const orderService = {
  createOrder: async (orderData) => {
    const response = await api.post("/orders", orderData);
    return response.data;
  },
  createCounterOrder: async (orderData) => {
    const response = await api.post("/orders", orderData);
    return response.data;
  },
  createPixOrder: async (orderData) => {
    const response = await api.post("/orders", orderData);
    return response.data;
  },
  getAllOrders: async () => {
    const response = await api.get("/orders");
    return response.data;
  },
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  getOrdersByStatus: async (status) => {
    const response = await api.get(`/orders/status/${status}`);
    return response.data;
  },
  updateOrderStatus: async (id, status) => {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },
  addItemToOrder: async (orderId, itemData) => {
    const response = await api.post(`/orders/${orderId}/items`, itemData);
    return response.data;
  },
  removeItemFromOrder: async (orderId, itemId) => {
    const response = await api.delete(`/orders/${orderId}/items/${itemId}`);
    return response.data;
  },
  getDashboardStats: async () => {
    const response = await api.get("/orders/stats");
    return response.data;
  },
  getDashboardStatsByPeriod: async (startDate, endDate) => {
    const response = await api.get("/orders/stats", {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });
    return response.data;
  },
};
export default orderService;
