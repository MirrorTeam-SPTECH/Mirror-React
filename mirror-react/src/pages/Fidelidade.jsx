"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "../components/Header";
import { Favoritos } from "../components/CardFavoritos";
import { SubNavigation } from "../components/SubNavigation";
import produtosData from "../data/produtos.json";
import "../styles/Fidelidade.css";
import Vector15 from "../assets/img/Vector15.png";
import Vector16 from "../assets/img/Vector16.png";

const API_URL = "http://localhost:8080/api/pedidos";

export default function FidelidadePage() {
  const [fidelidade, setFidelidade] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comprasRealizadas, setComprasRealizadas] = useState(0);
  const [premioDisponivel, setPremioDisponivel] = useState(false);
  const [pedidosProcessados, setPedidosProcessados] = useState(new Set());

  // 1. Ao montar, zera tudo e carrega os favoritos visuais
  useEffect(() => {
    // limpa dados antigos
    localStorage.removeItem("dadosFidelidade");
    localStorage.removeItem("historicoPedidos");
    localStorage.removeItem("fidelidade");

    // carrega produtos favoritos (visual)
    const ids = JSON.parse(localStorage.getItem("fidelidade")) || [];
    setFidelidade(produtosData.hamburgueres.filter((p) => ids.includes(p.id)));

    // zera contagem de compras
    setComprasRealizadas(0);
    setPremioDisponivel(false);
    setPedidosProcessados(new Set());

    setLoading(false);
  }, []);

  // 2. Busca pedidos novos a cada segundo e atualiza contador
  const verificarNovasCompras = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(res.statusText);
      const lista = await res.json();

      let detectou = false;
      const novos = new Set(pedidosProcessados);

      lista.forEach((p) => {
        const id = p.id?.toString() || `${p.dataCriacao}-${p.total}`;
        if (!novos.has(id)) {
          novos.add(id);
          detectou = true;
        }
      });

      if (detectou) {
        const total = novos.size;
        setPedidosProcessados(novos);
        setComprasRealizadas(Math.min(total, 10));
        setPremioDisponivel(total >= 10);
      }
    } catch (err) {
      console.error("Erro ao buscar pedidos para fidelidade:", err);
    }
  }, [pedidosProcessados]);

  useEffect(() => {
    const interval = setInterval(verificarNovasCompras, 1000);
    return () => clearInterval(interval);
  }, [verificarNovasCompras]);

  // 3. Layout de pontos + prêmio
  const renderBloco = (items, isLeftBlock = false) => (
    <div className="bloco-central">
      {isLeftBlock ? (
        <div className="circulos-container">
          <h3 className="text-lg font-medium">Seus pontos</h3>
          <div className="linha-circulos">
            {[...Array(5)].map((_, idx) => (
              <div
                key={idx}
                className={`circulo ${
                  idx < comprasRealizadas ? "circulo-verde" : ""
                } ${
                  idx === comprasRealizadas && comprasRealizadas < 10
                    ? "circulo-proximo"
                    : ""
                }`}
              >
                {idx < comprasRealizadas ? (
                  <span className="circulo-check">✓</span>
                ) : (
                  <span className="circulo-numero">{idx + 1}</span>
                )}
              </div>
            ))}
          </div>
          <div className="linha-circulos">
            {[...Array(5)].map((_, j) => {
              const idx = j + 5;
              return (
                <div
                  key={j}
                  className={`circulo ${
                    idx < comprasRealizadas ? "circulo-verde" : ""
                  } ${
                    idx === comprasRealizadas && comprasRealizadas < 10
                      ? "circulo-proximo"
                      : ""
                  }`}
                >
                  {idx < comprasRealizadas ? (
                    <span className="circulo-check">✓</span>
                  ) : (
                    <span className="circulo-numero">{idx + 1}</span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="progresso-texto">
            {!premioDisponivel && (
              <p className="text-center text-sm text-gray-600">
                Faltam {10 - comprasRealizadas} compras para o prêmio!
              </p>
            )}
            {premioDisponivel && (
              <p className="text-center text-lg font-bold text-green-600">
                🎉 Prêmio disponível para resgate!
              </p>
            )}
            <div className="text-xs text-gray-500 mt-2">
              <p>Pedidos processados: {pedidosProcessados.size}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="premio-container flex flex-col items-center">
          <h3 className="text-lg font-medium flex items-center justify-center mb-2">
            Seu Prêmio
          </h3>
          <div className="imagem-premio relative flex items-center justify-center flex-col h-[550px] bg-white rounded-2xl shadow-lg overflow-hidden">
            <img
              src={Vector15 || "/placeholder.svg"}
              alt=""
              className="absolute !-mt-1 left-0 w-full h-1/2 object-cover z-0"
              style={{ pointerEvents: "none" }}
            />
            <img
              src={Vector16 || "/placeholder.svg"}
              alt=""
              className="absolute left-0 w-full h-1/2 object-cover z-0"
              style={{ pointerEvents: "none" }}
            />
            <img
              src="/img/combo-3.png"
              alt=""
              className="relative z-10"
              style={{ width: 320, height: 320, objectFit: "contain" }}
            />
            {premioDisponivel ? (
              <div className="premio-disponivel absolute top-10 left-1/2 -translate-x-1/2 z-10 text-5xl"></div>
            ) : (
              <div className="premio-bloqueado absolute top-4 left-1/2 -translate-x-1/2 z-10 text-5xl">
                🔒
              </div>
            )}
          </div>
          <p className="descricao-premio text-center mt-2">
            {premioDisponivel
              ? "🎉 Seu prêmio está disponível! Hambúrguer X-Tudo Grátis"
              : "Complete 10 compras e ganhe um delicioso X-Tudo totalmente grátis!"}
          </p>
        </div>
      )}
      <div className="fidelidade-lista">
        {items.map((item) => (
          <Favoritos
            key={item.id}
            nome={item.nome}
            valor={`R$ ${item.preco}`}
            descricao={item.descricao}
            imagem={item.imagem}
          />
        ))}
      </div>
    </div>
  );

  // 4. Renderização final
  return (
    <div>
      {loading ? (
        <div>Carregando...</div>
      ) : (
        <div className="flex flex-col !-mt-25">
          <Header titulo="Cada pedido te aproxima" p="de mais sabores" />
          <div className="fidelidade-page-container">
            <div className="blocos-centrais-container">
              {renderBloco(
                fidelidade.slice(0, Math.ceil(fidelidade.length / 2)),
                true
              )}
              {renderBloco(fidelidade.slice(Math.ceil(fidelidade.length / 2)))}
            </div>
          </div>
          <SubNavigation />
        </div>
      )}
    </div>
  );
}
