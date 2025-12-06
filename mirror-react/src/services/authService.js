import api from "../config/api";
const authService = {
  login: async (credentials) => {
    const payload = {
      email: credentials.email,
      password: credentials.senha,
    };
    console.log("AuthService enviando para backend:", {
      ...payload,
      password: "***",
    });
    const response = await api.post("/auth/login", payload);

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    if (response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post("/users/register", {
      name: userData.nome,
      email: userData.email,
      password: userData.senha,


    });
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
  getToken: () => {
    return localStorage.getItem("token");
  },
};
export default authService;