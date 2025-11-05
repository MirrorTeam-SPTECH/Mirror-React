"use client";

import { useState } from "react";
import axios from "axios";
import ButtonBack from "./Shared/ButtonBack";
import CardCarregamento from "./CardCarregamento";
import CardQRcode from "./CardQRcode";
import { addPaymentNotification } from "../utils/notifications";

export default function CardPagamento({ produto, onCartao, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrCodeData, setQrCodeData] = useState(null);

  if (!produto) {
    return (
      <div className="w-[350px] h-128 flex flex-col font-['Montserrat']">
        <div className="flex-none !p-5 bg-white rounded-t-2xl shadow-md">
          <h2 className="text-2xl font-bold !m-0 text-gray-800">
            Finalizar compra
          </h2>
        </div>
        <div className="flex-grow bg-white rounded-b-2xl shadow-md flex items-center justify-center text-gray-600">
          Nenhum produto selecionado
        </div>
      </div>
    );
  }

  const nome = produto.nome || "";
  const quantity = produto.quantity || 1;
  const subtotal = produto.subtotal || "0,00";
  const taxaEntrega = produto.taxaEntrega || "1,00";
  const total = produto.total || "0,00";
  const adicionais = Array.isArray(produto.adicionaisSelecionados)
    ? produto.adicionaisSelecionados
    : [];

  const parsePreco = (preco) => {
    if (typeof preco === "string")
      return Number.parseFloat(preco.replace(",", "."));
    if (typeof preco === "number") return preco;
    return 0;
  };
  const toNumber = (v) => {
    if (v == null) return 0;
    if (typeof v === "number") return Number.isFinite(v) ? v : 0;
    if (typeof v === "string") {
      const n = Number.parseFloat(v.replace(",", "."));
      return Number.isNaN(n) ? 0 : n;
    }
    return 0;
  };

  const calcularTotal = () => {
    const precoBase = parsePreco(produto.preco);
    const qtdProduto = produto.quantity || 1;

    // Total dos adicionais (já multiplicado pelas quantidades de cada adicional)
    const totalAdicionais = adicionais.reduce((acc, adicional) => {
      const precoAdicional = parsePreco(adicional.preco);
      const quantidadeAdicional =
        adicional.quantity || adicional.quantidade || 1;
      return acc + precoAdicional * quantidadeAdicional;
    }, 0);

    // CÁLCULO CORRETO: (preço base × quantidade do produto) + adicionais
    // Exemplo: (29,90 × 6) + 18,00 = 197,40
    const totalCalc = precoBase * qtdProduto + totalAdicionais;

    console.log("=== CÁLCULO DE TOTAL ===");
    console.log("Produto:", produto.nome || produto.name);
    console.log("Preço base (raw):", produto.preco || produto.price);
    console.log("Preço base (parsed):", precoBase);
    console.log("Quantidade do produto:", qtdProduto);
    console.log("Adicionais:", adicionais);
    adicionais.forEach((adicional, index) => {
      const precoAd = parsePreco(adicional.preco);
      const qtdAd = adicional.quantity || adicional.quantidade || 1;
      console.log(
        `  Adicional ${index + 1}: ${
          adicional.nome || adicional.name
        } - R$ ${precoAd} x ${qtdAd} = R$ ${precoAd * qtdAd}`
      );
    });
    console.log("Total de adicionais:", totalAdicionais);
    console.log(
      "Cálculo: (",
      precoBase,
      "×",
      qtdProduto,
      ") +",
      totalAdicionais,
      "=",
      totalCalc
    );
    console.log("========================");

    return totalCalc.toFixed(2);
  };

  const buildStandardPayment = (metodoPagamento) => {
    const unitPrice =
      typeof produto.unitPrice === "number"
        ? produto.unitPrice
        : toNumber(produto.preco);
    const qtd = produto.quantity || 1;
    const entregaNum =
      typeof produto.entregaNum === "number" ? produto.entregaNum : 0;
    const adicionaisSelecionados = Array.isArray(produto.adicionaisSelecionados)
      ? produto.adicionaisSelecionados
      : [];
    const adicionaisTotal = adicionaisSelecionados.reduce((acc, ad) => {
      const p = toNumber(ad?.preco);
      const q = toNumber(ad?.quantidade) || 1;
      return acc + p * q;
    }, 0);
    const subtotalNum =
      typeof produto.subtotalNum === "number"
        ? produto.subtotalNum
        : unitPrice * qtd;
    const totalNum =
      typeof produto.totalNum === "number"
        ? produto.totalNum
        : subtotalNum + entregaNum + adicionaisTotal;

    const timestamp = Date.now();

    return {
      nomeLanche: nome,
      nome,
      imagem: produto.imagem || "/placeholder.svg?height=60&width=60",
      tempoPreparo: produto.tempoPreparo || "15-20 min",

      preco: unitPrice,
      precoUnitario: unitPrice,
      unitPrice,
      quantidade: qtd,
      quantity: qtd,

      subtotal: subtotal,
      subtotalNum,
      taxaEntrega: produto.taxaEntrega || "0,00",
      entregaNum,
      valorTotal: totalNum,
      total: total,
      totalNum,

      adicionaisSelecionados,
      totalAdicionais: adicionaisTotal,

      observacoes: produto.observacoes || "",

      timestamp,
      metodoPagamento,
    };
  };

  const saveHistorico = (dadosPagamento) => {
    try {
      const historico = JSON.parse(
        localStorage.getItem("historicoPedidos") || "[]"
      );
      const jaExiste = Array.isArray(historico)
        ? historico.some(
            (p) => p?.dadosOriginais?.timestamp === dadosPagamento.timestamp
          )
        : false;
      if (jaExiste) return;

      const unit = toNumber(dadosPagamento.unitPrice);
      const qtd = toNumber(dadosPagamento.quantity);
      const entrega =
        typeof dadosPagamento.entregaNum === "number"
          ? dadosPagamento.entregaNum
          : 0;
      const adicionais = Array.isArray(dadosPagamento.adicionaisSelecionados)
        ? dadosPagamento.adicionaisSelecionados
        : [];

      const itens = [
        {
          nome: dadosPagamento.nomeLanche,
          preco: unit,
          quantidade: qtd,
          imagem: dadosPagamento.imagem,
          tipo: "produto",
          adicionaisSelecionados: adicionais,
        },
      ];
      adicionais.forEach((ad) => {
        itens.push({
          nome: `+ ${ad?.nome}`,
          preco: toNumber(ad?.preco),
          quantidade: toNumber(ad?.quantidade) || 1,
          imagem: ad?.imagem || "/placeholder.svg?height=60&width=60",
          tipo: "adicional",
        });
      });

      const totalNumCalc =
        typeof dadosPagamento.totalNum === "number"
          ? dadosPagamento.totalNum
          : unit * qtd +
            entrega +
            adicionais.reduce(
              (acc, ad) =>
                acc + toNumber(ad?.preco) * (toNumber(ad?.quantidade) || 1),
              0
            );

      const novoPedido = {
        id: `#${String(dadosPagamento.timestamp).toString(36).toUpperCase()}`,
        dataPedido: new Date().toISOString(),
        tempoPreparo: dadosPagamento.tempoPreparo || "15-20 min",
        status: "em-andamento",
        metodoPagamento: dadosPagamento.metodoPagamento,
        total: totalNumCalc,
        itens,
        dadosOriginais: { timestamp: dadosPagamento.timestamp },
      };

      const atualizado = [
        novoPedido,
        ...(Array.isArray(historico) ? historico : []),
      ];
      localStorage.setItem("historicoPedidos", JSON.stringify(atualizado));
    } catch (e) {
      console.error("Erro ao salvar no histórico:", e);
    }
  };

  const handlePagamentoBalcao = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const totalCalculado = calcularTotal();

      console.log("=== PAGAMENTO BALCÃO ===");
      console.log("Total calculado:", totalCalculado);
      console.log("=====================");

      if (!token) {
        alert("Você precisa estar logado para fazer o pagamento.");
        setLoading(false);
        return;
      }

      // 1. Criar o pedido
      const orderData = {
        customerName: user.name || user.nome || "Cliente",
        customerEmail: user.email || "cliente@example.com",
        customerPhone: user.phone || user.telefone || "",
        total: parseFloat(totalCalculado),
        notes: produto.observacoes || "",
      };

      const orderResponse = await axios.post(
        "http://localhost:8080/api/orders",
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const orderId = orderResponse.data.id;

      // 2. Adicionar items ao pedido
      // Formatar os adicionais para o campo observations
      const adicionaisTexto = adicionais
        .map(
          (ad) => `${ad.nome} (+R$ ${ad.preco.toFixed(2).replace(".", ",")})`
        )
        .join(", ");

      const itemData = {
        menuItemId: produto.id,
        quantity: quantity,
        unitPrice: parseFloat(totalCalculado) / quantity,
        observations: adicionaisTexto || null,
      };

      await axios.post(
        `http://localhost:8080/api/orders/${orderId}/items`,
        itemData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // 3. Criar o pagamento com método CASH (Dinheiro no balcão)
      const paymentData = {
        orderId: orderId,
        method: "CASH",
        amount: parseFloat(totalCalculado),
      };

      await axios.post("http://localhost:8080/api/payments", paymentData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Pagamento no balcão registrado com sucesso!");

      // Notificações e histórico local
      const std = buildStandardPayment("balcao");
      saveHistorico(std);
      addPaymentNotification(std);

      if (onCartao) onCartao();
      if (onClose) onClose();
      alert("Pagamento no balcão registrado com sucesso!");
    } catch (err) {
      console.error("Erro ao registrar pagamento no balcão:", err);
      console.error("Detalhes:", err.response?.data);
      setError("Erro ao registrar pagamento no balcão");
      alert(
        "Erro ao registrar pagamento no balcão: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePagamentoPix = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const totalCalculado = calcularTotal();

      console.log("=== PAGAMENTO PIX ===");
      console.log("Total calculado:", totalCalculado);
      console.log("Tipo:", typeof totalCalculado);
      console.log("Produto completo:", produto);
      console.log("Adicionais completos:", adicionais);
      console.log("=====================");

      if (!token) {
        alert("Você precisa estar logado para fazer o pagamento via PIX.");
        setLoading(false);
        return;
      }

      // 1. Criar o pedido (sem items primeiro)
      const orderData = {
        customerName: user.name || user.nome || "Cliente",
        customerEmail: user.email || "cliente@example.com",
        customerPhone: user.phone || user.telefone || "",
        total: parseFloat(totalCalculado),
        notes: produto.observacoes || "",
      };

      const orderResponse = await axios.post(
        "http://localhost:8080/api/orders",
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const orderId = orderResponse.data.id;

      // 2. Adicionar items ao pedido
      // Formatar os adicionais para o campo observations
      const adicionaisTexto = adicionais
        .map(
          (ad) => `${ad.nome} (+R$ ${ad.preco.toFixed(2).replace(".", ",")})`
        )
        .join(", ");

      const itemData = {
        menuItemId: produto.id,
        quantity: quantity,
        unitPrice: parseFloat(totalCalculado) / quantity,
        observations: adicionaisTexto || null,
      };

      await axios.post(
        `http://localhost:8080/api/orders/${orderId}/items`,
        itemData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // 3. Criar o pagamento
      const paymentData = {
        orderId: orderId,
        method: "PIX",
        amount: parseFloat(totalCalculado),
      };

      const paymentResponse = await axios.post(
        "http://localhost:8080/api/payments",
        paymentData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const paymentId = paymentResponse.data.id;

      // 4. Processar pagamento PIX (gerar QR Code)
      const pixResponse = await axios.post(
        `http://localhost:8080/api/payments/${paymentId}/pix`,
        { customerEmail: user.email || "cliente@example.com" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Salvar no histórico local
      const std = buildStandardPayment("pix");
      const payload = {
        ...std,
        produto,
        orderId,
        paymentId,
        qr_code: pixResponse.data.qr_code,
        ticket_url: pixResponse.data.ticket_url,
      };
      saveHistorico(std);
      localStorage.setItem("novoPagamentoPix", JSON.stringify(payload));
      addPaymentNotification(std);

      // Mostrar QR Code ao invés de redirecionar
      setQrCodeData({
        qrCode: pixResponse.data.qr_code,
        qrCodeBase64: pixResponse.data.qr_code_base64,
        ticketUrl: pixResponse.data.ticket_url,
        orderId,
        paymentId,
      });
    } catch (err) {
      console.error("Erro ao iniciar pagamento PIX:", err);
      console.error("Detalhes do erro:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.response?.data ||
        err.message;

      setError("Erro ao iniciar pagamento");
      alert(
        `Erro ao iniciar pagamento PIX:\n\n${
          typeof errorMsg === "object"
            ? JSON.stringify(errorMsg, null, 2)
            : errorMsg
        }\n\nVerifique se:\n1. O Spring Boot está rodando\n2. As credenciais do Mercado Pago estão configuradas\n3. O banco de dados está acessível`
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CardCarregamento />;
  }

  // Se tem QR Code, mostrar componente de QR Code
  if (qrCodeData) {
    return (
      <CardQRcode
        qrCode={qrCodeData.qrCode}
        qrCodeBase64={qrCodeData.qrCodeBase64}
        ticketUrl={qrCodeData.ticketUrl}
        onClose={() => {
          setQrCodeData(null);
          if (onClose) onClose();
        }}
        onConfirmar={() => {
          alert("Pagamento confirmado! Aguarde a confirmação do banco.");
          setQrCodeData(null);
          if (onClose) onClose();
        }}
      />
    );
  }
  if (loading) {
    return <CardCarregamento />;
  }

  return (
    <div className="w-[350px] h-128 flex flex-col font-['Montserrat']">
      <div className="flex justify-center !p-5 bg-white rounded-t-2xl shadow-md">
        <div className="flex absolute left-1 top-0.5 ">
          <ButtonBack onClose={onClose} />
        </div>
        <h2 className="text-2xl font-bold !m-0 text-gray-800">
          Finalizar compra
        </h2>
      </div>

      <div className="flex-grow overflow-y-auto bg-white shadow-inner !px-5 !py-2">
        <div className="flex justify-between text-sm text-gray-700 !mb-2.5">
          <span>
            {nome} {quantity > 1 ? `(${quantity}x)` : ""}
          </span>
          <span>R$ {subtotal}</span>
        </div>

        {adicionais.length > 0 && (
          <div className="!mb-2.5">
            {adicionais.map((ad, i) => (
              <div
                key={i}
                className="flex justify-between text-xs text-gray-600 !mb-1"
              >
                <span>
                  {ad.nome} x{ad.quantidade || 1}
                </span>
                <span>
                  R${" "}
                  {(parsePreco(ad.preco) * (ad.quantidade || 1))
                    .toFixed(2)
                    .replace(".", ",")}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between text-sm text-gray-700 !mb-2.5">
          <span>Subtotal</span>
          <span>R$ {subtotal}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-700 !mb-2.5">
          <span>Taxa de entrega</span>
          <span>R$ {taxaEntrega}</span>
        </div>

        <hr className="border-none h-px bg-gray-200 !my-4" />

        <div className="flex justify-between text-lg font-bold text-gray-800 !mb-2.5">
          <span>Total</span>
          <span>R$ {total}</span>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-2 rounded-md text-sm mb-2">
            {typeof error === "string"
              ? error
              : error?.message || "Erro ao processar pagamento"}
          </div>
        )}
      </div>

      <div className="flex-none !px-5 !pb-5 bg-white rounded-b-2xl shadow-md">
        <p className="text-base font-medium !mb-4 text-gray-800">
          Como prefere fazer o pagamento?
        </p>

        <button
          className={`w-full flex justify-between items-center !p-4 !mb-2.5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          onClick={handlePagamentoPix}
          disabled={loading}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-xl">💠</span>
            <span className="text-base font-medium text-gray-800">PIX</span>
          </div>
          {loading ? (
            <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <span className="text-lg text-gray-600">➔</span>
          )}
        </button>

        <button
          className={`w-full flex justify-between items-center !p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          onClick={handlePagamentoBalcao}
          disabled={loading}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-xl">💳</span>
            <span className="text-base font-medium text-gray-800">Balcão</span>
          </div>
          {loading ? (
            <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <span className="text-lg text-gray-600">➔</span>
          )}
        </button>
      </div>
    </div>
  );
}
