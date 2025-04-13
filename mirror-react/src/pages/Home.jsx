// src/pages/Home.jsx
import React from "react";
import { Header } from "../components/Header";
import { Pesquisa } from "../components/Pesquisa";
import { NavigationBar } from "../components/NavigationBar";
import { ListaProdutos } from "../components/ListaProdutos";
import { SubNavigation } from "../components/SubNavigation";

import produtosData from "../data/produtos.json";
// Cria o objeto de categorias com os dados importados
const todasCategorias = [
    { titulo: "Hamburgueres", produtos: produtosData.hamburgueres || [] },
    { titulo: "Espetinhos", produtos: produtosData.espetinhos || [] },
    { titulo: "Adicionais", produtos: produtosData.adicionais || [] },
    { titulo: "Bebidas", produtos: produtosData.bebidas || [] },
    { titulo: "Porções", produtos: produtosData.porcoes || [] }
  ];





export default function Home() {
  return (
    <div className="containerProjeto">
      <Header titulo="Bem vindos!" p="Vamos fazer seu pedido" />
      <Pesquisa />
      <NavigationBar />

      {/* Passa todas as categorias para o componente ListaProdutos */}
      <ListaProdutos categorias={todasCategorias} />

      <SubNavigation />
    </div>
  );
}
