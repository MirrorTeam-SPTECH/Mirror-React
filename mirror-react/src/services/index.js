import api from "../config/api";

/**
 * Serviço de índice - exporta todos os serviços
 */
export { default as authService } from "./authService";
export { default as orderService } from "./orderService";
export { default as menuService } from "./menuService";
export { default as paymentService } from "./paymentService";

// Re-exportar a instância do axios configurada
export { api };
