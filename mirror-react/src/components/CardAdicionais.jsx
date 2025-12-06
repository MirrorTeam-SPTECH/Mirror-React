"use client";
import { useState, useMemo } from "react";
import ButtonBack from "../components/Shared/ButtonBack"
export default function CardAdicionais({ produto, onAvancar, onVoltar }) {

  const adicionaisDisponiveis = produto.adicionais || [
    {
      id: 1,
      nome: "Queijo",
      preco: 2,
      imagem: "/img/adicionais.png",
    },
    {
      id: 2,
      nome: "Queijo Cheddar",
      preco: 4,
      imagem: "/img/adicionais.png",
    },
    {
      id: 3,
      nome: "Hamburguer",
      preco: 6,
      imagem: "/img/adicionais.png",
    },
    {
      id: 4,
      nome: "Bacon",
      preco: 4,
      imagem: "/img/adicionais.png",
    },
  ];

  const [quantidades, setQuantidades] = useState(
    adicionaisDisponiveis.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {})
  );

  const [observacoes, setObservacoes] = useState("");

  const totalAdicionais = useMemo(() => {
    return adicionaisDisponiveis.reduce((total, item) => {
      return total + (quantidades[item.id] || 0) * item.preco;
    }, 0);
  }, [quantidades, adicionaisDisponiveis]);

  const precoBase = produto.subtotalNum || 0;

  const subtotalNum = precoBase + totalAdicionais;
  const subtotal = subtotalNum.toFixed(2).replace(".", ",");

  const aumentarQuantidade = (id) => {
    setQuantidades((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };
  const diminuirQuantidade = (id) => {
    if (quantidades[id] > 0) {
      setQuantidades((prev) => ({
        ...prev,
        [id]: prev[id] - 1,
      }));
    }
  };

  const handleAvancar = () => {

    const adicionaisSelecionados = adicionaisDisponiveis
      .filter((item) => quantidades[item.id] > 0)
      .map((item) => ({
        ...item,
        quantidade: quantidades[item.id],
      }));

    const entregaNum = produto.entregaNum || 0.0;
    const totalNum = subtotalNum + entregaNum;
    const total = totalNum.toFixed(2).replace(".", ",");

    const produtoComAdicionais = {
      ...produto,
      adicionaisSelecionados,
      totalAdicionais,
      subtotal,
      subtotalNum,
      total,
      totalNum,
      observacoes,
    };
    console.log("CardAdicionais vai enviar:", produtoComAdicionais);
    onAvancar(produtoComAdicionais);
  };
  return (
    <div className="w-[350px] h-127 bg-white rounded-2xl overflow-hidden shadow-md flex flex-col font-['Montserrat']">
      <div className="flex !-ml-2 absolute">
      <ButtonBack onClose={onVoltar} />
</div>
      {}
      <div className="!px-5 !pb-2 flex justify-center !mt-5">
        <h2 className="text-2xl font-bold !m-0 text-gray-800 text-center">
          {produto.nome}
        </h2>
      </div>
      {}
      <div className="!px-4  relative">
        <div className="inline-block !pb-2 font-semibold text-gray-800 border-b-3 border-red-600 !pr-3">
          <span>Descrição</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200 !ml-5"></div>
      </div>
      {}
      <div className="!px-5 !py-2 max-h-[300px] overflow-y-auto">
        {adicionaisDisponiveis.map((adicional) => (
          <div
            key={adicional.id}
            className="flex justify-between items-center !mb-4"
          >
            <div className="flex flex-col">
              <span className="text-base font-medium text-gray-800">
                {adicional.nome}
              </span>
              <span className="text-sm text-gray-500">
                R$ {adicional.preco.toFixed(2).replace(".", ",")}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="w-8 h-8 rounded-md bg-gray-100 border-none flex items-center justify-center text-lg cursor-pointer text-gray-800"
                onClick={() => diminuirQuantidade(adicional.id)}
              >
                −
              </button>
              <span className="text-base font-medium min-w-[20px] text-center text-gray-800">
                {quantidades[adicional.id] || 0}
              </span>
              <button
                className="w-8 h-8 rounded-md bg-gray-100 border-none flex items-center justify-center text-lg cursor-pointer text-gray-800"
                onClick={() => aumentarQuantidade(adicional.id)}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
      {}
      <div className="!px-5 !-pb-5">
        <div className=" flex justify-center">
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Alguma observação sobre o seu pedido? Ex: sem cebola, sem alface..."
            className="w-full !pt-5  flex items-center text-sm border border-gray-300 rounded-md min-h-[10px] resize-none focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600 text-gray-800"
          />
        </div>
        <div className="w-full  bg-gray-200 !mt-4"></div>
      </div>
      {}
      <div className="!px-5 !pb-2 !mt-auto">
        <div className="flex justify-between !mb-4">
          <span className="font-medium text-gray-800">Subtotal</span>
          <span className="font-semibold text-gray-800">R$ {subtotal}</span>
        </div>
        <button
          className="w-full h-10 bg-green-600 text-white border-none rounded-full !py-4 text-base font-semibold cursor-pointer flex items-center justify-center hover:bg-green-700 transition-colors"
          onClick={handleAvancar}
        >
          Adicionar ao carrinho <span className="!ml-2">→</span>
        </button>
      </div>
    </div>
  );
}