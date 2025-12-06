import api from "../config/api";
const menuService = {
  getAllItems: async () => {
    const response = await api.get("/menu-items");
    return response.data;
  },
  getItemById: async (id) => {
    const response = await api.get(`/menu-items/${id}`);
    return response.data;
  },
  getItemsByCategory: async (category) => {
    const response = await api.get(`/menu-items/category/${category}`);
    return response.data;
  },
  createItem: async (itemData) => {
    const response = await api.post("/menu-items", itemData);
    return response.data;
  },
  updateItem: async (id, itemData) => {
    const response = await api.put(`/menu-items/${id}`, itemData);
    return response.data;
  },
  deleteItem: async (id) => {
    await api.delete(`/menu-items/${id}`);
  },
};
export default menuService;