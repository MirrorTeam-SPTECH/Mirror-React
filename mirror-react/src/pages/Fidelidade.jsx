import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Favoritos } from "../components/CardFavoritos";
import { SubNavigation } from "../components/SubNavigation";
import produtosData from "../data/produtos.json";
import "../styles/Fidelidade.css";

export default function FidelidadePage() {
  const [fidelidade, setFidelidade] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fidelidadeIds = JSON.parse(localStorage.getItem("fidelidade")) || [];
    const fidelidadeFiltrados = produtosData.hamburgueres.filter((produto) =>
      fidelidadeIds.includes(produto.id)
    );
    setFidelidade(fidelidadeFiltrados);
    setLoading(false);
  }, []);

  const renderBloco = (items, isLeftBlock = false) => (
    <div className="bloco-central">
      {isLeftBlock ? (
        <div className="circulos-container">
          <h3 className="text-lg font-medium">Seus pontos</h3>
          <div className="linha-circulos">
            {[...Array(5)].map((_, index) => (
              <div key={`top-circle-${index}`} className="circulo"></div>
            ))}
          </div>
          <div className="linha-circulos">
            {[...Array(5)].map((_, index) => (
              <div key={`bottom-circle-${index}`} className="circulo"></div>
            ))}
          </div>
        </div>
      ) : (
        <div className="premio-container ">
          <h3 className="text-lg font-medium flex items-start">Seu Prêmio</h3>
          <div className="imagem-premio"></div>
          <p className="descricao-premio">
            Aqui vai a descrição do prêmio. Substitua este texto pela descrição real.
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
              {renderBloco(fidelidade.slice(0, Math.ceil(fidelidade.length / 2)), true)}
              {renderBloco(fidelidade.slice(Math.ceil(fidelidade.length / 2)))}
            </div>
          </div>
          <SubNavigation />
        </div>
      )}  
    </div>
  );
}