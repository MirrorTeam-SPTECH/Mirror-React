import api from "../config/api";

/**
 * Serviço de autenticação
 */
const authService = {
  /**
   * Realiza login do usuário
   * @param {Object} credentials - Credenciais do usuário
   * @param {string} credentials.email - Email do usuário
   * @param {string} credentials.senha - Senha do usuário
   * @returns {Promise<Object>} - Dados do usuário e token
   */
  login: async (credentials) => {
    const payload = {
      email: credentials.email,
      password: credentials.senha,
    };

    console.log("AuthService enviando para backend:", {
      ...payload,
      password: "***",
    });

    const response = await api.post("/api/auth/login", payload);

    // Salvar token e dados do usuário no localStorage
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    // Salvar dados do usuário também
    if (response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  },

  /**
   * Registra novo usuário
   * @param {Object} userData - Dados do novo usuário
   * @param {string} userData.nome - Nome do usuário
   * @param {string} userData.email - Email do usuário
   * @param {string} userData.senha - Senha do usuário
   * @returns {Promise<Object>} - Dados do usuário registrado
   */
  register: async (userData) => {
    const response = await api.post("/api/users/register", {
      name: userData.nome,
      email: userData.email,
      password: userData.senha,
      // phone não é enviado (opcional no backend)
      // role não é enviado (automaticamente CUSTOMER no backend)
    });
    return response.data;
  },

  /**
   * Realiza logout do usuário
   */
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  /**
   * Verifica se o usuário está autenticado
   * @returns {boolean} - True se autenticado
   */
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  /**
   * Obtém o token atual
   * @returns {string|null} - Token JWT ou null
   */
  getToken: () => {
    return localStorage.getItem("token");
  },
};

export default authService;
