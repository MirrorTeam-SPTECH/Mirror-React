import produtosData from "../data/produtos.json";

export const todasCategorias = [
  {titulo: "Combos", produtos: produtosData.combos || []},
  { titulo: "Hamburgueres", produtos: produtosData.hamburgueres || [] },
  { titulo: "Espetinhos", produtos: produtosData.espetinhos || [] },
  { titulo: "Adicionais", produtos: produtosData.adicionais || [] },
  { titulo: "Bebidas", produtos: produtosData.bebidas || [] },
  { titulo: "Porções", produtos: produtosData.porcoes || [] },
];