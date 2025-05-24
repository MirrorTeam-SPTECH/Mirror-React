// src/components/CardPagamento.jsx
"use client"
import ButtonBack from "../components/Shared/ButtonBack"

export default function CardPagamento({ produto, onPix, onCartao, pedido, onClose}) {
  console.log("CardPagamento recebeu:", produto)

  // Se não tiver produto, renderiza estado vazio mantendo altura fixa igual ao CardCarrinho
  if (!produto) {
    return (
      <div className="w-[350px] h-128 flex flex-col font-['Montserrat']">
        {/* Topo */}
        <div className="flex-none !p-5 bg-white rounded-t-2xl shadow-md">
          <h2 className="text-2xl font-bold !m-0 text-gray-800">Finalizar compra</h2>
        </div>
        {/* Conteúdo vazio */}
        <div className="flex-grow bg-white rounded-b-2xl shadow-md flex items-center justify-center text-gray-600">
          Nenhum produto selecionado
        </div>
      </div>
    )
  }

  // Extrai dados
  const nome = produto.nome || ""
  const quantity = produto.quantity || 1
  const subtotal = produto.subtotal || "0,00"
  const taxaEntrega = produto.taxaEntrega || "1,00"
  const total = produto.total || "0,00"
  const adicionais = produto.adicionaisSelecionados || []

  // Dispara evento e chama callback ao clicar em "Balcão"
  const handlePagamentoBalcao = () => {
    if (onCartao) onCartao();
  
    const nomeLanche = pedido?.nome ?? "desconhecido";
  
    localStorage.setItem(
      "novoPagamentoBalcao",
      JSON.stringify({
        timestamp: Date.now(),
        nomeLanche,
      })
    );
  };
  
  
  


  return (
    <div className="w-[350px] h-128 flex flex-col font-['Montserrat']">
      {/* Topo */}
      <div className="flex justify-center !p-5 bg-white rounded-t-2xl shadow-md">
        <div className="flex absolute left-1 top-0.5 ">
                    <ButtonBack onClose={onClose} />
              </div>
        <h2 className="text-2xl font-bold !m-0 text-gray-800">Finalizar compra</h2>
      </div>

      {/* Conteúdo rolável */}
      <div className="flex-grow overflow-y-auto bg-white shadow-inner !px-5 !py-2">
        {/* Resumo do item */}
        <div className="flex justify-between text-sm text-gray-700 !mb-2.5">
          <span>
            {nome} {quantity > 1 ? `(${quantity}x)` : ""}
          </span>
          <span>R$ {subtotal}</span>
        </div>

        {/* Adicionais */}
        {adicionais.length > 0 && (
          <div className="!mb-2.5">
            {adicionais.map((ad, i) => (
              <div key={i} className="flex justify-between text-xs text-gray-600 !mb-1">
                <span>
                  {ad.nome} x{ad.quantidade}
                </span>
                <span>R$ {(ad.preco * ad.quantidade).toFixed(2).replace(".", ",")}</span>
              </div>
            ))}
          </div>
        )}

        {/* Subtotal e taxa */}
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
      </div>

      {/* Rodapé fixo */}
      <div className="flex-none !px-5 !pb-5 bg-white rounded-b-2xl shadow-md">
        <p className="text-base font-medium !mb-4 text-gray-800">Como prefere fazer o pagamento?</p>
        
        {/* Botão PIX */}
        <button
          className="w-full flex justify-between items-center !p-4 !mb-2.5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={onPix}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-xl">💠</span>
            <span className="text-base font-medium text-gray-800">PIX</span>
          </div>
          <span className="text-lg text-gray-600">➔</span>
        </button>

        {/* Botão Balcão */}
        <button
          className="w-full flex justify-between items-center !p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={handlePagamentoBalcao}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-xl">💳</span>
            <span className="text-base font-medium text-gray-800">Balcão</span>
          </div>
          <span className="text-lg text-gray-600">➔</span>
        </button>
      </div>
    </div>
  )
}
