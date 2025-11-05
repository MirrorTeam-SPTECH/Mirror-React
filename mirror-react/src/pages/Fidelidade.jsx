"use client";

import { useState, useEffect, useCallback } from "react";
import { useRef } from "react";
import { Header } from "../components/Header";
import { Favoritos } from "../components/CardFavoritos";
import { SubNavigation } from "../components/SubNavigation";
import produtosData from "../data/produtos.json";
import Vector15 from "../assets/img/Vector15.png";
import Vector16 from "../assets/img/Vector16.png";
import "../styles/Fidelidade.css";
import confetti from "canvas-confetti";

export default function FidelidadePage() {
  const [fidelidade, setFidelidade] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comprasRealizadas, setComprasRealizadas] = useState(0);
  const [premioDisponivel, setPremioDisponivel] = useState(false);
  const [pedidosProcessados, setPedidosProcessados] = useState(new Set());
  const [userEmail, setUserEmail] = useState(null);

  // Obter email do usuário logado
  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserEmail(user.email);
      }
    } catch (error) {
      console.error("Erro ao obter usuário:", error);
    }
  }, []);

  // Montagem: carrega favoritos visuais e progresso persistido (específico por usuário)
  useEffect(() => {
    if (!userEmail) return;

    // Chaves específicas do usuário
    const favKey = `favoritos_${userEmail}`;
    const fidelKey = `dadosFidelidade_${userEmail}`;

    const ids = JSON.parse(localStorage.getItem(favKey) || "[]");
    setFidelidade(produtosData.hamburgueres.filter((p) => ids.includes(p.id)));

    const saved = JSON.parse(localStorage.getItem(fidelKey) || "{}");
    const compras = saved.compras || 0;
    const processados = new Set(saved.pedidosProcessados || []);

    setComprasRealizadas(compras);
    setPremioDisponivel(compras >= 10);
    setPedidosProcessados(processados);
    setLoading(false);
  }, [userEmail]);

  // Verifica novas compras de: novoPagamentoBalcao, novoPagamentoPix e como backup o historicoPedidos
  const verificarNovasCompras = useCallback(() => {
    if (!userEmail) return;

    const fidelKey = `dadosFidelidade_${userEmail}`;

    let novaCompraDetectada = false;
    const novos = new Set(pedidosProcessados);

    // Balcão
    const novoPagamentoBalcao = localStorage.getItem("novoPagamentoBalcao");
    if (novoPagamentoBalcao) {
      try {
        const dados = JSON.parse(novoPagamentoBalcao);
        const pedidoId = `balcao-${dados.timestamp}`;
        if (!novos.has(pedidoId)) {
          novos.add(pedidoId);
          novaCompraDetectada = true;
        }
      } catch (e) {
        console.error("Erro ao processar novoPagamentoBalcao:", e);
      } finally {
        // Limpa a chave sempre que encontrada (processada/corrompida)
        localStorage.removeItem("novoPagamentoBalcao");
      }
    }

    // PIX
    const novoPagamentoPix = localStorage.getItem("novoPagamentoPix");
    if (novoPagamentoPix) {
      try {
        const dados = JSON.parse(novoPagamentoPix);
        const pedidoId = `pix-${dados.timestamp}`;
        if (!novos.has(pedidoId)) {
          novos.add(pedidoId);
          novaCompraDetectada = true;
        }
      } catch (e) {
        console.error("Erro ao processar novoPagamentoPix:", e);
      } finally {
        localStorage.removeItem("novoPagamentoPix");
      }
    }

    // Backup: buscar pedidos do usuário pela API (se necessário)
    // Removido o uso de historicoPedidos global que continha pedidos de todos os usuários

    if (novaCompraDetectada) {
      const total = novos.size;
      setPedidosProcessados(novos);
      setComprasRealizadas(Math.min(total, 10));
      setPremioDisponivel(total >= 10);

      // Persistência com chave específica do usuário
      localStorage.setItem(
        fidelKey,
        JSON.stringify({
          compras: Math.min(total, 10),
          pedidosProcessados: Array.from(novos),
          ultimaAtualizacao: new Date().toISOString(),
          // preserva contagem de prêmios se existir
          premiosResgatados:
            JSON.parse(localStorage.getItem(fidelKey) || "{}")
              .premiosResgatados || 0,
        })
      );
    }
  }, [pedidosProcessados, userEmail]);

  useEffect(() => {
    verificarNovasCompras(); // primeiro disparo
    const interval = setInterval(verificarNovasCompras, 1000);
    return () => clearInterval(interval);
  }, [verificarNovasCompras]);

  const progressoRef = useRef(null);

  useEffect(() => {
    if (premioDisponivel && progressoRef.current) {
      const rect = progressoRef.current.getBoundingClientRect();
      confetti({
        particleCount: 100,
        spread: 100,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        },
      });
    }
  }, [premioDisponivel]);

  const renderBloco = (items, isLeftBlock = false) => (
    <div className="bloco-central">
      {isLeftBlock ? (
        <div className="circulos-container">
          <h3 className="text-lg font-medium">Seus pontos</h3>
          <div className="linha-circulos !mt-7">
            {[...Array(5)].map((_, index) => (
              <div
                key={`top-circle-${index}`}
                className={`circulo ${
                  index < comprasRealizadas ? "circulo-verde" : ""
                } ${
                  index === comprasRealizadas && comprasRealizadas < 10
                    ? "circulo-proximo"
                    : ""
                }`}
              >
                {index < comprasRealizadas ? (
                  <span className="circulo-check">✓</span>
                ) : (
                  <span className="circulo-numero">{index + 1}</span>
                )}
              </div>
            ))}
          </div>
          <div className="linha-circulos">
            {[...Array(5)].map((_, index) => {
              const circleIndex = index + 5;
              return (
                <div
                  key={`bottom-circle-${index}`}
                  className={`circulo ${
                    circleIndex < comprasRealizadas ? "circulo-verde" : ""
                  } ${
                    circleIndex === comprasRealizadas && comprasRealizadas < 10
                      ? "circulo-proximo"
                      : ""
                  }`}
                >
                  {circleIndex < comprasRealizadas ? (
                    <span className="circulo-check">✓</span>
                  ) : (
                    <span className="circulo-numero">{circleIndex + 1}</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="progresso-texto flex flex-col items-center justify-end !mt-10">
            {premioDisponivel && (
              <p className="text-center text-lg font-bold text-green-600">
                🎉 Prêmio disponível para resgate!
              </p>
            )}

            {/* Debug info - removido histórico global que continha todos os usuários */}
            <div className="text-xs text-gray-500 mt-2">
              <p>Pedidos processados: {pedidosProcessados.size}</p>
            </div>
          </div>
        </div>
      ) : (
        <div
          ref={progressoRef}
          className="premio-container flex flex-col items-center"
        >
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
          <p className="descricao-premio text-center !mt-3 text-gray-700">
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
