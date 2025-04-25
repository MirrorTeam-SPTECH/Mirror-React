import React from 'react';
import './CardErro.css';

const CardErro = () => {
  return (
    <div className="card-erro">
      <div className="icon-erro">✖</div>
      <p className="mensagem-erro">
        Algo deu errado no seu pedido<br />
        Por favor, tente novamente ou entre em contato<br />
        com o suporte
      </p>
      <button className="btn tentar">Tentar Novamente</button>
      <button className="btn voltar">Voltar para o início</button>
    </div>
  );
};

export default CardErro;